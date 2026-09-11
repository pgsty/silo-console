// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { minioadminFile, SERVER_ENDPOINT } from "./consts";

test.use({ storageState: minioadminFile });
for (const lang of ["en", "zh"]) {
  test.describe(lang, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((language) => {
        localStorage.setItem("language", language);
        localStorage.setItem("sidebarOpen", "{broken");
        localStorage.setItem("keep-this-preference", "kept");
      }, lang);
    });
    test("malformed deep links recover without clearing preferences", async ({
      page,
    }) => {
      // Set the address before the SPA boots. Invalid percent escapes cannot
      // be sent as HTTP document URLs because servers reject them first.
      await page.addInitScript(() => {
        const target = new URLSearchParams(location.search).get("test-route");
        if (target) history.replaceState({}, "", target);
      });
      for (const suffix of ["%", "%FF", "%E0%A4%A"]) {
        await page.goto(
          `${SERVER_ENDPOINT}/?test-route=${encodeURIComponent(`/browser/bucket/${suffix}`)}`,
        );
        await expect(
          page.getByText(lang === "zh" ? "404 错误" : "404 Error", {
            exact: true,
          }),
        ).toBeVisible();
        await page
          .getByRole("link", {
            name: lang === "zh" ? "返回首页" : "Return home",
          })
          .click();
        await expect(page.locator("#sign-out")).toBeVisible();
        expect(
          await page.evaluate(() =>
            localStorage.getItem("keep-this-preference"),
          ),
        ).toBe("kept");
      }
    });
    for (const width of [1440, 390]) {
      test(`navigation names and keyboard tooltip at width ${width}`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`${SERVER_ENDPOINT}/buckets`);
        const signOut = page.locator("#sign-out");
        await expect(signOut).toHaveAccessibleName(
          lang === "zh" ? "登出" : "Sign Out",
        );
        const auditNames = async () => {
          const result = await new AxeBuilder({ page })
            .withRules(["button-name", "link-name", "aria-command-name"])
            .analyze();
          expect(result.violations).toEqual([]);
        };
        await auditNames();
        const toggle = page.getByRole("button", {
          name:
            width < 600
              ? lang === "zh"
                ? "展开菜单"
                : "Expand menu"
              : lang === "zh"
                ? "折叠菜单"
                : "Collapse menu",
          exact: true,
        });
        await toggle.focus();
        await page.keyboard.press("Enter");
        await expect(signOut).toHaveAccessibleName(
          lang === "zh" ? "登出" : "Sign Out",
        );
        await auditNames();
        const refresh = page.locator("#refresh-buckets");
        await expect(refresh).toHaveAccessibleName(
          lang === "zh" ? "刷新存储桶" : "Refresh buckets",
        );
        await refresh.focus();
        await expect(page.getByRole("tooltip")).toBeVisible();
        await expect(refresh).toHaveAccessibleDescription(
          lang === "zh" ? "刷新" : "Refresh",
        );
        await page.keyboard.press("Escape");
        await expect(page.getByRole("tooltip")).toHaveCount(0);
      });
    }
    test("sign-out stays localized across a responsive relayout", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`${SERVER_ENDPOINT}/buckets`);
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await expect(page.locator("#sign-out")).toHaveAccessibleName(
          lang === "zh" ? "登出" : "Sign Out",
        );
      }
    });
    test("root render failure has a localized recovery action", async ({
      page,
    }) => {
      await page.route("**/api/v1/buckets", (route) =>
        route.fulfill({
          json: {
            buckets: [
              { name: { malformed: true }, creation_date: "2026-01-01" },
            ],
          },
        }),
      );
      await page.goto(`${SERVER_ENDPOINT}/browser`);
      await expect(page.getByRole("alert")).toContainText(
        lang === "zh" ? "无法显示此页面。" : "Unable to display this page.",
      );
      await expect(
        page.getByRole("button", {
          name: lang === "zh" ? "重新加载页面" : "Reload page",
          exact: true,
        }),
      ).toBeVisible();
      expect(
        await page.evaluate(() => localStorage.getItem("keep-this-preference")),
      ).toBe("kept");
    });
  });
}
