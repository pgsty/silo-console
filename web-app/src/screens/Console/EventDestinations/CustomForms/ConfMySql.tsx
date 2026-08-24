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

import React, { useEffect, useState } from "react";
import { IElementValue } from "../../Configurations/types";
import {
  Box,
  CommentBox,
  FormLayout,
  Grid,
  InputBox,
  RadioGroup,
  ReadBox,
  Switch,
} from "mds";
import { useT } from "i18n";
import {
  buildMySqlDsn,
  databaseNotificationValues,
  emptyMySqlDsnFields,
  isDatabaseNotificationValid,
  maskMySqlDsn,
  mySqlDsnStateFromRaw,
  MySqlDsnFields,
} from "./dsnUtils";

interface IConfMySqlProps {
  onChange: (newValue: IElementValue[]) => void;
  onValidityChange: (valid: boolean) => void;
}

const ConfMySql = ({ onChange, onValidityChange }: IConfMySqlProps) => {
  const t = useT();
  //Local States
  const [useDsnString, setUseDsnString] = useState<boolean>(false);
  const [connection, setConnection] = useState({
    raw: "",
    fields: emptyMySqlDsnFields(),
  });

  const [table, setTable] = useState<string>("");
  const [format, setFormat] = useState<string>("namespace");
  const [queueDir, setQueueDir] = useState<string>("");
  const [queueLimit, setQueueLimit] = useState<string>("");
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    onChange(
      databaseNotificationValues("dsn_string", connection.raw, {
        table,
        format,
        queueDir,
        queueLimit,
        comment,
      }),
    );
    onValidityChange(isDatabaseNotificationValid(connection.raw, table));
  }, [
    connection.raw,
    table,
    format,
    queueDir,
    queueLimit,
    comment,
    onChange,
    onValidityChange,
  ]);

  const setStructuredField = <Field extends keyof MySqlDsnFields>(
    field: Field,
    value: MySqlDsnFields[Field],
  ) => {
    setConnection((current) => {
      const fields = { ...current.fields, [field]: value };
      return { fields, raw: buildMySqlDsn(fields) };
    });
  };

  const switcherChangeEvt = (event: React.ChangeEvent<HTMLInputElement>) => {
    const manual = event.target.checked;
    if (!manual) {
      // Parsing only populates the structured controls. The raw value stays
      // authoritative until the user explicitly edits a field.
      setConnection((current) => mySqlDsnStateFromRaw(current.raw));
    }
    setUseDsnString(manual);
  };

  return (
    <FormLayout withBorders={false} containerPadding={false}>
      <Switch
        label={t("Enter DSN String")}
        checked={useDsnString}
        id="checkedB"
        name="checkedB"
        onChange={switcherChangeEvt}
        value={"dnsString"}
      />
      {useDsnString ? (
        <React.Fragment>
          <Box className={"inputItem"}>
            <InputBox
              id="dsn-string"
              name="dsn_string"
              label={t("DSN String")}
              value={connection.raw}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setConnection((current) => ({
                  ...current,
                  raw: e.target.value,
                }));
              }}
            />
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box>
            <Box
              withBorders
              useBackground
              sx={{
                overflowY: "auto",
                height: 170,
                marginBottom: 12,
              }}
            >
              <InputBox
                id="host"
                name="host"
                label=""
                placeholder={t("Enter Host")}
                value={connection.fields.host}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setStructuredField("host", e.target.value);
                }}
              />
              <InputBox
                id="db-name"
                name="db-name"
                label=""
                placeholder={t("Enter DB Name")}
                value={connection.fields.dbName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setStructuredField("dbName", e.target.value);
                }}
              />
              <InputBox
                id="port"
                name="port"
                label=""
                placeholder={t("Enter Port")}
                value={connection.fields.port}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setStructuredField("port", e.target.value);
                }}
              />
              <InputBox
                id="user"
                name="user"
                label=""
                placeholder={t("Enter User")}
                value={connection.fields.user}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setStructuredField("user", e.target.value);
                }}
              />
              <InputBox
                id="password"
                name="password"
                label=""
                placeholder={t("Enter Password")}
                type="password"
                value={connection.fields.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setStructuredField("password", e.target.value);
                }}
              />
            </Box>
          </Box>
          <Grid item xs={12} sx={{ margin: "12px 0" }}>
            <ReadBox label={t("Connection String")} multiLine>
              {maskMySqlDsn(connection.raw)}
            </ReadBox>
          </Grid>
        </React.Fragment>
      )}
      <InputBox
        id="table"
        name="table"
        label={t("Table")}
        placeholder={t("Enter Table Name")}
        value={table}
        tooltip={t(
          "DB table name to store/update events, table is auto-created",
        )}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setTable(e.target.value);
        }}
      />
      <RadioGroup
        currentValue={format}
        id="format"
        name="format"
        label={t("Format")}
        onChange={(e) => {
          setFormat(e.target.value);
        }}
        tooltip={t(
          "'namespace' reflects current bucket/object list and 'access' reflects a journal of object operations, defaults to 'namespace'",
        )}
        selectorOptions={[
          { label: "Namespace", value: "namespace" },
          { label: "Access", value: "access" },
        ]}
      />
      <InputBox
        id="queue-dir"
        name="queue_dir"
        label={t("Queue Dir")}
        placeholder={t("Enter Queue Dir")}
        value={queueDir}
        tooltip={t(
          "Staging directory for undelivered messages e.g. '/home/events'",
        )}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setQueueDir(e.target.value);
        }}
      />
      <InputBox
        id="queue-limit"
        name="queue_limit"
        label={t("Queue Limit")}
        placeholder={t("Enter Queue Limit")}
        type="number"
        value={queueLimit}
        tooltip={t(
          "Maximum limit for undelivered messages, defaults to '10000'",
        )}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setQueueLimit(e.target.value);
        }}
      />
      <CommentBox
        id="comment"
        name="comment"
        label={t("Comment")}
        placeholder={t("Enter custom notes if any")}
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
        }}
      />
    </FormLayout>
  );
};

export default ConfMySql;
