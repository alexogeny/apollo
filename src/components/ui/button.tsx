import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        secondary:
          "bg-secondary/10 text-secondary-foreground border border-secondary/50 hover:bg-secondary/15",
        outline:
          "border border-input bg-transparent hover:bg-muted/60 hover:text-foreground",
        ghost: "hover:bg-muted/60 hover:text-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        subtle: "bg-muted/70 text-foreground hover:bg-muted/90",
      },
      size: {
        xs: "h-7 px-2.5 text-xs",
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-base",
        icon: "h-10 w-10",
      },
      density: {
        comfortable: "tracking-tight",
        relaxed: "tracking-normal",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      density: "comfortable",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  readonly asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, density, asChild = false, type = "button", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, density, className }))}
        ref={ref}
        data-variant={variant ?? "primary"}
        data-size={size ?? "md"}
        {...(!asChild ? { type } : {})}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { buttonVariants };
