// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React, { useState } from "react";
import styled from "styled-components";
import {
  Autocomplete,
  Banner,
  Button,
  Checkbox,
  CommentBox,
  DensityProvider,
  IconButton,
  HelpBox,
  InfoIcon,
  InputBox,
  ModalBox,
  ProgressBar,
  RadioGroup,
  RefreshIcon,
  Select,
  Snackbar,
  Switch,
  SurfaceLevelProvider,
  Tag,
  Tooltip,
  type,
} from "mds";
import { useT } from "i18n";
import { StatusBadge } from "../../../common/ui/StatusBadge";
const Panel = styled.section`
  display: grid;
  gap: 16px;
  padding: 24px;
  border-radius: 12px;
  background: var(--surface-3);
  box-shadow: var(--shadow-2);
  h2 {
    ${type("title")} margin: 0;
  }
  h3 {
    ${type("subtitle")} margin: 0;
  }
  .control-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }
  .control-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
  }
  .inputItem {
    min-width: 0;
  }
  .inputLabel {
    margin-inline-end: 8px;
  }
  .inputLabel > span {
    min-width: 0;
  }
`;
const ControlShowcase = () => {
  const t = useT();
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState("one");
  const [value, setValue] = useState("one");
  const [dialog, setDialog] = useState<"sm" | "lg" | "xl" | null>(null);
  const [nested, setNested] = useState(false);
  const [notice, setNotice] = useState(false);
  const [loading, setLoading] = useState(false);
  const options = [
    { label: t("Default"), value: "one" },
    { label: t("Compact"), value: "two" },
  ];
  return (
    <SurfaceLevelProvider level={3}>
      <Panel id="control-craft">
        <h2>{t("Control craft")}</h2>
        <p>
          {t(
            "Hover, press or use Tab to inspect each control. All changes here are local demos.",
          )}
        </p>
        <h3>{t("Buttons and loading")}</h3>
        <div className="control-row">
          <Button
            id="press-80"
            variant="primary"
            sx={{ width: 80 }}
            label={t("Save")}
          />
          <Button
            id="press-400"
            variant="primary"
            sx={{ width: 400, maxWidth: "100%" }}
            label={t("Create bucket")}
          />
          <Button
            id="control-secondary"
            variant="secondary"
            label={t("Secondary")}
          />
          <Button id="control-outline" variant="outline" label={t("Outline")} />
          <Button id="control-ghost" variant="ghost" label={t("Ghost")} />
          <Button id="control-danger" variant="danger" label={t("Delete")} />
          <Button
            id="control-disabled"
            disabled
            disabledReason={t("Select an object to download.")}
            label={t("Disabled")}
          />
          <Button id="control-loading" loading label={t("Loading")} />
          <Button
            id="control-toggle-loading"
            loading={loading}
            label={t("Save changes")}
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 1500);
            }}
          />
          <IconButton aria-label={t("Refresh")}>
            <RefreshIcon />
          </IconButton>
        </div>
        <DensityProvider density="compact">
          <div className="control-row">
            <Button
              id="control-compact"
              variant="primary"
              label={t("Compact")}
            />
            <InputBox
              id="control-compact-input"
              label={t("Compact")}
              placeholder={t("Name")}
            />
          </div>
          <div id="control-compact-help">
            <HelpBox
              iconComponent={<InfoIcon />}
              title={t("Compact")}
              help={t("Usage is calculated by the server.")}
            />
          </div>
        </DensityProvider>
        <h3>{t("Fields and validation")}</h3>
        <div className="control-grid">
          <InputBox
            id="control-input"
            label={t("Name")}
            placeholder={t("Name")}
          />
          <InputBox
            id="control-password"
            type="password"
            label={t("Password")}
            defaultValue="example"
          />
          <InputBox
            id="control-error"
            label={t("Name")}
            error={t("A name is required.")}
          />
          <InputBox
            id="control-disabled-input"
            label={t("Disabled")}
            disabled
            value={t("Unavailable")}
          />
          <InputBox
            id="control-disabled-empty"
            label={t("Disabled")}
            disabled
            placeholder={t("Name")}
          />
          <InputBox
            id="control-number"
            type="number"
            label={t("Capacity")}
            defaultValue={20}
          />
          <Select
            id="control-select"
            label={t("Density")}
            value={value}
            options={options}
            onChange={setValue}
          />
          <Select
            id="control-disabled-select"
            label={t("Disabled")}
            value="one"
            options={options}
            onChange={() => {}}
            disabled
          />
          <Select
            id="control-error-select"
            label={t("Density")}
            options={options}
            onChange={() => {}}
            error={t("A name is required.")}
            placeholder={t("Select")}
          />
          <Select
            id="control-disabled-placeholder"
            label={t("Disabled")}
            options={options}
            onChange={() => {}}
            disabled
            placeholder={t("Select")}
          />
          <Autocomplete
            id="control-autocomplete"
            label={t("Search")}
            placeholder={t("Select")}
            value={value}
            options={options}
            onChange={setValue}
          />
          <Autocomplete
            id="control-error-autocomplete"
            label={t("Search")}
            placeholder={t("Select")}
            options={options}
            onChange={() => {}}
            error={t("A name is required.")}
          />
          <Autocomplete
            id="control-disabled-autocomplete"
            label={t("Disabled")}
            placeholder={t("Select")}
            options={options}
            onChange={() => {}}
            disabled
          />
          <CommentBox
            id="control-disabled-textarea"
            label={t("Disabled")}
            disabled
            placeholder={t("Description")}
          />
          <CommentBox
            id="control-textarea"
            label={t("Description")}
            placeholder={t("Description")}
          />
        </div>
        <h3>{t("Selection controls")}</h3>
        <div className="control-row">
          <Checkbox
            id="control-checkbox"
            label={t("Enabled")}
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
          />
          <Checkbox
            id="control-disabled-checkbox"
            label={t("Disabled")}
            disabled
            checked
            readOnly
          />
          <Switch
            id="control-switch"
            label={t("Enabled")}
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
          />
          <Switch
            id="control-disabled-switch"
            label={t("Disabled")}
            checked
            disabled
          />
          <RadioGroup
            id="control-radio"
            name="control-radio"
            label={t("Density")}
            currentValue={radio}
            selectorOptions={options}
            onChange={(event) => setRadio(event.target.value)}
          />
        </div>
        <h3>{t("Status and feedback")}</h3>
        <div className="control-row">
          <Tag id="control-tag" label={t("Enabled")} color="ok" />
          <Tag
            id="control-tag-dot"
            label={t("Warning")}
            color="warn"
            variant="dot"
          />
          <StatusBadge tone="danger" label={t("Offline")} />
          <StatusBadge tone="info" label={t("Built-in")} dot={false} />
          <Tooltip tooltip={t("First tooltip")}>
            <Button id="control-tip-one" label={t("First tooltip")} />
          </Tooltip>
          <Tooltip tooltip={t("Second tooltip")}>
            <Button id="control-tip-two" label={t("Second tooltip")} />
          </Tooltip>
        </div>
        <Banner title={t("Information")} tone="info">
          {t("Usage is calculated by the server.")}
        </Banner>
        <Banner title={t("Warning")} tone="warning" contrast="high">
          {t("Above the 85% warning threshold")}
        </Banner>
        <ProgressBar
          value={65}
          variant="determinate"
          progressLabel
          notificationLabel={t("Progress")}
        />
        <ProgressBar notificationLabel={t("Loading")} />
        <h3>{t("Dialogs")}</h3>
        <div className="control-row">
          {(["sm", "lg", "xl"] as const).map((size) => (
            <Button
              key={size}
              id={`control-dialog-${size}`}
              label={`${t("Open Dialog")} · ${size === "sm" ? "400" : size === "lg" ? "540" : "880"}`}
              onClick={() => setDialog(size)}
            />
          ))}
          <Button
            id="control-snackbar"
            label={t("Show notification")}
            onClick={() => setNotice(true)}
          />
        </div>
        <ModalBox
          open={dialog !== null}
          size={dialog || "lg"}
          title={t("Dialog controls")}
          onClose={() => setDialog(null)}
        >
          <div className="control-grid" style={{ display: "grid", gap: 16 }}>
            <InputBox id="dialog-name" label={t("Name")} />
            <Select
              id="dialog-select"
              label={t("Density")}
              value={value}
              options={options}
              onChange={setValue}
            />
          </div>
          <div
            className="control-row"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "flex-end",
              marginTop: 24,
            }}
          >
            <Button
              id="control-nested-open"
              label={t("Nested dialog")}
              onClick={() => setNested(true)}
            />
            <Button
              id="control-dialog-cancel"
              label={t("Cancel")}
              onClick={() => setDialog(null)}
            />
            <Button
              id="control-dialog-save"
              variant="primary"
              label={t("Save")}
              onClick={() => setDialog(null)}
            />
          </div>
          <ModalBox
            open={nested}
            size="sm"
            title={t("Nested dialog")}
            onClose={() => setNested(false)}
          >
            <Button
              id="control-nested-close"
              variant="primary"
              label={t("Close")}
              onClick={() => setNested(false)}
            />
          </ModalBox>
        </ModalBox>
        <Snackbar
          open={notice}
          onClose={() => setNotice(false)}
          message={t("Demo action completed.")}
          closeButton
        />
      </Panel>
    </SurfaceLevelProvider>
  );
};
export default ControlShowcase;
