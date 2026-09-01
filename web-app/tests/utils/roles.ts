import { readFileSync } from "fs";
import { ClientFunction, Role, Selector } from "testcafe";

const data = readFileSync(__dirname + "/../constants/timestamp.txt", "utf-8");
const unixTimestamp = data.trim();

const loginUrl = "http://localhost:9090/login";
// diagnostics/watch/trace need to run in port 9090 (through the server) to work
const loginUrlServer = "http://localhost:9090/login";
const submitButton = Selector("button").withAttribute("id", "do-login");
const currentPath = ClientFunction(() => window.location.pathname);
const LOGIN_TIMEOUT = 30000;

const loginAs = async (
  t: TestController,
  accessKey: string,
  secretKey: string,
) => {
  await t
    .typeText("#accessKey", accessKey)
    .typeText("#secretKey", secretKey)
    .click(submitButton)
    .expect(submitButton.exists)
    .notOk(`login for ${accessKey} did not complete`, {
      timeout: LOGIN_TIMEOUT,
    })
    .expect(currentPath())
    .notContains(
      "/login",
      `login for ${accessKey} did not leave the login page`,
      {
        timeout: LOGIN_TIMEOUT,
      },
    );
};

export const admin = Role(
  loginUrl,
  async (t) => {
    await loginAs(t, "minioadmin", "minioadmin");
  },
  { preserveUrl: true },
);

export const bucketAssignPolicy = Role(
  loginUrl,
  async (t) => {
    await loginAs(
      t,
      "bucketassignpolicy-" + unixTimestamp,
      "bucketassignpolicy",
    );
  },
  { preserveUrl: true },
);

export const bucketRead = Role(
  loginUrl,
  async (t) => {
    await loginAs(t, "bucketread-" + unixTimestamp, "bucketread");
  },
  { preserveUrl: true },
);

export const bucketWrite = Role(
  loginUrl,
  async (t) => {
    await loginAs(t, "bucketwrite-" + unixTimestamp, "bucketwrite");
  },
  { preserveUrl: true },
);

export const bucketReadWrite = Role(
  loginUrl,
  async (t) => {
    await loginAs(t, "bucketreadwrite-" + unixTimestamp, "bucketreadwrite");
  },
  { preserveUrl: true },
);

export const bucketObjectTags = Role(
  loginUrl,
  async (t) => {
    await loginAs(t, "bucketobjecttags-" + unixTimestamp, "bucketobjecttags");
  },
  { preserveUrl: true },
);

export const bucketCannotTag = Role(
  loginUrl,
  async (t) => {
    await loginAs(t, "bucketcannottag-" + unixTimestamp, "bucketcannottag");
  },
  { preserveUrl: true },
);

export const bucketSpecific = Role(
  loginUrl,
  async (t) => {
    await loginAs(t, "bucketspecific-" + unixTimestamp, "bucketspecific");
  },
  { preserveUrl: true },
);

export const bucketWritePrefixOnly = Role(
  loginUrl,
  async (t) => {
    await loginAs(
      t,
      "bucketwriteprefixonlypolicy-" + unixTimestamp,
      "bucketwriteprefixonlypolicy",
    );
  },
  { preserveUrl: true },
);

export const dashboard = Role(
  loginUrl,
  async (t) => {
    await loginAs(t, "dashboard-" + unixTimestamp, "dashboard");
  },
  { preserveUrl: true },
);

export const diagnostics = Role(
  loginUrlServer,
  async (t) => {
    await loginAs(t, "diagnostics-" + unixTimestamp, "diagnostics");
  },
  { preserveUrl: true },
);

export const groups = Role(
  loginUrl,
  async (t) => {
    await loginAs(t, "groups-" + unixTimestamp, "groups1234");
  },
  { preserveUrl: true },
);

export const heal = Role(
  loginUrlServer,
  async (t) => {
    await loginAs(t, "heal-" + unixTimestamp, "heal1234");
  },
  { preserveUrl: true },
);

export const iamPolicies = Role(
  loginUrl,
  async (t) => {
    await loginAs(t, "iampolicies-" + unixTimestamp, "iampolicies");
  },
  { preserveUrl: true },
);

export const logs = Role(
  loginUrl,
  async (t) => {
    await loginAs(t, "logs-" + unixTimestamp, "logs1234");
  },
  { preserveUrl: true },
);

export const notificationEndpoints = Role(
  loginUrl,
  async (t) => {
    await loginAs(
      t,
      "notificationendpoints-" + unixTimestamp,
      "notificationendpoints",
    );
  },
  { preserveUrl: true },
);

export const settings = Role(
  loginUrl,
  async (t) => {
    await loginAs(t, "settings-" + unixTimestamp, "settings");
  },
  { preserveUrl: true },
);

export const tiers = Role(
  loginUrl,
  async (t) => {
    await loginAs(t, "tiers-" + unixTimestamp, "tiers1234");
  },
  { preserveUrl: true },
);

export const trace = Role(
  loginUrlServer,
  async (t) => {
    await loginAs(t, "trace-" + unixTimestamp, "trace1234");
  },
  { preserveUrl: true },
);

export const users = Role(
  loginUrl,
  async (t) => {
    await loginAs(t, "users-" + unixTimestamp, "users1234");
  },
  { preserveUrl: true },
);

export const watch = Role(
  loginUrlServer,
  async (t) => {
    await loginAs(t, "watch-" + unixTimestamp, "watch1234");
  },
  { preserveUrl: true },
);

export const deleteObjectWithPrefixOnly = Role(
  loginUrl,
  async (t) => {
    await loginAs(
      t,
      "delete-object-with-prefix-" + unixTimestamp,
      "deleteobjectwithprefix1234",
    );
  },
  { preserveUrl: true },
);

export const conditions1 = Role(
  loginUrl,
  async (t) => {
    await loginAs(t, "conditions-" + unixTimestamp, "conditions1234");
  },
  { preserveUrl: true },
);

export const conditions2 = Role(
  loginUrl,
  async (t) => {
    await loginAs(t, "conditions-2-" + unixTimestamp, "conditions1234");
  },
  { preserveUrl: true },
);

export const conditions3 = Role(
  loginUrl,
  async (t) => {
    await loginAs(t, "conditions-3-" + unixTimestamp, "conditions1234");
  },
  { preserveUrl: true },
);

export const conditions4 = Role(
  loginUrl,
  async (t) => {
    await loginAs(t, "conditions-4-" + unixTimestamp, "conditions1234");
  },
  { preserveUrl: true },
);

export const rewindEnabled = Role(
  loginUrl,
  async (t) => {
    await loginAs(t, "rewind-allowed-" + unixTimestamp, "rewindallowed1234");
  },
  { preserveUrl: true },
);

export const rewindNotEnabled = Role(
  loginUrl,
  async (t) => {
    await loginAs(
      t,
      "rewind-not-allowed-" + unixTimestamp,
      "rewindnotallowed1234",
    );
  },
  { preserveUrl: true },
);
