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
import { PageLayout, Box } from "mds";
import Copyright from "../common/Copyright";
import { useT } from "../i18n";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  const t = useT();
  return (
    <PageLayout>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          textAlign: "center",
          margin: "auto",
          flexFlow: "column",
        }}
      >
        <Box
          sx={{
            fontSize: "110%",
            margin: "0 0 0.25rem",
            color: "#909090",
          }}
        >
          {t("404 Error")}
        </Box>
        <Box
          sx={{
            fontStyle: "normal",
            fontSize: "clamp(2rem,calc(2rem + 1.2vw),3rem)",
            fontWeight: 700,
          }}
        >
          {t("Sorry, the page could not be found.")}
        </Box>
        <Box sx={{ marginTop: 20 }}>
          <Link to="/">{t("Return home")}</Link>
        </Box>
        <Box sx={{ marginTop: 20 }}>
          <Copyright />
        </Box>
      </Box>
    </PageLayout>
  );
};

export default NotFound;
