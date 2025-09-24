import * as HoverCardPrimitive from '@radix-ui/react-hover-card';

import { createStyled } from '../styled';

const HoverCardContent = createStyled(HoverCardPrimitive.Content, {
  base: {
    backgroundColor: 'var(--apollo-color-surface)',
    color: 'var(--apollo-color-text)',
    borderRadius: 'var(--apollo-radius-xl)',
    border: '1px solid color-mix(in srgb, var(--apollo-color-border) 65%, transparent)',
    boxShadow: 'var(--apollo-shadow-medium)',
    padding: 'calc(var(--apollo-space-4) - 2px)',
    width: 'min(320px, 90vw)',
    display: 'grid',
    gap: 'var(--apollo-space-3)',
    transformOrigin: 'var(--radix-hover-card-content-transform-origin)',
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
    component: 'hover-card-content',
  }),
});

const HoverCardArrow = createStyled(HoverCardPrimitive.Arrow, {
  base: {
    fill: 'var(--apollo-color-surface)',
    stroke: 'color-mix(in srgb, var(--apollo-color-border) 60%, transparent)',
    strokeWidth: 1,
  },
  dataAttributes: () => ({
    component: 'hover-card-arrow',
  }),
});

const HoverCardRoot = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;
const HoverCardPortal = HoverCardPrimitive.Portal;

export const HoverCard = Object.assign(HoverCardRoot, {
  Root: HoverCardRoot,
  Trigger: HoverCardTrigger,
  Portal: HoverCardPortal,
  Content: HoverCardContent,
  Arrow: HoverCardArrow,
});

export {
  HoverCardArrow,
  HoverCardContent,
  HoverCardPortal,
  HoverCardRoot,
  HoverCardTrigger,
};
