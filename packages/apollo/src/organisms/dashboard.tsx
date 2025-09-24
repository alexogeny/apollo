import { createStyled } from '../styled';

const DashboardRoot = createStyled('div', {
  base: {
    minHeight: '100vh',
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    backgroundColor: 'var(--apollo-color-bg)',
    color: 'var(--apollo-color-text)',
  },
  dataAttributes: () => ({
    component: 'dashboard-root',
  }),
});

const DashboardMain = createStyled('div', {
  base: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'minmax(240px, 280px) minmax(0, 1fr)',
    alignItems: 'start',
    gap: 'clamp(var(--apollo-space-6), 4vw, var(--apollo-space-8))',
    paddingInline: 'clamp(1.5rem, 5vw, 3rem)',
    paddingBlock: 'clamp(2.5rem, 5vw, 3.5rem)',
  },
  dataAttributes: (variants) => ({
    component: 'dashboard-main',
    layout: variants.layout ?? 'twoColumn',
  }),
  variants: {
    layout: {
      twoColumn: {},
      stacked: {},
    },
  },
  defaultVariants: {
    layout: 'twoColumn',
  },
  compoundVariants: [
    {
      variants: { layout: 'twoColumn' },
      style: {
        '@media (max-width: 960px)': {
          gridTemplateColumns: '1fr',
        },
      },
    },
    {
      variants: { layout: 'stacked' },
      style: {
        gridTemplateColumns: '1fr',
      },
    },
  ],
});

const DashboardSidebar = createStyled('aside', {
  base: {
    position: 'relative',
    minWidth: 0,
    display: 'grid',
  },
  dataAttributes: () => ({
    component: 'dashboard-sidebar',
  }),
});

const DashboardContent = createStyled('div', {
  base: {
    minWidth: 0,
    display: 'grid',
    gap: 'clamp(var(--apollo-space-6), 4vw, var(--apollo-space-8))',
  },
  dataAttributes: () => ({
    component: 'dashboard-content',
  }),
});

export const Dashboard = Object.assign(DashboardRoot, {
  Root: DashboardRoot,
  Main: DashboardMain,
  Sidebar: DashboardSidebar,
  Content: DashboardContent,
});
