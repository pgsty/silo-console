// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

import { useT } from "i18n";
import React, { useLayoutEffect, useRef } from "react";
import { ModalBox } from "mds";
import { useMobile } from "common/ui/useMediaQuery";
import { useOverlayIntent } from "common/ui/overlayIntent";
import RouteBoundContent from "./RouteBoundContent";

interface IDetailsListPanel {
  open: boolean;
  /** The router has accepted a location the panel's route has not rendered. */
  routePending: boolean;
  closePanel: () => void;
  children: React.ReactNode;
}
const DetailsListPanel = ({
  open,
  routePending,
  closePanel,
  children,
}: IDetailsListPanel) => {
  const t = useT();
  const mobile = useMobile();
  useOverlayIntent(mobile && open);
  const opener = useRef<HTMLElement | null>(null);
  const previousOpen = useRef(false);
  const focusable = (element: HTMLElement | null): element is HTMLElement =>
    !!element &&
    element !== document.body &&
    element.isConnected &&
    element.getClientRects().length > 0 &&
    element.matches(
      "button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]",
    );
  useLayoutEffect(() => {
    if (open && !previousOpen.current)
      opener.current =
        document.activeElement instanceof HTMLElement &&
        focusable(document.activeElement)
          ? document.activeElement
          : null;
    previousOpen.current = open;
  }, [open]);
  const restoreFocus = () =>
    focusable(opener.current)
      ? opener.current
      : document.querySelector<HTMLElement>(
          '#version-object-details, [role="grid"] [role="row"][tabindex="0"], [role="group"][tabindex="0"]',
        );
  return (
    <div
      id="details-panel"
      style={{
        width: mobile || !open ? 0 : 300,
        minWidth: mobile || !open ? 0 : 300,
        borderInlineStart:
          open && !mobile ? "1px solid var(--border)" : undefined,
      }}
    >
      <ModalBox
        restoreFocusTo={restoreFocus}
        inline={!mobile}
        open={open}
        onClose={closePanel}
        title={t("Object details")}
        closeLabel={t("Close details")}
        sx={
          mobile
            ? {
                "& .modalContainer": {
                  width: "100%",
                  maxWidth: "100%",
                  height: "100dvh",
                  maxHeight: "100dvh",
                  padding: 16,
                  borderRadius: 0,
                  transform: "none",
                },
                "& .dialogContent": { flex: 1 },
              }
            : undefined
        }
      >
        <RouteBoundContent pending={routePending}>{children}</RouteBoundContent>
      </ModalBox>
    </div>
  );
};
export default DetailsListPanel;
