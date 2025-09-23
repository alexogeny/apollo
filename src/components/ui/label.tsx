import { forwardRef, type LabelHTMLAttributes } from "react";

import { cn } from "../../lib/utils";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  readonly isRequired?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, isRequired = false, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {isRequired ? (
          <span className="text-destructive" aria-hidden>
            *
          </span>
        ) : null}
      </span>
    </label>
  ),
);

Label.displayName = "Label";
