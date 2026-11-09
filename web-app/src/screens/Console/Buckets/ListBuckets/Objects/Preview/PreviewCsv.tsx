// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React, { useMemo } from "react";
import { useT } from "i18n";
import { parseDelimitedPreview } from "./csvPreview";
import { PreviewNotice, PreviewSurface } from "./previewStyles";

const PreviewCsv = ({
  content,
  delimiter,
  isFullscreen,
}: {
  content: string;
  delimiter: "," | "\t";
  isFullscreen: boolean;
}) => {
  const t = useT();
  const { rows, truncated, columnsTruncated } = useMemo(
    () => parseDelimitedPreview(content, delimiter),
    [content, delimiter],
  );
  const columns = rows.reduce(
    (maximum, row) => Math.max(maximum, row.length),
    0,
  );
  return (
    <>
      {truncated && (
        <PreviewNotice role="status">
          {t("Showing first 500 rows")}
        </PreviewNotice>
      )}
      {columnsTruncated && (
        <PreviewNotice role="status">
          {t(
            "Showing the first 100 columns. View Source or download the object to see all columns.",
          )}
        </PreviewNotice>
      )}
      <PreviewSurface
        $fullscreen={isFullscreen}
        tabIndex={0}
        role="region"
        aria-label={t("CSV preview content")}
      >
        <table>
          <thead>
            <tr>
              <th
                scope="col"
                style={{
                  width: "1%",
                  textAlign: "end",
                  whiteSpace: "nowrap",
                }}
              >
                {t("Row")}
              </th>
              {Array.from({ length: columns }, (_, index) => (
                <th scope="col" key={index}>
                  {rows[0]?.[index] || "—"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(1).map((row, index) => (
              <tr key={index}>
                <th scope="row" style={{ textAlign: "end" }}>
                  {index + 2}
                </th>
                {Array.from({ length: columns }, (_, column) => (
                  <td key={column}>{row[column] ?? ""}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </PreviewSurface>
    </>
  );
};
export default PreviewCsv;
