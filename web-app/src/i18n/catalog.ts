// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later

export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & {
  other: string;
};
type Translation = string | PluralForms;
export type Dictionary = Record<string, Translation>;
