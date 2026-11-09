// This file is part of MinIO Design System
// Copyright (c) 2023 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from "react";
import { DropdownSelectorProps } from "./DropdownSelector.types";
import { useModalPresence } from "../../global/ModalState";
import Popup from "./DropdownSelectorPopup";

// The language menu must work immediately, including without a network.
// Keep the shared popup synchronous; useListPopup owns its exit transition.
export default function DropdownSelector(props: DropdownSelectorProps) {
  const visible = useModalPresence();
  return <Popup {...props} open={props.open && visible} />;
}
