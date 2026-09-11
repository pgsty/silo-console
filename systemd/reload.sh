#!/bin/sh
set -e
# Installation/removal inside a container/chroot must not contact the host.
if [ -d /run/systemd/system ] && command -v systemctl >/dev/null 2>&1; then
    systemctl daemon-reload
fi
