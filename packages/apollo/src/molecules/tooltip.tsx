import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { createStyled } from '../styled';

const TooltipContent = createStyled(TooltipPrimitive.Content, {
  base: {
    '--apollo-tooltip-bg': 'color-mix(in srgb, var(--apollo-color-text) 92%, var(--apollo-color-surface) 8%)',
    '--apollo-tooltip-fg': 'var(--apollo-color-surface)',
    backgroundColor: 'var(--apollo-tooltip-bg)',
    color: 'var(--apollo-tooltip-fg)',
    borderRadius: 'var(--apollo-radius-md)',
    border: '1px solid color-mix(in srgb, var(--apollo-tooltip-bg) 65%, transparent)',
    boxShadow: 'var(--apollo-shadow-medium)',
    paddingBlock: 'calc(var(--apollo-space-2) + 2px)',
    paddingInline: 'calc(var(--apollo-space-3) + 2px)',
    fontSize: 'var(--apollo-typography-size-sm)',
    lineHeight: 'var(--apollo-typography-line-height-tight)',
    letterSpacing: 'var(--apollo-typography-letter-spacing-tight)',
    fontWeight: 'var(--apollo-typography-weight-medium)',
    zIndex: 'var(--apollo-z-overlay)',
    userSelect: 'none',
    pointerEvents: 'none',
    transformOrigin: 'var(--radix-tooltip-content-transform-origin)',
    transition:
      'opacity var(--apollo-motion-duration-quick) var(--apollo-motion-easing-standard), transform var(--apollo-motion-duration-quick) var(--apollo-motion-easing-standard)',
    '&[data-state="delayed-open"]': {
      opacity: 1,
      transform: 'translateY(0)',
    },
    '&[data-state="closed"]': {
      opacity: 0,
    },
    '&[data-side="top"]': {
      transform: 'translateY(-2px)',
    },
    '&[data-side="bottom"]': {
      transform: 'translateY(2px)',
    },
    '&[data-side="left"]': {
      transform: 'translateX(-2px)',
    },
    '&[data-side="right"]': {
      transform: 'translateX(2px)',
    },
  },
  dataAttributes: () => ({
    component: 'tooltip-content',
  }),
});

const TooltipArrow = createStyled(TooltipPrimitive.Arrow, {
  base: {
    fill: 'var(--apollo-tooltip-bg)',
  },
  dataAttributes: () => ({
    component: 'tooltip-arrow',
  }),
});

const TooltipRoot = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipPortal = TooltipPrimitive.Portal;
const TooltipProvider = TooltipPrimitive.Provider;

export const Tooltip = Object.assign(TooltipRoot, {
  Root: TooltipRoot,
  Provider: TooltipProvider,
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Content: TooltipContent,
  Arrow: TooltipArrow,
});

export {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
};
