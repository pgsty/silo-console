#!/bin/sh
set -e
# Debian uses "remove" and RPM uses 0 for final removal. Upgrades keep the
# existing service running until the operator deliberately restarts it.
case "${1:-remove}" in
    remove|deinstall|0)
        if [ -d /run/systemd/system ] && command -v systemctl >/dev/null 2>&1; then
            systemctl stop minio-console.service
            systemctl disable minio-console.service
        fi
        ;;
esac
