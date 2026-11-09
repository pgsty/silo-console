// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React, { createContext, ReactNode, useContext } from "react";
const defaults = {
  close: "Close",
  actions: "Actions:",
  showPassword: "Show password",
  hidePassword: "Hide password",
  inputAction: "Input action",
  chooseDate: "Choose date",
  chooseDateTime: "Choose date and time",
  calendarLocale: "en",
  time: "Time",
  hour: "Hour",
  minute: "Minute",
  second: "Second",
  meridiem: "AM/PM",
  am: "AM",
  pm: "PM",
  previousCalendarPeriod: "Previous calendar period",
  nextCalendarPeriod: "Next calendar period",
  progress: "Progress",
  remove: "Remove",
  on: "On",
  off: "Off",
};
const Labels = createContext(defaults);
export const ControlLabelsProvider = ({
  labels,
  children,
}: {
  labels: Partial<typeof defaults>;
  children: ReactNode;
}) => <Labels.Provider value={{ ...defaults, ...labels }}>{children}</Labels.Provider>;
export const useControlLabels = () => useContext(Labels);
