// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later

import { expect, test } from "@playwright/test";
import {
  EMPTY_SERVICE_ACCOUNT_POLICY,
  policyForServiceAccountUpdate,
} from "../src/screens/Console/Account/serviceAccountPolicy";

const parentPolicy =
  '{"Version":"2012-10-17","Statement":[{"Effect":"Allow"}]}';
const inlinePolicy =
  '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["s3:GetObject"]}]}';

test("service-account policy payloads keep inherited and inline state distinct", () => {
  expect(
    policyForServiceAccountUpdate({
      initialMode: "inherited",
      mode: "inherited",
      policyDefinition: parentPolicy,
      initialPolicyDefinition: "",
    }),
  ).toBe("");

  expect(
    policyForServiceAccountUpdate({
      initialMode: "inherited",
      mode: "inline",
      policyDefinition: parentPolicy,
      initialPolicyDefinition: "",
    }),
  ).toBe(parentPolicy);

  expect(
    policyForServiceAccountUpdate({
      initialMode: "inherited",
      mode: "inherited",
      policyDefinition: "",
      initialPolicyDefinition: "",
    }),
  ).toBe("");
});

test("inline policy payloads distinguish metadata saves, edits, and clearing", () => {
  expect(
    policyForServiceAccountUpdate({
      initialMode: "inline",
      mode: "inline",
      policyDefinition: inlinePolicy,
      initialPolicyDefinition: inlinePolicy,
    }),
  ).toBe("");

  expect(
    policyForServiceAccountUpdate({
      initialMode: "inline",
      mode: "inline",
      policyDefinition: parentPolicy,
      initialPolicyDefinition: inlinePolicy,
    }),
  ).toBe(parentPolicy);

  expect(
    policyForServiceAccountUpdate({
      initialMode: "inline",
      mode: "inherited",
      policyDefinition: inlinePolicy,
      initialPolicyDefinition: inlinePolicy,
    }),
  ).toBe(EMPTY_SERVICE_ACCOUNT_POLICY);
});
