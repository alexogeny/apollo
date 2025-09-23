import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";

import { cn } from "../../lib/utils";

export type InsightStatus = "positive" | "neutral" | "warning";

export interface InsightItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly status: InsightStatus;
  readonly metric?: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
}

const statusIcon: Record<InsightStatus, JSX.Element> = {
  positive: <CheckCircleIcon className="h-5 w-5 text-chart-3" aria-hidden />,
  neutral: <InformationCircleIcon className="h-5 w-5 text-muted-foreground" aria-hidden />,
  warning: <ExclamationCircleIcon className="h-5 w-5 text-accent" aria-hidden />,
};

const statusBadge: Record<InsightStatus, { label: string; className: string }> = {
  positive: { label: "Opportunity", className: "bg-chart-3/15 text-chart-3" },
  neutral: { label: "Insight", className: "bg-muted/60 text-muted-foreground" },
  warning: { label: "Watch", className: "bg-accent/20 text-accent" },
};

export interface InsightListProps {
  readonly title?: string;
  readonly description?: string;
  readonly items: ReadonlyArray<InsightItem>;
  readonly className?: string;
}

export function InsightList({ title, description, items, className }: InsightListProps): JSX.Element {
  return (
    <Card className={cn("flex h-full flex-col gap-5", className)}>
      <div className="space-y-1">
        {title ? <h3 className="text-lg font-semibold text-foreground">{title}</h3> : null}
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <ul className="space-y-4" aria-label={title ?? "Insights"}>
        {items.map((item, index) => {
          const badge = statusBadge[item.status];
          const icon = statusIcon[item.status];
          return (
            <li key={item.id} className="space-y-3">
              <div className="flex items-start gap-3">
                <span aria-hidden className="mt-1">
                  {icon}
                </span>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <Badge className={badge.className}>{badge.label}</Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {item.metric ? <span className="font-mono text-sm text-foreground">{item.metric}</span> : null}
                    {item.actionLabel ? (
                      <button
                        type="button"
                        onClick={item.onAction}
                        className="rounded-full border border-transparent bg-muted/60 px-3 py-1 text-xs font-medium text-foreground transition hover:border-muted-foreground/40 hover:bg-muted"
                      >
                        {item.actionLabel}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
              {index < items.length - 1 ? <Separator className="ml-8" /> : null}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
