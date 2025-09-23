import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as React from 'react';

import { createStyled } from '../styled';

const CheckboxRoot = createStyled(CheckboxPrimitive.Root, {
  base: {
    all: 'unset',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'calc(var(--apollo-space-5) + var(--apollo-space-1))',
    height: 'calc(var(--apollo-space-5) + var(--apollo-space-1))',
    borderRadius: 'var(--apollo-radius-sm)',
    border: '1px solid var(--apollo-color-border)',
    backgroundColor: 'var(--apollo-color-surface)',
    color: 'var(--apollo-color-text)',
    transition:
      'background-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), border-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), box-shadow var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard)',
    '&[data-state="checked"]': {
      backgroundColor: 'var(--apollo-color-accent)',
      borderColor: 'var(--apollo-color-accent)',
      color: 'var(--apollo-color-accent-contrast)',
      boxShadow: 'var(--apollo-shadow-low)',
    },
    '&[data-state="indeterminate"]': {
      backgroundColor: 'var(--apollo-color-accent)',
      borderColor: 'var(--apollo-color-accent)',
      color: 'var(--apollo-color-accent-contrast)',
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
        borderRadius: 'var(--apollo-radius-md)',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
  dataAttributes: (variants) => variants,
});

const StyledIndicator = createStyled(CheckboxPrimitive.Indicator, {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
    height: '70%',
    color: 'inherit',
  },
});

export const CheckboxIndicator = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Indicator>
>(({ children, ...props }, ref) => {
  const defaultIndicator = (
    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 14 14" focusable="false">
      <polyline
        points="2.5 7.5 5.5 10.5 11.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
  return (
    <StyledIndicator {...props} ref={ref}>
      {children ?? defaultIndicator}
    </StyledIndicator>
  );
});
CheckboxIndicator.displayName = 'CheckboxIndicator';

export const CheckboxLabel = createStyled('span', {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--apollo-space-2)',
    fontFamily: 'var(--apollo-typography-font-family-base)',
    fontSize: 'var(--apollo-typography-size-sm)',
    color: 'var(--apollo-color-text)',
  },
  variants: {
    tone: {
      default: {},
      muted: {
        color: 'var(--apollo-color-text-muted)',
      },
    },
  },
  defaultVariants: {
    tone: 'default',
  },
  dataAttributes: (variants) => variants,
});

export const Checkbox = Object.assign(CheckboxRoot, {
  Indicator: CheckboxIndicator,
  Label: CheckboxLabel,
});
