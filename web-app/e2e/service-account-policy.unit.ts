// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later

import { expect, test } from "@playwright/test";
import {
  EMPTY_SERVICE_ACCOUNT_POLICY,
  isServiceAccountCreatePolicyValid,
  isServiceAccountUpdatePolicyValid,
  policyForServiceAccountCreate,
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

test("service-account creation drops preloaded policy when restriction toggle is turned off", () => {
  expect(
    policyForServiceAccountCreate({
      isRestrictedByPolicy: false,
      policyDefinition: parentPolicy,
    }),
  ).toBe("");

  expect(
    policyForServiceAccountCreate({
      isRestrictedByPolicy: true,
      policyDefinition: inlinePolicy,
    }),
  ).toBe(inlinePolicy);

  expect(
    isServiceAccountCreatePolicyValid({
      isRestrictedByPolicy: false,
      policyDefinition: "",
    }),
  ).toBe(true);

  expect(
    isServiceAccountCreatePolicyValid({
      isRestrictedByPolicy: true,
      policyDefinition: "  \n ",
    }),
  ).toBe(false);

  expect(
    isServiceAccountCreatePolicyValid({
      isRestrictedByPolicy: true,
      policyDefinition: '{"Version":"2012-10-17","Statement":[]}',
    }),
  ).toBe(false);

  expect(
    isServiceAccountUpdatePolicyValid({
      initialMode: "inline",
      mode: "inline",
      policyDefinition: "{}",
      initialPolicyDefinition: inlinePolicy,
    }),
  ).toBe(false);

  expect(
    isServiceAccountUpdatePolicyValid({
      initialMode: "inline",
      mode: "inline",
      policyDefinition: '{"Version":"","Statement":null}',
      initialPolicyDefinition: '{"Version":"","Statement":null}',
    }),
  ).toBe(true);

  expect(
    isServiceAccountCreatePolicyValid({
      isRestrictedByPolicy: true,
      policyDefinition: inlinePolicy,
    }),
  ).toBe(true);
});

test("restriction toggle rejects every empty document accepted by the Go decoder", () => {
  for (const policyDefinition of [
    '{"Statement":null}',
    '{"statement":[]}',
    '{"VERSION":"2012-10-17","STATEMENT":null}',
    '{"Statement":[{"Effect":"Allow"}],"statement":[]}',
    '{"Statement":[{"Effect":"Allow"}],"statement":[{"Effect":"Allow"}],"Statement":[]}',
    '{"ſtatement":[]}',
  ]) {
    expect(
      isServiceAccountCreatePolicyValid({
        isRestrictedByPolicy: true,
        policyDefinition,
      }),
      policyDefinition,
    ).toBe(false);
    expect(
      isServiceAccountUpdatePolicyValid({
        initialMode: "inline",
        mode: "inline",
        initialPolicyDefinition: inlinePolicy,
        policyDefinition,
      }),
      policyDefinition,
    ).toBe(false);
  }
});
