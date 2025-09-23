import * as ProgressPrimitive from "@radix-ui/react-progress";
import { forwardRef, useMemo, type ComponentPropsWithoutRef, type ElementRef } from "react";

import { cn } from "../../lib/utils";

export interface ProgressProps
  extends ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  readonly tone?: "accent" | "neutral" | "success" | "warning" | "danger";
}

const toneToClassName: Record<NonNullable<ProgressProps["tone"]>, string> = {
  accent: "bg-primary",
  neutral: "bg-muted-foreground/70",
  success: "bg-chart-3",
  warning: "bg-accent",
  danger: "bg-destructive",
};

export const Progress = forwardRef<
  ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, tone = "accent", ...props }, ref) => {
  const safeValue = useMemo(() => Math.max(0, Math.min(100, value ?? 0)), [value]);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-muted",
        "after:absolute after:inset-0 after:bg-gradient-to-r after:from-background/60 after:via-background/10 after:to-background/30",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "relative h-full flex-1",
          toneToClassName[tone],
          "transition-transform",
          "[&[data-state=indeterminate]]:translate-x-full",
        )}
        style={{ transform: `translateX(-${100 - safeValue}%)` }}
        data-tone={tone}
      >
        <span className="sr-only">{safeValue}% complete</span>
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  );
});

Progress.displayName = ProgressPrimitive.Root.displayName;
