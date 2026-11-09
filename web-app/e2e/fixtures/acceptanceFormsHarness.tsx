// This file is part of MinIO Console Server
// Copyright (c) 2026 Pigsty
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

import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { DateTime } from "luxon";
import StyleHandler from "../../src/StyleHandler";
import {
  Autocomplete,
  Button,
  Checkbox,
  CommentBox,
  DateTimeInput,
  DensityProvider,
  Elevated,
  FileSelector,
  FormLayout,
  GlobalStyles,
  HelpIcon,
  InputBox,
  ModalBox,
  PageHeader,
  ReadBox,
  SectionTitle,
  ScreenTitle,
  Select,
  Switch,
  ValuePair,
} from "mds";
import { store } from "../../src/store";
import { setDarkMode, setLanguage } from "../../src/systemSlice";
import {
  darkTokens,
  lightTokens,
  tokenCssVariables,
} from "../../src/common/ui/tokens";
import { siloLightThemeOverrides } from "../../src/common/siloTheme";
import AddIDPConfiguration from "../../src/screens/Console/IDP/AddIDPConfiguration";
import IDPConfigurationDetails from "../../src/screens/Console/IDP/IDPConfigurationDetails";
import IDPLDAPConfigurationDetails from "../../src/screens/Console/IDP/LDAP/IDPLDAPConfigurationDetails";
import AddIDPConfigurationHelpBox from "../../src/screens/Console/IDP/AddIDPConfigurationHelpbox";
import {
  openIDFormFields,
  openIDHelpBoxContents,
} from "../../src/screens/Console/IDP/utils";
import AddTierConfiguration from "../../src/screens/Console/Configurations/TiersConfiguration/AddTierConfiguration";
import ConfigurationOptions from "../../src/screens/Console/Configurations/ConfigurationPanels/ConfigurationOptions";
import CSVMultiSelector from "../../src/screens/Console/Common/FormComponents/CSVMultiSelector/CSVMultiSelector";
import DateRangeSelector from "../../src/screens/Console/Common/FormComponents/DateRangeSelector/DateRangeSelector";
import PanelTitle from "../../src/screens/Console/Common/PanelTitle/PanelTitle";
import { EmptyState } from "../../src/common/ui/EmptyState";
import { FilteredEmptyState } from "../../src/common/ui/FilteredEmptyState";
import { FeatureUnavailable } from "../../src/common/ui/FeatureUnavailable";
import { NoPermission } from "../../src/common/ui/NoPermission";
import { ConsoleNotFound } from "../../src/common/ui/ConsoleNotFound";
import BrowserBreadcrumbs from "../../src/screens/Console/ObjectBrowser/BrowserBreadcrumbs";
import UploadFilesButton from "../../src/screens/Console/Buckets/ListBuckets/UploadFilesButton";
import Overview from "../../src/screens/Console/Overview/Overview";
import { saveSessionResponse } from "../../src/screens/Console/consoleSlice";
import { useT } from "../../src/i18n";

const query = new URLSearchParams(location.search);
store.dispatch(setLanguage(query.get("lang") === "zh" ? "zh" : "en"));
store.dispatch(setDarkMode(query.get("theme") === "dark"));
if (["overview", "browser-controls"].includes(query.get("case") || "")) {
  store.dispatch(
    saveSessionResponse({
      permissions: { "arn:aws:s3:::*": ["s3:*", "admin:*"] },
      features: ["local-identity"],
    }),
  );
}
for (const [name, value] of Object.entries(
  tokenCssVariables(query.get("theme") === "dark" ? darkTokens : lightTokens),
)) {
  document.documentElement.style.setProperty(name, value);
}

const help = (
  <AddIDPConfigurationHelpBox
    helpText="OpenID"
    docText="Documentation"
    docLink="https://silo.pgsty.com/docs/"
    contents={openIDHelpBoxContents}
  />
);

function Controls() {
  const [on, setOn] = useState(false);
  const [choice, setChoice] = useState("one");
  const [submits, setSubmits] = useState(0);
  const [origins, setOrigins] = useState("https://first.example.invalid");
  const choices = [
    { label: "First region", value: "one" },
    { label: "Second region", value: "two" },
  ];
  return (
    <main style={{ padding: 16, maxWidth: 960, margin: "auto" }}>
      <h1>Form controls</h1>
      <FormLayout
        title="Connection settings"
        helpBox={
          query.has("narrow") ? <div id="form-help">{help}</div> : undefined
        }
      >
        <SectionTitle>Credential details</SectionTitle>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSubmits(submits + 1);
          }}
        >
          <InputBox
            id="endpoint"
            label="Long identity provider endpoint"
            value="https://identity.example.invalid/very/long/path"
            onChange={() => {}}
            tooltip="Endpoint help"
          />
          <InputBox
            id="secret"
            label="Secret Key"
            type="password"
            value="fixture-secret"
            onChange={() => {}}
          />
          <InputBox
            id="invalid"
            label="Invalid endpoint"
            value="bad"
            onChange={() => {}}
            error={`https://invalid.example/${"long-error".repeat(20)}`}
          />
          <Select
            id="region"
            label="Storage region"
            value={choice}
            options={choices}
            onChange={setChoice}
          />
          <Autocomplete
            id="autocomplete"
            label="Search a region"
            value={choice}
            options={choices}
            onChange={setChoice}
          />
          <CommentBox
            id="description"
            label="Description"
            defaultValue="Long connection details"
          />
          <CSVMultiSelector
            name="origins"
            label="Allowed origins"
            tooltip="Origins help"
            commonPlaceholder="Enter allowed origin"
            elements={origins}
            onChange={setOrigins}
            withBorder
          />
          <output id="origins-value">{origins}</output>
          <ReadBox label="Read-only endpoint">
            <span id="readonly">
              https://identity.example.invalid/{"longpath".repeat(30)}
            </span>
          </ReadBox>
          <ValuePair
            label="Distinguished name"
            value={"cn=very-long-identity-name,".repeat(20)}
          />
          <FileSelector
            id="credentials"
            name="credentials"
            label="Credentials"
            onChange={() => {}}
            value={`${"long-credential-name-".repeat(20)}.json`}
          />
          <Switch
            id="enabled"
            label="Enable identity provider"
            tooltip="Switch help"
            description="Controls the identity provider"
            checked={on}
            onChange={(event) => setOn(event.target.checked)}
          />
          <Button id="submit" label="Submit form" type="submit" />
          <output id="submits">{submits}</output>
        </form>
      </FormLayout>
      <div id="help-panel">{help}</div>
    </main>
  );
}

function Headings() {
  const [entity, setEntity] = useState(false);
  const [filtered, setFiltered] = useState(true);
  const [open, setOpen] = useState(false);
  return (
    <main>
      {entity ? (
        <>
          <PageHeader label="Users" />
          <ScreenTitle title="Alice" />
        </>
      ) : (
        <PageHeader titleElement="h1" label="Permissions" />
      )}
      <FormLayout title="Policy">
        <PanelTitle>Current User Policy</PanelTitle>
        <EmptyState title="No rules" />
      </FormLayout>
      <div id="empty-section-toolbar">
        <SectionTitle
          actions={
            <Button
              id="open-heading-dialog"
              label="Edit permissions"
              onClick={() => setOpen(true)}
            />
          }
        >
          {[
            false,
            null,
            " ",
            <React.Fragment key="empty">{undefined}</React.Fragment>,
          ]}
        </SectionTitle>
      </div>
      <FilteredEmptyState
        headingLevel={2}
        filtered={filtered}
        onClear={() => setFiltered(false)}
        title="No groups"
      />
      <FeatureUnavailable
        headingLevel={2}
        title="Feature unavailable"
        description="Configure the feature first."
      />
      <NoPermission headingLevel={2} required={[]} />
      <ConsoleNotFound headingLevel={2} />
      <Button
        id="show-entity"
        label="Show Alice"
        onClick={() => setEntity(true)}
      />
      <ModalBox
        open={open}
        onClose={() => setOpen(false)}
        title="Edit permissions"
      >
        <Button
          id="finish-heading-dialog"
          label="Done"
          onClick={() => setOpen(false)}
        />
      </ModalBox>
    </main>
  );
}

function Dates() {
  const seconds = query.get("case") === "dates-seconds";
  const [expiry, setExpiry] = useState<DateTime | null>(
    DateTime.fromISO("2026-10-24T12:30:00"),
  );
  const [start, setStart] = useState(expiry);
  const [end, setEnd] = useState(expiry);
  const [disabled, setDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <main style={{ padding: 16, maxWidth: 960, margin: "auto" }}>
      <h1>Date fields</h1>
      <FormLayout>
        <InputBox id="date-before" label="Name" defaultValue="Key name" />
        <DateTimeInput
          id="expiry"
          label="Expiry"
          value={expiry}
          onChange={setExpiry}
          disabled={disabled}
          secondsSelector={false}
        />
        <InputBox
          id="date-after"
          label="Description"
          defaultValue="Key description"
        />
        <Button
          id="disable-date"
          label="Toggle read-only"
          onClick={() => setDisabled(!disabled)}
        />
        <output id="expiry-value">
          {expiry?.toFormat("yyyy-MM-dd HH:mm:ss")}
        </output>
      </FormLayout>
      <DateRangeSelector
        timeStart={start}
        setTimeStart={setStart}
        timeEnd={end}
        setTimeEnd={setEnd}
      />
      <Button
        id="open-date-dialog"
        label="Edit expiry"
        onClick={() => setOpen(true)}
      />
      <ModalBox open={open} onClose={() => setOpen(false)} title="Edit expiry">
        <FormLayout containerPadding={false} withBorders={false}>
          <DateTimeInput
            id="modal-expiry"
            label="Expiry"
            value={expiry}
            onChange={setExpiry}
            secondsSelector={seconds}
          />
          <Button
            id="save-expiry"
            label="Save selection"
            onClick={() => setOpen(false)}
          />
        </FormLayout>
      </ModalBox>
    </main>
  );
}

function Checkboxes() {
  const [checked, setChecked] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [changes, setChanges] = useState(0);
  const [rows, setRows] = useState(0);
  const [switched, setSwitched] = useState(false);
  return (
    <main style={{ padding: 16 }}>
      <h1>Checkbox associations</h1>
      <div onClick={() => setRows((count) => count + 1)}>
        <Checkbox
          id="labeled-checkbox"
          label="Enabled option"
          tooltip="Checkbox help"
          checked={checked}
          onChange={(event) => {
            setChecked(event.target.checked);
            setChanges((count) => count + 1);
          }}
        />
      </div>
      <div data-testid="generated-checkbox">
        <Checkbox
          label="Generated option"
          checked={generated}
          onChange={(event) => {
            setGenerated(event.target.checked);
            setChanges((count) => count + 1);
          }}
        />
      </div>
      <Checkbox id="disabled-checkbox" label="Disabled option" disabled />
      <Checkbox id="row-checkbox" aria-label="Row selection" />
      <Switch
        id="labeled-switch"
        label="Enabled switch"
        tooltip="Toggle help"
        checked={switched}
        onChange={(event) => {
          setSwitched(event.target.checked);
          setChanges((count) => count + 1);
        }}
      />
      <Switch id="only-switch" label="Status" switchOnly />
      <output id="checkbox-events">{JSON.stringify({ changes, rows })}</output>
    </main>
  );
}

function BrowserControls() {
  const t = useT();
  const [checked, setChecked] = useState(false);
  const [changes, setChanges] = useState(0);
  const [files, setFiles] = useState(0);
  const [folders, setFolders] = useState(0);
  const [disabled, setDisabled] = useState(false);
  return (
    <main style={{ padding: 16 }}>
      <h1>Browser controls</h1>
      <div id="browser-toolbar">
        <BrowserBreadcrumbs
          bucketName="example"
          internalPaths="docs/"
          additionalOptions={
            <Checkbox
              id="showDeletedObjects"
              name="deleted_objects"
              value="deleted_on"
              label={t("Show deleted objects")}
              checked={checked}
              onChange={(event) => {
                setChecked(event.target.checked);
                setChanges((count) => count + 1);
              }}
              sx={{
                marginLeft: 5,
                "@media (max-width: 600px)": { marginLeft: 0 },
              }}
            />
          }
        />
      </div>
      <div style={{ marginTop: 24 }}>
        <UploadFilesButton
          bucketName="example"
          uploadPath="example/docs/"
          forceDisable={disabled}
          uploadFileFunction={(close) => {
            setFiles((count) => count + 1);
            close();
          }}
          uploadFolderFunction={(close) => {
            setFolders((count) => count + 1);
            close();
          }}
        />
      </div>
      <button id="outside-upload" style={{ display: "block", marginTop: 120 }}>
        Outside popup
      </button>
      <button id="disable-upload" onClick={() => setDisabled(!disabled)}>
        Toggle disabled
      </button>
      <output id="browser-control-events">
        {JSON.stringify({ checked, changes, files, folders })}
      </output>
    </main>
  );
}

function Harness() {
  const scenario = query.get("case") || "controls";
  const initialRoute = scenario.startsWith("tier-")
    ? `/tier/${scenario.slice(5)}`
    : scenario === "openid-edit"
      ? "/openid/fixture"
      : scenario === "configuration"
        ? "/settings/api"
        : "/";
  return (
    <Provider store={store}>
      <ThemeProvider theme={siloLightThemeOverrides}>
        <GlobalStyles />
        <DensityProvider
          density={query.get("density") === "compact" ? "compact" : "default"}
        >
          <Elevated
            style={
              query.has("narrow")
                ? { width: "calc(100% - 240px)", marginLeft: 240 }
                : undefined
            }
          >
            <MemoryRouter initialEntries={[initialRoute]}>
              {scenario === "controls" ? (
                <Controls />
              ) : scenario === "headings" ? (
                <Headings />
              ) : scenario === "checkboxes" ? (
                <Checkboxes />
              ) : scenario === "browser-controls" ? (
                <StyleHandler>
                  <BrowserControls />
                </StyleHandler>
              ) : scenario === "overview" ? (
                <StyleHandler>
                  <main>
                    <Overview />
                  </main>
                </StyleHandler>
              ) : scenario.startsWith("dates") ? (
                <StyleHandler>
                  <Dates />
                </StyleHandler>
              ) : scenario === "openid-add" ? (
                <main>
                  <AddIDPConfiguration
                    icon={<HelpIcon />}
                    helpBox={help}
                    header="OpenID"
                    title="Add Configuration"
                    backLink="/"
                    formFields={openIDFormFields}
                  />
                </main>
              ) : scenario === "ldap" ? (
                <main>
                  <IDPLDAPConfigurationDetails />
                </main>
              ) : scenario === "configuration" ? (
                <main>
                  <Routes>
                    <Route
                      path="/settings/*"
                      element={<ConfigurationOptions />}
                    />
                  </Routes>
                </main>
              ) : (
                <main>
                  <Routes>
                    <Route
                      path="/openid/:idpName"
                      element={
                        <IDPConfigurationDetails
                          formFields={openIDFormFields}
                          endpoint="openid"
                          backLink="/"
                          header="OpenID"
                          idpType="openid"
                          icon={<HelpIcon />}
                          helpBox={help}
                        />
                      }
                    />
                    <Route
                      path="/tier/:service"
                      element={<AddTierConfiguration />}
                    />
                  </Routes>
                </main>
              )}
            </MemoryRouter>
          </Elevated>
        </DensityProvider>
      </ThemeProvider>
    </Provider>
  );
}

createRoot(document.getElementById("root")!).render(<Harness />);
