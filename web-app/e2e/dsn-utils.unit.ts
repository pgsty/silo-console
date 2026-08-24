// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import {
  buildMySqlDsn,
  buildPostgresDsn,
  databaseNotificationValues,
  emptyMySqlDsnFields,
  emptyPostgresDsnFields,
  isDatabaseNotificationValid,
  maskMySqlDsn,
  maskPostgresDsn,
  mySqlDsnStateFromRaw,
  parseMySqlDsn,
  parsePostgresDsn,
  postgresDsnStateFromRaw,
} from "../src/screens/Console/EventDestinations/CustomForms/dsnUtils";

test.describe("database notification DSNs", () => {
  test("keeps an empty MySQL form empty", () => {
    const fields = emptyMySqlDsnFields();
    expect(buildMySqlDsn(fields)).toBe("");
    expect(mySqlDsnStateFromRaw("")).toEqual({ raw: "", fields });
  });

  test("round-trips canonical PostgreSQL values with quoting", () => {
    const fields = {
      ...emptyPostgresDsnFields(),
      host: "db.internal",
      dbName: "events db",
      port: "5432",
      user: "event_writer",
      password: "p'a\\ss word",
      sslMode: "verify-full",
    };

    const dsn = buildPostgresDsn(fields);
    expect(parsePostgresDsn(dsn)).toEqual(fields);
    expect(maskPostgresDsn(dsn)).not.toContain(fields.password);
    expect(maskPostgresDsn(dsn)).toContain("password=••••••");
  });

  test("does not reinterpret a non-canonical PostgreSQL string", () => {
    const raw = "port=5432 host=db.internal";
    expect(parsePostgresDsn(raw)).not.toBeNull();
    expect(postgresDsnStateFromRaw(raw)).toMatchObject({
      raw,
      fields: { host: "db.internal", port: "5432" },
    });
    expect(maskPostgresDsn("postgres://user:secret@db/events")).toBe("••••••");
  });

  test("round-trips MySQL IPv6, query parameters, and password punctuation", () => {
    const fields = {
      host: "2001:db8::1",
      port: "3306",
      dbName: "events?parseTime=true&charset=utf8mb4",
      user: "event_writer",
      password: "p:a@ss",
    };

    const dsn = buildMySqlDsn(fields);
    expect(dsn).toBe(
      "event_writer:p:a@ss@tcp([2001:db8::1]:3306)/events?parseTime=true&charset=utf8mb4",
    );
    expect(parseMySqlDsn(dsn)).toEqual(fields);
    expect(mySqlDsnStateFromRaw(dsn)).toEqual({ raw: dsn, fields });
    expect(maskMySqlDsn(dsn)).not.toContain(fields.password);
    expect(maskMySqlDsn(dsn)).toContain("event_writer:••••••@tcp(");
  });

  test("emits canonical-only payloads even when the DSN is cleared", () => {
    const values = databaseNotificationValues("dsn_string", "", {
      table: "events",
      format: "namespace",
      queueDir: "",
      queueLimit: "",
      comment: "",
    });

    expect(values).toEqual([
      { key: "dsn_string", value: "" },
      { key: "table", value: "events" },
      { key: "format", value: "namespace" },
      { key: "queue_dir", value: "" },
      { key: "queue_limit", value: "" },
      { key: "comment", value: "" },
    ]);
    expect(values.map(({ key }) => key)).not.toContain("host");
    expect(values.map(({ key }) => key)).not.toContain("password");
  });

  test("requires both a canonical connection value and table", () => {
    expect(isDatabaseNotificationValid("host=db", "events")).toBe(true);
    expect(isDatabaseNotificationValid("", "events")).toBe(false);
    expect(isDatabaseNotificationValid("host=db", " ")).toBe(false);
  });
});
