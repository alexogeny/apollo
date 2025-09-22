import { useMemo, useState } from "react";

import {
  Dashboard,
  Stack,
  Text,
  type DashboardActivity,
  type DashboardMetric,
  type DataTableColumn,
  type SidebarSection,
} from "@apollo/ui";

interface WorkstreamRow {
  readonly id: number;
  readonly name: string;
  readonly status: "Ready" | "In review" | "Draft";
  readonly owner: string;
  readonly updated: string;
}

const WORKSTREAM_ROWS: ReadonlyArray<WorkstreamRow> = [
  { id: 1, name: "Navigation shell", status: "Ready", owner: "Alex Morgan", updated: "2 days ago" },
  { id: 2, name: "Command palette", status: "In review", owner: "Priya Das", updated: "5 days ago" },
  { id: 3, name: "Context menu", status: "Draft", owner: "Liam Patel", updated: "1 day ago" },
];

const ACTIVITIES: ReadonlyArray<DashboardActivity> = [
  {
    id: "activity-1",
    title: "Modal refresh shipped",
    description: "Updated focus traps and density tokens",
    timestamp: "Today • 14:05",
  },
  {
    id: "activity-2",
    title: "Accessibility audit",
    description: "Resolved contrast issues for overlays",
    timestamp: "Yesterday • 09:12",
  },
  {
    id: "activity-3",
    title: "Command palette launched",
    description: "Released to product teams for beta feedback",
    timestamp: "2 days ago",
  },
];

const METRICS: ReadonlyArray<DashboardMetric> = [
  {
    id: "ready",
    label: "Components ready",
    value: "18 / 24",
    helper: "Ready to publish",
    progress: { value: 75, label: "Components ready" },
  },
  {
    id: "accessibility",
    label: "Accessibility issues",
    value: "3",
    trend: { label: "5 resolved this week", tone: "positive" },
    helper: "Focus on overlays",
  },
  {
    id: "contributors",
    label: "Contributors",
    value: "42",
    trend: { label: "+6 vs last month", tone: "positive" },
    helper: "Across product teams",
  },
];

export function DashboardDemo(): JSX.Element {
  const [filter, setFilter] = useState<"review" | "all">("review");

  const columns = useMemo<ReadonlyArray<DataTableColumn<WorkstreamRow>>>(
    () => [
      { id: "component", header: "Component", accessor: (row) => row.name, sortable: true },
      { id: "status", header: "Status", accessor: (row) => row.status },
      { id: "owner", header: "Owner", accessor: (row) => row.owner },
      { id: "updated", header: "Updated", accessor: (row) => row.updated, sortable: true, align: "right" },
    ],
    [],
  );

  const sidebarSections = useMemo<ReadonlyArray<SidebarSection>>(
    () => [
      {
        id: "primary-nav",
        title: "Navigation",
        items: [
          { id: "overview", label: "Overview", description: "Health & adoption", href: "#" },
          { id: "workstreams", label: "Workstreams", description: "24 tracked", href: "#" },
          { id: "reports", label: "Reports", description: "Stakeholder updates", href: "#" },
        ],
      },
      {
        id: "support-nav",
        title: "Resources",
        items: [
          { id: "accessibility", label: "Accessibility", description: "Audit log", href: "#" },
          { id: "changelog", label: "Changelog", description: "Release history", href: "#" },
        ],
      },
    ],
    [],
  );

  const filteredRows = useMemo(
    () =>
      filter === "review"
        ? WORKSTREAM_ROWS.filter((row) => row.status !== "Ready")
        : WORKSTREAM_ROWS,
    [filter],
  );

  return (
    <Dashboard<WorkstreamRow>
      title="Release readiness overview"
      description="Monitor component progress, accessibility quality, and recent activity from a single workspace."
      sidebar={{
        sections: sidebarSections,
        activeItemId: "overview",
        ariaLabel: "Design operations navigation",
        header: (
          <Stack gap="2">
            <Text as="span" variant="bodySm" weight="semibold">
              Design ops
            </Text>
            <Text as="span" variant="detail" color="secondary">
              Release readiness
            </Text>
          </Stack>
        ),
        footer: (
          <Text as="span" variant="detail" color="secondary">
            Snapshot updated 5 minutes ago.
          </Text>
        ),
      }}
      metrics={METRICS}
      activities={ACTIVITIES}
      filters={[
        { id: "review", label: "In review", active: filter === "review", onSelect: () => setFilter("review") },
        { id: "all", label: "All workstreams", active: filter === "all", onSelect: () => setFilter("all") },
      ]}
      table={{
        title: "Workstream queue",
        description: "Track design and accessibility readiness across teams.",
        data: filteredRows,
        columns,
      }}
      primaryAction={{ id: "new", label: "New workstream" }}
      secondaryAction={{ id: "share", label: "Share report", variant: "outline", tone: "neutral" }}
    />
  );
}
