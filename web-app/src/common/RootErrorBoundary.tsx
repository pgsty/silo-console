// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from "react";
import { getStoredLanguage, translate } from "../i18n/lang";

// Keep recovery independent of Redux, routing and the component library: any
// of them may be the source of the failed render. Never clear user storage.
export default class RootErrorBoundary extends React.Component<
  React.PropsWithChildren,
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    const t = (text: string) => translate(getStoredLanguage(), text);
    return (
      <main className="recovery-page" role="alert">
        <h1>{t("Unable to display this page.")}</h1>
        <p>
          {t("Reload the page or return home. Your preferences will be kept.")}
        </p>
        <button type="button" onClick={() => window.location.reload()}>
          {t("Reload page")}
        </button>{" "}
        <a href={document.baseURI}>{t("Return home")}</a>
      </main>
    );
  }
}
