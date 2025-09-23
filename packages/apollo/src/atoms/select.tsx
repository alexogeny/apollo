import * as SelectPrimitive from '@radix-ui/react-select';
import * as React from 'react';

import { createStyled } from '../styled';

const SelectTrigger = createStyled(SelectPrimitive.Trigger, {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--apollo-space-2)',
    minWidth: '10rem',
    paddingInline: 'var(--apollo-space-3)',
    paddingBlock: 'calc(var(--apollo-space-2) + 2px)',
    borderRadius: 'var(--apollo-radius-md)',
    border: '1px solid var(--apollo-color-border)',
    backgroundColor: 'var(--apollo-color-surface)',
    color: 'var(--apollo-color-text)',
    fontFamily: 'var(--apollo-typography-font-family-base)',
    fontSize: 'var(--apollo-typography-size-md)',
    lineHeight: 'var(--apollo-typography-line-height-snug)',
    boxShadow: 'var(--apollo-shadow-low)',
    transition:
      'border-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), box-shadow var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard)',
    '&[data-placeholder]': {
      color: 'var(--apollo-color-text-muted)',
    },
    '&[data-state="open"]': {
      borderColor: 'var(--apollo-color-accent)',
      boxShadow: 'var(--apollo-shadow-focus)',
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: 'var(--apollo-shadow-focus)',
      borderColor: 'var(--apollo-color-accent)',
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
  },
  variants: {
    size: {
      sm: {
        fontSize: 'var(--apollo-typography-size-sm)',
        paddingBlock: 'var(--apollo-space-2)',
      },
      md: {},
      lg: {
        fontSize: 'var(--apollo-typography-size-lg)',
        paddingBlock: 'calc(var(--apollo-space-3) + 2px)',
      },
    },
    tone: {
      neutral: {},
      surface: {
        backgroundColor: 'var(--apollo-color-bg-subtle)',
      },
      accent: {
        borderColor: 'var(--apollo-color-accent)',
        backgroundColor: 'var(--apollo-color-accent-subtle)',
        color: 'var(--apollo-color-accent-contrast)',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    tone: 'neutral',
  },
  dataAttributes: (variants) => variants,
});

const SelectIcon = createStyled(SelectPrimitive.Icon, {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    color: 'var(--apollo-color-text-muted)',
  },
});

const SelectContent = createStyled(SelectPrimitive.Content, {
  base: {
    overflow: 'hidden',
    backgroundColor: 'var(--apollo-color-surface)',
    borderRadius: 'var(--apollo-radius-lg)',
    border: '1px solid color-mix(in srgb, var(--apollo-color-border) 60%, transparent)',
    boxShadow: 'var(--apollo-shadow-high)',
    minWidth: 'var(--radix-select-trigger-width, 10rem)',
    zIndex: 'var(--apollo-z-popover)',
  },
});

const SelectViewport = createStyled(SelectPrimitive.Viewport, {
  base: {
    paddingBlock: 'var(--apollo-space-2)',
    paddingInline: 'var(--apollo-space-1)',
    display: 'grid',
    gap: 'var(--apollo-space-1)',
  },
});

const SelectItem = createStyled(SelectPrimitive.Item, {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--apollo-space-3)',
    paddingInline: 'var(--apollo-space-3)',
    paddingBlock: 'var(--apollo-space-2)',
    borderRadius: 'var(--apollo-radius-sm)',
    cursor: 'pointer',
    color: 'var(--apollo-color-text)',
    fontFamily: 'var(--apollo-typography-font-family-base)',
    fontSize: 'var(--apollo-typography-size-sm)',
    transition:
      'background-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard)',
    '&[data-highlighted]': {
      outline: 'none',
      backgroundColor: 'var(--apollo-color-accent-subtle)',
      color: 'var(--apollo-color-accent-contrast)',
    },
    '&[data-state="checked"]': {
      color: 'var(--apollo-color-accent)',
    },
    '&[data-disabled]': {
      opacity: 0.45,
      pointerEvents: 'none',
    },
  },
});

const StyledIndicator = createStyled(SelectPrimitive.ItemIndicator, {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'currentColor',
  },
});

export const SelectItemIndicator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ItemIndicator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ItemIndicator>
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
SelectItemIndicator.displayName = 'SelectItemIndicator';

export const SelectLabel = createStyled(SelectPrimitive.Label, {
  base: {
    paddingInline: 'var(--apollo-space-3)',
    paddingBlock: 'var(--apollo-space-1)',
    fontSize: 'var(--apollo-typography-size-xs)',
    fontWeight: 'var(--apollo-typography-weight-semibold)',
    color: 'var(--apollo-color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
});

export const SelectSeparator = createStyled(SelectPrimitive.Separator, {
  base: {
    height: '1px',
    backgroundColor: 'color-mix(in srgb, var(--apollo-color-border) 70%, transparent)',
    margin: 'var(--apollo-space-1) var(--apollo-space-3)',
  },
});

const ScrollButtonBase = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 'var(--apollo-space-6)',
  color: 'var(--apollo-color-text-muted)',
};

export const SelectScrollUpButton = createStyled(SelectPrimitive.ScrollUpButton, {
  base: ScrollButtonBase,
});

export const SelectScrollDownButton = createStyled(SelectPrimitive.ScrollDownButton, {
  base: ScrollButtonBase,
});

export const SelectItemText = createStyled(SelectPrimitive.ItemText, {
  base: {
    flex: 1,
  },
});

export const Select = Object.assign(SelectPrimitive.Root, {
  Trigger: SelectTrigger,
  Value: SelectPrimitive.Value,
  Icon: SelectIcon,
  Portal: SelectPrimitive.Portal,
  Content: SelectContent,
  Viewport: SelectViewport,
  Item: SelectItem,
  ItemText: SelectItemText,
  ItemIndicator: SelectItemIndicator,
  Label: SelectLabel,
  Separator: SelectSeparator,
  ScrollUpButton: SelectScrollUpButton,
  ScrollDownButton: SelectScrollDownButton,
});
