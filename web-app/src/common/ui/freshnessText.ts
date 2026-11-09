// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { DateTime } from "luxon";
import { formatText, Lang, translate, localeTag } from "../../i18n/lang";

export const freshnessText = ({
  at,
  pending,
  prefix = "Updated",
  language,
  now = DateTime.now(),
}: {
  at?: string | null;
  pending?: boolean;
  prefix?: "Updated" | "Calculated";
  language: Lang;
  now?: DateTime;
}) => {
  const t = (text: string) => translate(language, text);
  const date = at ? DateTime.fromISO(at) : null;
  if (pending || !date?.isValid)
    return {
      label: t("Calculating…"),
      tooltip: t("The server has not finished computing usage yet."),
      dateTime: undefined,
    };
  const locale = localeTag(language);
  const relative = date.toRelative({ locale, base: now }) || "";
  return {
    label: formatText(
      prefix === "Calculated" ? t("Calculated {time}") : t("Updated {time}"),
      { time: relative },
    ),
    tooltip: date
      .setLocale(locale)
      .toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS),
    dateTime: date.toISO() || undefined,
  };
};
