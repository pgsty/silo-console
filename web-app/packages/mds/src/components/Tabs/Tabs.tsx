// This file is part of MinIO Design System
// Copyright (c) 2023 MinIO, Inc.
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

import React, { FC, useEffect, useId, useRef, useState } from "react";
import styled, { CSSObject } from "styled-components";
import { revealListItem } from "../../global/listPopup";
import { TabsProps } from "./Tabs.types";
import TabButton from "./TabButton";
import { useDensity } from "../../global/Density";
import { useFluidHover } from "../../global/useFluidHover";
import { FluidHoverHighlight } from "../../global/FluidHoverHighlight";

const TabsContainer = styled.div<{ $horizontal: boolean; $sx?: CSSObject }>`
  display: flex;
  flex-direction: ${({ $horizontal }) => ($horizontal ? "column" : "row")};
  height: 100%;
  min-width: 0;
  .optionsContainer {
    display: flex;
    align-items: ${({ $horizontal }) =>
      $horizontal ? "center" : "flex-start"};
    max-height: 100%;
    gap: var(--gap, 8px);
    min-width: 0;
    overflow: auto;
  }
  .optionsList {
    position: relative;
    isolation: isolate;
    display: flex;
    flex-direction: ${({ $horizontal }) => ($horizontal ? "row" : "column")};
    width: ${({ $horizontal }) => ($horizontal ? "max-content" : "220px")};
    max-width: 100%;
    max-height: 100%;
    overflow: auto;
    flex-shrink: 0;
    padding: var(--segment-pad, 4px);
    border-radius: var(--radius-control, 8px);
    background: var(--muted, #f4f4f5);
  }
  .optionsList:not(.subtle) [role="tab"] {
    color: var(--foreground, #171717);
  }
  [aria-orientation="vertical"] [role="tab"] {
    justify-content: flex-start;
    text-align: start;
    min-height: var(--control-height, 36px);
  }
  [aria-orientation="vertical"] [role="tab"] > svg {
    flex-shrink: 0;
  }
  [data-fluid-highlight] {
    z-index: -1;
  }
  [data-selected="true"] {
    background: var(--surface-3, white);
    box-shadow: var(--shadow-2);
  }
  .subtle {
    background: transparent;
    box-shadow: none;
    padding: 4px;
  }
  .subtle [data-selected="true"] {
    background: transparent;
    border-radius: 0;
    box-shadow: inset 0 -2px 0 var(--foreground);
  }
  .tabsPanels {
    min-width: 0;
    flex: 1;
    width: 100%;
    padding: 16px;
  }
  ${({ $sx }) => $sx}
`;

const Tabs: FC<TabsProps> = ({
  horizontal,
  options,
  currentTabOrPath,
  useRouteTabs = false,
  routes,
  onTabClick,
  optionsInitialComponent,
  optionsEndComponent,
  sx,
  variant = "segmented",
}) => {
  const scope = useId();
  const list = useRef<HTMLDivElement>(null);
  const { compact } = useDensity();
  const hover = useFluidHover(list, {
    axis: horizontal ? "x" : "y",
    gapClick: { maxDistance: 16 },
  });
  const isSelected = (index: number) =>
    (useRouteTabs
      ? options[index].tabConfig.to
      : options[index].tabConfig.id) === currentTabOrPath;
  const selected = options.findIndex((_, index) => isSelected(index));
  const first = options.findIndex((item) => !item.tabConfig.disabled);
  const entry =
    selected >= 0 && !options[selected].tabConfig.disabled ? selected : first;
  const [focused, setFocused] = useState<string | undefined>(
    options[entry]?.tabConfig.id,
  );
  useEffect(() => {
    const selectedOption = options.find(
      (item) =>
        (useRouteTabs ? item.tabConfig.to : item.tabConfig.id) ===
        currentTabOrPath,
    );
    if (selectedOption) setFocused(selectedOption.tabConfig.id);
  }, [currentTabOrPath, useRouteTabs]);
  const focusIndex = options.findIndex(
    (item) => item.tabConfig.id === focused && !item.tabConfig.disabled,
  );
  const roving = focusIndex >= 0 ? focusIndex : entry;
  useEffect(() => {
    const container = list.current;
    if (!container) return;
    const revealSelected = () => {
      const item =
        container.querySelector<HTMLElement>(
          '[role="tab"]:focus:not(:disabled)',
        ) ?? container.querySelector<HTMLElement>('[aria-selected="true"]');
      if (item) revealListItem(item);
    };
    const observer = new ResizeObserver(revealSelected);
    observer.observe(container);
    revealSelected();
    return () => observer.disconnect();
  }, [selected, horizontal]);
  return (
    <TabsContainer
      $horizontal={!!horizontal}
      className="tabs-container"
      $sx={sx}
      style={
        { "--segment-pad": compact ? "2px" : "4px" } as React.CSSProperties
      }
    >
      <div className="optionsContainer">
        {optionsInitialComponent}
        <div
          ref={list}
          role="tablist"
          aria-orientation={horizontal ? "horizontal" : "vertical"}
          className={`optionsList ${variant === "subtle" ? "subtle" : ""}`}
          onKeyDown={(event) => {
            const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
            const forward = horizontal ? (rtl ? "ArrowLeft" : "ArrowRight") : "ArrowDown";
            const backward = horizontal ? (rtl ? "ArrowRight" : "ArrowLeft") : "ArrowUp";
            if (![forward, backward, "Home", "End"].includes(event.key)) return;
            const items = Array.from(
              list.current?.querySelectorAll<HTMLButtonElement>(
                '[role="tab"]:not(:disabled)',
              ) || [],
            );
            const index = items.indexOf(
              document.activeElement as HTMLButtonElement,
            );
            if (index < 0) return;
            event.preventDefault();
            event.stopPropagation();
            const next =
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? items.length - 1
                  : (index + (event.key === forward ? 1 : -1) + items.length) %
                    items.length;
            items[next]?.focus({ preventScroll: true });
            const item = items[next];
            if (item) {
              setFocused(
                options.find(
                  (option) => `${scope}-${option.tabConfig.id}` === item.id,
                )?.tabConfig.id,
              );
              revealListItem(item);
            }
          }}
        >
          <FluidHoverHighlight hover={hover} selected />
          <FluidHoverHighlight hover={hover} />
          {options.map((item, index) => (
            <TabButton
              key={item.tabConfig.id}
              id={`${scope}-${item.tabConfig.id}`}
              panelId={
                useRouteTabs
                  ? `${scope}-route-panel`
                  : `${scope}-${item.tabConfig.id}-panel`
              }
              index={index}
              tabIndex={index === roving ? 0 : -1}
              onClick={() => {
                setFocused(item.tabConfig.id);
                onTabClick(
                  useRouteTabs ? item.tabConfig.to || "" : item.tabConfig.id,
                );
              }}
              horizontal={!!horizontal}
              label={item.tabConfig.label}
              disabled={!!item.tabConfig.disabled}
              icon={item.tabConfig.icon}
              selected={isSelected(index)}
            />
          ))}
        </div>
        {optionsEndComponent}
      </div>
      <div className="tabsPanels">
        {useRouteTabs ? (
          <div
            role="tabpanel"
            id={`${scope}-route-panel`}
            aria-labelledby={
              selected >= 0
                ? `${scope}-${options[selected].tabConfig.id}`
                : undefined
            }
          >
            {routes}
          </div>
        ) : (
          options.map((item, index) => (
            <div
              key={item.tabConfig.id}
              role="tabpanel"
              id={`${scope}-${item.tabConfig.id}-panel`}
              aria-labelledby={`${scope}-${item.tabConfig.id}`}
              hidden={!isSelected(index)}
              tabIndex={0}
            >
              {isSelected(index) ? item.content : null}
            </div>
          ))
        )}
      </div>
    </TabsContainer>
  );
};
export default Tabs;
