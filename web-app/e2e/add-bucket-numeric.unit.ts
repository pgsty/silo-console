// Copyright (c) 2026 PGSTY
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { fileURLToPath } from "node:url";
import { chromium, expect, test } from "@playwright/test";
import { buildHarness } from "./fixtures/buildHarness";
import { browserExecutable } from "./fixtures/browserExecutable";

test.describe.configure({ mode: "default" });

let browser: Awaited<ReturnType<typeof chromium.launch>>;
let harnessScript: string;

test.beforeAll(async () => {
  const result = await buildHarness({
    configFile: false,
    logLevel: "silent",
    define: { "process.env.NODE_ENV": '"production"' },
    resolve: { tsconfigPaths: true },
    build: {
      write: false,
      lib: {
        entry: fileURLToPath(
          new URL("./fixtures/addBucketNumericHarness.ts", import.meta.url),
        ),
        name: "AddBucketNumericHarness",
        formats: ["iife"],
      },
    },
  });
  const output = Array.isArray(result) ? result[0] : result;
  if (!("output" in output)) throw new Error("Missing harness output");
  harnessScript = output.output
    .filter((item) => item.type === "chunk")
    .map((item) => item.code)
    .join("\n");
  browser = await chromium.launch({
    executablePath: browserExecutable(),
  });
});

test.afterAll(async () => {
  await browser.close();
});

async function mount() {
  const page = await browser.newPage();
  const requests: unknown[] = [];
  await page.route("http://bucket-create.test/", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: '<div id="root"></div>',
    }),
  );
  await page.route("**/api/v1/**", (route) => {
    requests.push({
      method: route.request().method(),
      path: new URL(route.request().url()).pathname,
      body: route.request().postDataJSON(),
    });
    return route.fulfill({ json: { bucketName: "test-bucket" } });
  });
  await page.addInitScript({ content: harnessScript });
  await page.goto("http://bucket-create.test/");
  return { page, requests };
}

test("create quota accepts fractional scalars and sends complete bytes", async () => {
  const { page, requests } = await mount();
  try {
    const result = await page.evaluate(async () => {
      const harness = (window as any).addBucketNumericHarness;
      const { setName, setQuota, setQuotaSize, setQuotaUnit } =
        harness.addBucketActions;
      harness.store.dispatch(setName("test-bucket"));
      harness.store.dispatch(setQuota(true));
      harness.store.dispatch(setQuotaSize(".5"));
      harness.store.dispatch(setQuotaUnit("Gi"));
      const action = await harness.store.dispatch(harness.addBucketAsync());
      return {
        action: action.type,
        invalidFields: harness.store.getState().addBucket.invalidFields,
      };
    });

    expect(result.action).toBe("buckets/addBucketAsync/fulfilled");
    expect(result.invalidFields).toEqual([]);
    expect(requests).toEqual([
      {
        method: "POST",
        path: "/api/v1/buckets",
        body: {
          name: "test-bucket",
          quota: {
            enabled: true,
            quota_type: "hard",
            amount: 536870912,
          },
          versioning: {
            enabled: false,
            excludeFolders: false,
            excludePrefixes: [],
          },
          locking: false,
        },
      },
    ]);
  } finally {
    await page.close();
  }
});

test("create quota rejects values outside the supported browser range", async () => {
  const { page, requests } = await mount();
  try {
    const result = await page.evaluate(async () => {
      const harness = (window as any).addBucketNumericHarness;
      const { setName, setQuota, setQuotaSize, setQuotaUnit } =
        harness.addBucketActions;
      harness.store.dispatch(setName("test-bucket"));
      harness.store.dispatch(setQuota(true));
      harness.store.dispatch(setQuotaSize("1000"));
      harness.store.dispatch(setQuotaUnit("Ei"));
      const state = harness.store.getState().addBucket;
      const action = await harness.store.dispatch(harness.addBucketAsync());
      return {
        action: action.type,
        invalidFields: state.invalidFields,
      };
    });

    expect(result.action).toBe("buckets/addBucketAsync/rejected");
    expect(result.invalidFields).toEqual(["quotaSize"]);
    expect(requests).toEqual([]);
  } finally {
    await page.close();
  }
});

test("changing the quota unit revalidates the current scalar", async () => {
  const { page, requests } = await mount();
  try {
    const result = await page.evaluate(() => {
      const harness = (window as any).addBucketNumericHarness;
      const { setQuota, setQuotaSize, setQuotaUnit } = harness.addBucketActions;
      harness.store.dispatch(setQuota(true));
      harness.store.dispatch(setQuotaSize("8"));
      harness.store.dispatch(setQuotaUnit("Gi"));
      const valid = harness.store.getState().addBucket.invalidFields;
      harness.store.dispatch(setQuotaUnit("Ei"));
      const invalid = harness.store.getState().addBucket.invalidFields;
      return { valid, invalid };
    });

    expect(result.valid).toEqual([]);
    expect(result.invalid).toEqual(["quotaSize"]);
    expect(requests).toEqual([]);
  } finally {
    await page.close();
  }
});

for (const value of [1.5, 2147483648]) {
  test(`create retention rejects ${value}`, async () => {
    const { page, requests } = await mount();
    try {
      const result = await page.evaluate(async (retentionValidity) => {
        const harness = (window as any).addBucketNumericHarness;
        const { setName, setVersioning, setRetention, setRetentionValidity } =
          harness.addBucketActions;
        harness.store.dispatch(setName("test-bucket"));
        harness.store.dispatch(setVersioning(true));
        harness.store.dispatch(setRetention(true));
        harness.store.dispatch(setRetentionValidity(retentionValidity));
        const action = await harness.store.dispatch(harness.addBucketAsync());
        return {
          action: action.type,
          invalidFields: harness.store.getState().addBucket.invalidFields,
        };
      }, value);

      expect(result.action).toBe("buckets/addBucketAsync/rejected");
      expect(result.invalidFields).toEqual(["retentionValidity"]);
      expect(requests).toEqual([]);
    } finally {
      await page.close();
    }
  });
}

test("create retention keeps the int32 upper boundary", async () => {
  const { page, requests } = await mount();
  try {
    const result = await page.evaluate(async () => {
      const harness = (window as any).addBucketNumericHarness;
      const { setName, setVersioning, setRetention, setRetentionValidity } =
        harness.addBucketActions;
      harness.store.dispatch(setName("test-bucket"));
      harness.store.dispatch(setVersioning(true));
      harness.store.dispatch(setRetention(true));
      harness.store.dispatch(setRetentionValidity(2147483647));
      const action = await harness.store.dispatch(harness.addBucketAsync());
      return {
        action: action.type,
        invalidFields: harness.store.getState().addBucket.invalidFields,
      };
    });

    expect(result.action).toBe("buckets/addBucketAsync/fulfilled");
    expect(result.invalidFields).toEqual([]);
    expect(requests).toEqual([
      {
        method: "POST",
        path: "/api/v1/buckets",
        body: {
          name: "test-bucket",
          retention: {
            mode: "compliance",
            unit: "days",
            validity: 2147483647,
          },
          versioning: {
            enabled: true,
            excludeFolders: false,
            excludePrefixes: [],
          },
          locking: true,
        },
      },
    ]);
  } finally {
    await page.close();
  }
});
