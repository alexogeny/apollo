import {
  createContext,
  forwardRef,
  type ButtonHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

import { Portal } from "../internal/Portal";
import { useControllableState } from "../internal/useControllableState";
import { hexToRgba } from "../internal/color";
import { Button } from "../primitives/Button";

export interface CommandPaletteCommand {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly shortcut?: readonly string[];
  readonly keywords?: readonly string[];
  readonly group?: string;
  readonly onSelect: () => void;
}

interface CommandPaletteContextValue {
  readonly open: boolean;
  readonly setOpen: (open: boolean) => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

export interface CommandPaletteProps {
  readonly commands: readonly CommandPaletteCommand[];
  readonly placeholder?: string;
  readonly emptyState?: ReactNode;
  readonly hotkey?: string;
  readonly open?: boolean;
  readonly defaultOpen?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  readonly children?: ReactNode;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: ${({ theme }) => hexToRgba(theme.colors.surface.surfaceContrast, 0.64)};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
  z-index: 1200;
`;

const Palette = styled.div`
  width: min(36rem, 92vw);
  background: ${({ theme }) => theme.colors.surface.surfaceRaised};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  padding: ${({ theme }) => theme.space[4]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[3]}`};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background: ${({ theme }) => theme.colors.surface.surfaceSunken};
  font-family: ${({ theme }) => theme.typography.fonts.sans};
  font-size: ${({ theme }) => theme.typography.variants.body.fontSize};
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.colors.action.accent.solid};
    box-shadow:
      0 0 0 1px ${({ theme }) => theme.colors.surface.background},
      0 0 0 3px ${({ theme }) => theme.colors.states.focusRing};
  }
`;

const Results = styled.div`
  max-height: 18rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
`;

const GroupLabel = styled.div`
  font-family: ${({ theme }) => theme.typography.fonts.sans};
  font-size: ${({ theme }) => theme.typography.variants.detail.fontSize};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.text.muted};
`;

const CommandItem = styled.button<{ readonly $active: boolean }>`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[3]}`};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.action.accent.subtle : theme.colors.surface.surfaceRaised};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  text-align: left;

  &:hover,
  &:focus-visible {
    outline: none;
    background: ${({ theme }) => theme.colors.action.accent.subtle};
  }
`;

const Shortcut = styled.span`
  display: inline-flex;
  gap: ${({ theme }) => theme.space[1]};
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: ${({ theme }) => theme.typography.variants.detail.fontSize};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const CommandText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[1]};
`;

const CommandTitle = styled.span`
  font-family: ${({ theme }) => theme.typography.fonts.sans};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
`;

const CommandDescription = styled.span`
  font-size: ${({ theme }) => theme.typography.variants.detail.fontSize};
  color: ${({ theme }) => theme.colors.text.muted};
`;

export function CommandPalette({
  commands,
  placeholder = "Search commands...",
  emptyState = "No matching commands",
  hotkey = "k",
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: CommandPaletteProps): JSX.Element {
  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const commandRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const normalized = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!normalized) {
      return commands;
    }
    return commands.filter((command) => {
      const haystack = [
        command.title,
        command.description ?? "",
        ...(command.keywords ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [commands, normalized]);

  const grouped = useMemo(() => {
    const map = new Map<string, CommandPaletteCommand[]>();
    filtered.forEach((command) => {
      const key = command.group ?? "Commands";
      const items = map.get(key) ?? [];
      items.push(command);
      map.set(key, items);
    });
    return Array.from(map.entries());
  }, [filtered]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && key === hotkey.toLowerCase()) {
        event.preventDefault();
        setIsOpen(true);
      }
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hotkey, setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    searchRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    commandRefs.current = commandRefs.current.slice(0, filtered.length);
    if (filtered[activeIndex]) {
      commandRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [filtered, activeIndex]);

  const handleKeyNavigation = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % Math.max(filtered.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));
    } else if (event.key === "Enter" && filtered[activeIndex]) {
      event.preventDefault();
      filtered[activeIndex].onSelect();
      setIsOpen(false);
    }
  };

  return (
    <CommandPaletteContext.Provider value={{ open: isOpen, setOpen: setIsOpen }}>
      {children}
      <Portal>
        {isOpen ? (
          <Overlay role="presentation" onClick={() => setIsOpen(false)}>
            <Palette onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
              <SearchInput
                ref={searchRef}
                placeholder={placeholder}
                value={query}
                onChange={(event) => {
                  setQuery(event.currentTarget.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyNavigation}
                aria-label="Command search"
              />
              <Results>
                {filtered.length === 0 ? (
                  <div>{emptyState}</div>
                ) : (
                  grouped.map(([group, commandsInGroup]) => (
                    <div key={group}>
                      <GroupLabel>{group}</GroupLabel>
                      {commandsInGroup.map((command, index) => {
                        const globalIndex = filtered.indexOf(command);
                        return (
                          <CommandItem
                            key={command.id}
                            ref={(node) => {
                              commandRefs.current[globalIndex] = node;
                            }}
                            $active={globalIndex === activeIndex}
                            onClick={() => {
                              command.onSelect();
                              setIsOpen(false);
                            }}
                          >
                            <CommandText>
                              <CommandTitle>{command.title}</CommandTitle>
                              {command.description ? (
                                <CommandDescription>{command.description}</CommandDescription>
                              ) : null}
                            </CommandText>
                            {command.shortcut && command.shortcut.length > 0 ? (
                              <Shortcut>
                                {command.shortcut.map((key) => (
                                  <kbd key={key}>{key}</kbd>
                                ))}
                              </Shortcut>
                            ) : null}
                          </CommandItem>
                        );
                      })}
                    </div>
                  ))
                )}
              </Results>
            </Palette>
          </Overlay>
        ) : null}
      </Portal>
    </CommandPaletteContext.Provider>
  );
}

export interface CommandPaletteTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const CommandPaletteTrigger = forwardRef<HTMLButtonElement, CommandPaletteTriggerProps>(
  function CommandPaletteTrigger({ onClick, ...props }, ref) {
    const context = useContext(CommandPaletteContext);
    if (!context) {
      throw new Error("CommandPaletteTrigger must be used within CommandPalette");
    }
    return (
      <Button
        type="button"
        {...props}
        ref={ref}
        onClick={(event) => {
          onClick?.(event);
          context.setOpen(true);
        }}
      />
    );
  },
);

CommandPaletteTrigger.displayName = "CommandPaletteTrigger";

export function useCommandPalette(): CommandPaletteContextValue {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error("useCommandPalette must be used within CommandPalette");
  }
  return context;
}
