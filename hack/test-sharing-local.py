#!/usr/bin/env python3
"""Verify sharing against disposable, loopback-only SILO/Console processes."""

import argparse
import json
import os
from pathlib import Path
import socket
import subprocess
import tempfile
import time
import urllib.request
import uuid


def free_port():
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--silo", type=Path, required=True)
    parser.add_argument("--console", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--docker-image", help="Run the supplied Linux SILO binary in this cached image with a 512 MiB tmpfs")
    parser.add_argument("--modes", nargs="+", choices=["embedded", "standalone"],
                        default=["embedded", "standalone"])
    args = parser.parse_args()
    repo = Path(__file__).resolve().parents[1]
    output = args.output.resolve()
    output.mkdir(parents=True, exist_ok=True)
    results = []
    # No production MINIO_*/CONSOLE_* configuration is inherited.
    env = {key: value for key, value in os.environ.items() if not key.startswith(("MINIO_", "CONSOLE_", "SILO_SHARE_TEST_"))}
    env.update(MINIO_ROOT_USER="minioadmin", MINIO_ROOT_PASSWORD="minioadmin", MINIO_UPDATE="off", MINIO_PROMETHEUS_AUTH_TYPE="public")
    try:
        for mode in args.modes:
            record = {"mode": mode, "api": False, "browser": False}
            results.append(record)
            print(f"Checking {mode}", flush=True)
            case = output / mode
            case.mkdir(parents=True, exist_ok=True)
            processes, logs = [], []
            container = None
            with tempfile.TemporaryDirectory(prefix="silo-share-data-") as data:
                try:
                    ports = set()
                    while len(ports) < 3:
                        ports.add(free_port())
                    s3_port, embedded_port, standalone_port = sorted(ports)
                    endpoint = f"http://127.0.0.1:{s3_port}"
                    def start(command, process_env, name, health):
                        log = open(case / f"{name}.log", "wb")
                        logs.append(log)
                        process = subprocess.Popen(command, env=process_env, stdout=log, stderr=subprocess.STDOUT)
                        processes.append(process)
                        for _ in range(120):
                            if process.poll() is not None:
                                raise RuntimeError(f"{name} exited; see {case / (name + '.log')}")
                            try:
                                with urllib.request.urlopen(health, timeout=1) as response:
                                    if response.status == 200:
                                        return
                            except (OSError, TimeoutError):
                                pass
                            time.sleep(0.25)
                        raise RuntimeError(f"{name} did not become ready")

                    command = [str(args.silo.resolve()), "--certs-dir", str(Path(data) / "silo-certs"), "server",
                               "--address", f"127.0.0.1:{s3_port}", "--console-address", f"127.0.0.1:{embedded_port}", str(Path(data) / "objects")]
                    if args.docker_image:
                        container = "silo-share-test-" + uuid.uuid4().hex[:12]
                        command = ["docker", "run", "--rm", "--pull=never", "--name", container,
                                   "-p", f"127.0.0.1:{s3_port}:{s3_port}", "-p", f"127.0.0.1:{embedded_port}:{embedded_port}",
                                   "--mount", f"type=bind,src={args.silo.resolve()},dst=/silo,readonly",
                                   "--tmpfs", "/data:rw,size=512m"]
                        for key, value in env.items():
                            if key.startswith(("MINIO_", "CONSOLE_")):
                                command.extend(["-e", f"{key}={value}"])
                        command.extend([args.docker_image, "/silo", "--certs-dir", "/tmp/certs", "server",
                                        "--address", f":{s3_port}", "--console-address", f":{embedded_port}", "/data"])
                    start(command,
                          env, "silo", f"http://127.0.0.1:{embedded_port}/")
                    console = f"http://127.0.0.1:{embedded_port}"
                    if mode == "standalone":
                        console = f"http://127.0.0.1:{standalone_port}"
                        start([str(args.console.resolve()), "server", "--host", "127.0.0.1", "--port", str(standalone_port),
                               "--certs-dir", str(Path(data) / "console-certs")],
                              dict(env, CONSOLE_MINIO_SERVER=endpoint), "console", console + "/")
                    test_env = dict(env, SILO_SHARE_TEST_ENDPOINT=endpoint, CONSOLE_SHARE_TEST_ENDPOINT=console,
                                    CONSOLE_TEST_ENDPOINT=console, SILO_TEST_PORT=str(s3_port),
                                    SILO_SHARE_TEST_ACCESS_KEY="minioadmin", SILO_SHARE_TEST_SECRET_KEY="minioadmin")
                    for kind, command, cwd in [
                        ("api", ["go", "test", "-mod=readonly", "./api", "-run", "^TestSharedObjectLiveStack$", "-count=1", "-v"], repo),
                        ("browser", [str(repo / "web-app/node_modules/.bin/playwright"), "test", "e2e/sharing.spec.ts", "--project=chromium", "--no-deps", "--workers=1", "--reporter=line", "--output", str(case / "browser")], repo / "web-app"),
                    ]:
                        result = subprocess.run(command, cwd=cwd, env=test_env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=180)
                        (case / f"{kind}-tests.log").write_bytes(result.stdout)
                        record[kind] = result.returncode == 0
                        print(f"  {kind}: {'PASS' if record[kind] else 'FAIL'}", flush=True)
                        if result.returncode:
                            raise RuntimeError(f"{kind} failed; see {case / (kind + '-tests.log')}")
                finally:
                    for process in reversed(processes):
                        process.terminate()
                        try:
                            process.wait(timeout=10)
                        except subprocess.TimeoutExpired:
                            process.kill()
                            process.wait()
                    for log in logs:
                        log.close()
                    if container:
                        subprocess.run(["docker", "rm", "-f", container], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=20, check=False)
    finally:
        (output / "results.json").write_text(json.dumps(results, indent=2) + "\n")


if __name__ == "__main__":
    main()
