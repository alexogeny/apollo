import { Fragment, useMemo } from "react";

import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";

import { cn } from "../../lib/utils";

export type MetricTrendDirection = "increase" | "decrease" | "steady";

export interface MetricTrend {
  readonly label: string;
  readonly direction: MetricTrendDirection;
  readonly delta: number;
  readonly tone?: "success" | "warning" | "danger";
}

export interface MetricSparkline {
  readonly points: ReadonlyArray<number>;
  readonly label?: string;
  readonly tone?: "primary" | "secondary" | "accent" | "neutral";
}

export interface MetricProgress {
  readonly value: number;
  readonly label?: string;
  readonly tone?: "accent" | "neutral" | "success" | "warning" | "danger";
}

export interface MetricCardProps {
  readonly title: string;
  readonly value: string;
  readonly unit?: string;
  readonly subtitle?: string;
  readonly trend?: MetricTrend;
  readonly progress?: MetricProgress;
  readonly sparkline?: MetricSparkline;
  readonly footnote?: string;
  readonly className?: string;
}

const trendToneToClasses: Record<NonNullable<MetricTrend["tone"]>, string> = {
  success: "text-chart-3",
  warning: "text-accent",
  danger: "text-destructive",
};

const sparklineToneToColor: Record<NonNullable<MetricSparkline["tone"]>, string> = {
  primary: "hsl(var(--chart-1))",
  secondary: "hsl(var(--chart-2))",
  accent: "hsl(var(--chart-5))",
  neutral: "hsl(var(--muted-foreground))",
};

function buildSparklinePath(points: ReadonlyArray<number>): string {
  if (points.length === 0) {
    return "";
  }
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const step = 100 / (points.length - 1 || 1);

  return points
    .map((point, index) => {
      const x = index * step;
      const normalized = (point - min) / range;
      const y = 100 - normalized * 100;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

const directionLabel: Record<MetricTrendDirection, string> = {
  increase: "Trending up",
  decrease: "Trending down",
  steady: "Holding steady",
};

export function MetricCard({
  title,
  value,
  unit,
  subtitle,
  trend,
  progress,
  sparkline,
  footnote,
  className,
}: MetricCardProps): JSX.Element {
  const path = useMemo(() => (sparkline ? buildSparklinePath(sparkline.points) : ""), [sparkline]);
  const sparklineColor = sparkline?.tone ? sparklineToneToColor[sparkline.tone] : sparklineToneToColor.primary;

  const trendToneClass = trend?.tone ? trendToneToClasses[trend.tone] : "text-primary";

  return (
    <Card className={cn("flex h-full flex-col gap-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{title}</p>
          <div className="flex flex-wrap items-end gap-2">
            <span className="text-3xl font-semibold text-foreground">{value}</span>
            {unit ? <span className="text-sm text-muted-foreground">{unit}</span> : null}
          </div>
          {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        {trend ? (
          <Badge variant="neutral" className="bg-primary/10 text-xs font-medium text-primary">
            <span className="sr-only">{directionLabel[trend.direction]} by {Math.abs(trend.delta)}%</span>
            <span aria-hidden>
              {trend.direction === "increase" ? "▲" : trend.direction === "decrease" ? "▼" : "➝"}
            </span>
            <span aria-hidden className="ml-1">
              {trend.delta > 0 ? "+" : trend.delta < 0 ? "−" : ""}
              {Math.abs(trend.delta).toFixed(1)}%
            </span>
          </Badge>
        ) : null}
      </div>

      {sparkline && path ? (
        <div className="relative h-24 w-full">
          <svg
            viewBox="0 0 100 100"
            role="img"
            aria-label={sparkline.label ?? `${title} trendline`}
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="metric-card-spark" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor={sparklineColor} stopOpacity="0.28" />
                <stop offset="100%" stopColor={sparklineColor} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${path} L100,100 L0,100 Z`} fill="url(#metric-card-spark)" aria-hidden />
            <path d={path} fill="none" stroke={sparklineColor} strokeWidth={2} strokeLinejoin="round" />
            <Fragment>
              {sparkline.points.map((point, index) => {
                const max = Math.max(...sparkline.points);
                const min = Math.min(...sparkline.points);
                const range = max - min || 1;
                const step = 100 / (sparkline.points.length - 1 || 1);
                const x = index * step;
                const normalized = (point - min) / range;
                const y = 100 - normalized * 100;
                return (
                  <circle key={index} cx={x} cy={y} r={1.5} fill={sparklineColor} aria-hidden />
                );
              })}
            </Fragment>
          </svg>
        </div>
      ) : null}

      {trend ? (
        <div className="flex items-center justify-between gap-3 text-sm">
          <p className="text-muted-foreground">{trend.label}</p>
          <p className={cn("font-medium", trendToneClass)}>{directionLabel[trend.direction]}</p>
        </div>
      ) : null}

      {progress ? (
        <div className="space-y-2" aria-live="polite">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{progress.label ?? "Progress"}</span>
            <span className="font-semibold text-foreground">{progress.value}%</span>
          </div>
          <Progress value={progress.value} tone={progress.tone ?? "accent"} aria-hidden={false} />
        </div>
      ) : null}

      {footnote ? <p className="text-xs text-muted-foreground/80">{footnote}</p> : null}
    </Card>
  );
}
