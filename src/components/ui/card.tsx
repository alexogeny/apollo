import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "glass-panel relative rounded-2xl border border-border/70 bg-card/95 p-6 shadow-sm transition-colors",
        className,
      )}
      {...props}
    />
  ),
);

Card.displayName = "Card";
