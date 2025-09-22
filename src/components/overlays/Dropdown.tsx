import {
  createContext,
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import styled from "styled-components";

import { Portal } from "../internal/Portal";
import { useControllableState } from "../internal/useControllableState";

interface DropdownContextValue {
  readonly open: boolean;
  readonly setOpen: (open: boolean) => void;
  readonly triggerRef: React.MutableRefObject<HTMLElement | null>;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

export interface DropdownProps {
  readonly open?: boolean;
  readonly defaultOpen?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  readonly children: ReactNode;
}

export function Dropdown({ open, defaultOpen = false, onOpenChange, children }: DropdownProps): JSX.Element {
  const triggerRef = useRef<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const value = useMemo<DropdownContextValue>(
    () => ({ open: isOpen, setOpen: setIsOpen, triggerRef }),
    [isOpen, setIsOpen],
  );

  return <DropdownContext.Provider value={value}>{children}</DropdownContext.Provider>;
}

function useDropdownContext(component: string): DropdownContextValue {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error(`${component} must be used within a Dropdown`);
  }
  return context;
}

const ContentContainer = styled.div`
  position: absolute;
  min-width: 12rem;
  background-color: ${({ theme }) => theme.colors.surface.surfaceRaised};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.space[2]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[1]};
  z-index: 1000;
`;

const ItemButton = styled.button`
  border: none;
  background: transparent;
  display: flex;
  width: 100%;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[3]}`};
  font-family: ${({ theme }) => theme.typography.fonts.sans};
  font-size: ${({ theme }) => theme.typography.variants.body.fontSize};
  line-height: ${({ theme }) => theme.typography.variants.body.lineHeight};
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  text-align: left;

  &:hover,
  &:focus-visible {
    outline: none;
    background: ${({ theme }) => theme.colors.action.accent.subtle};
  }

  &[data-danger="true"] {
    color: ${({ theme }) => theme.colors.action.danger.solid};
  }
`;

const Separator = styled.div`
  height: 1px;
  width: 100%;
  background: ${({ theme }) => theme.colors.border.subtle};
  margin: ${({ theme }) => `${theme.space[1]} 0`};
`;

export interface DropdownTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const DropdownTrigger = forwardRef<HTMLButtonElement, DropdownTriggerProps>(function DropdownTrigger(
  { onClick, ...props },
  ref,
) {
  const context = useDropdownContext("DropdownTrigger");
  return (
    <button
      type="button"
      {...props}
      aria-haspopup="menu"
      aria-expanded={context.open}
      data-state={context.open ? "open" : "closed"}
      ref={(node) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
        context.triggerRef.current = node;
      }}
      onClick={(event) => {
        onClick?.(event);
        context.setOpen(!context.open);
      }}
    />
  );
});

DropdownTrigger.displayName = "DropdownTrigger";

export interface DropdownContentProps extends HTMLAttributes<HTMLDivElement> {
  readonly align?: "start" | "end";
}

export const DropdownContent = forwardRef<HTMLDivElement, DropdownContentProps>(function DropdownContent(
  { align = "start", style, onKeyDown, ...props },
  ref,
) {
  const context = useDropdownContext("DropdownContent");
  const contentRef = useRef<HTMLDivElement | null>(null);
  const mergedStyle = { ...style };

  useEffect(() => {
    if (!context.open) {
      return;
    }
    const updatePosition = () => {
      if (!context.triggerRef.current || !contentRef.current || typeof window === "undefined") {
        return;
      }
      const triggerRect = context.triggerRef.current.getBoundingClientRect();
      const { innerHeight, innerWidth, scrollX, scrollY } = window;
      const contentRect = contentRef.current.getBoundingClientRect();
      const top = triggerRect.bottom + scrollY + 6;
      let left = align === "end" ? triggerRect.right - contentRect.width + scrollX : triggerRect.left + scrollX;
      left = Math.max(8, Math.min(left, innerWidth - contentRect.width - 8));
      const clampedTop = Math.max(8, Math.min(top, innerHeight - contentRect.height - 8 + scrollY));
      contentRef.current.style.top = `${clampedTop}px`;
      contentRef.current.style.left = `${left}px`;
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [align, context]);

  useEffect(() => {
    if (!context.open) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        context.setOpen(false);
      }
    };
    const handleClick = (event: MouseEvent) => {
      if (contentRef.current?.contains(event.target as Node) || context.triggerRef.current?.contains(event.target as Node)) {
        return;
      }
      context.setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [context]);

  if (!context.open) {
    return null;
  }

  return (
    <Portal>
      <ContentContainer
        role="menu"
        ref={(node) => {
          contentRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        style={mergedStyle}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        {...props}
      />
    </Portal>
  );
});

DropdownContent.displayName = "DropdownContent";

export interface DropdownItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly inset?: boolean;
  readonly danger?: boolean;
}

export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(function DropdownItem(
  { inset = false, danger = false, onClick, ...props },
  ref,
) {
  const context = useDropdownContext("DropdownItem");
  return (
    <ItemButton
      role="menuitem"
      data-inset={inset ? "true" : undefined}
      data-danger={danger ? "true" : undefined}
      onClick={(event) => {
        onClick?.(event);
        context.setOpen(false);
      }}
      ref={ref}
      style={inset ? { paddingLeft: "2.5rem" } : undefined}
      {...props}
    />
  );
});

DropdownItem.displayName = "DropdownItem";

export interface DropdownSeparatorProps extends HTMLAttributes<HTMLDivElement> {}

export const DropdownSeparator = forwardRef<HTMLDivElement, DropdownSeparatorProps>(function DropdownSeparator(
  props,
  ref,
) {
  return <Separator role="separator" ref={ref} {...props} />;
});

DropdownSeparator.displayName = "DropdownSeparator";
