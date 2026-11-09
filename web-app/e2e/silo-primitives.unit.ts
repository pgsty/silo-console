// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Isolated feature entry: use the same deferred catalogue boundary as Console.

import { expect, test } from "@playwright/test";
import { DateTime } from "luxon";
import {
  darkTokens,
  lightTokens,
  tokenCssVariables,
} from "../src/common/ui/tokens";
import { freshnessText } from "../src/common/ui/freshnessText";
import { statCardTone } from "../src/common/ui/statCardTone";
import { orderOverflowItems } from "../src/common/ui/overflowItems";

// T03's public CSS aliases stay stable as the underlying design changes.
test("design colors map to stable CSS variables in both themes", () => {
  for (const tokens of [lightTokens, darkTokens]) {
    const css = tokenCssVariables(tokens);
    const aliases = {
      bg: "surface-1",
      "surface-hover": "hover",
      "border-strong": "input",
      "text-secondary": "muted-foreground",
      "primary-soft": "active",
      "neutral-badge-text": "foreground",
      "success-soft": "success-tint",
      danger: "destructive",
    };
    for (const [alias, token] of Object.entries(aliases))
      expect(css[`--silo-${alias}`]).toBe(`var(--${token})`);
    expect(
      Object.values(tokens).every((value) =>
        Object.values(css).includes(value),
      ),
    ).toBe(true);
    expect(css["--space-24"]).toBe("24px");
    expect(css["--silo-space-24"]).toBe("var(--space-24)");
    expect(css["--radius-button"]).toBe("8px");
    expect(css["--silo-motion-hover"]).toBe("var(--dur-fast) var(--ease-fast)");
    expect(css["--silo-elevation-overlay"]).toBe("var(--shadow-3)");
  }
  expect(tokenCssVariables(lightTokens)["--surface-1"]).toBe("#FAFAFA");
  expect(tokenCssVariables(darkTokens)["--surface-1"]).toBe("#171717");
});

const now = DateTime.fromISO("2026-10-23T12:00:00Z");
const at = "2026-10-23T11:57:00Z";
test("freshness formats relative and absolute times in the selected language", () => {
  const en = freshnessText({ at, language: "en", now });
  const zh = freshnessText({ at, language: "zh", prefix: "Calculated", now });
  expect(en.label).toBe("Updated 3 minutes ago");
  expect(zh.label).toBe("统计于 3分钟前");
  expect(en.tooltip).toContain("October 23, 2026");
  expect(zh.tooltip).toContain("2026年10月23日");
  expect(en.dateTime).toBeTruthy();
  expect(
    freshnessText({ at, language: "en", prefix: "Calculated", now }).label,
  ).toBe("Calculated 3 minutes ago");
  expect(freshnessText({ at, language: "zh", now }).label).toBe(
    "更新于 3分钟前",
  );
  expect(
    freshnessText({ at, language: "en", now: now.plus({ minutes: 1 }) }).label,
  ).toBe("Updated 4 minutes ago");
});

test("missing, invalid and pending timestamps explain the calculation state", () => {
  for (const at of [undefined, null, "", "not-a-date"]) {
    expect(freshnessText({ at, language: "en", now })).toEqual({
      label: "Calculating…",
      tooltip: "The server has not finished computing usage yet.",
      dateTime: undefined,
    });
    expect(freshnessText({ at, language: "zh", now })).toEqual({
      label: "统计中…",
      tooltip: "服务端尚未完成用量统计",
      dateTime: undefined,
    });
  }
  expect(freshnessText({ at, pending: true, language: "en", now }).label).toBe(
    "Calculating…",
  );
});

test("capacity tones change at 85% and 95%, including exact boundaries", () => {
  for (const [value, tone] of [
    [0, "success"],
    [0.84999, "success"],
    [0.85, "warning"],
    [0.94999, "warning"],
    [0.95, "danger"],
    [1, "danger"],
  ] as const) {
    expect(statCardTone(value)).toBe(tone);
  }
});

test("overflow ordering keeps destructive items last without changing either group", () => {
  const items = Object.freeze([
    { label: "Delete", danger: true },
    { label: "View" },
    { label: "Reset", danger: true, disabled: true },
    { label: "Edit", danger: false },
  ]);
  const ordered = orderOverflowItems(items);
  expect(ordered.map(({ label }) => label)).toEqual([
    "View",
    "Edit",
    "Delete",
    "Reset",
  ]);
  expect(items.map(({ label }) => label)).toEqual([
    "Delete",
    "View",
    "Reset",
    "Edit",
  ]);
  expect(ordered[3]).toBe(items[2]);
  expect(orderOverflowItems([])).toEqual([]);
  expect(orderOverflowItems([{ danger: true }, { danger: true }])).toEqual([
    { danger: true },
    { danger: true },
  ]);
});
