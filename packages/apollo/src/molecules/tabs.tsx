import * as TabsPrimitive from '@radix-ui/react-tabs';

import { createStyled } from '../styled';

const TabsList = createStyled(TabsPrimitive.List, {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--apollo-space-1)',
    backgroundColor: 'var(--apollo-color-bg-subtle)',
    borderRadius: 'var(--apollo-radius-lg)',
    border: '1px solid color-mix(in srgb, var(--apollo-color-border) 65%, transparent)',
    padding: 'calc(var(--apollo-space-1) + 2px)',
  },
  dataAttributes: () => ({
    component: 'tabs-list',
  }),
});

const TabsTrigger = createStyled(TabsPrimitive.Trigger, {
  base: {
    appearance: 'none',
    border: '1px solid transparent',
    borderRadius: 'var(--apollo-radius-md)',
    backgroundColor: 'transparent',
    color: 'var(--apollo-color-text-muted)',
    fontFamily: 'var(--apollo-typography-font-family-base)',
    fontSize: 'var(--apollo-typography-size-sm)',
    letterSpacing: 'var(--apollo-typography-letter-spacing-tight)',
    fontWeight: 'var(--apollo-typography-weight-medium)',
    paddingInline: 'calc(var(--apollo-space-3) + 2px)',
    paddingBlock: 'calc(var(--apollo-space-2) + 2px)',
    cursor: 'pointer',
    transition:
      'background-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), border-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard)',
    '&[data-state="active"]': {
      color: 'var(--apollo-color-text)',
      backgroundColor: 'var(--apollo-color-surface)',
      borderColor: 'color-mix(in srgb, var(--apollo-color-accent) 35%, transparent)',
      boxShadow: 'var(--apollo-shadow-low)',
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: 'var(--apollo-shadow-focus)',
    },
  },
  variants: {
    tone: {
      neutral: {},
      accent: {
        '&[data-state="active"]': {
          backgroundColor: 'var(--apollo-color-accent-subtle)',
          color: 'var(--apollo-color-accent-contrast)',
          borderColor: 'var(--apollo-color-accent)',
        },
      },
    },
  },
  defaultVariants: {
    tone: 'neutral',
  },
  dataAttributes: (variants) => ({
    component: 'tabs-trigger',
    tone: variants.tone,
  }),
});

const TabsContent = createStyled(TabsPrimitive.Content, {
  base: {
    marginTop: 'var(--apollo-space-4)',
    borderRadius: 'var(--apollo-radius-lg)',
    border: '1px solid color-mix(in srgb, var(--apollo-color-border) 65%, transparent)',
    padding: 'calc(var(--apollo-space-4) - 2px)',
    backgroundColor: 'var(--apollo-color-surface)',
    boxShadow: 'var(--apollo-shadow-low)',
    color: 'var(--apollo-color-text)',
    transition: 'opacity var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard)',
    '&[data-state="inactive"]': {
      opacity: 0,
      pointerEvents: 'none',
    },
  },
  dataAttributes: () => ({
    component: 'tabs-content',
  }),
});

const TabsRoot = TabsPrimitive.Root;

export const Tabs = Object.assign(TabsRoot, {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export { TabsContent, TabsList, TabsRoot, TabsTrigger };
