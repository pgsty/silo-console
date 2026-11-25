// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
import React from "react";
import { IElement, IElementValue, IOverrideEnv, OverrideValue } from "./types";
import {
  CodeIcon,
  CompressIcon,
  ConsoleIcon,
  FindReplaceIcon,
  FirstAidIcon,
  KeyIcon,
  LogsIcon,
  PendingItemsIcon,
  PublicIcon,
} from "mds";
import { i18nKey } from "i18n/lang";

// Labels become tabs in ConfigurationOptions; form copy is translated by
// ConfTargetGeneric. Mark it here, keeping raw keys until render time.
export const configurationElements: IElement[] = [
  {
    icon: <PublicIcon />,
    configuration_id: "region",
    configuration_label: i18nKey("Region"),
  },
  {
    icon: <CompressIcon />,
    configuration_id: "compression",
    configuration_label: i18nKey("Compression"),
  },
  {
    icon: <CodeIcon />,
    configuration_id: "api",
    configuration_label: i18nKey("API"),
  },
  {
    icon: <FirstAidIcon />,
    configuration_id: "heal",
    configuration_label: i18nKey("Heal"),
  },
  {
    icon: <FindReplaceIcon />,
    configuration_id: "scanner",
    configuration_label: i18nKey("Scanner"),
  },
  {
    icon: <KeyIcon />,
    configuration_id: "etcd",
    configuration_label: i18nKey("Etcd"),
  },
  {
    icon: <ConsoleIcon />,
    configuration_id: "logger_webhook",
    configuration_label: i18nKey("Logger Webhook"),
  },
  {
    icon: <PendingItemsIcon />,
    configuration_id: "audit_webhook",
    configuration_label: i18nKey("Audit Webhook"),
  },
  {
    icon: <LogsIcon />,
    configuration_id: "audit_kafka",
    configuration_label: i18nKey("Audit Kafka"),
  },
];

export const fieldsConfigurations: any = {
  region: [
    {
      name: "name",
      required: true,
      label: i18nKey("Server Location"),
      tooltip: i18nKey(
        'Name of the location of the server e.g. "us-west-rack2"',
      ),
      type: "string",
      placeholder: i18nKey("e.g. us-west-rack-2"),
    },
    {
      name: "comment",
      required: false,
      label: i18nKey("Comment"),
      tooltip: i18nKey("You can add a comment to this setting"),
      type: "comment",
      placeholder: i18nKey("Enter custom notes if any"),
    },
  ],
  compression: [
    {
      name: "extensions",
      required: false,
      label: i18nKey("Extensions"),
      tooltip: i18nKey(
        'Extensions to compress e.g. ".txt", ".log" or ".csv" -  you can write one per field',
      ),
      type: "csv",
      placeholder: i18nKey("Enter an Extension"),
      withBorder: true,
    },
    {
      name: "mime_types",
      required: false,
      label: i18nKey("Mime Types"),
      tooltip: i18nKey(
        'Mime types e.g. "text/*", "application/json" or "application/xml" - you can write one per field',
      ),
      type: "csv",
      placeholder: i18nKey("Enter a Mime Type"),
      withBorder: true,
    },
  ],
  api: [
    {
      name: "requests_max",
      required: false,
      label: i18nKey("Requests Max"),
      tooltip: i18nKey("Maximum number of concurrent requests, e.g. '1600'"),
      type: "number",
      placeholder: i18nKey("Enter Requests Max"),
    },
    {
      name: "cors_allow_origin",
      required: false,
      label: i18nKey("Cors Allow Origin"),
      tooltip: i18nKey("List of origins allowed for CORS requests"),
      type: "csv",
      placeholder: i18nKey("Enter allowed origin e.g. https://example.com"),
    },
    {
      name: "replication_max_workers",
      required: false,
      label: i18nKey("Maximum Replication Workers"),
      tooltip: i18nKey(
        "Maximum number of replication workers (1–500, default 500)",
      ),
      type: "number",
    },
  ],
  heal: [
    {
      name: "bitrotscan",
      required: false,
      label: i18nKey("Bitrot Scan"),
      tooltip: i18nKey(
        "Perform bitrot scan on disks when checking objects during scanner",
      ),
      type: "on|off",
    },
    {
      name: "max_sleep",
      required: false,
      label: i18nKey("Max Sleep"),
      tooltip: i18nKey(
        "Maximum sleep duration between objects to slow down heal operation, e.g. 2s",
      ),
      type: "duration",
      placeholder: i18nKey("Enter Max Sleep Duration"),
    },
    {
      name: "max_io",
      required: false,
      label: i18nKey("Max IO"),
      tooltip: i18nKey(
        "Maximum IO requests allowed between objects to slow down heal operation, e.g. 3",
      ),
      type: "number",
      placeholder: i18nKey("Enter Max IO"),
    },
  ],
  scanner: [
    {
      name: "delay",
      required: false,
      label: i18nKey("Delay Multiplier"),
      tooltip: i18nKey("Scanner delay multiplier, defaults to '10.0'"),
      type: "number",
      placeholder: i18nKey("Enter Delay"),
    },
    {
      name: "max_wait",
      required: false,
      label: i18nKey("Max Wait"),
      tooltip: i18nKey(
        "Maximum wait time between operations, defaults to '15s'",
      ),
      type: "duration",
      placeholder: i18nKey("Enter Max Wait"),
    },
    {
      name: "cycle",
      required: false,
      label: i18nKey("Cycle"),
      tooltip: i18nKey(
        "Time duration between scanner cycles, defaults to '1m'",
      ),
      type: "duration",
      placeholder: i18nKey("Enter Cycle"),
    },
  ],
  etcd: [
    {
      name: "endpoints",
      required: true,
      label: i18nKey("Endpoints"),
      tooltip: i18nKey(
        'List of etcd endpoints e.g. "http://localhost:2379" - you can write one per field',
      ),
      type: "csv",
      placeholder: i18nKey("Enter Endpoint"),
    },
    {
      name: "path_prefix",
      required: false,
      label: i18nKey("Path Prefix"),
      tooltip: i18nKey('Namespace prefix to isolate tenants e.g. "customer1/"'),
      type: "string",
      placeholder: i18nKey("Enter Path Prefix"),
    },
    {
      name: "coredns_path",
      required: false,
      label: i18nKey("Coredns Path"),
      tooltip: i18nKey('Shared bucket DNS records, default is "/skydns"'),
      type: "string",
      placeholder: i18nKey("Enter Coredns Path"),
    },
    {
      name: "client_cert",
      required: false,
      label: i18nKey("Client Cert"),
      tooltip: i18nKey("Client cert for mTLS authentication"),
      type: "string",
      placeholder: i18nKey("Enter Client Cert"),
    },
    {
      name: "client_cert_key",
      required: false,
      label: i18nKey("Client Cert Key"),
      tooltip: i18nKey("Client cert key for mTLS authentication"),
      type: "string",
      placeholder: i18nKey("Enter Client Cert Key"),
    },
    {
      name: "comment",
      required: false,
      label: i18nKey("Comment"),
      tooltip: i18nKey("You can add a comment to this setting"),
      type: "comment",
      multiline: true,
      placeholder: i18nKey("Enter custom notes if any"),
    },
  ],
  logger_webhook: [
    {
      name: "endpoint",
      required: true,
      label: i18nKey("Endpoint"),
      type: "string",
      placeholder: i18nKey("Enter Endpoint"),
    },
    {
      name: "auth_token",
      required: true,
      label: i18nKey("Auth Token"),
      type: "password",
      placeholder: i18nKey("Enter Auth Token"),
    },
  ],
  audit_webhook: [
    {
      name: "endpoint",
      required: true,
      label: i18nKey("Endpoint"),
      type: "string",
      placeholder: i18nKey("Enter Endpoint"),
    },
    {
      name: "auth_token",
      required: true,
      label: i18nKey("Auth Token"),
      type: "password",
      placeholder: i18nKey("Enter Auth Token"),
    },
  ],
  audit_kafka: [
    {
      name: "enable",
      required: false,
      label: i18nKey("Enable"),
      tooltip: i18nKey("Enable audit_kafka target"),
      type: "on|off",
      customValueProcess: (origValue: string) => {
        return origValue === "" || origValue === "on" ? "on" : "off";
      },
    },
    {
      name: "brokers",
      required: true,
      label: i18nKey("Brokers"),
      type: "csv",
      placeholder: i18nKey("Enter Kafka Broker"),
    },
    {
      name: "topic",
      required: false,
      label: i18nKey("Topic"),
      type: "string",
      placeholder: i18nKey("Enter Kafka Topic"),
      tooltip: i18nKey("Kafka topic used for bucket notifications"),
    },
    {
      name: "sasl",
      required: false,
      label: i18nKey("Use SASL"),
      tooltip: i18nKey(
        "Enable SASL (Simple Authentication and Security Layer) authentication",
      ),
      type: "on|off",
    },
    {
      name: "sasl_username",
      required: false,
      label: i18nKey("SASL Username"),
      type: "string",
      placeholder: i18nKey("Enter SASL Username"),
      tooltip: i18nKey("Username for SASL/PLAIN or SASL/SCRAM authentication"),
    },
    {
      name: "sasl_password",
      required: false,
      label: i18nKey("SASL Password"),
      type: "password",
      placeholder: i18nKey("Enter SASL Password"),
      tooltip: i18nKey("Password for SASL/PLAIN or SASL/SCRAM authentication"),
    },
    {
      name: "sasl_mechanism",
      required: false,
      label: i18nKey("SASL Mechanism"),
      type: "string",
      placeholder: i18nKey("Enter SASL Mechanism"),
      tooltip: i18nKey("SASL authentication mechanism"),
    },
    {
      name: "tls",
      required: false,
      label: i18nKey("Use TLS"),
      tooltip: i18nKey("Enable TLS (Transport Layer Security)"),
      type: "on|off",
    },
    {
      name: "tls_skip_verify",
      required: false,
      label: i18nKey("Skip TLS Verification"),
      tooltip: i18nKey("Trust server TLS without verification"),
      type: "on|off",
    },
    {
      name: "client_tls_cert",
      required: false,
      label: i18nKey("Client Cert"),
      tooltip: i18nKey("Client cert for mTLS authentication"),
      type: "string",
      placeholder: i18nKey("Enter Client Cert"),
    },
    {
      name: "client_tls_key",
      required: false,
      label: i18nKey("Client Cert Key"),
      tooltip: i18nKey("Client cert key for mTLS authentication"),
      type: "string",
      placeholder: i18nKey("Enter Client Cert Key"),
    },
    {
      name: "tls_client_auth",
      required: false,
      label: i18nKey("TLS Client Auth"),
      tooltip: i18nKey(
        "ClientAuth determines the Kafka server's policy for TLS client authorization",
      ),
      type: "string",
    },
    {
      name: "version",
      required: false,
      label: i18nKey("Version"),
      tooltip: i18nKey("Specify the version of the Kafka cluster"),
      type: "string",
    },
  ],
};

export const removeEmptyFields = (formFields: IElementValue[]) => {
  const nonEmptyFields = formFields.filter((field) => field.value !== "");

  return nonEmptyFields;
};

export const selectSAs = (
  e: React.ChangeEvent<HTMLInputElement>,
  setSelectedSAs: Function,
  selectedSAs: string[],
) => {
  const targetD = e.target;
  const value = targetD.value;
  const checked = targetD.checked;

  let elements: string[] = [...selectedSAs]; // We clone the selectedSAs array
  if (checked) {
    // If the user has checked this field we need to push this to selectedSAs
    elements.push(value);
  } else {
    // User has unchecked this field, we need to remove it from the list
    elements = elements.filter((element) => element !== value);
  }
  setSelectedSAs(elements);
  return elements;
};

export const overrideFields = (formFields: IElementValue[]): IOverrideEnv => {
  let overrideReturn: IOverrideEnv = {};

  formFields.forEach((envItem) => {
    // it has override values, we construct the value
    if (envItem.env_override) {
      const value: OverrideValue = {
        value: envItem.env_override.value || "",
        overrideEnv: envItem.env_override.name || "",
      };

      overrideReturn = { ...overrideReturn, [envItem.key]: value };
    }
  });

  return overrideReturn;
};
