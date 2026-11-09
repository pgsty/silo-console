// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

import React, { useState } from "react";
import copy from "copy-to-clipboard";
import { Button, CopyIcon, InputBox, Box, breakPoints } from "mds";
import { useT } from "i18n";

const KeyRevealer = ({ value }: { value: string }) => {
  const t = useT();
  const [shown, setShown] = useState<boolean>(false);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexFlow: "row",
        [`@media (max-width: ${breakPoints.sm}px)`]: {
          flexFlow: "column",
        },
      }}
    >
      <InputBox
        id="inspect-dec-key"
        name="inspect-dec-key"
        placeholder=""
        label=""
        aria-label={t("Inspect Decryption Key")}
        type={shown ? "text" : "password"}
        onChange={() => {}}
        value={value}
        overlayIcon={<CopyIcon />}
        readOnly={true}
        // The async Clipboard API exists only in secure contexts; Console is
        // often served over plain HTTP, so use the execCommand fallback.
        overlayAction={() => copy(value)}
      />

      <Button
        id={"show-hide-key"}
        style={{
          marginInlineStart: "10px",
        }}
        variant="callAction"
        onClick={() => setShown(!shown)}
        label={t("Show/Hide")}
      />
    </Box>
  );
};

export default KeyRevealer;
