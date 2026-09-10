#!/usr/bin/env python3
"""nFPM's APK script headers use source mtime rather than the package mtime."""
import os
from pathlib import Path
import subprocess

epoch = int(subprocess.check_output(["git", "show", "-s", "--format=%ct", "HEAD"], text=True).strip())
for path in Path("systemd").glob("*.sh"):
    os.utime(path, (epoch, epoch))
