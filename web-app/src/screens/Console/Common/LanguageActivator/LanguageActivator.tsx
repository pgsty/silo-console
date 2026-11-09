// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later

import React, { useRef, useState } from "react";
import { DropdownSelector } from "mds";
import { useAppDispatch } from "../../../../store";
import { setLanguage } from "../../../../systemSlice";
import {
  isLanguage,
  languages,
  LOCALES,
  storeLanguage,
  useLanguage,
  useT,
} from "i18n";
import LanguageToggleIcon from "../../../../icons/LanguageToggleIcon";
import HeaderIconButton from "../PageHeaderWrapper/HeaderIconButton";

export default function LanguageActivator() {
  const language = useLanguage();
  const t = useT();
  const dispatch = useAppDispatch();
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <HeaderIconButton
        ref={trigger}
        id="language-activator"
        aria-label={t("Language")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? "language-menu" : undefined}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <LanguageToggleIcon />
      </HeaderIconButton>
      <DropdownSelector
        id="language-menu"
        role="listbox"
        ariaLabel={t("Language")}
        open={open}
        anchorEl={trigger.current}
        anchorOrigin="end"
        autoFocus
        selectedOption={language}
        hideTriggerAction={() => setOpen(false)}
        options={languages.map((value) => ({
          value,
          label: LOCALES[value].label,
          lang: LOCALES[value].tag,
          dir: LOCALES[value].dir,
          indicator:
            language === value ? <span aria-hidden="true">✓</span> : undefined,
        }))}
        onSelect={(value) => {
          if (isLanguage(value)) {
            storeLanguage(value);
            dispatch(setLanguage(value));
          }
        }}
      />
    </>
  );
}
