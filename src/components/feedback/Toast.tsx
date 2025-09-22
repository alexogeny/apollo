import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import styled from "styled-components";

import type { ActionTone } from "../../theme/tokens";
import { Portal } from "../internal/Portal";
import { Button } from "../primitives/Button";

export type ToastPlacement = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface ToastAction {
  readonly label: string;
  readonly onSelect?: () => void;
}

export interface ToastOptions {
  readonly id?: string;
  readonly title: string;
  readonly description?: string;
  readonly tone?: ActionTone;
  readonly duration?: number;
  readonly action?: ToastAction;
  readonly dismissible?: boolean;
}

interface ToastRecord extends ToastOptions {
  readonly id: string;
  readonly createdAt: number;
  readonly tone: ActionTone;
  readonly dismissible: boolean;
}

interface ToastContextValue {
  readonly toasts: readonly ToastRecord[];
  readonly publish: (toast: ToastOptions) => string;
  readonly dismiss: (id: string) => void;
  readonly clearAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ToastViewport = styled.div.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith("$"),
})<{ readonly $placement: ToastPlacement }>`
  position: fixed;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[4]};
  pointer-events: none;
  ${({ $placement }) => {
    switch ($placement) {
      case "top-left":
        return "top: 0; left: 0; align-items: flex-start;";
      case "top-right":
        return "top: 0; right: 0; align-items: flex-end;";
      case "bottom-left":
        return "bottom: 0; left: 0; align-items: flex-start;";
      case "bottom-right":
      default:
        return "bottom: 0; right: 0; align-items: flex-end;";
    }
  }}
`;

const ToastCard = styled.div.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith("$"),
})<{ readonly $tone: ActionTone }>`
  min-width: 18rem;
  max-width: 24rem;
  background-color: ${({ theme }) => theme.colors.surface.surfaceRaised};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  pointer-events: auto;
  padding: ${({ theme }) => theme.space[4]};
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  color: ${({ theme }) => theme.colors.text.primary};

  &[data-tone="accent"] {
    border-color: ${({ theme }) => theme.colors.action.accent.outline};
  }

  &[data-tone="success"] {
    border-color: ${({ theme }) => theme.colors.action.success.outline};
  }

  &[data-tone="danger"] {
    border-color: ${({ theme }) => theme.colors.action.danger.outline};
  }
`;

const ToastTitle = styled.div`
  font-family: ${({ theme }) => theme.typography.fonts.sans};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  font-size: ${({ theme }) => theme.typography.variants.subtitle.fontSize};
  line-height: ${({ theme }) => theme.typography.variants.subtitle.lineHeight};
`;

const ToastDescription = styled.div`
  font-family: ${({ theme }) => theme.typography.fonts.sans};
  font-size: ${({ theme }) => theme.typography.variants.body.fontSize};
  line-height: ${({ theme }) => theme.typography.variants.body.lineHeight};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const ToastActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[2]};
`;

export interface ToastProviderProps {
  readonly children: ReactNode;
  readonly placement?: ToastPlacement;
  readonly duration?: number;
}

export function ToastProvider({
  children,
  placement = "bottom-right",
  duration = 6000,
}: ToastProviderProps): JSX.Element {
  const [toasts, setToasts] = useState<readonly ToastRecord[]>([]);
  const timers = useRef(new Map<string, number>());
  const isBrowser = typeof window !== "undefined";

  const dismiss = (id: string) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id));
    const handle = timers.current.get(id);
    if (handle !== undefined) {
      if (isBrowser) {
        window.clearTimeout(handle);
      }
      timers.current.delete(id);
    }
  };

  const scheduleDismiss = (id: string, toastDuration: number) => {
    if (toastDuration === Infinity) {
      return;
    }
    if (!isBrowser) {
      return;
    }
    const handle = window.setTimeout(() => {
      dismiss(id);
    }, toastDuration);
    timers.current.set(id, handle);
  };

  const publish = (toast: ToastOptions) => {
    const id = toast.id ?? `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const record: ToastRecord = {
      ...toast,
      id,
      createdAt: Date.now(),
      tone: toast.tone ?? "accent",
      dismissible: toast.dismissible ?? true,
    };
    setToasts((previous) => [...previous, record]);
    scheduleDismiss(id, toast.duration ?? duration);
    return id;
  };

  const clearAll = () => {
    setToasts([]);
    if (isBrowser) {
      timers.current.forEach((handle) => window.clearTimeout(handle));
    }
    timers.current.clear();
  };

  useEffect(() => () => {
    if (isBrowser) {
      timers.current.forEach((handle) => window.clearTimeout(handle));
    }
    timers.current.clear();
  }, [isBrowser]);

  const value = useMemo<ToastContextValue>(
    () => ({ toasts, publish, dismiss, clearAll }),
    [toasts],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Portal>
        <ToastViewport role="region" aria-live="polite" $placement={placement}>
          {toasts.map((toast) => (
            <ToastCard key={toast.id} data-tone={toast.tone} $tone={toast.tone}>
              <ToastTitle>{toast.title}</ToastTitle>
              {toast.description ? <ToastDescription>{toast.description}</ToastDescription> : null}
              {(toast.action || toast.dismissible) && (
                <ToastActions>
                  {toast.action ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      tone={toast.tone}
                      onClick={() => {
                        toast.action?.onSelect?.();
                        dismiss(toast.id);
                      }}
                    >
                      {toast.action.label}
                    </Button>
                  ) : null}
                  {toast.dismissible ? (
                    <Button size="sm" variant="ghost" tone="neutral" onClick={() => dismiss(toast.id)}>
                      Close
                    </Button>
                  ) : null}
                </ToastActions>
              )}
            </ToastCard>
          ))}
        </ToastViewport>
      </Portal>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
