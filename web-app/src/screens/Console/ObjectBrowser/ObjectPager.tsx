// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React from "react";
import { useSelector } from "react-redux";
import { Box, Button } from "mds";
import { AppState, useAppDispatch } from "../../../store";
import { useT } from "i18n";
import { formatText } from "i18n/lang";
import { requestObjectPage } from "./objectBrowserThunks";
import {
  firstPageRequest,
  nextPageRequest,
  OBJECT_PAGE_SIZES,
  pageScope,
  pageSizeRequest,
  previousPageRequest,
} from "./objectPaging";

// The bar under the object list: what the rows on screen represent, the page
// size, and first/previous/next. There is no total and no arbitrary jump,
// because either would require scanning the directory. The page number and
// the rows change only once the requested page has arrived in full.
const ObjectPager = () => {
  const dispatch = useAppDispatch();
  const t = useT();

  const objectPage = useSelector(
    (state: AppState) => state.objectBrowser.objectPage,
  );
  const recordCount = useSelector(
    (state: AppState) => state.objectBrowser.records.length,
  );
  const requestInProgress = useSelector(
    (state: AppState) => state.objectBrowser.requestInProgress,
  );
  const rewindEnabled = useSelector(
    (state: AppState) => state.objectBrowser.rewind.rewindEnabled,
  );
  const showDeleted = useSelector(
    (state: AppState) => state.objectBrowser.showDeleted,
  );

  // Nothing has been committed for this listing yet.
  if (objectPage.tokens.length === 0) {
    return null;
  }

  // History listings have no cursor: they are one capped, time-limited set.
  const historyMode = rewindEnabled || showDeleted;
  const scope = pageScope(objectPage, recordCount);
  const previous = previousPageRequest(objectPage);
  const next = nextPageRequest(objectPage);

  let scopeText: string;
  let scopeNote = "";
  switch (scope.kind) {
    case "complete":
      scopeText = formatText(t("{count} items in total"), {
        count: scope.count,
      });
      break;
    case "truncated":
      scopeText = formatText(
        t(
          "Showing the first {count} entries; the listing stopped at the row or time limit.",
        ),
        { count: scope.count },
      );
      break;
    default:
      scopeText = formatText(t("Page {page} · {count} on this page"), {
        page: scope.page,
        count: scope.count,
      });
      scopeNote = t(
        "Sorting, filtering and select all apply to this page only.",
      );
  }

  return (
    <Box
      id="object-pager"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        // The scope text and controls form two groups. Controls also wrap
        // within narrow viewports so every page action stays reachable.
        flexWrap: "wrap",
        gap: "6px 16px",
        padding: "6px 14px",
        fontSize: 13,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flex: "1 1 260px",
          minWidth: 0,
        }}
      >
        <span id="object-page-scope">{scopeText}</span>
        {scopeNote !== "" && (
          <span
            id="object-page-scope-note"
            style={{ fontSize: 12, opacity: 0.75 }}
          >
            {scopeNote}
          </span>
        )}
      </Box>
      {!historyMode && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            maxWidth: "100%",
            gap: 8,
          }}
        >
          <label htmlFor="object-page-size" style={{ whiteSpace: "nowrap" }}>
            {t("Items per page")}
          </label>
          {/* A native select: the browser places its option list where it
              stays reachable, also at the bottom of the viewport. */}
          <select
            id="object-page-size"
            name="object-page-size"
            value={String(objectPage.pageSize)}
            disabled={requestInProgress}
            onChange={(event) => {
              dispatch(
                requestObjectPage(
                  pageSizeRequest(objectPage, Number(event.target.value)),
                ),
              );
            }}
            style={{
              height: 30,
              minWidth: 72,
              padding: "0 6px",
              fontSize: 13,
              fontFamily: "inherit",
              color: "inherit",
              background: "transparent",
              border: "1px solid rgba(128, 128, 128, 0.45)",
              borderRadius: 3,
              cursor: requestInProgress ? "default" : "pointer",
            }}
          >
            {OBJECT_PAGE_SIZES.map((size) => (
              <option key={size} value={String(size)}>
                {size}
              </option>
            ))}
          </select>
          <Button
            id="object-page-first"
            label={t("First page")}
            variant="regular"
            disabled={requestInProgress || objectPage.pageIndex === 0}
            onClick={() => {
              dispatch(requestObjectPage(firstPageRequest(objectPage)));
            }}
          />
          <Button
            id="object-page-previous"
            label={t("Previous page")}
            variant="regular"
            disabled={requestInProgress || previous === null}
            onClick={() => {
              if (previous !== null) {
                dispatch(requestObjectPage(previous));
              }
            }}
          />
          <Button
            id="object-page-next"
            label={t("Next page")}
            variant="regular"
            disabled={requestInProgress || next === null}
            onClick={() => {
              if (next !== null) {
                dispatch(requestObjectPage(next));
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ObjectPager;
