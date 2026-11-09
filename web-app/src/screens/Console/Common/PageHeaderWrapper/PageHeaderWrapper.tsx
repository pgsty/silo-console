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

import React, { Fragment } from "react";
import { Button, MenuToggleIcon, HelpIcon, PageHeader } from "mds";
import styled, { CSSObject } from "styled-components";
import { useT } from "i18n";
import { OverflowMenu, OverflowItem } from "common/ui/OverflowMenu";
import { useMobile } from "common/ui/useMediaQuery";
import ObjectManagerButton from "../ObjectManager/ObjectManagerButton";
import DarkModeActivator, {
  useThemeAction,
} from "../DarkModeActivator/DarkModeActivator";
import LanguageActivator from "../LanguageActivator/LanguageActivator";
import HeaderIconButton from "./HeaderIconButton";
import { useResponsiveMenu } from "../../Menu/ResponsiveMenu";
import HelpMenu from "../../HelpMenu";
import { openShortcutHelp } from "common/ui/ShortcutHelp";

const HeaderOwner = styled.div`
  position: relative;
  min-width: 0;
`;
const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;
const GlobalTools = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
interface HeaderAction extends OverflowItem {
  id: string;
  loading?: boolean;
  iconOnly?: boolean;
}
interface IPageHeaderWrapper {
  label: React.ReactNode;
  titleElement?: "div" | "h1";
  sx?: CSSObject;
  middleComponent?: React.ReactNode;
  actions?: React.ReactNode;
  primaryAction?: HeaderAction;
  secondaryActions?: HeaderAction[];
  help?: boolean;
}
const PageHeaderWrapper = ({
  label,
  titleElement,
  actions,
  primaryAction,
  secondaryActions = [],
  middleComponent,
  sx,
  help = true,
}: IPageHeaderWrapper) => {
  const t = useT();
  const mobile = useMobile();
  const menu = useResponsiveMenu();
  const theme = useThemeAction();
  const actionButton = (action: HeaderAction, primary = false) =>
    action.iconOnly ? (
      <HeaderIconButton
        key={action.id}
        id={action.id}
        aria-label={action.label}
        onClick={action.onClick}
        disabled={action.disabled || action.loading}
        disabledReason={action.disabledReason}
        aria-busy={action.loading}
      >
        {action.icon}
      </HeaderIconButton>
    ) : (
      <Button
        collapseOnSmall={false}
        key={action.id}
        id={action.id}
        label={action.label}
        icon={action.icon}
        onClick={action.onClick}
        disabled={action.disabled}
        disabledReason={action.disabledReason}
        loading={action.loading}
        variant={action.danger ? "danger" : primary ? "primary" : "regular"}
      />
    );
  const render = (
    toggleHelp?: () => void,
    helpOpen = false,
    helpRef?: React.RefObject<HTMLButtonElement>,
    hover?: Pick<
      React.HTMLAttributes<HTMLButtonElement>,
      "onPointerEnter" | "onPointerLeave"
    >,
  ) => (
    <PageHeader
      sx={sx}
      titleElement={titleElement}
      label={typeof label === "string" ? t(label) : label}
      menuToggle={
        menu.available && mobile ? (
          <HeaderIconButton
            aria-label={t("Open menu")}
            aria-expanded={menu.open}
            aria-controls="console-mobile-menu"
            onClick={() => menu.setOpen(true)}
          >
            <MenuToggleIcon className="mobile-menu-icon" />
          </HeaderIconButton>
        ) : undefined
      }
      actions={
        <Fragment>
          {actions && <ActionGroup>{actions}</ActionGroup>}
          {!mobile && secondaryActions.map((action) => actionButton(action))}
          {primaryAction && actionButton(primaryAction, true)}
          <GlobalTools>
            <LanguageActivator />
            {toggleHelp && (
              <HeaderIconButton
                ref={helpRef}
                {...hover}
                aria-label={t("Open help")}
                aria-expanded={helpOpen}
                onClick={toggleHelp}
              >
                <HelpIcon />
              </HeaderIconButton>
            )}
            {!mobile && (
              <>
                <DarkModeActivator />
              </>
            )}
            <ObjectManagerButton />
            {mobile && (
              <OverflowMenu
                label={t("Page actions")}
                items={[
                  ...secondaryActions,
                  { label: t("Keyboard shortcuts"), onClick: openShortcutHelp },
                  theme,
                ]}
              />
            )}
          </GlobalTools>
        </Fragment>
      }
      middleComponent={middleComponent}
    />
  );
  return (
    <HeaderOwner>
      {help ? <HelpMenu renderTrigger={render} /> : render()}
    </HeaderOwner>
  );
};
export default PageHeaderWrapper;
