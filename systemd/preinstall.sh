#!/bin/sh
# Create the service account expected by console.service (User=console-user).
set -e

if ! id console-user >/dev/null 2>&1; then
    if command -v useradd >/dev/null 2>&1; then
        useradd --system --user-group --home-dir /usr/local \
            --shell /sbin/nologin console-user
    elif command -v adduser >/dev/null 2>&1; then
        addgroup -S console-user 2>/dev/null || true
        adduser -S -D -H -h /usr/local -s /sbin/nologin \
            -G console-user console-user
    fi
fi

exit 0
