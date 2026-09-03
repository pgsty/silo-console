# This file is part of MinIO Console Server
# Copyright (c) 2022 MinIO, Inc.
# # This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# # This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
# # You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

SCRIPT_DIR=$(dirname "$0")
export SCRIPT_DIR
source "${SCRIPT_DIR}/common.sh"

__init__() {
  export TIMESTAMP=$(date "+%s")
  echo $TIMESTAMP >web-app/tests/constants/timestamp.txt
  export GOPATH=/tmp/gopath
  export PATH=${PATH}:${GOPATH}/bin
  export MC_UPDATE=off

  # Build the exact pgsty/mc source selected by Console's go.mod replacement.
  # `go install ...@version` ignores the main module's replacements.
  go build -o mc github.com/minio/mc
  chmod +x mc
  mv mc /usr/local/bin

  add_alias
}

main() {
  create_policies
  create_users
  assign_policies
}

(__init__ "$@" && main "$@")
