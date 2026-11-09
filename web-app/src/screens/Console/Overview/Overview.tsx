// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AllBucketsIcon,
  Button,
  CheckCircleIcon,
  DrivesIcon,
  InfoIcon,
  PageLayout,
  RefreshIcon,
  ServersIcon,
  TotalObjectsIcon,
} from "mds";
import {
  EmptyState,
  Freshness,
  SkeletonRows,
  StatCard,
} from "../../../common/ui";
import { hasPermission } from "../../../common/SecureComponent";
import { niceBytes } from "../../../common/utils";
import { formatText, localeTag, useLanguage, useT } from "i18n";
import { useAppDispatch, useAppSelector } from "../../../store";
import { setHelpName } from "../../../systemSlice";
import { selSession } from "../consoleSlice";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import { alerts, capacity, health, usage } from "./overviewModel";
import { quickActions } from "./quickActions";
import { useAdminInfo } from "./useAdminInfo";
import OverviewServers from "./OverviewServers";
import { menuPages } from "../../../navigation/menu";
import { menuSections } from "../../../navigation/registry";
import { useRouteContext } from "../../../navigation/useRouteContext";
import {
  Actions,
  AlertIcon,
  AlertList,
  Caption,
  Cards,
  Grid,
  Header,
  Notice,
  PageTitle,
  Panel,
  SkeletonBlock,
  Stack,
  Title,
  Navigation,
  NavigationCard,
  NavigationLink,
} from "./overviewStyles";

export default function Overview() {
  const t = useT();
  const language = useLanguage();
  const navigate = useNavigate();
  const session = useAppSelector(selSession);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHelpName("overview"));
  }, [dispatch]);
  const context = useRouteContext();
  const pages = menuPages(context);
  const needsRestart = useAppSelector(
    (state) => state.system.serverNeedsRestart,
  );
  const { data, refreshing, error, refresh } = useAdminInfo({
    refreshMs: 60000,
  });
  const number = (value: number | undefined) =>
    value === undefined
      ? "—"
      : new Intl.NumberFormat(localeTag(language)).format(value);
  const bytes = (value: number | undefined) =>
    value === undefined ? "—" : niceBytes(`${value}`);
  const byteValue = (value: number | undefined) => {
    if (value === undefined) return "—";
    const [amount, unit] = niceBytes(`${value}`).split(" ");
    return (
      <>
        {amount} <Caption>{unit}</Caption>
      </>
    );
  };
  const state = health(data?.servers);
  const amount = capacity(data?.servers);
  const stats = data ? usage(data) : undefined;
  const warnings = data ? alerts(data, needsRestart) : [];
  const actions = quickActions(
    session.permissions,
    session.features ?? [],
    hasPermission,
  );
  const value = (content: React.ReactNode) =>
    !data && refreshing ? <SkeletonBlock aria-hidden="true" /> : content;
  const ratio = (online: number | undefined, total: number | undefined) =>
    online === undefined || total === undefined
      ? "—"
      : `${number(online)}/${number(total)}`;

  return (
    <>
      <Header>
        <PageHeaderWrapper
          label={<PageTitle>{t("Overview")}</PageTitle>}
          primaryAction={{
            id: "refresh-overview",
            label: t("Refresh"),
            icon: <RefreshIcon />,
            iconOnly: true,
            loading: refreshing,
            onClick: () => void refresh(),
          }}
        />
      </Header>
      <PageLayout>
        <Grid>
          {error && (
            <Notice role="alert">
              <InfoIcon aria-hidden="true" />
              {data
                ? t("Refresh failed. The last received data is still shown.")
                : t("Could not load deployment information. Try refreshing.")}
            </Notice>
          )}
          <Cards
            role="group"
            aria-busy={refreshing}
            aria-label={t("Deployment statistics")}
          >
            <StatCard
              label={t("Cluster health")}
              icon={<ServersIcon />}
              value={value(ratio(state.serversOnline, state.serversTotal))}
              unit={<Caption>{t("servers online")}</Caption>}
              subline={
                data && (
                  <Stack>
                    <span>
                      {formatText(t("{count} drives online"), {
                        count: ratio(state.drivesOnline, state.drivesTotal),
                      })}
                    </span>
                    {state.healing > 0 && (
                      <span>
                        {formatText(t("{count} drive(s) healing"), {
                          count: number(state.healing),
                        })}
                      </span>
                    )}
                  </Stack>
                )
              }
            />
            <StatCard
              label={t("Capacity")}
              icon={<DrivesIcon />}
              value={value(
                <span data-testid="overview-used" data-bytes={amount.rawUsed}>
                  {byteValue(amount.rawUsed)}
                </span>,
              )}
              subline={
                data && (
                  <Stack>
                    <span
                      data-testid="overview-total"
                      data-bytes={amount.rawTotal}
                    >
                      {formatText(t("of {total} raw capacity"), {
                        total: bytes(amount.rawTotal),
                      })}
                    </span>
                    <Caption
                      data-testid="overview-available"
                      data-bytes={amount.rawAvailable}
                    >
                      {formatText(t("{available} available"), {
                        available: bytes(amount.rawAvailable),
                      })}
                    </Caption>
                  </Stack>
                )
              }
              progress={
                data && amount.usedRatio !== undefined
                  ? { value: amount.usedRatio }
                  : undefined
              }
            />
            <StatCard
              label={t("Data")}
              icon={<TotalObjectsIcon />}
              value={value(number(stats?.objects))}
              unit={<Caption>{t("objects")}</Caption>}
              subline={
                data && (
                  <Stack>
                    <span>{bytes(stats?.bytes)}</span>
                    <Freshness at={data.usageUpdatedAt} prefix="Calculated" />
                  </Stack>
                )
              }
            />
            <StatCard
              label={t("Buckets")}
              icon={<AllBucketsIcon />}
              value={value(number(stats?.buckets))}
              footer={<Link to="/buckets">{t("View buckets")} →</Link>}
            />
          </Cards>
          <Panel
            shadowLevel={2}
            id="overview-servers"
            tabIndex={-1}
            role="group"
            aria-labelledby="overview-servers-title"
          >
            <Title id="overview-servers-title">{t("Servers")}</Title>
            {!data && refreshing ? (
              <SkeletonRows rows={3} columns={4} />
            ) : (
              <OverviewServers servers={data?.servers} />
            )}
          </Panel>
          <Panel
            $columns={data && !warnings.length ? 4 : 8}
            shadowLevel={2}
            role="group"
            aria-labelledby="overview-alerts-title"
          >
            <Title id="overview-alerts-title">{t("Alerts")}</Title>
            {!data ? (
              refreshing ? (
                <SkeletonRows rows={3} columns={1} />
              ) : (
                <EmptyState
                  compact
                  title={t("Health information unavailable")}
                />
              )
            ) : warnings.length ? (
              <AlertList>
                {warnings.map((alert) => {
                  const label = formatText(
                    t(alert.message),
                    alert.values ?? {},
                  );
                  return (
                    <li key={alert.id}>
                      <AlertIcon
                        role="img"
                        $severity={alert.severity}
                        aria-label={
                          alert.severity === "danger"
                            ? t("Error")
                            : alert.severity === "warning"
                              ? t("Warning")
                              : t("Information")
                        }
                      >
                        <InfoIcon />
                      </AlertIcon>
                      {alert.href ? (
                        <a
                          href={alert.href}
                          onClick={(event) => {
                            const target = document.getElementById(
                              alert.href!.slice(1),
                            );
                            if (target) {
                              event.preventDefault();
                              target.scrollIntoView({ block: "nearest" });
                              target.focus();
                            }
                          }}
                        >
                          {label}
                        </a>
                      ) : (
                        <span>{label}</span>
                      )}
                    </li>
                  );
                })}
              </AlertList>
            ) : (
              <Stack
                as="p"
                style={{
                  margin: 0,
                  flexDirection: "row",
                  alignItems: "center",
                  color: "var(--muted-foreground)",
                }}
              >
                <CheckCircleIcon
                  aria-hidden="true"
                  style={{
                    width: 20,
                    height: 20,
                    color: "var(--success)",
                    flexShrink: 0,
                  }}
                />
                {t("All systems normal")}
              </Stack>
            )}
          </Panel>
          <Panel
            $columns={data && !warnings.length ? 8 : 4}
            shadowLevel={2}
            role="group"
            aria-labelledby="overview-actions-title"
          >
            <Title id="overview-actions-title">{t("Quick actions")}</Title>
            <Actions>
              {actions.map((action) => (
                <Button
                  key={action.id}
                  id={`overview-${action.id}`}
                  variant="secondary"
                  label={t(action.label)}
                  onClick={() => navigate(action.path)}
                />
              ))}
            </Actions>
            {!actions.length && (
              <Caption>
                {t("No quick actions available for your permissions.")}
              </Caption>
            )}
          </Panel>
          <Navigation>
            {menuSections.map((section) => {
              const links = pages.filter((page) => page.section === section.id);
              if (!links.length) return null;
              return (
                <NavigationCard
                  key={section.id}
                  shadowLevel={2}
                  role="group"
                  aria-labelledby={`overview-nav-${section.id}`}
                >
                  <Title id={`overview-nav-${section.id}`}>
                    {t(section.title)}
                  </Title>
                  <nav aria-labelledby={`overview-nav-${section.id}`}>
                    {links.map((page) => (
                      <NavigationLink key={page.id} to={page.path}>
                        <span aria-hidden="true">{page.menu!.icon}</span>
                        {t(page.title)}
                      </NavigationLink>
                    ))}
                  </nav>
                </NavigationCard>
              );
            })}
          </Navigation>
        </Grid>
      </PageLayout>
    </>
  );
}
