import { type ComponentProps } from "react";

import { MetricCard } from "../molecules/metric-card";
import { InsightList } from "../molecules/insight-list";
import { ActivityTimeline } from "../molecules/activity-timeline";
import { Card } from "../ui/card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

import { cn } from "../../lib/utils";

export interface OverviewTableRow {
  readonly id: string;
  readonly label: string;
  readonly owner: string;
  readonly progress: string;
  readonly status: string;
}

export interface AnalyticsOverviewProps {
  readonly metrics: ReadonlyArray<ComponentProps<typeof MetricCard>>;
  readonly highlights?: ComponentProps<typeof InsightList>;
  readonly timeline?: ComponentProps<typeof ActivityTimeline>;
  readonly table?: {
    readonly title: string;
    readonly description?: string;
    readonly rows: ReadonlyArray<OverviewTableRow>;
  };
  readonly className?: string;
}

export function AnalyticsOverview({
  metrics,
  highlights,
  timeline,
  table,
  className,
}: AnalyticsOverviewProps): JSX.Element {
  return (
    <section className={cn("flex flex-col gap-6", className)} aria-label="Analytics overview">
      <div className="grid gap-4 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard key={metric.title + index.toString()} {...metric} className="h-full" />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {highlights ? (
          <InsightList {...highlights} className="lg:col-span-3" />
        ) : null}
        {timeline ? <ActivityTimeline {...timeline} className="lg:col-span-2" /> : null}
      </div>

      {table ? (
        <Card className="p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-6 py-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{table.title}</h3>
              {table.description ? <p className="text-sm text-muted-foreground">{table.description}</p> : null}
            </div>
            <Tabs defaultValue="active" className="w-full gap-0 sm:w-auto">
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="backlog">Backlog</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="px-6 pb-6 pt-4">
            <Table className="text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead>Initiative</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium text-foreground">{row.label}</TableCell>
                    <TableCell className="text-muted-foreground">{row.owner}</TableCell>
                    <TableCell className="font-mono text-sm">{row.progress}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-xs">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-chart-3 opacity-75" aria-hidden />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-chart-3" aria-hidden />
                        </span>
                        {row.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : null}
    </section>
  );
}
