import {
  createContext,
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MutableRefObject,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
} from "react";
import styled, { css } from "styled-components";

import { Portal } from "../internal/Portal";
import { useControllableState } from "../internal/useControllableState";
import { hexToRgba } from "../internal/color";

interface DialogContextValue {
  readonly open: boolean;
  readonly setOpen: (open: boolean) => void;
  readonly triggerRef: MutableRefObject<HTMLElement | null>;
}

const DialogContext = createContext<DialogContextValue | null>(null);

interface DialogContentContextValue {
  readonly titleId: string;
  readonly descriptionId: string;
}

const DialogContentContext = createContext<DialogContentContextValue | null>(null);

export interface DialogProps {
  readonly open?: boolean;
  readonly defaultOpen?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  readonly children: ReactNode;
}

export function Dialog({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: DialogProps): JSX.Element {
  const triggerRef = useRef<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const value = useMemo<DialogContextValue>(
    () => ({ open: isOpen, setOpen: setIsOpen, triggerRef }),
    [isOpen, setIsOpen],
  );

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

function useDialogContext(component: string): DialogContextValue {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error(`${component} must be used within a Dialog`);
  }
  return context;
}

export type DialogVariant = "dialog" | "sheet";

const Overlay = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "$variant",
})<{ readonly $variant: DialogVariant }>`
  position: fixed;
  inset: 0;
  background-color: ${({ theme }) => hexToRgba(theme.colors.surface.surfaceContrast, 0.64)};
  display: ${({ $variant }) => ($variant === "sheet" ? "flex" : "grid")};
  justify-content: ${({ $variant }) => ($variant === "sheet" ? "flex-end" : "center")};
  align-items: ${({ $variant }) => ($variant === "sheet" ? "stretch" : "center")};
  padding: ${({ theme }) => theme.space[6]};
  z-index: 1000;
`;

const Content = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "$variant",
})<{ readonly $variant: DialogVariant }>`
  position: relative;
  background-color: ${({ theme }) => theme.colors.surface.surfaceRaised};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  width: min(32rem, 90vw);
  max-height: 90vh;
  overflow-y: auto;
  padding: ${({ theme }) => theme.space[6]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
  ${({ $variant, theme }) =>
    $variant === "sheet"
      ? css`
          width: min(28rem, 100vw);
          max-height: 100vh;
          height: 100vh;
          border-radius: 0;
          border-top-left-radius: ${theme.radii.xl};
          border-bottom-left-radius: ${theme.radii.xl};
        `
      : null}
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
`;

const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[3]};
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.typography.fonts.sans};
  font-size: ${({ theme }) => theme.typography.variants.subtitle.fontSize};
  line-height: ${({ theme }) => theme.typography.variants.subtitle.lineHeight};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  margin: 0;
`;

const Description = styled.p`
  font-family: ${({ theme }) => theme.typography.fonts.sans};
  font-size: ${({ theme }) => theme.typography.variants.body.fontSize};
  line-height: ${({ theme }) => theme.typography.variants.body.lineHeight};
  color: ${({ theme }) => theme.colors.text.muted};
  margin: 0;
`;

export interface DialogTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(function DialogTrigger(
  { onClick, ...props },
  ref,
) {
  const context = useDialogContext("DialogTrigger");
  return (
    <button
      type="button"
      {...props}
      ref={(node) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
        context.triggerRef.current = node;
      }}
      data-state={context.open ? "open" : "closed"}
      aria-expanded={context.open}
      aria-haspopup="dialog"
      onClick={(event) => {
        onClick?.(event);
        context.setOpen(true);
      }}
    />
  );
});

DialogTrigger.displayName = "DialogTrigger";

export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  readonly children: ReactNode;
  readonly modalLabel?: string;
  readonly onDismiss?: () => void;
  readonly variant?: DialogVariant;
}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  { children, modalLabel, onDismiss, onKeyDown, onClick, variant = "dialog", ...props },
  ref,
) {
  const { open, setOpen, triggerRef } = useDialogContext("DialogContent");
  const titleId = useId();
  const descriptionId = useId();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const node = contentRef.current;
    if (node) {
      node.focus({ preventScroll: true });
    }

    return () => {
      onDismiss?.();
      if (triggerRef.current) {
        triggerRef.current.focus({ preventScroll: true });
      } else if (previouslyFocused) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [open, onDismiss, triggerRef]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
      if (event.key === "Tab" && contentRef.current) {
        const focusable = contentRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);

  const contentContext = useMemo<DialogContentContextValue>(
    () => ({ titleId, descriptionId }),
    [titleId, descriptionId],
  );

  if (!open) {
    return null;
  }

  return (
    <Portal>
      <Overlay
        role="presentation"
        ref={overlayRef}
        $variant={variant}
        onClick={(event) => {
          if (event.target === overlayRef.current) {
            setOpen(false);
          }
          onClick?.(event);
        }}
      >
        <Content
          $variant={variant}
          ref={(node) => {
            contentRef.current = node;
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={modalLabel ? undefined : titleId}
          aria-describedby={descriptionId}
          aria-label={modalLabel}
          tabIndex={-1}
          onKeyDown={onKeyDown}
          {...props}
        >
          <DialogContentContext.Provider value={contentContext}>
            {children}
          </DialogContentContext.Provider>
        </Content>
      </Overlay>
    </Portal>
  );
});

DialogContent.displayName = "DialogContent";

export interface DialogHeaderProps extends HTMLAttributes<HTMLElement> {}

export const DialogHeader = forwardRef<HTMLElement, DialogHeaderProps>(function DialogHeader(
  props,
  ref,
) {
  return <Header ref={ref} {...props} />;
});

DialogHeader.displayName = "DialogHeader";

export interface DialogFooterProps extends HTMLAttributes<HTMLElement> {}

export const DialogFooter = forwardRef<HTMLElement, DialogFooterProps>(function DialogFooter(
  props,
  ref,
) {
  return <Footer ref={ref} {...props} />;
});

DialogFooter.displayName = "DialogFooter";

export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(function DialogTitle(
  props,
  ref,
) {
  const context = useContext(DialogContentContext);
  if (!context) {
    throw new Error("DialogTitle must be used within DialogContent");
  }
  return <Title id={context.titleId} ref={ref} {...props} />;
});

DialogTitle.displayName = "DialogTitle";

export interface DialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  function DialogDescription(props, ref) {
    const context = useContext(DialogContentContext);
    if (!context) {
      throw new Error("DialogDescription must be used within DialogContent");
    }
    return <Description id={context.descriptionId} ref={ref} {...props} />;
  },
);

DialogDescription.displayName = "DialogDescription";

export interface DialogCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(function DialogClose(
  { onClick, ...props },
  ref,
) {
  const context = useDialogContext("DialogClose");
  return (
    <button
      type="button"
      {...props}
      ref={ref}
      onClick={(event) => {
        onClick?.(event);
        context.setOpen(false);
      }}
    />
  );
});

DialogClose.displayName = "DialogClose";
