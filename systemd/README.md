# Packaged Linux service

DEB and RPM retain `/etc/systemd/system/minio-console.service` and
`/etc/default/console`. Existing service names and configuration files continue
to work. APK installs the same files for compatibility, but stock Alpine uses
OpenRC: run the binary under your chosen supervisor rather than assuming systemd
is available. Packages do not automatically enable or start the service.

The service runs `/usr/local/bin/silo-console` as `console-user:console-user`,
with a working directory and `HOME` of `/var/lib/silo-console`. New accounts use
that home; upgrading an existing account does not rewrite its passwd entry.
The explicit service `HOME` handles accounts created by older packages with
`/usr/local` as their home. State is owned by the service user with mode `0750`;
`/run/silo-console` is managed by systemd and removed when the service stops.

Certificate configuration is rooted at `/etc/silo-console/certs`, explicitly
passed with `--certs-dir`. The package creates this directory and `CAs/` as
`root:console-user`, mode `0750`. Install upstream private-CA certificates in
`CAs/`. For HTTPS on Console itself, install `public.crt` and `private.key` in
`certs/`. Files should be `root:console-user`, mode `0640`. The service reads
these files; operators manage them. Upgrades do not recursively chown or remove
existing files. Example:

```sh
sudo install -o root -g console-user -m 0640 company-ca.crt \
  /etc/silo-console/certs/CAs/company-ca.crt
sudoedit /etc/default/console
sudo systemctl enable --now minio-console.service
```

### Upgrading an installation with existing certificates

Packages before this change used the service account's home directory, normally
`/usr/local/.console/certs`. The new unit uses `/etc/silo-console/certs`.
When the old directory contains certificates, installation prints a warning
with both paths. It preserves the old files, private keys, symlinks and passwd
entry, and does not restart the service. Complete one of these steps **before
restarting**:

- Keep the old location by adding `--certs-dir /usr/local/.console/certs` to
  `CONSOLE_OPTS` in `/etc/default/console`, retaining your other options. Use the
  actual old path printed by the installer. A path under `/home`, `/root` or
  `/run/user` is hidden by `ProtectHome`; migrate it to `/etc` instead.
- Install your serving certificate, private key and private CAs into the new
  directory using the ownership and modes above. Preserve any domain-specific
  certificate subdirectories, and check symlink targets remain readable by
  `console-user`. Remove the old files only after verifying TLS and login.

Directory ownership/modes declared by the package are reapplied on upgrade;
operator-managed certificate files are not recursively modified.

Set `CONSOLE_MINIO_SERVER` to the maintained SILO endpoint. Stable
`CONSOLE_PBKDF_PASSPHRASE` and `CONSOLE_PBKDF_SALT` preserve sessions across
restarts; unset values invalidate sessions on restart. Keep `/etc/default/console`
root-owned with mode `0600`. `CONSOLE_OPTS` can override the certificate path or
ports, for example `--port 9090 --tls-port 9443 --certs-dir /etc/my-console/certs`.
Do not put certificates under a home directory hidden by `ProtectHome`.

Shutdown allows **90 seconds** for SIGTERM cleanup, then systemd sends SIGKILL to
the remaining control group. A stopped/unresponsive process therefore cannot
block upgrades or removal indefinitely. The unit uses a private temporary
directory and devices, read-only system paths, inaccessible home directories,
no new privileges, an empty capability set and only Unix/IPv4/IPv6 sockets.
State and runtime directories remain writable. Use an unprivileged listening
port (9090 by default) with a reverse proxy; binding a privileged port requires
an intentional unit override. Custom writable paths need `ReadWritePaths` in a
systemd drop-in. Inspect the effective unit with `systemctl cat` after upgrades.

Package install/upgrade reloads systemd without unexpectedly restarting a running
Console. Restart it deliberately to activate the new executable and unit:

```sh
sudo systemctl daemon-reload
sudo systemctl restart minio-console.service
sudo systemctl status minio-console.service
```

DEB/RPM removal stops/disables the compatibility unit and reloads systemd.
The stock Alpine APK creates its service account at installation and does not
run systemd lifecycle hooks. User state,
configuration and certificates are retained for explicit operator cleanup.
For source/manual installs, run `systemd/preinstall.sh` as root to create the
account/directories, install the binary as `/usr/local/bin/silo-console`, install
`console.env` as `/etc/default/console` with mode `0600`, and install
`console.service` under the compatibility unit name.

`hack/test-package-lifecycle.sh` is for disposable Linux containers/VMs. It checks
install, upgrade/config preservation, restart, forced termination of a process that ignores TERM, TLS startup with a private CA, ownership and removal. Never run it on a
host whose existing Console data or configuration should be preserved.
