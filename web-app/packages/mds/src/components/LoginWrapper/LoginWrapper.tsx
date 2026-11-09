// This file is part of MinIO Design System
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

import React, { FC, useEffect, useState } from "react";
import get from "lodash/get";
import styled from "styled-components";
import ApplicationLogo from "../ApplicationLogo/ApplicationLogo";
import Grid from "../Grid/Grid";
import { LoginWrapperProps } from "./LoginWrapper.types";
import { breakPoints } from "../../global/utils";

const poster = "background/background.jpg";

const CustomLogin = styled.div(({ theme }) => {
  return {
    "& .mainContainer": {
      height: "100vh",
    },
    "& .decorationPanel": {
      position: "relative",
      backgroundColor: get(theme, "login.promoBG", "#000110"),
      background: `url(${poster}) no-repeat center center fixed`,
      backgroundSize: "cover",
      filter: get(theme, "login.bgFilter", "none"),
      "& .backgroundContainer": {
        width: "100%",
        height: "auto",
        minHeight: 200,
        position: "absolute",
        bottom: "0",
        insetInlineEnd: 0,
        filter: get(theme, "login.bgFilter", "none"),
        "& .posterBG": {
          width: "100%",
          height: "100%",
        },
      },
      "& .bgExtend": {
        backgroundImage:
          "linear-gradient(45deg,rgba(172,223,234,0) 0,#7fc0e4 100%)",
        position: "absolute",
        width: 500,
        insetInlineStart: 0,
      },
      "& .promoContainer": {
        zIndex: 5,
        width: "80%",
        maxWidth: "687px",
        position: "absolute",
        top: "190px",
        left: "50%",
        transform: "translateX(-50%)",
        "& .promoHeader": {
          color: get(theme, "login.promoHeader", "#fff"),
          fontSize: "46px",
          textAlign: "start",
          fontWeight: "900",
          lineHeight: "60px",
        },
        "& .promoInfo": {
          marginTop: "31px",
          maxWidth: "542px",
          color: get(theme, "login.promoText", "#fff"),
          fontSize: "18px",
          textAlign: "start",
          fontWeight: "300",
          lineHeight: "30px",
          textShadow: "0 0 5ppx #000",
          "& a": {
            color: get(theme, "login.promoText", "#fff"),
            textDecoration: "none",
            fontWeight: "bold",
            "&:hover": {
              textDecoration: "underline",
            },
          },
        },
      },
    },
    "& .formPanel": {
      zIndex: 10,
      maxWidth: "520px",
      backgroundColor: get(theme, "login.formBG", "#fff"),
      [`@media (min-width: ${get(
        breakPoints,
        "xs",
        0,
      )}px) and (max-width: ${get(breakPoints, "md", 0)}px)`]: {
        maxWidth: "100%",
      },
      "& .logoContainer": {
        display: "flex",
        height: "215px",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 3px 10px 2px #00000010",
        "& svg": {
          width: "325px",
        },
      },
      "& .formContainer": {
        paddingTop: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "calc(100vh - 215px)",
        "& .form": {
          width: "328px",
          flexGrow: "1",
          height: "100%",
        },
        "& .footer": {
          display: "flex",
          width: "328px",
          borderTop: `${get(
            theme,
            "login.footerDivider",
            "#f2f2f2",
          )} 1px solid`,
          padding: "35px 0",
          textAlign: "center",
          alignItems: "flex-end",
          justifyContent: "center",
        },
        "& .footer, & .footer a": {
          color: get(theme, "login.footerElements", "#000"),
          fontSize: "14px",
          textDecoration: "none",
        },
      },
    },
  };
});

const LoginWrapper: FC<LoginWrapperProps> = ({
  logoProps,
  form,
  formFooter,
  promoInfo,
  promoHeader,
  backgroundAnimation = false,
}) => {
  return (
    <CustomLogin>
      <Grid container className={"mainContainer"} wrap={"nowrap"}>
        <Grid item xs={"hidden"} sm={"hidden"} md className={"decorationPanel"}>
          {(promoInfo || promoHeader) && (
            <Grid container>
              <Grid item className={"promoContainer"}>
                <Grid item className={"promoHeader"}>
                  {promoHeader}
                </Grid>
                <Grid item className={"promoInfo"}>
                  {promoInfo}
                </Grid>
              </Grid>
            </Grid>
          )}
          <Grid item className={"backgroundContainer"}>
            <img className={"posterBG"} />
          </Grid>
        </Grid>
        <Grid item xs={12} className={"formPanel"}>
          <Grid container>
            <Grid item xs={12} className={"logoContainer"}>
              <ApplicationLogo {...logoProps} />
            </Grid>
            <Grid item xs={12} className={"formContainer"}>
              <Grid item xs className={"form"}>
                {form}
              </Grid>
              {formFooter && (
                <Grid item xs className={"footer"}>
                  {formFooter}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </CustomLogin>
  );
};

export default LoginWrapper;
