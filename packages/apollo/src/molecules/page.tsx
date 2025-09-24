import { createStyled } from '../styled';

const PageRoot = createStyled('div', {
  base: {
    minHeight: '100vh',
    backgroundColor: 'var(--apollo-color-bg)',
    color: 'var(--apollo-color-text)',
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
  },
  dataAttributes: () => ({
    component: 'page-root',
  }),
});

const PageBody = createStyled('div', {
  base: {
    width: '100%',
    paddingBlock: 'clamp(2.5rem, 6vw, 4rem)',
    paddingInline: 'clamp(1.5rem, 5vw, 3rem)',
    display: 'grid',
    gap: 'clamp(var(--apollo-space-6), 4vw, var(--apollo-space-8))',
  },
  dataAttributes: () => ({
    component: 'page-body',
  }),
});

const PageContent = createStyled('div', {
  base: {
    width: '100%',
    margin: '0 auto',
    maxWidth: '1180px',
    display: 'grid',
    gap: 'clamp(var(--apollo-space-6), 4vw, var(--apollo-space-8))',
  },
  dataAttributes: () => ({
    component: 'page-content',
  }),
});

const PageSection = createStyled('section', {
  base: {
    display: 'grid',
    gap: 'var(--apollo-space-5)',
    scrollMarginTop: 'clamp(5rem, 10vh, 6rem)',
  },
  variants: {
    variant: {
      surface: {
        backgroundColor: 'var(--apollo-color-surface)',
        borderRadius: 'var(--apollo-radius-xl)',
        border: '1px solid color-mix(in srgb, var(--apollo-color-border) 65%, transparent)',
        boxShadow: 'var(--apollo-shadow-low)',
        padding: 'clamp(1.75rem, 3vw, 2.5rem)',
      },
      plain: {
        padding: '0',
      },
      hero: {
        background:
          'linear-gradient(140deg, color-mix(in srgb, var(--apollo-color-accent) 16%, transparent), color-mix(in srgb, var(--apollo-color-bg-subtle) 80%, transparent))',
        borderRadius: 'var(--apollo-radius-xxl, 1.5rem)',
        border: '1px solid color-mix(in srgb, var(--apollo-color-border) 45%, transparent)',
        boxShadow: 'var(--apollo-shadow-medium)',
        padding: 'clamp(2.5rem, 6vw, 3.5rem)',
        gap: 'var(--apollo-space-4)',
      },
    },
  },
  defaultVariants: {
    variant: 'surface',
  },
  dataAttributes: (variants) => ({
    component: 'page-section',
    variant: variants.variant ?? 'surface',
  }),
});

const PageSectionHeader = createStyled('header', {
  base: {
    display: 'grid',
    gap: 'var(--apollo-space-2)',
  },
  dataAttributes: () => ({
    component: 'page-section-header',
  }),
});

const PageSectionTitle = createStyled('h2', {
  base: {
    margin: 0,
    fontSize: 'clamp(1.6rem, 2.4vw, 1.875rem)',
    letterSpacing: 'var(--apollo-typography-letter-spacing-tight)',
    fontWeight: 'var(--apollo-typography-weight-semibold)',
    color: 'var(--apollo-color-text)',
  },
  dataAttributes: () => ({
    component: 'page-section-title',
  }),
});

const PageSectionDescription = createStyled('p', {
  base: {
    margin: 0,
    color: 'var(--apollo-color-text-muted)',
    maxWidth: '70ch',
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  dataAttributes: () => ({
    component: 'page-section-description',
  }),
});

const PageEyebrow = createStyled('span', {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5ch',
    color: 'var(--apollo-color-accent-strong)',
    fontSize: '0.75rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontWeight: 'var(--apollo-typography-weight-semibold)',
  },
  dataAttributes: () => ({
    component: 'page-eyebrow',
  }),
});

const PageHeading = createStyled('h1', {
  base: {
    margin: 0,
    fontSize: 'clamp(2.25rem, 5vw, 3rem)',
    letterSpacing: '-0.02em',
    fontWeight: 'var(--apollo-typography-weight-semibold)',
    color: 'var(--apollo-color-text)',
  },
  dataAttributes: () => ({
    component: 'page-heading',
  }),
});

const PageLead = createStyled('p', {
  base: {
    margin: 0,
    maxWidth: '70ch',
    fontSize: '1.05rem',
    lineHeight: 1.7,
    color: 'color-mix(in srgb, var(--apollo-color-text-muted) 90%, var(--apollo-color-text) 10%)',
  },
  dataAttributes: () => ({
    component: 'page-lead',
  }),
});

const PageFooter = createStyled('footer', {
  base: {
    paddingBlock: 'clamp(2.5rem, 5vw, 3.5rem)',
    paddingInline: 'clamp(1.5rem, 5vw, 3rem)',
    textAlign: 'center',
    color: 'var(--apollo-color-text-muted)',
    fontSize: '0.9rem',
  },
  dataAttributes: () => ({
    component: 'page-footer',
  }),
});

export const Page = Object.assign(PageRoot, {
  Root: PageRoot,
  Body: PageBody,
  Content: PageContent,
  Section: PageSection,
  SectionHeader: PageSectionHeader,
  SectionTitle: PageSectionTitle,
  SectionDescription: PageSectionDescription,
  Eyebrow: PageEyebrow,
  Heading: PageHeading,
  Lead: PageLead,
  Footer: PageFooter,
});
