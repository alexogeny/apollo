import * as SwitchPrimitive from '@radix-ui/react-switch';

import { createStyled } from '../styled';

const SwitchRoot = createStyled(SwitchPrimitive.Root, {
  base: {
    all: 'unset',
    display: 'inline-flex',
    alignItems: 'center',
    width: 'calc(var(--apollo-space-7) + var(--apollo-space-3))',
    height: 'calc(var(--apollo-space-4) + var(--apollo-space-1))',
    padding: 'var(--apollo-space-1)',
    borderRadius: 'var(--apollo-radius-pill)',
    backgroundColor: 'var(--apollo-color-border)',
    border: '1px solid transparent',
    cursor: 'pointer',
    transition:
      'background-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), box-shadow var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard)',
    '--apollo-switch-translate': 'calc(var(--apollo-space-6) - var(--apollo-space-3))',
    '&[data-state="checked"]': {
      backgroundColor: 'var(--apollo-color-accent-subtle)',
      borderColor: 'color-mix(in srgb, var(--apollo-color-accent) 40%, transparent)',
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: 'var(--apollo-shadow-focus)',
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
  variants: {
    tone: {
      accent: {
        backgroundColor: 'color-mix(in srgb, var(--apollo-color-accent) 18%, transparent)',
        '&[data-state="checked"]': {
          backgroundColor: 'var(--apollo-color-accent)',
        },
      },
      surface: {
        backgroundColor: 'var(--apollo-color-bg-subtle)',
      },
      neutral: {},
    },
  },
  defaultVariants: {
    tone: 'neutral',
  },
  dataAttributes: (variants) => variants,
});

const SwitchThumb = createStyled(SwitchPrimitive.Thumb, {
  base: {
    display: 'block',
    width: 'calc(var(--apollo-space-4) + var(--apollo-space-1))',
    height: 'calc(var(--apollo-space-4) + var(--apollo-space-1))',
    borderRadius: 'var(--apollo-radius-pill)',
    backgroundColor: 'var(--apollo-color-surface)',
    boxShadow: 'var(--apollo-shadow-low)',
    transition:
      'transform var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), background-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard)',
    transform: 'translateX(0)',
    '[data-state="checked"] &': {
      transform: 'translateX(var(--apollo-switch-translate))',
      backgroundColor: 'var(--apollo-color-accent)',
      color: 'var(--apollo-color-accent-contrast)',
    },
  },
});

export const Switch = Object.assign(SwitchRoot, {
  Thumb: SwitchThumb,
});
