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
import React from "react";

import {
  Box,
  ChangeAccessPolicyIcon,
  GroupsIcon,
  HelpIconFilled,
  UsersIcon,
} from "mds";
import { useT } from "i18n";

const FeatureItem = ({
  icon,
  description,
}: {
  icon: any;
  description: string;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        "& .min-icon": {
          marginInlineEnd: "10px",
          height: "23px",
          width: "23px",
          marginBottom: "10px",
        },
      }}
    >
      {icon}{" "}
      <div style={{ fontSize: "var(--fs-body)", color: "var(--foreground)" }}>
        {description}
      </div>
    </Box>
  );
};
const AddUserHelpBox = () => {
  const t = useT();
  return (
    <Box
      sx={{
        flex: 1,
        border: 0,
        background: "var(--hover)",
        color: "var(--foreground)",
        borderRadius: "8px",
        display: "flex",
        flexFlow: "column",
        padding: "16px",
        marginTop: 0,
      }}
    >
      <Box
        sx={{
          fontSize: "var(--fs-body)",
          fontWeight: 550,
          display: "flex",
          alignItems: "center",
          marginBottom: "16px",

          "& .min-icon": {
            height: "21px",
            width: "21px",
            marginInlineEnd: "15px",
          },
        }}
      >
        <HelpIconFilled />
        <div>{t("Learn more about the Users feature")}</div>
      </Box>
      <Box sx={{ fontSize: "var(--fs-body)", marginBottom: "15px" }}>
        {t(
          "A SILO user consists of a unique access key (username) and corresponding secret key (password). Clients must authenticate their identity by specifying both a valid access key (username) and the corresponding secret key (password) of an existing SILO user.",
        )}
        <br />
        <br />
        {t(
          "Each user can have one or more assigned policies that explicitly list the actions and resources to which that user has access. Users can also inherit policies from the groups in which they have membership.",
        )}
        <br />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexFlow: "column",
        }}
      >
        <FeatureItem icon={<UsersIcon />} description={t("Create Users")} />
        <FeatureItem icon={<GroupsIcon />} description={t("Manage Groups")} />
        <FeatureItem
          icon={<ChangeAccessPolicyIcon />}
          description={t("Assign Policies")}
        />
      </Box>
    </Box>
  );
};

export default AddUserHelpBox;
