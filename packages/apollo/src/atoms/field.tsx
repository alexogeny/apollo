import { createStyled } from '../styled';

export const Field = createStyled('div', {
  base: {
    display: 'grid',
    gap: 'var(--apollo-space-2)',
    width: '100%',
  },
});

export const FieldLabel = createStyled('label', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--apollo-space-2)',
    fontFamily: 'var(--apollo-typography-font-family-base)',
    fontSize: 'var(--apollo-typography-size-sm)',
    fontWeight: 'var(--apollo-typography-weight-semibold)',
    color: 'var(--apollo-color-text)',
  },
  variants: {
    tone: {
      default: {},
      subtle: {
        color: 'var(--apollo-color-text-muted)',
        fontWeight: 'var(--apollo-typography-weight-medium)',
      },
      accent: {
        color: 'var(--apollo-color-accent)',
      },
    },
  },
  defaultVariants: {
    tone: 'default',
  },
  dataAttributes: (variants) => variants,
});

export const FieldHint = createStyled('p', {
  base: {
    margin: 0,
    color: 'var(--apollo-color-text-muted)',
    fontFamily: 'var(--apollo-typography-font-family-base)',
    fontSize: 'var(--apollo-typography-size-sm)',
    lineHeight: 'var(--apollo-typography-line-height-snug)',
  },
});

export const FieldError = createStyled('p', {
  base: {
    margin: 0,
    color: 'var(--apollo-color-danger)',
    fontFamily: 'var(--apollo-typography-font-family-base)',
    fontSize: 'var(--apollo-typography-size-sm)',
    lineHeight: 'var(--apollo-typography-line-height-snug)',
  },
});

export const FieldControl = createStyled('div', {
  base: {
    display: 'flex',
    alignItems: 'stretch',
    width: '100%',
    borderRadius: 'var(--apollo-radius-lg)',
    backgroundColor: 'var(--apollo-color-surface)',
    boxShadow: 'var(--apollo-shadow-low)',
  },
});
