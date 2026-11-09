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
import get from "lodash/get";
import styled from "styled-components";
import Button from "../Button/Button";
import Box from "../Box/Box";
import Loader from "../Loader/Loader";
import { WizardButton, WizardConstruct, WizardPageProps } from "./Wizard.types";

const WizardPageMain = styled.div<WizardConstruct>(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  "& .wizardComponent": {
    overflowY: "auto",
    marginBottom: 8,
    height: "calc(100vh - 100px - 80px)",
    minHeight: 400,
    flex: 1,
    width: "100%",
  },
  "& .wizardModal": {
    overflowY: "auto",
    overflowX: "hidden",
    margin: "8px 0",
    minHeight: 350,
    maxHeight: "calc(100vh - 515px)",
    padding: "16px",
    position: "relative",
  },
  "& .buttonsContainer": {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start" as const,
    padding: "16px 0 0",
    borderTop: `1px solid ${get(theme, "borderColor", "#E2E2E2")}`,
    "& button": {
      marginInlineStart: 0,
    },
    "&.forModal": {
      paddingBottom: 0,
    },
  },
  "@media (max-width: 575px)": {
    "& .forModal .buttonInnerContainer": { flexDirection: "column", gap: 8, marginInlineEnd: 0, "& button": { marginInlineStart: 0, width: "100%" } },
    "& .wizardModal": { minHeight: 0, maxHeight: "none", padding: 0 },
  },
  "& .buttonInnerContainer": {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
  },
}));

const WizardPage = ({
  page,
  pageChange,
  loadingStep,
  forModal,
}: WizardPageProps) => {
  const buttonAction = (btn: WizardButton) => {
    switch (btn.type) {
      case "next":
        pageChange("++");
        break;
      case "back":
        pageChange("--");
        break;
      case "to":
        pageChange(btn.toPage || 0);
        break;
      case "custom":
      default:
    }

    if (btn.action) {
      btn.action(pageChange);
    }
  };

  return (
    <WizardPageMain>
      <Box className={forModal ? "wizardModal" : "wizardComponent"}>
        {page.componentRender}
      </Box>
      {loadingStep && (
        <Box>
          <Loader />
        </Box>
      )}
      <Box className={`buttonsContainer ${forModal ? "forModal" : ""}`}>
        <Box className={"buttonInnerContainer"}>
          {page.buttons.map((btn) => {
            if (btn.componentRender) {
              return btn.componentRender;
            }
            return (
              <Button
                id={"wizard-button-" + btn.label}
                variant="regular"
                onClick={() => {
                  buttonAction(btn);
                }}
                disabled={!btn.enabled}
                key={`button-${page.label}-${btn.label}`}
                label={btn.label}
              />
            );
          })}
        </Box>
      </Box>
    </WizardPageMain>
  );
};

export default WizardPage;
