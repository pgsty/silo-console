#!/bin/sh
# Create the service account expected by console.service (User=console-user).
set -e

if ! id console-user >/dev/null 2>&1; then
    if command -v useradd >/dev/null 2>&1; then
        useradd --system --user-group --home-dir /var/lib/silo-console \
            --shell /sbin/nologin console-user
    elif command -v adduser >/dev/null 2>&1; then
        addgroup -S console-user 2>/dev/null || true
        adduser -S -D -H -h /var/lib/silo-console -s /sbin/nologin \
            -G console-user console-user
    else
        echo "Cannot create console-user: neither useradd nor adduser is available" >&2
        exit 1
    fi
fi

# Do not recursively change ownership of existing state or operator certificates.
install -d -m 0750 -o console-user -g console-user /var/lib/silo-console
install -d -m 0750 -o root -g console-user /etc/silo-console /etc/silo-console/certs /etc/silo-console/certs/CAs

# Older packages used the account's home (normally /usr/local) for certs.
# Keep private files in place and warn before the operator restarts the service.
legacy_home=$(getent passwd console-user | cut -d: -f6)
legacy_certs="$legacy_home/.console/certs"
if [ -n "$legacy_home" ] && [ -d "$legacy_certs" ] && [ -n "$(find "$legacy_certs/." -mindepth 1 ! -type d -print -quit)" ]; then
    echo "WARNING: SILO Console service now uses /etc/silo-console/certs; existing certificates remain in $legacy_certs. Before restarting minio-console.service, migrate the certificates and CAs or set --certs-dir $legacy_certs in CONSOLE_OPTS. See /usr/share/doc/silo-console/service.md. No certificates were moved." >&2
fi

exit 0
