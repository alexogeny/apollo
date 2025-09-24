import { createStyled } from '../styled';

const TopbarRoot = createStyled('header', {
  base: {
    position: 'sticky',
    top: 0,
    insetInline: 0,
    zIndex: 'var(--apollo-z-overlay)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--apollo-space-4)',
    paddingBlock: 'calc(var(--apollo-space-3) + 2px)',
    paddingInline: 'clamp(1.5rem, 5vw, 3rem)',
    background:
      'color-mix(in srgb, var(--apollo-color-bg) 82%, color-mix(in srgb, var(--apollo-color-surface) 18%, transparent))',
    borderBottom: '1px solid color-mix(in srgb, var(--apollo-color-border) 55%, transparent)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
  },
  dataAttributes: () => ({
    component: 'topbar-root',
  }),
});

const TopbarSection = createStyled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--apollo-space-3)',
    minWidth: 0,
  },
  variants: {
    align: {
      start: { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      end: { justifyContent: 'flex-end' },
    },
  },
  defaultVariants: {
    align: 'start',
  },
  dataAttributes: (variants) => ({
    component: 'topbar-section',
    align: variants.align ?? 'start',
  }),
});

const TopbarBadge = createStyled('span', {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--apollo-space-2)',
    paddingInline: 'calc(var(--apollo-space-3) + 2px)',
    paddingBlock: 'calc(var(--apollo-space-1) + 2px)',
    borderRadius: 'var(--apollo-radius-pill)',
    fontSize: '0.75rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontWeight: 'var(--apollo-typography-weight-semibold)',
    border: '1px solid transparent',
  },
  variants: {
    tone: {
      accent: {
        backgroundColor: 'color-mix(in srgb, var(--apollo-color-accent-subtle) 70%, transparent)',
        color:
          'color-mix(in srgb, var(--apollo-color-accent-contrast) 85%, var(--apollo-color-accent) 15%)',
        borderColor: 'color-mix(in srgb, var(--apollo-color-accent) 40%, transparent)',
      },
      neutral: {
        backgroundColor: 'color-mix(in srgb, var(--apollo-color-bg-subtle) 75%, transparent)',
        color: 'var(--apollo-color-text-muted)',
        borderColor: 'color-mix(in srgb, var(--apollo-color-border) 55%, transparent)',
      },
    },
  },
  defaultVariants: {
    tone: 'accent',
  },
  dataAttributes: (variants) => ({
    component: 'topbar-badge',
    tone: variants.tone ?? 'accent',
  }),
});

const TopbarTitle = createStyled('span', {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--apollo-space-2)',
    fontWeight: 'var(--apollo-typography-weight-semibold)',
    fontSize: '1.05rem',
    color: 'var(--apollo-color-text)',
    letterSpacing: 'var(--apollo-typography-letter-spacing-tight)',
  },
  dataAttributes: () => ({
    component: 'topbar-title',
  }),
});

const TopbarSubtitle = createStyled('span', {
  base: {
    color: 'var(--apollo-color-text-muted)',
    fontSize: '0.9rem',
    letterSpacing: 'var(--apollo-typography-letter-spacing-tight)',
  },
  dataAttributes: () => ({
    component: 'topbar-subtitle',
  }),
});

const TopbarActions = createStyled('div', {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--apollo-space-2)',
  },
  dataAttributes: () => ({
    component: 'topbar-actions',
  }),
});

const TopbarAction = createStyled('button', {
  base: {
    appearance: 'none',
    border: '1px solid transparent',
    borderRadius: 'var(--apollo-radius-md)',
    paddingInline: 'calc(var(--apollo-space-3) + 2px)',
    paddingBlock: 'calc(var(--apollo-space-2) + 2px)',
    fontFamily: 'inherit',
    fontSize: '0.85rem',
    fontWeight: 'var(--apollo-typography-weight-medium)',
    letterSpacing: 'var(--apollo-typography-letter-spacing-tight)',
    cursor: 'pointer',
    transition:
      'background-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), border-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), box-shadow var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard)',
  },
  variants: {
    variant: {
      solid: {
        backgroundColor: 'var(--apollo-color-accent)',
        color: 'var(--apollo-color-accent-contrast)',
        '&:hover': {
          filter: 'brightness(1.05)',
        },
      },
      outline: {
        borderColor: 'color-mix(in srgb, var(--apollo-color-border) 65%, transparent)',
        color: 'var(--apollo-color-text)',
        backgroundColor: 'transparent',
        '&:hover': {
          borderColor: 'color-mix(in srgb, var(--apollo-color-accent) 35%, transparent)',
        },
      },
      ghost: {
        backgroundColor: 'color-mix(in srgb, var(--apollo-color-accent-subtle) 60%, transparent)',
        color: 'var(--apollo-color-accent)',
        '&:hover': {
          backgroundColor: 'color-mix(in srgb, var(--apollo-color-accent-subtle) 75%, transparent)',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'solid',
  },
  dataAttributes: (variants) => ({
    component: 'topbar-action',
    variant: variants.variant ?? 'solid',
  }),
});

export const Topbar = Object.assign(TopbarRoot, {
  Root: TopbarRoot,
  Section: TopbarSection,
  Badge: TopbarBadge,
  Title: TopbarTitle,
  Subtitle: TopbarSubtitle,
  Actions: TopbarActions,
  Action: TopbarAction,
});
