import { createStyled } from '../styled';
import type { StyleObject } from '../styled';

const controlBase: StyleObject = {
  appearance: 'none',
  width: '100%',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--apollo-space-2)',
  paddingInline: 'var(--apollo-space-3)',
  paddingBlock: 'calc(var(--apollo-space-2) + 2px)',
  borderRadius: 'var(--apollo-radius-md)',
  border: '1px solid var(--apollo-color-border)',
  backgroundColor: 'var(--apollo-color-surface)',
  color: 'var(--apollo-color-text)',
  fontFamily: 'var(--apollo-typography-font-family-base)',
  fontSize: 'var(--apollo-typography-size-md)',
  lineHeight: 'var(--apollo-typography-line-height-snug)',
  letterSpacing: 'var(--apollo-typography-letter-spacing-normal)',
  boxShadow: 'var(--apollo-shadow-low)',
  transition:
    'box-shadow var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), border-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), transform var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard)',
  '&::placeholder': {
    color: 'var(--apollo-color-text-muted)',
  },
  '&:focus-visible': {
    outline: 'none',
    borderColor: 'var(--apollo-color-accent)',
    boxShadow: 'var(--apollo-shadow-focus)',
  },
  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.6,
    boxShadow: 'none',
  },
  '&:active:not(:disabled)': {
    transform: 'scale(var(--apollo-motion-press-scale))',
  },
};

const sizeVariants: Record<string, StyleObject> = {
  sm: {
    fontSize: 'var(--apollo-typography-size-sm)',
    paddingBlock: 'var(--apollo-space-2)',
    paddingInline: 'var(--apollo-space-2)',
  },
  md: {},
  lg: {
    fontSize: 'var(--apollo-typography-size-lg)',
    paddingBlock: 'calc(var(--apollo-space-3) + 2px)',
    paddingInline: 'var(--apollo-space-4)',
  },
};

const toneVariants: Record<string, StyleObject> = {
  default: {},
  surface: {
    backgroundColor: 'var(--apollo-color-bg-subtle)',
  },
  accent: {
    borderColor: 'var(--apollo-color-accent)',
    backgroundColor: 'var(--apollo-color-accent-subtle)',
    color: 'var(--apollo-color-accent-contrast)',
    '&::placeholder': {
      color: 'color-mix(in srgb, var(--apollo-color-accent-contrast) 60%, transparent)',
    },
  },
};

const validationVariants: Record<string, StyleObject> = {
  invalid: {
    borderColor: 'var(--apollo-color-danger)',
    boxShadow: '0 0 0 1px var(--apollo-color-danger-soft)',
    '&:focus-visible': {
      boxShadow: '0 0 0 3px var(--apollo-color-danger-soft)',
    },
  },
  success: {
    borderColor: 'var(--apollo-color-success)',
    boxShadow: '0 0 0 1px color-mix(in srgb, var(--apollo-color-success) 35%, transparent)',
    '&:focus-visible': {
      boxShadow: '0 0 0 3px color-mix(in srgb, var(--apollo-color-success) 25%, transparent)',
    },
  },
};

export const Input = createStyled('input', {
  base: controlBase,
  variants: {
    size: sizeVariants,
    tone: toneVariants,
    validation: validationVariants,
  },
  defaultVariants: {
    size: 'md',
    tone: 'default',
  },
  dataAttributes: (variants) => variants,
});

export const Textarea = createStyled('textarea', {
  base: {
    ...controlBase,
    display: 'block',
    minHeight: 'calc(var(--apollo-space-10) + var(--apollo-space-4))',
    paddingBlock: 'calc(var(--apollo-space-3) + 2px)',
    resize: 'vertical',
    lineHeight: 'var(--apollo-typography-line-height-normal)',
  },
  variants: {
    size: {
      sm: {
        fontSize: 'var(--apollo-typography-size-sm)',
        minHeight: 'calc(var(--apollo-space-9) + var(--apollo-space-3))',
      },
      md: {},
      lg: {
        fontSize: 'var(--apollo-typography-size-lg)',
        minHeight: 'calc(var(--apollo-space-10) * 2)',
      },
    },
    tone: toneVariants,
    validation: validationVariants,
  },
  defaultVariants: {
    size: 'md',
    tone: 'default',
  },
  dataAttributes: (variants) => variants,
});
