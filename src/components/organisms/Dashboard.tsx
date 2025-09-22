import { type HTMLAttributes, type ReactNode, useId } from "react";
import styled from "styled-components";

import type { ActionTone, TextColorToken } from "../../theme/tokens";
import { Card } from "../primitives/Card";
import { Button, type ButtonVariant } from "../primitives/Button";
import { Progress, type ProgressVariant } from "../primitives/Progress";
import { Stack } from "../layout/Stack";
import { Text } from "../primitives/Text";
import { DataTable, type DataTableProps } from "../data/DataTable";
import { Sidebar, type SidebarProps } from "../navigation/Sidebar";

const DashboardShell = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  width: 100%;
  min-height: 100%;
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface.surface};

  @media (max-width: 960px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space["8"]};
  padding: ${({ theme }) => `${theme.space["8"]} ${theme.space["8"]}`};
  background: ${({ theme }) => theme.colors.surface.background};
  min-width: 0;

  @media (max-width: 960px) {
    padding: ${({ theme }) => `${theme.space["6"]} ${theme.space["5"]}`};
  }
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space["4"]};
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space["4"]};
  flex-wrap: wrap;
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space["2"]};
  min-width: 0;
`;

const HeaderActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space["3"]};
  flex-wrap: wrap;
`;

const FiltersRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space["2"]};
  flex-wrap: wrap;
`;

const MetricsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space["4"]};
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`;

const MetricCard = styled(Card)`
  height: 100%;
`;

const MetricIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.surfaceSunken};
  color: ${({ theme }) => theme.colors.action.accent.solid};
`;

const ContentGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space["6"]};
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  align-items: start;

  @media (min-width: 1120px) {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  }
`;

const TableCard = styled(Card)`
  height: 100%;
  overflow: hidden;
`;

const ActivityCard = styled(Card)`
  height: 100%;
`;

const ActivityList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space["4"]};
`;

const ActivityItem = styled.li`
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${({ theme }) => theme.space["3"]};
  padding-bottom: ${({ theme }) => theme.space["2"]};

  &::after {
    content: "";
    position: absolute;
    left: 1rem;
    top: calc(2rem + ${({ theme }) => theme.space["1"]});
    bottom: 0;
    width: 2px;
    background: ${({ theme }) => theme.colors.border.subtle};
    opacity: 0.4;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:last-child::after {
    display: none;
  }
`;

const ActivityMarker = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surface.surfaceSunken};
  color: ${({ theme }) => theme.colors.action.accent.solid};
  box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.border.subtle};
`;

const DefaultMarkerDot = styled.span`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.action.accent.solid};
  display: inline-block;
`;

const ActionIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.space["2"]};
`;

export type DashboardTrendTone = "positive" | "neutral" | "negative";

export interface DashboardMetricTrend {
  readonly label: string;
  readonly tone?: DashboardTrendTone;
}

export interface DashboardMetricProgress {
  readonly value: number;
  readonly tone?: ActionTone;
  readonly label?: string;
  readonly variant?: ProgressVariant;
}

export interface DashboardMetric {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly helper?: string;
  readonly trend?: DashboardMetricTrend;
  readonly progress?: DashboardMetricProgress;
  readonly icon?: ReactNode;
}

export interface DashboardActivity {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly timestamp: string;
  readonly icon?: ReactNode;
}

export interface DashboardAction {
  readonly id: string;
  readonly label: string;
  readonly onClick?: () => void;
  readonly tone?: ActionTone;
  readonly variant?: ButtonVariant;
  readonly icon?: ReactNode;
}

export interface DashboardFilter {
  readonly id: string;
  readonly label: string;
  readonly active?: boolean;
  readonly disabled?: boolean;
  readonly onSelect?: (filterId: string) => void;
}

export interface DashboardTableSection<T> extends DataTableProps<T> {
  readonly title: string;
  readonly description?: string;
}

export interface DashboardProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  readonly title: string;
  readonly description?: string;
  readonly sidebar: SidebarProps;
  readonly metrics: ReadonlyArray<DashboardMetric>;
  readonly activities: ReadonlyArray<DashboardActivity>;
  readonly table: DashboardTableSection<T>;
  readonly primaryAction?: DashboardAction;
  readonly secondaryAction?: DashboardAction;
  readonly filters?: ReadonlyArray<DashboardFilter>;
}

const trendColor = (tone?: DashboardTrendTone): TextColorToken => {
  switch (tone) {
    case "positive":
      return "success";
    case "negative":
      return "danger";
    default:
      return "secondary";
  }
};

const renderAction = (action: DashboardAction, fallbackVariant: ButtonVariant, fallbackTone: ActionTone) => (
  <Button
    key={action.id}
    type="button"
    size="sm"
    variant={action.variant ?? fallbackVariant}
    tone={action.tone ?? fallbackTone}
    onClick={action.onClick}
  >
    {action.icon ? <ActionIcon aria-hidden="true">{action.icon}</ActionIcon> : null}
    {action.label}
  </Button>
);

export function Dashboard<T>({
  title,
  description,
  sidebar,
  metrics,
  activities,
  table,
  primaryAction,
  secondaryAction,
  filters,
  className,
  ...rest
}: DashboardProps<T>): JSX.Element {
  const titleId = useId();
  const descriptionId = description ? `${titleId}-description` : undefined;
  const { title: tableTitle, description: tableDescription, ...tableProps } = table;
  const tableCaption = tableProps.caption ?? tableTitle;

  return (
    <DashboardShell className={className} {...rest}>
      <Sidebar {...sidebar} />
      <MainContent aria-labelledby={titleId} aria-describedby={descriptionId}>
        <Header>
          <HeaderRow>
            <HeaderText>
              <Text as="h1" id={titleId} variant="title" weight="semibold">
                {title}
              </Text>
              {description ? (
                <Text as="p" id={descriptionId} variant="body" color="secondary">
                  {description}
                </Text>
              ) : null}
            </HeaderText>
            {primaryAction || secondaryAction ? (
              <HeaderActions>
                {secondaryAction ? renderAction(secondaryAction, "outline", "neutral") : null}
                {primaryAction ? renderAction(primaryAction, "solid", "accent") : null}
              </HeaderActions>
            ) : null}
          </HeaderRow>
          {filters && filters.length > 0 ? (
            <FiltersRow>
              {filters.map((filter) => {
                const isActive = filter.active ?? false;
                return (
                  <Button
                    key={filter.id}
                    size="sm"
                    variant={isActive ? "solid" : "subtle"}
                    tone={isActive ? "accent" : "neutral"}
                    aria-pressed={isActive}
                    disabled={filter.disabled}
                    onClick={() => filter.onSelect?.(filter.id)}
                  >
                    {filter.label}
                  </Button>
                );
              })}
            </FiltersRow>
          ) : null}
        </Header>
        {metrics.length > 0 ? (
          <MetricsGrid>
            {metrics.map((metric) => (
              <MetricCard
                key={metric.id}
                padding="5"
                radius="lg"
                shadow="xs"
                background="surfaceRaised"
              >
                <Stack gap="3">
                  <Stack direction="horizontal" gap="3" align="center" justify="space-between">
                    <Stack gap="1">
                      <Text as="span" variant="detail" color="secondary">
                        {metric.label}
                      </Text>
                      <Text as="span" variant="headline" weight="semibold">
                        {metric.value}
                      </Text>
                    </Stack>
                    {metric.icon ? <MetricIcon aria-hidden="true">{metric.icon}</MetricIcon> : null}
                  </Stack>
                  {metric.trend ? (
                    <Text as="span" variant="detail" color={trendColor(metric.trend.tone)}>
                      {metric.trend.label}
                    </Text>
                  ) : null}
                  {metric.helper ? (
                    <Text as="span" variant="detail" color="muted">
                      {metric.helper}
                    </Text>
                  ) : null}
                  {metric.progress ? (
                    <Progress
                      value={metric.progress.value}
                      tone={metric.progress.tone ?? "accent"}
                      variant={metric.progress.variant ?? "linear"}
                      label={metric.progress.label ?? metric.label}
                    />
                  ) : null}
                </Stack>
              </MetricCard>
            ))}
          </MetricsGrid>
        ) : null}
        <ContentGrid>
          <TableCard padding="5" radius="lg" shadow="xs" background="surfaceRaised">
            <Stack gap="3">
              <Stack gap="1">
                <Text as="h2" variant="subtitle" weight="semibold">
                  {tableTitle}
                </Text>
                {tableDescription ? (
                  <Text as="p" variant="detail" color="secondary">
                    {tableDescription}
                  </Text>
                ) : null}
              </Stack>
              <DataTable {...tableProps} caption={tableCaption} />
            </Stack>
          </TableCard>
          <ActivityCard padding="5" radius="lg" shadow="xs" background="surfaceRaised">
            <Stack gap="3">
              <Text as="h2" variant="subtitle" weight="semibold">
                Recent activity
              </Text>
              <ActivityList>
                {activities.map((activity) => (
                  <ActivityItem key={activity.id}>
                    <ActivityMarker aria-hidden={activity.icon ? "true" : undefined}>
                      {activity.icon ?? <DefaultMarkerDot />}
                    </ActivityMarker>
                    <Stack gap="1">
                      <Text as="span" variant="bodySm" weight="semibold">
                        {activity.title}
                      </Text>
                      <Text as="span" variant="detail" color="secondary">
                        {activity.description}
                      </Text>
                      <Text as="span" variant="detail" color="muted">
                        {activity.timestamp}
                      </Text>
                    </Stack>
                  </ActivityItem>
                ))}
              </ActivityList>
            </Stack>
          </ActivityCard>
        </ContentGrid>
      </MainContent>
    </DashboardShell>
  );
}
