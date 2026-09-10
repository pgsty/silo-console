#!/usr/bin/env bash
# Run only in a disposable Linux package-test container/VM, never on the host.
# Usage: hack/test-package-lifecycle.sh /path/to/package.deb [previous-package]
set -euo pipefail
package="$1"
install_package() {
  case "$1" in
    *.deb) dpkg -i "$1" ;;
    *.rpm) rpm -Uvh --replacepkgs "$1" ;;
    *.apk) apk add --allow-untrusted --force-overwrite "$1" ;;
    *) echo "Unsupported package: $1" >&2; exit 1 ;;
  esac
}
install_package "${2:-$package}"
# Simulate operator configuration/state and ensure the upgrade retains them.
printf '\n# lifecycle-test-kept\n' >> /etc/default/console
install -d -m 0750 -o console-user -g console-user /var/lib/silo-console
touch /var/lib/silo-console/keep-state
# Seed real certificates before the upgrade, including the old default path.
cert_dir=/etc/silo-console/certs
if [ "${2:-$package}" != "$package" ]; then
  cert_dir="$(getent passwd console-user | cut -d: -f6)/.console/certs"
fi
install -d -m 0750 -o root -g console-user "$cert_dir" "$cert_dir/CAs"
openssl req -x509 -nodes -newkey rsa:2048 -days 1 -subj /CN=localhost \
  -addext subjectAltName=DNS:localhost,IP:127.0.0.1 \
  -keyout "$cert_dir/private.key" -out "$cert_dir/public.crt" >/dev/null 2>&1
cp "$cert_dir/public.crt" "$cert_dir/CAs/test.crt"
chown root:console-user "$cert_dir/private.key" "$cert_dir/public.crt" "$cert_dir/CAs/test.crt"
chmod 0640 "$cert_dir/private.key" "$cert_dir/public.crt" "$cert_dir/CAs/test.crt"
certificate_hashes="$(sha256sum "$cert_dir/private.key" "$cert_dir/public.crt" "$cert_dir/CAs/test.crt")"
upgrade_log=$(mktemp)
if ! install_package "$package" >"$upgrade_log" 2>&1; then cat "$upgrade_log"; exit 1; fi
cat "$upgrade_log"
if [ "$cert_dir" != /etc/silo-console/certs ]; then
  grep -F "existing certificates remain in $cert_dir" "$upgrade_log"
  grep -F 'Before restarting minio-console.service' "$upgrade_log"
  # Apply the documented operator choice to retain the old location. The
  # package does not restart the service or move private keys automatically.
  printf '\nCONSOLE_OPTS="--port 9090 --tls-port 9443 --certs-dir %s"\n' "$cert_dir" >> /etc/default/console
fi
rm "$upgrade_log"
test "$certificate_hashes" = "$(sha256sum "$cert_dir/private.key" "$cert_dir/public.crt" "$cert_dir/CAs/test.crt")"
grep -q '^# lifecycle-test-kept$' /etc/default/console
test -f /var/lib/silo-console/keep-state
test "$(stat -c %U /var/lib/silo-console)" = console-user
test "$(stat -c %G /etc/silo-console/certs/CAs)" = console-user
/usr/local/bin/silo-console --version
if [ -d /run/systemd/system ]; then
  systemctl daemon-reload
  systemctl start minio-console.service
  for _ in $(seq 1 30); do
    if curl -fsS http://127.0.0.1:9090/ >/dev/null; then break; fi
    sleep 1
  done
  curl -fsS http://127.0.0.1:9090/ >/dev/null
  before="$(systemctl show minio-console.service -p MainPID --value)"
  systemctl restart minio-console.service
  after="$(systemctl show minio-console.service -p MainPID --value)"
  test "$before" != "$after"
  test "$(systemctl show minio-console.service -p TimeoutStopUSec --value)" = 1min\ 30s
  # Exercise systemd escalation with a controlled process that ignores TERM;
  # systemd sends SIGCONT during stop, so SIGSTOP alone cannot model a hang.
  systemctl stop minio-console.service
  mkdir -p /etc/systemd/system/minio-console.service.d
  cat > /etc/systemd/system/minio-console.service.d/stop-test.conf <<'UNIT'
[Service]
TimeoutStopSec=1
ExecStart=
ExecStart=/bin/sh -c 'trap "" TERM; exec sleep infinity'
UNIT
  systemctl daemon-reload
  systemctl start minio-console.service
  sleep 1
  timeout 10 systemctl stop minio-console.service || true
  test "$(systemctl show minio-console.service -p MainPID --value)" = 0
  test "$(systemctl show minio-console.service -p Result --value)" = timeout
  rm /etc/systemd/system/minio-console.service.d/stop-test.conf
  systemctl daemon-reload
  systemctl reset-failed minio-console.service
  # The listener must use the same private certificate seeded before upgrade.
  systemctl start minio-console.service
  for _ in $(seq 1 30); do
    if curl --cacert "$cert_dir/CAs/test.crt" -fsS https://localhost:9443/ >/dev/null; then break; fi
    sleep 1
  done
  curl --cacert "$cert_dir/CAs/test.crt" -fsS https://localhost:9443/ >/dev/null
fi
case "$package" in
  *.deb) dpkg --remove silo-console ;;
  *.rpm) rpm -e silo-console ;;
  *.apk) apk del silo-console ;;
esac
test -f /var/lib/silo-console/keep-state
if [ -d /run/systemd/system ]; then
  if systemctl is-active --quiet minio-console.service; then exit 1; fi
fi
echo "Install, upgrade, runtime ownership and removal verified: $package"
