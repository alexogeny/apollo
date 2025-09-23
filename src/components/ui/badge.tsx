import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        neutral: "border-transparent bg-muted text-muted-foreground",
        outline: "border-border text-foreground",
        success: "border-transparent bg-chart-3/20 text-chart-3",
        warning: "border-transparent bg-accent/25 text-accent",
        danger: "border-transparent bg-destructive/20 text-destructive",
      },
      density: {
        snug: "tracking-tight",
        relaxed: "tracking-wide uppercase",
      },
    },
    defaultVariants: {
      variant: "neutral",
      density: "snug",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, density, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      className={cn(badgeVariants({ variant, density }), className)}
      data-variant={variant ?? "neutral"}
      {...props}
    />
  ),
);

Badge.displayName = "Badge";

export { badgeVariants };
