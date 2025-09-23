import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "@radix-ui/react-icons";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from "react";

import { cn } from "../../lib/utils";

export const DropdownMenu = DropdownPrimitive.Root;
export const DropdownMenuTrigger = DropdownPrimitive.Trigger;
export const DropdownMenuGroup = DropdownPrimitive.Group;
export const DropdownMenuPortal = DropdownPrimitive.Portal;
export const DropdownMenuSub = DropdownPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownPrimitive.RadioGroup;

export const DropdownMenuSubTrigger = forwardRef<
  ElementRef<typeof DropdownPrimitive.SubTrigger>,
  ComponentPropsWithoutRef<typeof DropdownPrimitive.SubTrigger> & {
    readonly inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm outline-none focus:bg-muted focus:text-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRightIcon className="ml-auto h-4 w-4" />
  </DropdownPrimitive.SubTrigger>
));

DropdownMenuSubTrigger.displayName = DropdownPrimitive.SubTrigger.displayName;

export const DropdownMenuSubContent = forwardRef<
  ElementRef<typeof DropdownPrimitive.SubContent>,
  ComponentPropsWithoutRef<typeof DropdownPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[10rem] overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg",
      className,
    )}
    {...props}
  />
));

DropdownMenuSubContent.displayName = DropdownPrimitive.SubContent.displayName;

export const DropdownMenuContent = forwardRef<
  ElementRef<typeof DropdownPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DropdownPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <DropdownPrimitive.Portal>
    <DropdownPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[12rem] overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-xl backdrop-blur",
        className,
      )}
      {...props}
    />
  </DropdownPrimitive.Portal>
));

DropdownMenuContent.displayName = DropdownPrimitive.Content.displayName;

export const DropdownMenuItem = forwardRef<
  ElementRef<typeof DropdownPrimitive.Item>,
  ComponentPropsWithoutRef<typeof DropdownPrimitive.Item> & {
    readonly inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm outline-none transition-colors focus:bg-muted focus:text-foreground",
      inset && "pl-8",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-60",
      className,
    )}
    {...props}
  />
));

DropdownMenuItem.displayName = DropdownPrimitive.Item.displayName;

export const DropdownMenuCheckboxItem = forwardRef<
  ElementRef<typeof DropdownPrimitive.CheckboxItem>,
  ComponentPropsWithoutRef<typeof DropdownPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm outline-none transition-colors focus:bg-muted focus:text-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-60",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownPrimitive.ItemIndicator>
        <CheckIcon className="h-4 w-4" />
      </DropdownPrimitive.ItemIndicator>
    </span>
    <span className="ml-6 flex-1">{children}</span>
  </DropdownPrimitive.CheckboxItem>
));

DropdownMenuCheckboxItem.displayName = DropdownPrimitive.CheckboxItem.displayName;

export const DropdownMenuRadioItem = forwardRef<
  ElementRef<typeof DropdownPrimitive.RadioItem>,
  ComponentPropsWithoutRef<typeof DropdownPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm outline-none transition-colors focus:bg-muted focus:text-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-60",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownPrimitive.ItemIndicator>
        <CircleIcon className="h-2 w-2 fill-current" />
      </DropdownPrimitive.ItemIndicator>
    </span>
    <span className="ml-6 flex-1">{children}</span>
  </DropdownPrimitive.RadioItem>
));

DropdownMenuRadioItem.displayName = DropdownPrimitive.RadioItem.displayName;

export const DropdownMenuLabel = forwardRef<
  ElementRef<typeof DropdownPrimitive.Label>,
  ComponentPropsWithoutRef<typeof DropdownPrimitive.Label> & {
    readonly inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-xs font-semibold text-muted-foreground", inset && "pl-8", className)}
    {...props}
  />
));

DropdownMenuLabel.displayName = DropdownPrimitive.Label.displayName;

export const DropdownMenuSeparator = forwardRef<
  ElementRef<typeof DropdownPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof DropdownPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border/80", className)}
    {...props}
  />
));

DropdownMenuSeparator.displayName = DropdownPrimitive.Separator.displayName;

export const DropdownMenuShortcut = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>): JSX.Element => (
  <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />
);
