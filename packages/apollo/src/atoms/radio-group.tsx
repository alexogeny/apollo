import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

import { createStyled } from '../styled';

const RadioGroupRoot = createStyled(RadioGroupPrimitive.Root, {
  base: {
    display: 'grid',
    gap: 'var(--apollo-space-2)',
  },
});

const RadioGroupItem = createStyled(RadioGroupPrimitive.Item, {
  base: {
    all: 'unset',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'calc(var(--apollo-space-5) + var(--apollo-space-1))',
    height: 'calc(var(--apollo-space-5) + var(--apollo-space-1))',
    borderRadius: 'var(--apollo-radius-pill)',
    border: '1px solid var(--apollo-color-border)',
    backgroundColor: 'var(--apollo-color-surface)',
    color: 'var(--apollo-color-accent)',
    transition:
      'box-shadow var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), border-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard)',
    '&[data-state="checked"]': {
      borderColor: 'var(--apollo-color-accent)',
      boxShadow: 'inset 0 0 0 6px var(--apollo-color-accent-subtle)',
      backgroundColor: 'var(--apollo-color-accent-subtle)',
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: 'var(--apollo-shadow-focus)',
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.55,
    },
  },
  variants: {
    size: {
      sm: {
        width: 'var(--apollo-space-5)',
        height: 'var(--apollo-space-5)',
      },
      md: {},
      lg: {
        width: 'var(--apollo-space-6)',
        height: 'var(--apollo-space-6)',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
  dataAttributes: (variants) => variants,
});

const RadioGroupIndicator = createStyled(RadioGroupPrimitive.Indicator, {
  base: {
    width: '55%',
    height: '55%',
    borderRadius: 'var(--apollo-radius-pill)',
    backgroundColor: 'currentColor',
    transition: 'transform var(--apollo-motion-duration-fast) var(--apollo-motion-easing-entrance)',
    transform: 'scale(1)',
  },
});

export const RadioGroupLabel = createStyled('span', {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--apollo-space-2)',
    fontFamily: 'var(--apollo-typography-font-family-base)',
    fontSize: 'var(--apollo-typography-size-sm)',
    color: 'var(--apollo-color-text)',
  },
});

export const RadioGroup = Object.assign(RadioGroupRoot, {
  Item: RadioGroupItem,
  Indicator: RadioGroupIndicator,
  Label: RadioGroupLabel,
});
