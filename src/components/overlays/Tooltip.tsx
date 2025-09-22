import {
  cloneElement,
  createContext,
  forwardRef,
  type FocusEvent as ReactFocusEvent,
  type HTMLAttributes,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
} from "react";
import styled from "styled-components";

import { Portal } from "../internal/Portal";
import { useControllableState } from "../internal/useControllableState";

export type TooltipSide = "top" | "bottom" | "left" | "right";

interface TooltipContextValue {
  readonly open: boolean;
  readonly setOpen: (open: boolean) => void;
  readonly triggerRef: MutableRefObject<HTMLElement | null>;
  readonly contentId: string;
  readonly side: TooltipSide;
  readonly delay: number;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

export interface TooltipProps {
  readonly children: ReactNode;
  readonly side?: TooltipSide;
  readonly delayDuration?: number;
  readonly open?: boolean;
  readonly defaultOpen?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
}

export function Tooltip({
  children,
  side = "top",
  delayDuration = 200,
  open,
  defaultOpen = false,
  onOpenChange,
}: TooltipProps): JSX.Element {
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentId = useId();
  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const value = useMemo<TooltipContextValue>(
    () => ({ open: isOpen, setOpen: setIsOpen, triggerRef, contentId, side, delay: delayDuration }),
    [contentId, delayDuration, isOpen, setIsOpen, side],
  );

  return <TooltipContext.Provider value={value}>{children}</TooltipContext.Provider>;
}

function useTooltipContext(component: string): TooltipContextValue {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error(`${component} must be used within a Tooltip`);
  }
  return context;
}

const TooltipBubble = styled.div`
  position: absolute;
  padding: ${({ theme }) => `${theme.space[1]} ${theme.space[2]}`};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface.surfaceContrast};
  color: ${({ theme }) => theme.colors.text.contrast};
  font-family: ${({ theme }) => theme.typography.fonts.sans};
  font-size: ${({ theme }) => theme.typography.variants.detail.fontSize};
  line-height: ${({ theme }) => theme.typography.variants.detail.lineHeight};
  box-shadow: ${({ theme }) => theme.shadows.md};
  pointer-events: none;
  z-index: 1100;
  max-width: 18rem;
`;

const TooltipArrow = styled.span`
  position: absolute;
  width: 0.5rem;
  height: 0.5rem;
  transform: rotate(45deg);
  background: ${({ theme }) => theme.colors.surface.surfaceContrast};
`;

export interface TooltipTriggerProps {
  readonly children: ReactElement;
}

export const TooltipTrigger = forwardRef<HTMLElement, TooltipTriggerProps>(function TooltipTrigger(
  { children },
  ref,
) {
  const context = useTooltipContext("TooltipTrigger");
  const showTimer = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);
  const childProps = children.props ?? {};

  const clearTimers = () => {
    if (showTimer.current != null && typeof window !== "undefined") {
      window.clearTimeout(showTimer.current);
    }
    if (hideTimer.current != null && typeof window !== "undefined") {
      window.clearTimeout(hideTimer.current);
    }
    showTimer.current = null;
    hideTimer.current = null;
  };

  const handleFocus = (event: ReactFocusEvent<HTMLElement>) => {
    childProps.onFocus?.(event);
    clearTimers();
    context.setOpen(true);
  };

  const handleBlur = (event: ReactFocusEvent<HTMLElement>) => {
    childProps.onBlur?.(event);
    clearTimers();
    context.setOpen(false);
  };

  const handlePointerEnter = (event: ReactPointerEvent<HTMLElement>) => {
    childProps.onPointerEnter?.(event);
    clearTimers();
    if (typeof window !== "undefined") {
      showTimer.current = window.setTimeout(() => {
        context.setOpen(true);
      }, context.delay);
    } else {
      context.setOpen(true);
    }
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLElement>) => {
    childProps.onPointerLeave?.(event);
    clearTimers();
    if (typeof window !== "undefined") {
      hideTimer.current = window.setTimeout(() => {
        context.setOpen(false);
      }, context.delay);
    } else {
      context.setOpen(false);
    }
  };

  return cloneElement(children, {
    ...childProps,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onPointerEnter: handlePointerEnter,
    onPointerLeave: handlePointerLeave,
    ref: (node: HTMLElement | null) => {
      if (typeof childProps.ref === "function") {
        childProps.ref(node);
      } else if (childProps.ref) {
        (childProps.ref as MutableRefObject<HTMLElement | null>).current = node;
      }
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as MutableRefObject<HTMLElement | null>).current = node;
      }
      context.triggerRef.current = node;
    },
    "aria-describedby": context.open ? context.contentId : undefined,
  });
});

TooltipTrigger.displayName = "TooltipTrigger";

export interface TooltipContentProps extends HTMLAttributes<HTMLDivElement> {}

export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(function TooltipContent(
  { style, children, ...props },
  ref,
) {
  const context = useTooltipContext("TooltipContent");
  const bubbleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!context.open || typeof window === "undefined") {
      return;
    }
    const updatePosition = () => {
      const trigger = context.triggerRef.current;
      const bubble = bubbleRef.current;
      if (!trigger || !bubble) {
        return;
      }
      const triggerRect = trigger.getBoundingClientRect();
      const bubbleRect = bubble.getBoundingClientRect();
      const offset = 8;
      let top = triggerRect.top + window.scrollY;
      let left = triggerRect.left + window.scrollX;
      switch (context.side) {
        case "bottom":
          top = triggerRect.bottom + offset + window.scrollY;
          left = triggerRect.left + triggerRect.width / 2 - bubbleRect.width / 2 + window.scrollX;
          break;
        case "left":
          top = triggerRect.top + triggerRect.height / 2 - bubbleRect.height / 2 + window.scrollY;
          left = triggerRect.left - bubbleRect.width - offset + window.scrollX;
          break;
        case "right":
          top = triggerRect.top + triggerRect.height / 2 - bubbleRect.height / 2 + window.scrollY;
          left = triggerRect.right + offset + window.scrollX;
          break;
        case "top":
        default:
          top = triggerRect.top - bubbleRect.height - offset + window.scrollY;
          left = triggerRect.left + triggerRect.width / 2 - bubbleRect.width / 2 + window.scrollX;
          break;
      }
      bubble.style.top = `${Math.max(top, 4)}px`;
      bubble.style.left = `${Math.max(left, 4)}px`;
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [context]);

  if (!context.open) {
    return null;
  }

  return (
    <Portal>
      <TooltipBubble
        id={context.contentId}
        role="tooltip"
        ref={(node) => {
          bubbleRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            (ref as MutableRefObject<HTMLDivElement | null>).current = node;
          }
        }}
        style={style}
        {...props}
      >
        {children}
        <TooltipArrow
          style={{
            top: context.side === "bottom" ? -4 : context.side === "top" ? "calc(100% - 4px)" : "50%",
            bottom: context.side === "top" ? -4 : undefined,
            left:
              context.side === "top" || context.side === "bottom"
                ? "50%"
                : context.side === "left"
                  ? "calc(100% - 4px)"
                  : -4,
            right: context.side === "right" ? -4 : undefined,
            transform:
              context.side === "left" || context.side === "right"
                ? "translateY(-50%) rotate(45deg)"
                : "translateX(-50%) rotate(45deg)",
          }}
        />
      </TooltipBubble>
    </Portal>
  );
});

TooltipContent.displayName = "TooltipContent";
