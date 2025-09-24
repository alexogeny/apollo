import * as React from 'react';

import { createStyled } from '../styled';

const SidebarRoot = createStyled('nav', {
  base: {
    position: 'sticky',
    top: 'calc(var(--apollo-space-8) + 72px)',
    display: 'grid',
    gap: 'var(--apollo-space-5)',
    alignContent: 'start',
    padding: 'clamp(1.5rem, 3vw, 2rem)',
    borderRadius: 'var(--apollo-radius-xl)',
    border: '1px solid color-mix(in srgb, var(--apollo-color-border) 60%, transparent)',
    backgroundColor: 'var(--apollo-color-surface)',
    boxShadow: 'var(--apollo-shadow-low)',
    minWidth: 0,
    '@media (max-width: 960px)': {
      position: 'static',
      top: 'auto',
    },
  },
  dataAttributes: (variants) => ({
    component: 'sidebar-root',
    variant: variants.variant ?? 'surface',
  }),
  variants: {
    variant: {
      surface: {},
      ghost: {
        backgroundColor: 'color-mix(in srgb, var(--apollo-color-bg-subtle) 65%, transparent)',
        borderColor: 'color-mix(in srgb, var(--apollo-color-border) 40%, transparent)',
        boxShadow: 'none',
      },
    },
  },
  defaultVariants: {
    variant: 'surface',
  },
  compoundVariants: [
    {
      variants: { variant: 'ghost' },
      style: {
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      },
    },
  ],
});

const SidebarHeader = createStyled('div', {
  base: {
    display: 'grid',
    gap: 'var(--apollo-space-2)',
  },
  dataAttributes: () => ({
    component: 'sidebar-header',
  }),
});

const SidebarSection = createStyled('div', {
  base: {
    display: 'grid',
    gap: 'var(--apollo-space-3)',
  },
  dataAttributes: () => ({
    component: 'sidebar-section',
  }),
});

const SidebarSectionLabel = createStyled('span', {
  base: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--apollo-color-text-muted)',
    fontWeight: 'var(--apollo-typography-weight-semibold)',
  },
  dataAttributes: () => ({
    component: 'sidebar-section-label',
  }),
});

const SidebarList = createStyled('div', {
  base: {
    display: 'grid',
    gap: 'var(--apollo-space-2)',
  },
  dataAttributes: () => ({
    component: 'sidebar-list',
  }),
});

const SidebarItemBase = createStyled('button', {
  base: {
    appearance: 'none',
    border: '1px solid transparent',
    borderRadius: 'var(--apollo-radius-lg)',
    backgroundColor: 'transparent',
    display: 'grid',
    gap: '0.35rem',
    paddingBlock: 'calc(var(--apollo-space-3) + 2px)',
    paddingInline: 'calc(var(--apollo-space-4) + 2px)',
    textAlign: 'left',
    cursor: 'pointer',
    color: 'var(--apollo-color-text-muted)',
    fontFamily: 'inherit',
    fontSize: '0.92rem',
    letterSpacing: 'var(--apollo-typography-letter-spacing-tight)',
    transition:
      'background-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), border-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), box-shadow var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard)',
    minWidth: 0,
  },
  variants: {
    state: {
      idle: {
        '&:hover': {
          backgroundColor: 'color-mix(in srgb, var(--apollo-color-accent-subtle) 45%, transparent)',
          color: 'var(--apollo-color-text)',
        },
      },
      active: {
        backgroundColor: 'var(--apollo-color-accent-subtle)',
        borderColor: 'color-mix(in srgb, var(--apollo-color-accent) 40%, transparent)',
        color: 'var(--apollo-color-accent-contrast)',
        boxShadow: '0 0 0 1px color-mix(in srgb, var(--apollo-color-accent) 35%, transparent)',
      },
    },
  },
  defaultVariants: {
    state: 'idle',
  },
  dataAttributes: (variants) => ({
    component: 'sidebar-item',
    state: variants.state ?? 'idle',
  }),
  compoundVariants: [
    {
      variants: { state: 'idle' },
      style: {
        '&:focus-visible': {
          outline: 'none',
          boxShadow: 'var(--apollo-shadow-focus)',
        },
      },
    },
    {
      variants: { state: 'active' },
      style: {
        '&:focus-visible': {
          outline: 'none',
          boxShadow: 'var(--apollo-shadow-focus-strong)',
        },
      },
    },
  ],
});

const SidebarItemLabel = createStyled('span', {
  base: {
    fontWeight: 'var(--apollo-typography-weight-semibold)',
    color: 'inherit',
    letterSpacing: 'var(--apollo-typography-letter-spacing-tight)',
  },
  dataAttributes: () => ({
    component: 'sidebar-item-label',
  }),
});

const SidebarItemDescription = createStyled('span', {
  base: {
    color: 'color-mix(in srgb, var(--apollo-color-text-muted) 90%, var(--apollo-color-text) 10%)',
    fontSize: '0.78rem',
    lineHeight: 1.5,
  },
  dataAttributes: () => ({
    component: 'sidebar-item-description',
  }),
});

const SidebarFooter = createStyled('div', {
  base: {
    fontSize: '0.75rem',
    color: 'var(--apollo-color-text-muted)',
    lineHeight: 1.5,
  },
  dataAttributes: () => ({
    component: 'sidebar-footer',
  }),
});

export interface SidebarItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SidebarItemBase>, 'state'> {
  readonly active?: boolean;
}

export const SidebarItem = React.forwardRef<
  React.ElementRef<typeof SidebarItemBase>,
  SidebarItemProps
>(({ active = false, ...props }, ref) => (
  <SidebarItemBase {...props} ref={ref} state={active ? 'active' : 'idle'} />
));

SidebarItem.displayName = 'SidebarItem';

export const Sidebar = Object.assign(SidebarRoot, {
  Root: SidebarRoot,
  Header: SidebarHeader,
  Section: SidebarSection,
  SectionLabel: SidebarSectionLabel,
  List: SidebarList,
  Item: SidebarItem,
  ItemLabel: SidebarItemLabel,
  ItemDescription: SidebarItemDescription,
  Footer: SidebarFooter,
});
