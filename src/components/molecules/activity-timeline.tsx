import { ClockIcon } from "@radix-ui/react-icons";

import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

import { cn } from "../../lib/utils";

export interface TimelineEvent {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly timestamp: string;
  readonly category?: string;
  readonly tone?: "accent" | "neutral" | "success" | "warning" | "danger";
}

const toneClass: Record<NonNullable<TimelineEvent["tone"]>, string> = {
  accent: "bg-chart-2",
  neutral: "bg-muted-foreground/60",
  success: "bg-chart-3",
  warning: "bg-accent",
  danger: "bg-destructive",
};

export interface ActivityTimelineProps {
  readonly title?: string;
  readonly description?: string;
  readonly events: ReadonlyArray<TimelineEvent>;
  readonly className?: string;
}

export function ActivityTimeline({ title, description, events, className }: ActivityTimelineProps): JSX.Element {
  return (
    <Card className={cn("flex h-full flex-col gap-5", className)}>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          {title ? <h3 className="text-lg font-semibold text-foreground">{title}</h3> : null}
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
          <ClockIcon className="h-4 w-4" aria-hidden />
          Live updates
        </div>
      </div>
      <ol className="relative space-y-6" aria-label={title ?? "Timeline"}>
        {events.map((event, index) => (
          <li key={event.id} className="relative pl-8">
            <span
              aria-hidden
              className={cn(
                "absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full",
                event.tone ? toneClass[event.tone] : "bg-primary",
              )}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-background" />
            </span>
            {index < events.length - 1 ? (
              <span className="absolute left-2 top-6 h-full w-px bg-border/70" aria-hidden />
            ) : null}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-foreground">{event.title}</p>
                {event.category ? <Badge variant="outline">{event.category}</Badge> : null}
              </div>
              <p className="text-sm text-muted-foreground">{event.description}</p>
              <time className="text-xs text-muted-foreground" dateTime={event.timestamp}>
                {event.timestamp}
              </time>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
