// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React from "react";
import { useSelector } from "react-redux";
import { AppState, useAppDispatch } from "../../../../store";
import { setLanguage } from "../../../../systemSlice";
import { Lang, nextLanguage, storeLanguage } from "../../../../i18n/lang";
import LanguageToggleIcon from "../../../../icons/LanguageToggleIcon";
import HeaderIconButton from "../PageHeaderWrapper/HeaderIconButton";

// Deliberately in the target language so its speakers can find it; not
// dictionary-driven.
const SWITCH_LABELS: Record<Lang, string> = {
  en: "Switch to English",
  zh: "切换到中文",
  pt: "Mudar para português",
};

export const useLanguageAction = () => {
  const dispatch = useAppDispatch();

  const language = useSelector((state: AppState) => state.system.language);

  const next = nextLanguage(language);

  const toggleLanguage = () => {
    dispatch(setLanguage(next));
    storeLanguage(next);
  };

  return {
    label: SWITCH_LABELS[next],
    onClick: toggleLanguage,
  };
};

const LanguageActivator = () => {
  const action = useLanguageAction();
  return (
    <HeaderIconButton
      id={"language-activator"}
      aria-label={action.label}
      onClick={action.onClick}
    >
      <LanguageToggleIcon />
    </HeaderIconButton>
  );
};

export default LanguageActivator;
