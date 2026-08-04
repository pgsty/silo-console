// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { SILO_COLORS } from "./SiloBrand";

// SILO console theme: token overrides deep-merged over the mds base themes
// (see StyleHandler). Palette direction: neutral zinc greys for chrome and
// text, SILO steel/sky for primary actions and selection, emblem teal for
// secondary actions. The sidebar uses one constant "night" family in both
// modes, echoing the login brand panel.

const steel = SILO_COLORS.steel; // #1D588C
const sky = SILO_COLORS.sky; // #7FB8E8
const teal = "#007FA8"; // silo.svg emblem mid stop

// Sidebar (constant across light/dark)
const night = {
  background: "#0C1626",
  text: "#A9B6C9",
  sectionLabel: "#8093AC",
  divider: "#1C2C44",
  iconBG: "#14243C",
  iconBorder: "#1B2E4A",
  selectedBG: "rgba(29, 88, 140, 0.32)",
  dropArrowBG: "#0A121F",
  collapse: "#93A5BD",
};

const menuOverrides = {
  vertical: {
    background: night.background,
    textColor: night.text,
    hoverSelectedIconBorder: "#FFFFFF",
    iconBorderColor: night.iconBorder,
    iconBGColor: night.iconBG,
    dropArrowColor: night.sectionLabel,
    dropArrowBackground: night.dropArrowBG,
    hoverSelectedBackground: night.selectedBG,
    hoverSelectedColor: "#FFFFFF",
    sectionDividerColor: night.divider,
    sectionLabelColor: night.sectionLabel,
    menuCollapseColor: night.collapse,
  },
};

export const siloLightThemeOverrides = {
  fontColor: "#18181B",
  borderColor: "#E4E4E7",
  bulletColor: steel,
  loaderColor: steel,
  linkColor: steel,
  boxBackground: "#FAFAFA",
  mutedText: "#71717A",
  secondaryText: "#52525B",
  signalColors: {
    main: steel,
    danger: "#BE123C",
    good: "#10B981",
    info: steel,
    warning: "#F59E0B",
  },
  buttons: {
    regular: {
      enabled: {
        border: "#D4D4D8",
        text: "#3F3F46",
        iconColor: "#52525B",
      },
      hover: {
        border: "#A1A1AA",
        text: "#18181B",
        background: "#F4F4F5",
        iconColor: "#18181B",
      },
      pressed: {
        border: "#A1A1AA",
        text: "#18181B",
        background: "#E4E4E7",
        iconColor: "#18181B",
      },
    },
    callAction: {
      enabled: { border: steel, background: steel },
      hover: { border: "#174A75", background: "#174A75" },
      pressed: { border: "#123C61", background: "#123C61" },
    },
    secondary: {
      enabled: {
        border: "rgba(190, 18, 60, 0.4)",
        text: "#BE123C",
        iconColor: "#BE123C",
      },
      hover: {
        border: "#BE123C",
        text: "#BE123C",
        background: "#FDF2F4",
        iconColor: "#BE123C",
      },
      pressed: {
        border: "#BE123C",
        text: "#FFFFFF",
        background: "#BE123C",
        iconColor: "#FFFFFF",
      },
    },
    text: {
      enabled: { text: "#3F3F46", iconColor: "#3F3F46" },
      hover: { background: "#F4F4F5", text: "#18181B", iconColor: "#18181B" },
      pressed: { background: "#E4E4E7", text: "#18181B", iconColor: "#18181B" },
    },
    subAction: {
      enabled: { border: teal, background: teal },
      hover: { border: "#1893BD", background: "#1893BD" },
      pressed: { border: "#026B8D", background: "#026B8D" },
    },
  },
  pageHeader: {
    border: "#E4E4E7",
    color: "#18181B",
  },
  tooltip: {
    background: "#18181B",
    color: "#FAFAFA",
  },
  commonInput: {
    labelColor: "#3F3F46",
  },
  checkbox: {
    checkBoxBorder: "#D4D4D8",
    checkBoxColor: steel,
  },
  iconButton: {
    buttonBG: "#FAFAFA",
    hoverBG: "#F4F4F5",
    activeBG: "#E4E4E7",
    color: "#52525B",
  },
  dataTable: {
    border: "#E4E4E7",
    selected: steel,
    hoverColor: "#F4F4F5",
  },
  backLink: {
    color: "#52525B",
    arrow: steel,
    hover: "#F4F4F5",
  },
  inputBox: {
    border: "#E4E4E7",
    hoverBorder: steel,
    color: "#18181B",
    placeholderColor: "#A1A1AA",
    error: "#BE123C",
  },
  breadcrumbs: {
    border: "#E4E4E7",
    linksColor: "#71717A",
    textColor: "#71717A",
    backgroundColor: "#FAFAFA",
    backButton: {
      border: "#E4E4E7",
    },
  },
  actionsList: {
    containerBorderColor: "#E4E4E7",
    backgroundColor: "#FAFAFA",
    optionsBorder: "#E4E4E7",
    optionsHoverTextColor: "#18181B",
    optionsTextColor: "#3F3F46",
    titleColor: "#18181B",
  },
  screenTitle: {
    border: "#E4E4E7",
    subtitleColor: "#71717A",
    iconColor: steel,
  },
  modalBox: {
    closeColor: "#71717A",
    closeHoverBG: "#F4F4F5",
    titleColor: "#18181B",
    iconColor: {
      default: steel,
    },
  },
  switchButton: {
    onLabelColor: "#18181B",
    onBackgroundColor: "#10B981",
  },
  dropdownSelector: {
    hoverBG: "#F4F4F5",
    selectedBGColor: "#E4E4E7",
  },
  readBox: {
    borderColor: "#E4E4E7",
    backgroundColor: "#FAFAFA",
    textColor: "#52525B",
  },
  menu: menuOverrides,
  tabs: {
    vertical: {
      buttons: {
        backgroundColor: "transparent",
        hoverBackground: "#F4F4F5",
        hoverLabelColor: "#18181B",
        labelColor: "#52525B",
        selectedBackground: "rgba(29, 88, 140, 0.09)",
        selectedLabelColor: steel,
      },
      backgroundColor: "transparent",
      borders: "transparent",
    },
    horizontal: {
      buttons: {
        hoverLabelColor: steel,
        labelColor: "#52525B",
        selectedLabelColor: steel,
      },
      selectedIndicatorColor: steel,
    },
  },
  tag: {
    default: { background: steel },
    secondary: { background: teal },
  },
  badge: {
    default: { backgroundColor: steel },
    secondary: { backgroundColor: teal },
  },
  snackbar: {
    default: { backgroundColor: steel },
  },
  informativeMessage: {
    default: { backgroundColor: steel, borderColor: steel },
  },
  slider: {
    bulletBG: steel,
    railBG: "#E4E4E7",
  },
};

export const siloDarkThemeOverrides = {
  fontColor: "#DCE3EC",
  borderColor: "#333F52",
  bulletColor: sky,
  loaderColor: sky,
  linkColor: sky,
  boxBackground: "#222B39",
  mutedText: "#7E8A9C",
  secondaryText: "#A8B4C4",
  signalColors: {
    main: "#6FA3D8",
    danger: "#EF5A72",
    good: "#2FBE8F",
    info: sky,
    warning: "#F5B455",
  },
  buttons: {
    regular: {
      enabled: {
        border: "#46536A",
        text: "#C6D1E0",
        iconColor: "#C6D1E0",
      },
      hover: {
        border: "#5A6A85",
        text: "#ECF1F7",
        background: "#2D3A4C",
        iconColor: "#ECF1F7",
      },
      pressed: {
        border: "#5A6A85",
        text: "#ECF1F7",
        background: "#26303F",
        iconColor: "#ECF1F7",
      },
    },
    callAction: {
      enabled: { border: "#2F6DA9", background: "#2F6DA9", text: "#FFFFFF" },
      hover: { border: "#3B7DBD", background: "#3B7DBD", text: "#FFFFFF" },
      pressed: { border: "#285D92", background: "#285D92", text: "#FFFFFF" },
    },
    secondary: {
      enabled: {
        border: "rgba(239, 90, 114, 0.45)",
        text: "#EF5A72",
        iconColor: "#EF5A72",
      },
      hover: {
        border: "#EF5A72",
        text: "#FF8296",
        background: "#3A2530",
        iconColor: "#FF8296",
      },
      pressed: {
        border: "#EF5A72",
        text: "#FFFFFF",
        background: "#B23048",
        iconColor: "#FFFFFF",
      },
    },
    text: {
      enabled: { text: "#C6D1E0", iconColor: "#C6D1E0" },
      hover: { background: "#2D3A4C", text: "#ECF1F7", iconColor: "#ECF1F7" },
      pressed: { background: "#26303F", text: "#ECF1F7", iconColor: "#ECF1F7" },
    },
    subAction: {
      enabled: { border: "#1E8FB8", background: "#1E8FB8", text: "#FFFFFF" },
      hover: { border: "#2AA3CE", background: "#2AA3CE", text: "#FFFFFF" },
      pressed: { border: "#177EA4", background: "#177EA4", text: "#FFFFFF" },
    },
  },
  pageHeader: {
    background: "#1B2431",
    border: "#2A3444",
    color: "#E8EDF4",
  },
  tooltip: {
    background: "#E9EEF6",
    color: "#131A26",
  },
  commonInput: {
    labelColor: "#C2CCDA",
  },
  checkbox: {
    checkBoxBorder: "#46536A",
    checkBoxColor: "#4F8CC9",
  },
  iconButton: {
    buttonBG: "#2A3444",
    hoverBG: "#364152",
    activeBG: "#40506A",
    disabledBG: "#232C3A",
    color: "#C6D1E0",
  },
  dataTable: {
    border: "#303B4D",
    selected: "#9CC4EC",
    hoverColor: "#26303F",
  },
  backLink: {
    color: "#A8B4C4",
    arrow: sky,
    hover: "#2A3444",
  },
  inputBox: {
    border: "#364152",
    hoverBorder: sky,
    color: "#DCE3EC",
    backgroundColor: "#1C2431",
    placeholderColor: "#6B7890",
    error: "#EF5A72",
  },
  breadcrumbs: {
    border: "#2A3444",
    linksColor: "#9FB3CC",
    textColor: "#7E8A9C",
    backgroundColor: "#1D2634",
    backButton: {
      border: "#2F3A4C",
      backgroundColor: "#232C3A",
    },
  },
  actionsList: {
    containerBorderColor: "#303B4D",
    backgroundColor: "#222B39",
    optionsBorder: "#303B4D",
    optionsHoverTextColor: "#ECF1F7",
    optionsTextColor: "#C6D1E0",
    titleColor: "#E8EDF4",
  },
  screenTitle: {
    border: "#303B4D",
    subtitleColor: "#7E8A9C",
    iconColor: sky,
  },
  modalBox: {
    closeColor: "#7E8A9C",
    closeHoverBG: "#2D3A4C",
    closeHoverColor: "#ECF1F7",
    containerColor: "#212B39",
    titleColor: "#E8EDF4",
    iconColor: {
      default: sky,
    },
  },
  switchButton: {
    onLabelColor: "#DCE3EC",
    onBackgroundColor: "#2FBE8F",
    switchBackground: "#2A3444",
    disabledBackground: "#26303F",
  },
  dropdownSelector: {
    backgroundColor: "#232E3E",
    hoverBG: "#2D3A4C",
    selectedBGColor: "#364152",
    optionTextColor: "#DCE3EC",
    hoverText: "#ECF1F7",
    selectedTextColor: "#ECF1F7",
  },
  readBox: {
    borderColor: "#303B4D",
    backgroundColor: "#1F2836",
    textColor: "#A8B4C4",
  },
  menu: menuOverrides,
  tabs: {
    vertical: {
      buttons: {
        backgroundColor: "transparent",
        hoverBackground: "#2D3A4C",
        hoverLabelColor: "#ECF1F7",
        labelColor: "#A8B4C4",
        selectedBackground: "rgba(127, 184, 232, 0.13)",
        selectedLabelColor: sky,
      },
      backgroundColor: "transparent",
      borders: "transparent",
    },
    horizontal: {
      buttons: {
        hoverLabelColor: sky,
        labelColor: "#A8B4C4",
        selectedLabelColor: sky,
      },
      selectedIndicatorColor: sky,
    },
  },
  tag: {
    default: { background: "#2F6DA9" },
    secondary: { background: "#1E8FB8" },
  },
  badge: {
    default: { backgroundColor: "#2F6DA9" },
    secondary: { backgroundColor: "#1E8FB8" },
  },
  snackbar: {
    default: { backgroundColor: "#2F6DA9" },
  },
  informativeMessage: {
    default: { backgroundColor: "#2F6DA9", borderColor: "#2F6DA9" },
  },
  slider: {
    bulletBG: sky,
    railBG: "#303B4D",
  },
};
