import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../src/store";
import { setLanguage } from "../../src/systemSlice";
import { translate } from "../../src/i18n/lang";
import NotFound from "../../src/screens/NotFoundPage";
import CommonCard from "../../src/screens/Console/Dashboard/CommonCard";
import { messageForError } from "../../src/screens/Console/Logs/ErrorLogs/LogLine";
import HealthInfoResults from "../../src/screens/Console/HealthInfo/HealthInfoResults";
const language =
  new URLSearchParams(location.search).get("lang") === "zh" ? "zh" : "en";
store.dispatch(setLanguage(language));
const log = {
  time: "12:00:00 UTC 01/01/2026",
  api: { name: "GetObject" },
  deploymentid: "deployment-test",
  requestID: "request-test",
  remotehost: "127.0.0.1",
  userAgent: "test-agent",
  error: { message: "raw error payload", source: ["raw stack payload"] },
} as any;
const info = {
  sys: {
    cpus: [],
    partitions: [],
    osinfo: [],
    meminfo: [],
    procinfo: [],
    netinfo: [],
    errors: [],
    services: [],
    config: {},
  },
  minio: {
    config: { config: {} },
    info: {
      mode: "distributed",
      deploymentID: "deployment-test",
      buckets: { count: 1 },
      objects: { count: 2 },
      usage: { size: 3 },
      backend: {},
      servers: [],
      metrics: {},
    },
  },
} as any;
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <MemoryRouter>
      <section data-testid="not-found">
        <NotFound />
      </section>
      <section data-testid="card">
        <CommonCard title="Test" metricValue="42" moreLink="/browser" />
      </section>
      <section data-testid="log">
        {messageForError(log, (text) => translate(language, text))}
      </section>
      <section data-testid="health">
        <HealthInfoResults serverHealthInfo={info} />
      </section>
    </MemoryRouter>
  </Provider>,
);
