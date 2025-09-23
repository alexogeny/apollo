import {
  ActivityTimeline,
  AnalyticsOverview,
  Badge,
  DashboardHeader,
  FilterToolbar,
  InsightList,
  MetricCard,
  type TimelineEvent,
} from "@apollo/ui";
import { useMemo, useState, type ComponentProps } from "react";

const METRIC_DATA = [
  {
    title: "Revenue",
    value: "$482K",
    subtitle: "Monthly recurring revenue",
    trend: {
      label: "vs last month",
      direction: "increase" as const,
      delta: 6.4,
      tone: "success" as const,
    },
    sparkline: {
      points: [320, 355, 370, 410, 420, 440, 482],
      label: "Revenue over the last 7 months",
      tone: "primary" as const,
    },
    progress: {
      value: 82,
      label: "Q2 goal",
      tone: "success" as const,
    },
  },
  {
    title: "Active customers",
    value: "1,284",
    subtitle: "Across all workspaces",
    trend: {
      label: "New upgrades",
      direction: "increase" as const,
      delta: 3.2,
      tone: "success" as const,
    },
    sparkline: {
      points: [950, 984, 1012, 1064, 1110, 1180, 1284],
      label: "Active customers trend",
      tone: "secondary" as const,
    },
    progress: {
      value: 58,
      label: "Licenses adopted",
      tone: "accent" as const,
    },
  },
  {
    title: "Support response",
    value: "1.8 hrs",
    subtitle: "Median first reply",
    trend: {
      label: "SLA compliance",
      direction: "decrease" as const,
      delta: -14.2,
      tone: "success" as const,
    },
    sparkline: {
      points: [4.2, 3.6, 3.1, 2.9, 2.5, 2.2, 1.8],
      label: "Response time trend",
      tone: "neutral" as const,
    },
    progress: {
      value: 92,
      label: "Tickets resolved on time",
      tone: "success" as const,
    },
    unit: "avg",
  },
  {
    title: "Pipeline health",
    value: "$3.1M",
    subtitle: "Qualified opportunities",
    trend: {
      label: "Conversion rate",
      direction: "steady" as const,
      delta: 0,
      tone: "warning" as const,
    },
    sparkline: {
      points: [2.6, 2.8, 3.0, 2.9, 3.0, 3.2, 3.1],
      label: "Pipeline coverage trend",
      tone: "accent" as const,
    },
    progress: {
      value: 64,
      label: "Quarter to goal",
      tone: "accent" as const,
    },
  },
] satisfies Array<ComponentProps<typeof MetricCard>>;

const INSIGHT_ITEMS = {
  title: "Highlights",
  description: "Signals worth reviewing with your go-to-market leads.",
  items: [
    {
      id: "design",
      title: "Design reviews are trending up",
      description: "Teams running design reviews every sprint have 18% higher feature adoption.",
      status: "positive" as const,
      metric: "+18% adoption",
      actionLabel: "Create ritual",
    },
    {
      id: "handoff",
      title: "Handoff delays",
      description: "Engineering handoff waits more than three days for 26% of initiatives.",
      status: "warning" as const,
      metric: "26% blocked",
      actionLabel: "Assign owner",
    },
    {
      id: "retention",
      title: "Retention cohorts steady",
      description: "Net retention is flat across high-touch segments but trending down in PLG.",
      status: "neutral" as const,
      metric: "102%",
    },
  ],
} satisfies React.ComponentProps<typeof InsightList>;

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "board",
    title: "Executive review",
    description: "Board-ready deck shared for approval.",
    timestamp: "Today, 09:30",
    tone: "accent",
  },
  {
    id: "launch",
    title: "Lifecycle automation launched",
    description: "10 new nurture paths deployed for high-value accounts.",
    timestamp: "Yesterday, 18:10",
    tone: "success",
  },
  {
    id: "incident",
    title: "Incident postmortem",
    description: "Root cause documented and mitigations approved by SRE.",
    timestamp: "May 4, 14:22",
    tone: "warning",
  },
];

const TABLE_ROWS = [
  { id: "rev-ops", label: "Revenue intelligence rollout", owner: "Priya Gupta", progress: "78%", status: "On track" },
  { id: "mobile", label: "Mobile dashboard 2.0", owner: "Damian Flores", progress: "62%", status: "In design" },
  { id: "adoption", label: "Enablement playbooks", owner: "Jo Lin", progress: "44%", status: "Needs support" },
];

const SEGMENTS = [
  { value: "quarter", label: "Quarter", count: 12 },
  { value: "month", label: "Month", count: 6 },
  { value: "week", label: "Week", count: 3 },
];

const FILTERS = [
  { label: "Enterprise", value: "enterprise", active: true, shortcut: "⌘1" },
  { label: "Self-serve", value: "self-serve", active: false, shortcut: "⌘2" },
  { label: "Churn risk", value: "churn", active: true, shortcut: "⌘3" },
  { label: "Expansion", value: "expansion", active: false, shortcut: "⌘4" },
];

export function App(): JSX.Element {
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState("quarter");
  const [filters, setFilters] = useState(FILTERS);

  const filteredMetrics = useMemo(() => {
    if (!query) {
      return METRIC_DATA;
    }
    const normalized = query.toLowerCase();
    return METRIC_DATA.filter((metric) => metric.title.toLowerCase().includes(normalized));
  }, [query]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 lg:px-10">
        <DashboardHeader
          title="Revenue performance hub"
          description="A single workspace to understand momentum, unblock teams, and share progress with stakeholders."
          breadcrumbs={[
            { id: "home", label: "Home", href: "#" },
            { id: "dashboards", label: "Dashboards", href: "#" },
            { id: "current", label: "Revenue performance" },
          ]}
          lastUpdated="3 hours ago"
          onCreateReport={() => window.alert("Create report")}
          overflowActions={[
            { id: "share", label: "Share with team", onSelect: () => window.alert("Share") },
            { id: "duplicate", label: "Duplicate dashboard", onSelect: () => window.alert("Duplicate") },
          ]}
          notificationsCount={3}
          team={{
            name: "Growth leadership",
            members: [
              { name: "Jo Lin" },
              { name: "Damian Flores" },
              { name: "Priya Gupta" },
              { name: "Owen Chen" },
              { name: "Amina Idris" },
            ],
          }}
        />

        <FilterToolbar
          query={query}
          onQueryChange={setQuery}
          segments={SEGMENTS}
          activeSegment={segment}
          onSegmentChange={setSegment}
          filters={filters}
          onFilterToggle={(value) =>
            setFilters((prev) =>
              prev.map((filter) =>
                filter.value === value ? { ...filter, active: !filter.active } : filter,
              ),
            )
          }
        />

        <AnalyticsOverview
          metrics={filteredMetrics}
          highlights={INSIGHT_ITEMS}
          timeline={{
            title: "Recent activity",
            description: "Changes shared with stakeholders across the last 48 hours.",
            events: TIMELINE_EVENTS,
          }}
          table={{
            title: "Strategic initiatives",
            description: "Aligned across product, marketing, and success.",
            rows: TABLE_ROWS,
          }}
        />

        <section className="grid gap-4 rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm lg:grid-cols-3">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Molecules in focus</h2>
            <p className="text-sm text-muted-foreground">
              Composable patterns combine to build cohesive, high-performing dashboards without sacrificing accessibility.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="neutral">Accessible</Badge>
              <Badge variant="neutral">Color-safe</Badge>
              <Badge variant="neutral">Reduced-motion aware</Badge>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <MetricCard
              title="Net revenue retention"
              value="109%"
              subtitle="Enterprise segment"
              trend={{ label: "vs goal", direction: "increase", delta: 4.2, tone: "success" }}
              progress={{ value: 54, label: "Expansion potential", tone: "accent" }}
              sparkline={{ points: [95, 98, 101, 104, 107, 109], label: "Retention trend", tone: "primary" }}
              footnote="Retention monitored weekly and normalized against last quarter."
            />
            <InsightList
              title="Adoption insights"
              description="Surface risk and opportunity across the funnel."
              items={INSIGHT_ITEMS.items}
            />
            <ActivityTimeline
              title="Workflow events"
              description="Key handoffs captured automatically."
              events={TIMELINE_EVENTS}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
