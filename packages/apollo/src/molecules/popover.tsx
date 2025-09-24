import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';

import { createStyled } from '../styled';

const PopoverContent = createStyled(PopoverPrimitive.Content, {
  base: {
    backgroundColor: 'var(--apollo-color-surface)',
    color: 'var(--apollo-color-text)',
    borderRadius: 'var(--apollo-radius-lg)',
    border: '1px solid color-mix(in srgb, var(--apollo-color-border) 65%, transparent)',
    boxShadow: 'var(--apollo-shadow-medium)',
    padding: 'calc(var(--apollo-space-4) - 2px)',
    minWidth: 'min(260px, 90vw)',
    maxWidth: 'min(340px, 90vw)',
    display: 'grid',
    gap: 'var(--apollo-space-3)',
    zIndex: 'var(--apollo-z-popover)',
    transformOrigin: 'var(--radix-popover-content-transform-origin)',
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
  },
  dataAttributes: () => ({
    component: 'popover-content',
  }),
});

const PopoverArrow = createStyled(PopoverPrimitive.Arrow, {
  base: {
    fill: 'var(--apollo-color-surface)',
    stroke: 'color-mix(in srgb, var(--apollo-color-border) 65%, transparent)',
    strokeWidth: 1,
  },
  dataAttributes: () => ({
    component: 'popover-arrow',
  }),
});

const PopoverCloseBase = createStyled(PopoverPrimitive.Close, {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'var(--apollo-space-7)',
    height: 'var(--apollo-space-7)',
    borderRadius: 'var(--apollo-radius-pill)',
    border: '1px solid transparent',
    backgroundColor: 'transparent',
    color: 'var(--apollo-color-text-muted)',
    cursor: 'pointer',
    transition:
      'background-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard)',
    '&:hover': {
      backgroundColor: 'var(--apollo-color-bg-subtle)',
      color: 'var(--apollo-color-text)',
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: 'var(--apollo-shadow-focus)',
    },
  },
  dataAttributes: () => ({
    component: 'popover-close',
  }),
});

const CloseIcon = (): JSX.Element => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
    <path
      d="M2.5 2.5l7 7m0-7l-7 7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

export const PopoverClose = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Close>
>(({ children, ...props }, ref) => (
  <PopoverCloseBase {...props} ref={ref}>
    {children ?? <CloseIcon />}
  </PopoverCloseBase>
));
PopoverClose.displayName = 'PopoverClose';

const PopoverRoot = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;
const PopoverPortal = PopoverPrimitive.Portal;

export const Popover = Object.assign(PopoverRoot, {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Anchor: PopoverAnchor,
  Portal: PopoverPortal,
  Content: PopoverContent,
  Arrow: PopoverArrow,
  Close: PopoverClose,
});

export {
  PopoverAnchor,
  PopoverArrow,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
};
