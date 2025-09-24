import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import * as React from 'react';

import { createStyled } from '../styled';

const surfaceStyles = {
  backgroundColor: 'var(--apollo-color-surface)',
  color: 'var(--apollo-color-text)',
  borderRadius: 'var(--apollo-radius-lg)',
  border: '1px solid color-mix(in srgb, var(--apollo-color-border) 60%, transparent)',
  boxShadow: 'var(--apollo-shadow-medium)',
  paddingBlock: 'calc(var(--apollo-space-2) + 2px)',
  minWidth: '200px',
  display: 'grid',
  gap: '2px',
  transformOrigin: 'var(--radix-context-menu-content-transform-origin)',
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

const ContextMenuContent = createStyled(ContextMenuPrimitive.Content, {
  base: {
    ...surfaceStyles,
  },
  dataAttributes: () => ({
    component: 'context-menu-content',
  }),
});

const ContextMenuSubContent = createStyled(ContextMenuPrimitive.SubContent, {
  base: {
    ...surfaceStyles,
    minWidth: '180px',
  },
  dataAttributes: () => ({
    component: 'context-menu-sub-content',
  }),
});

const itemBaseStyles = {
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

const ContextMenuItem = createStyled(ContextMenuPrimitive.Item, {
  base: itemBaseStyles,
  dataAttributes: () => ({
    component: 'context-menu-item',
  }),
});

const ContextMenuCheckboxItem = createStyled(ContextMenuPrimitive.CheckboxItem, {
  base: itemBaseStyles,
  dataAttributes: () => ({
    component: 'context-menu-checkbox-item',
  }),
});

const ContextMenuRadioItem = createStyled(ContextMenuPrimitive.RadioItem, {
  base: itemBaseStyles,
  dataAttributes: () => ({
    component: 'context-menu-radio-item',
  }),
});

const ContextMenuSubTrigger = createStyled(ContextMenuPrimitive.SubTrigger, {
  base: {
    ...itemBaseStyles,
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
    component: 'context-menu-sub-trigger',
  }),
});

const ContextMenuLabel = createStyled(ContextMenuPrimitive.Label, {
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
    component: 'context-menu-label',
  }),
});

const ContextMenuSeparator = createStyled(ContextMenuPrimitive.Separator, {
  base: {
    height: '1px',
    margin: 'calc(var(--apollo-space-1) + 1px) 0',
    backgroundColor: 'color-mix(in srgb, var(--apollo-color-border) 70%, transparent)',
  },
  dataAttributes: () => ({
    component: 'context-menu-separator',
  }),
});

const ContextMenuItemIndicator = createStyled(ContextMenuPrimitive.ItemIndicator, {
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
    component: 'context-menu-item-indicator',
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

const ContextMenuCheckbox = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ children, ...props }, ref) => (
  <ContextMenuCheckboxItem {...props} ref={ref}>
    <ContextMenuItemIndicator>
      <CheckIcon />
    </ContextMenuItemIndicator>
    {children}
  </ContextMenuCheckboxItem>
));
ContextMenuCheckbox.displayName = 'ContextMenuCheckbox';

const ContextMenuRadio = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ children, ...props }, ref) => (
  <ContextMenuRadioItem {...props} ref={ref}>
    <ContextMenuItemIndicator>
      <DotIcon />
    </ContextMenuItemIndicator>
    {children}
  </ContextMenuRadioItem>
));
ContextMenuRadio.displayName = 'ContextMenuRadio';

const ContextMenuRoot = ContextMenuPrimitive.Root;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
const ContextMenuSub = ContextMenuPrimitive.Sub;
const ContextMenuPortal = ContextMenuPrimitive.Portal;
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;
const ContextMenuGroup = ContextMenuPrimitive.Group;

export const ContextMenu = Object.assign(ContextMenuRoot, {
  Root: ContextMenuRoot,
  Trigger: ContextMenuTrigger,
  Portal: ContextMenuPortal,
  Content: ContextMenuContent,
  Sub: ContextMenuSub,
  SubTrigger: ContextMenuSubTrigger,
  SubContent: ContextMenuSubContent,
  Item: ContextMenuItem,
  CheckboxItem: ContextMenuCheckbox,
  RadioGroup: ContextMenuRadioGroup,
  RadioItem: ContextMenuRadio,
  Label: ContextMenuLabel,
  Separator: ContextMenuSeparator,
  ItemIndicator: ContextMenuItemIndicator,
  Group: ContextMenuGroup,
});

export {
  ContextMenuCheckbox,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuItemIndicator,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadio,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuRoot,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};
