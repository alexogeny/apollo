import {
  cloneElement,
  createContext,
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

import { Portal } from "../internal/Portal";

interface ContextMenuPosition {
  readonly x: number;
  readonly y: number;
}

interface ContextMenuContextValue {
  readonly open: boolean;
  readonly setOpen: (open: boolean) => void;
  readonly triggerRef: MutableRefObject<HTMLElement | null>;
  readonly position: ContextMenuPosition | null;
  readonly setPosition: (position: ContextMenuPosition | null) => void;
}

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

export interface ContextMenuProps {
  readonly children: ReactNode;
}

export function ContextMenu({ children }: ContextMenuProps): JSX.Element {
  const triggerRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<ContextMenuPosition | null>(null);

  const value = useMemo<ContextMenuContextValue>(
    () => ({ open, setOpen, triggerRef, position, setPosition }),
    [open, position],
  );

  return <ContextMenuContext.Provider value={value}>{children}</ContextMenuContext.Provider>;
}

function useContextMenu(component: string): ContextMenuContextValue {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error(`${component} must be used within a ContextMenu`);
  }
  return context;
}

export interface ContextMenuTriggerProps {
  readonly children: ReactElement;
}

export const ContextMenuTrigger = forwardRef<HTMLElement, ContextMenuTriggerProps>(
  function ContextMenuTrigger({ children }, ref) {
    const context = useContextMenu("ContextMenuTrigger");
    const childProps = children.props ?? {};

    return cloneElement(children, {
      ...childProps,
      onContextMenu: (event: ReactMouseEvent<HTMLElement>) => {
        childProps.onContextMenu?.(event);
        event.preventDefault();
        context.setPosition({ x: event.clientX, y: event.clientY });
        context.setOpen(true);
      },
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
    });
  },
);

ContextMenuTrigger.displayName = "ContextMenuTrigger";

const MenuContainer = styled.div`
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

const MenuItemButton = styled.button`
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
`;

const MenuSeparator = styled.div`
  height: 1px;
  width: 100%;
  background: ${({ theme }) => theme.colors.border.subtle};
  margin: ${({ theme }) => `${theme.space[1]} 0`};
`;

export interface ContextMenuContentProps extends HTMLAttributes<HTMLDivElement> {}

export const ContextMenuContent = forwardRef<HTMLDivElement, ContextMenuContentProps>(
  function ContextMenuContent({ style, children, ...props }, ref) {
    const context = useContextMenu("ContextMenuContent");
    const contentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (!context.open) {
        return;
      }
      const handleClose = (event: MouseEvent) => {
        if (contentRef.current?.contains(event.target as Node)) {
          return;
        }
        context.setOpen(false);
        context.setPosition(null);
      };
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          context.setOpen(false);
          context.setPosition(null);
        }
      };
      document.addEventListener("mousedown", handleClose);
      document.addEventListener("contextmenu", handleClose);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("mousedown", handleClose);
        document.removeEventListener("contextmenu", handleClose);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [context]);

    if (!context.open || !context.position) {
      return null;
    }

    const { x, y } = context.position;
    const mergedStyle: CSSProperties = {
      top: `${y + (typeof window !== "undefined" ? window.scrollY : 0)}px`,
      left: `${x + (typeof window !== "undefined" ? window.scrollX : 0)}px`,
      ...style,
    };

    return (
      <Portal>
        <MenuContainer
          role="menu"
          ref={(node) => {
            contentRef.current = node;
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              (ref as MutableRefObject<HTMLDivElement | null>).current = node;
            }
          }}
          style={mergedStyle}
          {...props}
        >
          {children}
        </MenuContainer>
      </Portal>
    );
  },
);

ContextMenuContent.displayName = "ContextMenuContent";

export interface ContextMenuItemProps extends HTMLAttributes<HTMLButtonElement> {}

export const ContextMenuItem = forwardRef<HTMLButtonElement, ContextMenuItemProps>(
  function ContextMenuItem({ onClick, ...props }, ref) {
    const context = useContextMenu("ContextMenuItem");
    return (
      <MenuItemButton
        role="menuitem"
        onClick={(event) => {
          onClick?.(event);
          context.setOpen(false);
          context.setPosition(null);
        }}
        ref={ref}
        {...props}
      />
    );
  },
);

ContextMenuItem.displayName = "ContextMenuItem";

export interface ContextMenuSeparatorProps extends HTMLAttributes<HTMLDivElement> {}

export const ContextMenuSeparator = forwardRef<HTMLDivElement, ContextMenuSeparatorProps>(
  function ContextMenuSeparator(props, ref) {
    return <MenuSeparator role="separator" ref={ref} {...props} />;
  },
);

ContextMenuSeparator.displayName = "ContextMenuSeparator";
