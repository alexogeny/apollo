import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as React from 'react';

import { createStyled } from '../styled';

const menuSurfaceStyles = {
  backgroundColor: 'var(--apollo-color-surface)',
  color: 'var(--apollo-color-text)',
  borderRadius: 'var(--apollo-radius-lg)',
  border: '1px solid color-mix(in srgb, var(--apollo-color-border) 60%, transparent)',
  boxShadow: 'var(--apollo-shadow-medium)',
  paddingBlock: 'calc(var(--apollo-space-2) + 2px)',
  minWidth: '200px',
  display: 'grid',
  gap: '2px',
  transformOrigin: 'var(--radix-dropdown-menu-content-transform-origin)',
  transition:
    'opacity var(--apollo-motion-duration-fast) var(--apollo-motion-easing-entrance), transform var(--apollo-motion-duration-fast) var(--apollo-motion-easing-entrance)',
  '&[data-state="open"]': {
    opacity: 1,
    transform: 'translateY(0)',
  },
  '&[data-state="closed"]': {
    opacity: 0,
    pointerEvents: 'none',
  },
  '&[data-side="top"]': {
    transform: 'translateY(-6px)',
  },
  '&[data-side="bottom"]': {
    transform: 'translateY(6px)',
  },
  '&[data-side="left"]': {
    transform: 'translateX(-6px)',
  },
  '&[data-side="right"]': {
    transform: 'translateX(6px)',
  },
} as const;

const DropdownMenuContent = createStyled(DropdownMenuPrimitive.Content, {
  base: {
    ...menuSurfaceStyles,
  },
  dataAttributes: () => ({
    component: 'dropdown-menu-content',
  }),
});

const DropdownMenuSubContent = createStyled(DropdownMenuPrimitive.SubContent, {
  base: {
    ...menuSurfaceStyles,
    minWidth: '180px',
  },
  dataAttributes: () => ({
    component: 'dropdown-menu-sub-content',
  }),
});

const baseItemStyles = {
  all: 'unset',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--apollo-space-3)',
  paddingInlineStart: 'calc(var(--apollo-space-6))',
  paddingInlineEnd: 'calc(var(--apollo-space-4))',
  paddingBlock: 'calc(var(--apollo-space-2) + 2px)',
  fontSize: 'var(--apollo-typography-size-sm)',
  fontWeight: 'var(--apollo-typography-weight-medium)',
  letterSpacing: 'var(--apollo-typography-letter-spacing-tight)',
  color: 'var(--apollo-color-text)',
  borderRadius: 'var(--apollo-radius-md)',
  cursor: 'pointer',
  transition:
    'background-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard)',
  '&[data-highlighted]': {
    backgroundColor: 'color-mix(in srgb, var(--apollo-color-accent-subtle) 70%, transparent)',
    color: 'var(--apollo-color-accent-strong)',
  },
  '&[data-disabled]': {
    color: 'var(--apollo-color-text-muted)',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  '&[data-state="open"]': {
    backgroundColor: 'color-mix(in srgb, var(--apollo-color-accent-subtle) 80%, transparent)',
    color: 'var(--apollo-color-accent-strong)',
  },
} as const;

const DropdownMenuItem = createStyled(DropdownMenuPrimitive.Item, {
  base: baseItemStyles,
  dataAttributes: () => ({
    component: 'dropdown-menu-item',
  }),
});

const DropdownMenuCheckboxItem = createStyled(DropdownMenuPrimitive.CheckboxItem, {
  base: baseItemStyles,
  dataAttributes: () => ({
    component: 'dropdown-menu-checkbox-item',
  }),
});

const DropdownMenuRadioItem = createStyled(DropdownMenuPrimitive.RadioItem, {
  base: baseItemStyles,
  dataAttributes: () => ({
    component: 'dropdown-menu-radio-item',
  }),
});

const DropdownMenuSubTrigger = createStyled(DropdownMenuPrimitive.SubTrigger, {
  base: {
    ...baseItemStyles,
    paddingInlineEnd: 'calc(var(--apollo-space-6))',
    '&::after': {
      content: "''",
      position: 'absolute',
      right: 'calc(var(--apollo-space-3))',
      width: '10px',
      height: '10px',
      borderTop: '2px solid currentColor',
      borderRight: '2px solid currentColor',
      transform: 'rotate(45deg)',
    },
  },
  dataAttributes: () => ({
    component: 'dropdown-menu-sub-trigger',
  }),
});

const DropdownMenuLabel = createStyled(DropdownMenuPrimitive.Label, {
  base: {
    paddingInline: 'calc(var(--apollo-space-4))',
    paddingBlock: 'calc(var(--apollo-space-2) + 2px)',
    fontSize: 'var(--apollo-typography-size-xs)',
    fontWeight: 'var(--apollo-typography-weight-semibold)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--apollo-color-text-muted)',
  },
  dataAttributes: () => ({
    component: 'dropdown-menu-label',
  }),
});

const DropdownMenuSeparator = createStyled(DropdownMenuPrimitive.Separator, {
  base: {
    height: '1px',
    margin: 'calc(var(--apollo-space-1) + 1px) 0',
    backgroundColor: 'color-mix(in srgb, var(--apollo-color-border) 70%, transparent)',
  },
  dataAttributes: () => ({
    component: 'dropdown-menu-separator',
  }),
});

const DropdownMenuArrow = createStyled(DropdownMenuPrimitive.Arrow, {
  base: {
    fill: 'var(--apollo-color-surface)',
    stroke: 'color-mix(in srgb, var(--apollo-color-border) 60%, transparent)',
    strokeWidth: 1,
  },
  dataAttributes: () => ({
    component: 'dropdown-menu-arrow',
  }),
});

const DropdownMenuItemIndicator = createStyled(DropdownMenuPrimitive.ItemIndicator, {
  base: {
    position: 'absolute',
    left: 'calc(var(--apollo-space-3) - 2px)',
    display: 'inline-flex',
    width: '18px',
    height: '18px',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--apollo-color-accent-strong)',
  },
  dataAttributes: () => ({
    component: 'dropdown-menu-item-indicator',
  }),
});

const DropdownMenuShortcut = createStyled('span', {
  base: {
    marginLeft: 'auto',
    fontSize: 'var(--apollo-typography-size-xs)',
    color: 'var(--apollo-color-text-muted)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  dataAttributes: () => ({
    component: 'dropdown-menu-shortcut',
  }),
});

const CheckIcon = (): JSX.Element => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
    <path
      d="M3 6.5 4.75 8.25 9 4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DotIcon = (): JSX.Element => (
  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" focusable="false">
    <circle cx="5" cy="5" r="3" fill="currentColor" />
  </svg>
);

const DropdownMenuCheckbox = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ children, ...props }, ref) => (
  <DropdownMenuCheckboxItem {...props} ref={ref}>
    <DropdownMenuItemIndicator>
      <CheckIcon />
    </DropdownMenuItemIndicator>
    {children}
  </DropdownMenuCheckboxItem>
));
DropdownMenuCheckbox.displayName = 'DropdownMenuCheckbox';

const DropdownMenuRadio = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ children, ...props }, ref) => (
  <DropdownMenuRadioItem {...props} ref={ref}>
    <DropdownMenuItemIndicator>
      <DotIcon />
    </DropdownMenuItemIndicator>
    {children}
  </DropdownMenuRadioItem>
));
DropdownMenuRadio.displayName = 'DropdownMenuRadio';

const DropdownMenuRoot = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;

export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  Portal: DropdownMenuPortal,
  Content: DropdownMenuContent,
  Sub: DropdownMenuSub,
  SubTrigger: DropdownMenuSubTrigger,
  SubContent: DropdownMenuSubContent,
  Item: DropdownMenuItem,
  CheckboxItem: DropdownMenuCheckbox,
  RadioGroup: DropdownMenuRadioGroup,
  RadioItem: DropdownMenuRadio,
  Label: DropdownMenuLabel,
  Separator: DropdownMenuSeparator,
  ItemIndicator: DropdownMenuItemIndicator,
  Arrow: DropdownMenuArrow,
  Shortcut: DropdownMenuShortcut,
  Group: DropdownMenuGroup,
});

export {
  DropdownMenuArrow,
  DropdownMenuCheckbox,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadio,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
