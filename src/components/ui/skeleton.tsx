import { type HTMLAttributes } from "react";

import { cn } from "../../lib/utils";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted/80",
        "after:absolute after:inset-0 after:translate-x-[-100%] after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent after:content-['']",
        "after:animate-[shimmer_var(--apollo-motion-duration,1.6s)_infinite]",
        className,
      )}
      role="presentation"
      {...props}
    />
  );
}
