# Systemd service for Console

Systemd script for Console.

## Installation

- Systemd script is configured to run `/usr/local/bin/silo-console`.
- Systemd script is configured to run the binary as `console-user`. DEB/RPM/APK
  packages create this system user automatically (`preinstall.sh`); for manual
  installations, create it yourself before using the service script.
- Release binaries and packages are available from the
  [release page](https://github.com/pgsty/silo-console/releases). Source builds
  remain available through the [README](https://github.com/pgsty/silo-console#quick-start).
- DEB and RPM packages currently retain the compatibility service name
  `/etc/systemd/system/minio-console.service`; renaming it requires a package
  migration. Manual installations below use `console.service`.
- Packages also install a configuration template at `/etc/default/console`
  (from `console.env`, marked as config/noreplace so upgrades keep your edits).

When building from source, install the local development binary under the
release name expected by the service:

```sh
sudo install -m 0755 ./console /usr/local/bin/silo-console
```

## Create the Environment configuration file

This file serves as input to Console systemd service.

```sh
$ cat <<EOT >> /etc/default/console
# Special opts
CONSOLE_OPTS="--port 8443"

# salt to encrypt JWT payload
CONSOLE_PBKDF_PASSPHRASE=CHANGEME

# required to encrypt JWT payload
CONSOLE_PBKDF_SALT=CHANGEME

# SILO or MinIO-compatible endpoint (compatibility variable retained)
CONSOLE_MINIO_SERVER=http://minio.endpoint:9000

EOT
```

## Systemctl

Download `console.service` in  `/etc/systemd/system/`

```
( cd /etc/systemd/system/; curl -O https://raw.githubusercontent.com/pgsty/silo-console/main/systemd/console.service )
```

Enable startup on boot

```
systemctl enable console.service
```

## Note

- Replace ``User=console-user`` and ``Group=console-user`` in console.service file with your local setup.
- Ensure that ``CONSOLE_PBKDF_PASSPHRASE`` and ``CONSOLE_PBKDF_SALT`` are set to appropriate values.
- Ensure that ``CONSOLE_MINIO_SERVER`` is set to appropriate server endpoint.
