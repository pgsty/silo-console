// This file is part of MinIO Console Server
// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { IElementValue } from "../../Configurations/types";

export interface PostgresDsnFields {
  host: string;
  dbName: string;
  port: string;
  user: string;
  password: string;
  sslMode: string;
}

export interface MySqlDsnFields {
  host: string;
  dbName: string;
  port: string;
  user: string;
  password: string;
}

export const emptyPostgresDsnFields = (): PostgresDsnFields => ({
  host: "",
  dbName: "",
  port: "",
  user: "",
  password: "",
  sslMode: "",
});

export const emptyMySqlDsnFields = (): MySqlDsnFields => ({
  host: "",
  dbName: "",
  port: "",
  user: "",
  password: "",
});

const postgresFields: ReadonlyArray<{
  key: string;
  field: keyof PostgresDsnFields;
}> = [
  { key: "host", field: "host" },
  { key: "dbname", field: "dbName" },
  { key: "user", field: "user" },
  { key: "password", field: "password" },
  { key: "port", field: "port" },
  { key: "sslmode", field: "sslMode" },
];

const postgresFieldByKey = new Map(
  postgresFields.map(({ key, field }) => [key, field] as const),
);

const encodePostgresValue = (value: string): string => {
  if (!/[\s'\\]/.test(value)) {
    return value;
  }

  return `'${value.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
};

export const buildPostgresDsn = (fields: Readonly<PostgresDsnFields>): string =>
  postgresFields
    .flatMap(({ key, field }) => {
      const value = fields[field];
      return value === "" ? [] : [`${key}=${encodePostgresValue(value)}`];
    })
    .join(" ");

export const parsePostgresDsn = (input: string): PostgresDsnFields | null => {
  const result = emptyPostgresDsnFields();
  const seen = new Set<keyof PostgresDsnFields>();
  let position = 0;

  while (position < input.length) {
    while (/\s/.test(input[position] || "")) {
      position++;
    }
    if (position >= input.length) {
      break;
    }

    const keyStart = position;
    while (position < input.length && !/[=\s]/.test(input[position])) {
      position++;
    }
    if (input[position] !== "=") {
      return null;
    }

    const field = postgresFieldByKey.get(input.slice(keyStart, position));
    if (!field || seen.has(field)) {
      return null;
    }
    seen.add(field);
    position++;

    let value = "";
    if (input[position] === "'") {
      position++;
      let closed = false;
      while (position < input.length) {
        const character = input[position++];
        if (character === "\\") {
          if (position >= input.length) {
            return null;
          }
          value += input[position++];
        } else if (character === "'") {
          closed = true;
          break;
        } else {
          value += character;
        }
      }
      if (!closed || (position < input.length && !/\s/.test(input[position]))) {
        return null;
      }
    } else {
      while (position < input.length && !/\s/.test(input[position])) {
        const character = input[position++];
        if (character === "\\") {
          if (position >= input.length) {
            return null;
          }
          value += input[position++];
        } else {
          value += character;
        }
      }
    }

    result[field] = value;
  }

  return result;
};

export const postgresDsnStateFromRaw = (raw: string) => ({
  raw,
  fields: parsePostgresDsn(raw) || emptyPostgresDsnFields(),
});

const normalizedMySqlHost = (host: string): string => {
  if (host.startsWith("[") && host.endsWith("]")) {
    return host.slice(1, -1);
  }
  return host;
};

export const buildMySqlDsn = (fields: Readonly<MySqlDsnFields>): string => {
  if (Object.values(fields).every((value) => value === "")) {
    return "";
  }

  const host = normalizedMySqlHost(fields.host);
  const addressHost = host.includes(":") ? `[${host}]` : host;
  return `${fields.user}:${fields.password}@tcp(${addressHost}:${fields.port})/${fields.dbName}`;
};

export const parseMySqlDsn = (input: string): MySqlDsnFields | null => {
  if (input === "") {
    return emptyMySqlDsnFields();
  }

  const networkMarker = "@tcp(";
  const networkStart = input.lastIndexOf(networkMarker);
  const addressEnd = input.indexOf(")/", networkStart + networkMarker.length);
  if (networkStart < 0 || addressEnd < 0) {
    return null;
  }

  const credentials = input.slice(0, networkStart);
  const credentialsSeparator = credentials.indexOf(":");
  if (credentialsSeparator < 0) {
    return null;
  }

  const address = input.slice(networkStart + networkMarker.length, addressEnd);
  let host = "";
  let port = "";
  if (address.startsWith("[")) {
    const bracketEnd = address.lastIndexOf("]:");
    if (bracketEnd < 0) {
      return null;
    }
    host = address.slice(1, bracketEnd);
    port = address.slice(bracketEnd + 2);
  } else {
    const addressSeparator = address.lastIndexOf(":");
    if (addressSeparator < 0) {
      return null;
    }
    host = address.slice(0, addressSeparator);
    port = address.slice(addressSeparator + 1);
  }

  return {
    user: credentials.slice(0, credentialsSeparator),
    password: credentials.slice(credentialsSeparator + 1),
    host,
    port,
    dbName: input.slice(addressEnd + 2),
  };
};

export const mySqlDsnStateFromRaw = (raw: string) => ({
  raw,
  fields: parseMySqlDsn(raw) || emptyMySqlDsnFields(),
});

const hiddenConnectionString = "••••••";

export const maskPostgresDsn = (input: string): string => {
  if (input === "") {
    return "";
  }
  const parsed = parsePostgresDsn(input);
  if (!parsed) {
    return hiddenConnectionString;
  }
  return buildPostgresDsn({
    ...parsed,
    password: parsed.password === "" ? "" : hiddenConnectionString,
  });
};

export const maskMySqlDsn = (input: string): string => {
  if (input === "") {
    return "";
  }
  const parsed = parseMySqlDsn(input);
  if (!parsed) {
    return hiddenConnectionString;
  }
  return buildMySqlDsn({
    ...parsed,
    password: parsed.password === "" ? "" : hiddenConnectionString,
  });
};

interface DatabaseNotificationFields {
  table: string;
  format: string;
  queueDir: string;
  queueLimit: string;
  comment: string;
}

export const databaseNotificationValues = (
  connectionKey: "connection_string" | "dsn_string",
  connectionValue: string,
  fields: Readonly<DatabaseNotificationFields>,
): IElementValue[] => [
  { key: connectionKey, value: connectionValue },
  { key: "table", value: fields.table },
  { key: "format", value: fields.format },
  { key: "queue_dir", value: fields.queueDir },
  { key: "queue_limit", value: fields.queueLimit },
  { key: "comment", value: fields.comment },
];

export const isDatabaseNotificationValid = (
  connectionValue: string,
  table: string,
): boolean => connectionValue.trim() !== "" && table.trim() !== "";
