import * as ToastPrimitive from '@radix-ui/react-toast';
import * as React from 'react';

import { createStyled } from '../styled';

const ToastViewport = createStyled(ToastPrimitive.Viewport, {
  base: {
    position: 'fixed',
    bottom: 'var(--apollo-space-6)',
    right: 'var(--apollo-space-6)',
    display: 'grid',
    gap: 'var(--apollo-space-3)',
    width: 'min(420px, calc(100vw - 2rem))',
    margin: 0,
    padding: 0,
    listStyle: 'none',
    outline: 'none',
    zIndex: 'var(--apollo-z-toast)',
  },
  dataAttributes: () => ({
    component: 'toast-viewport',
  }),
});

const ToastRoot = createStyled(ToastPrimitive.Root, {
  base: {
    '--apollo-toast-bg': 'var(--apollo-color-surface)',
    '--apollo-toast-fg': 'var(--apollo-color-text)',
    '--apollo-toast-border': 'color-mix(in srgb, var(--apollo-color-border) 70%, transparent)',
    '--apollo-toast-indicator': 'var(--apollo-color-accent)',
    position: 'relative',
    display: 'grid',
    gap: 'var(--apollo-space-2)',
    paddingBlock: 'calc(var(--apollo-space-4) - 2px)',
    paddingInlineEnd: 'calc(var(--apollo-space-4) - 2px)',
    paddingInlineStart: 'calc(var(--apollo-space-4) + var(--apollo-space-2))',
    width: 'min(420px, calc(100vw - 2rem))',
    borderRadius: 'var(--apollo-radius-lg)',
    border: '1px solid var(--apollo-toast-border)',
    backgroundColor: 'var(--apollo-toast-bg)',
    color: 'var(--apollo-toast-fg)',
    boxShadow: 'var(--apollo-shadow-medium)',
    pointerEvents: 'auto',
    overflow: 'hidden',
    transform: 'translateY(16px)',
    opacity: 0,
    transition:
      'transform var(--apollo-motion-duration-medium) var(--apollo-motion-easing-entrance), opacity var(--apollo-motion-duration-medium) var(--apollo-motion-easing-entrance)',
    '&::before': {
      content: "''",
      position: 'absolute',
      inset: '0 auto 0 0',
      width: '4px',
      backgroundColor: 'var(--apollo-toast-indicator)',
    },
    '&[data-state="open"]': {
      opacity: 1,
      transform: 'translateY(0)',
    },
    '&[data-state="closed"]': {
      opacity: 0,
      transform: 'translateY(16px)',
    },
    '&[data-swipe="move"]': {
      transform: 'translateX(var(--radix-toast-swipe-move-x))',
    },
    '&[data-swipe="cancel"]': {
      transform: 'translateX(0)',
      transition: 'transform 200ms var(--apollo-motion-easing-standard)',
    },
    '&[data-swipe="end"]': {
      transform: 'translateX(120%)',
    },
  },
  variants: {
    tone: {
      neutral: {},
      success: {
        '--apollo-toast-bg': 'var(--apollo-color-success-soft)',
        '--apollo-toast-fg': 'var(--apollo-color-success-contrast)',
        '--apollo-toast-border': 'color-mix(in srgb, var(--apollo-color-success) 50%, transparent)',
        '--apollo-toast-indicator': 'var(--apollo-color-success)',
      },
      warning: {
        '--apollo-toast-bg': 'var(--apollo-color-warning-soft)',
        '--apollo-toast-fg': 'var(--apollo-color-warning-contrast)',
        '--apollo-toast-border': 'color-mix(in srgb, var(--apollo-color-warning) 50%, transparent)',
        '--apollo-toast-indicator': 'var(--apollo-color-warning)',
      },
      danger: {
        '--apollo-toast-bg': 'var(--apollo-color-danger-soft)',
        '--apollo-toast-fg': 'var(--apollo-color-danger-contrast)',
        '--apollo-toast-border': 'color-mix(in srgb, var(--apollo-color-danger) 50%, transparent)',
        '--apollo-toast-indicator': 'var(--apollo-color-danger)',
      },
    },
  },
  defaultVariants: {
    tone: 'neutral',
  },
  dataAttributes: (variants) => ({
    component: 'toast-root',
    tone: variants.tone,
  }),
});

const ToastTitle = createStyled(ToastPrimitive.Title, {
  base: {
    margin: 0,
    fontSize: 'var(--apollo-typography-size-md)',
    fontWeight: 'var(--apollo-typography-weight-semibold)',
    letterSpacing: 'var(--apollo-typography-letter-spacing-tight)',
  },
});

const ToastDescription = createStyled(ToastPrimitive.Description, {
  base: {
    margin: 0,
    color: 'color-mix(in srgb, var(--apollo-toast-fg) 70%, var(--apollo-toast-bg) 30%)',
    fontSize: 'var(--apollo-typography-size-sm)',
    lineHeight: 'var(--apollo-typography-line-height-normal)',
  },
});

const ToastAction = createStyled(ToastPrimitive.Action, {
  base: {
    justifySelf: 'flex-start',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--apollo-space-2)',
    borderRadius: 'var(--apollo-radius-md)',
    paddingInline: 'calc(var(--apollo-space-3) + 2px)',
    paddingBlock: 'calc(var(--apollo-space-2) + 2px)',
    fontSize: 'var(--apollo-typography-size-sm)',
    fontWeight: 'var(--apollo-typography-weight-medium)',
    color: 'var(--apollo-toast-fg)',
    backgroundColor: 'color-mix(in srgb, var(--apollo-toast-bg) 70%, transparent)',
    border: '1px solid color-mix(in srgb, var(--apollo-toast-fg) 25%, transparent)',
    cursor: 'pointer',
    transition:
      'background-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard)',
    '&:hover': {
      backgroundColor: 'color-mix(in srgb, var(--apollo-toast-fg) 12%, var(--apollo-toast-bg) 88%)',
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: 'var(--apollo-shadow-focus)',
    },
  },
});

const ToastCloseBase = createStyled(ToastPrimitive.Close, {
  base: {
    position: 'absolute',
    top: 'var(--apollo-space-3)',
    right: 'var(--apollo-space-3)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'var(--apollo-space-7)',
    height: 'var(--apollo-space-7)',
    borderRadius: 'var(--apollo-radius-pill)',
    border: '1px solid transparent',
    backgroundColor: 'transparent',
    color: 'color-mix(in srgb, var(--apollo-toast-fg) 65%, var(--apollo-toast-bg) 35%)',
    cursor: 'pointer',
    transition:
      'background-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard)',
    '&:hover': {
      backgroundColor: 'color-mix(in srgb, var(--apollo-toast-bg) 80%, var(--apollo-toast-fg) 20%)',
      color: 'var(--apollo-toast-fg)',
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: 'var(--apollo-shadow-focus)',
    },
  },
  dataAttributes: () => ({
    component: 'toast-close',
  }),
});

const CloseIcon = (): JSX.Element => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
    <path
      d="M2.4 2.4l7.2 7.2m0-7.2l-7.2 7.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ children, ...props }, ref) => (
  <ToastCloseBase {...props} ref={ref}>
    {children ?? <CloseIcon />}
  </ToastCloseBase>
));
ToastClose.displayName = 'ToastClose';

const ToastProvider = ToastPrimitive.Provider;

export const Toast = Object.assign(ToastRoot, {
  Root: ToastRoot,
  Provider: ToastProvider,
  Viewport: ToastViewport,
  Title: ToastTitle,
  Description: ToastDescription,
  Action: ToastAction,
  Close: ToastClose,
});

export {
  ToastAction,
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
};
