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

exit 0
