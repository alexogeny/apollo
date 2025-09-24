import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';

import { createStyled } from '../styled';

const DialogOverlay = createStyled(DialogPrimitive.Overlay, {
  base: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'var(--apollo-color-backdrop)',
    backdropFilter: 'blur(12px)',
    zIndex: 'var(--apollo-z-overlay)',
    transition: 'opacity var(--apollo-motion-duration-medium) var(--apollo-motion-easing-standard)',
    '&[data-state="closed"]': {
      opacity: 0,
      pointerEvents: 'none',
    },
  },
  dataAttributes: () => ({
    component: 'dialog-overlay',
  }),
});

const DialogContent = createStyled(DialogPrimitive.Content, {
  base: {
    position: 'fixed',
    inset: '50% auto auto 50%',
    transform: 'translate(-50%, -50%)',
    width: 'min(560px, calc(100vw - 2rem))',
    maxHeight: 'calc(100vh - 4rem)',
    overflowY: 'auto',
    backgroundColor: 'var(--apollo-color-surface)',
    color: 'var(--apollo-color-text)',
    borderRadius: 'var(--apollo-radius-xl)',
    border: '1px solid color-mix(in srgb, var(--apollo-color-border) 65%, transparent)',
    boxShadow: 'var(--apollo-shadow-high)',
    padding: 'clamp(var(--apollo-space-4), 4vw, var(--apollo-space-6))',
    display: 'grid',
    gap: 'var(--apollo-space-4)',
    zIndex: 'var(--apollo-z-modal)',
    outline: 'none',
    transition:
      'opacity var(--apollo-motion-duration-medium) var(--apollo-motion-easing-entrance), transform var(--apollo-motion-duration-medium) var(--apollo-motion-easing-entrance)',
    '&[data-state="open"]': {
      opacity: 1,
      transform: 'translate(-50%, -50%) scale(1)',
    },
    '&[data-state="closed"]': {
      opacity: 0,
      transform: 'translate(-50%, -40%) scale(0.96)',
      pointerEvents: 'none',
    },
    '&:focus-visible': {
      boxShadow: 'var(--apollo-shadow-focus)',
    },
    '@media (max-width: 480px)': {
      width: 'calc(100vw - 1.5rem)',
      padding: 'var(--apollo-space-4)',
    },
  },
  variants: {
    size: {
      sm: {
        width: 'min(380px, calc(100vw - 2rem))',
      },
      md: {},
      lg: {
        width: 'min(640px, calc(100vw - 2rem))',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
  dataAttributes: (variants) => ({
    component: 'dialog-content',
    dialogSize: variants.size,
  }),
});

const DialogTitle = createStyled(DialogPrimitive.Title, {
  base: {
    fontSize: 'var(--apollo-typography-size-xl)',
    fontWeight: 'var(--apollo-typography-weight-semibold)',
    letterSpacing: 'var(--apollo-typography-letter-spacing-tight)',
    margin: 0,
    color: 'var(--apollo-color-text)',
  },
});

const DialogDescription = createStyled(DialogPrimitive.Description, {
  base: {
    margin: 0,
    color: 'var(--apollo-color-text-muted)',
    fontSize: 'var(--apollo-typography-size-md)',
    lineHeight: 'var(--apollo-typography-line-height-normal)',
  },
});

const DialogHeader = createStyled('header', {
  base: {
    display: 'grid',
    gap: 'var(--apollo-space-2)',
    paddingRight: 'var(--apollo-space-9)',
  },
});

const DialogBody = createStyled('div', {
  base: {
    display: 'grid',
    gap: 'var(--apollo-space-4)',
    color: 'var(--apollo-color-text)',
    fontSize: 'var(--apollo-typography-size-md)',
    lineHeight: 'var(--apollo-typography-line-height-normal)',
  },
});

const DialogFooter = createStyled('footer', {
  base: {
    display: 'flex',
    gap: 'var(--apollo-space-3)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

const DialogCloseBase = createStyled(DialogPrimitive.Close, {
  base: {
    position: 'absolute',
    top: 'var(--apollo-space-3)',
    right: 'var(--apollo-space-3)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'var(--apollo-space-8)',
    height: 'var(--apollo-space-8)',
    borderRadius: 'var(--apollo-radius-pill)',
    border: '1px solid transparent',
    backgroundColor: 'transparent',
    color: 'var(--apollo-color-text-muted)',
    cursor: 'pointer',
    transition:
      'background-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard)',
    '&:hover': {
      backgroundColor: 'var(--apollo-color-bg-subtle)',
      color: 'var(--apollo-color-text)',
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: 'var(--apollo-shadow-focus)',
    },
  },
  dataAttributes: () => ({
    component: 'dialog-close',
  }),
});

const CloseIcon = (): JSX.Element => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
    <path
      d="M3.1 3.1l7.8 7.8m0-7.8l-7.8 7.8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const DialogClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ children, ...props }, ref) => (
  <DialogCloseBase {...props} ref={ref}>
    {children ?? <CloseIcon />}
  </DialogCloseBase>
));
DialogClose.displayName = 'DialogClose';

const DialogRoot = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;

export const Dialog = Object.assign(DialogRoot, {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
});

export {
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
};
