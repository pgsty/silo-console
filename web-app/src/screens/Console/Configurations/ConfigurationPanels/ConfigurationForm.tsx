// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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
import { useLocation } from "react-router-dom";
import { Box, useAvailableWidth } from "mds";
import { configurationElements } from "../utils";
import EditConfiguration from "../../EventDestinations/CustomForms/EditConfiguration";

const ConfigurationsList = () => {
  const { pathname = "" } = useLocation();
  const { elementRef, width } = useAvailableWidth();

  const configName = pathname.substring(pathname.lastIndexOf("/") + 1);

  const validActiveConfig = configurationElements.find(
    (element) => element.configuration_id === configName,
  );
  const containerClassName = `${configName}`;
  return (
    <Box
      elementRef={elementRef}
      data-field-layout={width < 480 ? "stacked" : undefined}
      sx={{
        height: "100%",
        width: "100%",
        minWidth: 0,
      }}
    >
      {validActiveConfig && (
        <EditConfiguration
          key={configName}
          className={`${containerClassName}`}
          selectedConfiguration={validActiveConfig}
        />
      )}
    </Box>
  );
};

export default ConfigurationsList;
