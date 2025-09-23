export type KeyCombo = string | string[];

export interface HotkeyOptions {
  scope?: string;
  description?: string;
  group?: string;
  hideWhenFocusTrapped?: boolean;
  preventDefault?: boolean;
}

export type HotkeyHandler = (
  event: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey' | 'preventDefault'>,
  context: HotkeyContext,
) => void | boolean | Promise<void | boolean>;

export interface HotkeyContext {
  combo: string;
  printable: string;
  scope: string | null;
  global: boolean;
}

interface HotkeyBinding {
  scope: string;
  combo: string;
  printable: string;
  parts: NormalizedComboParts;
  handler: HotkeyHandler;
  options: {
    description?: string;
    group?: string;
    hideWhenFocusTrapped: boolean;
    preventDefault: boolean;
  };
}

interface NormalizedCombo {
  combo: string;
  printable: string;
  parts: NormalizedComboParts;
}

interface NormalizedComboParts {
  key: string;
  modifiers: Set<string>;
  usesMod: boolean;
}

const GLOBAL_SCOPE = '__global__';

const ORDERED_MODIFIERS = ['ctrl', 'meta', 'mod', 'alt', 'shift'];

const KEY_ALIASES: Record<string, string> = {
  esc: 'escape',
  escape: 'escape',
  ' ': 'space',
  spacebar: 'space',
  space: 'space',
  arrowup: 'arrowup',
  arrowdown: 'arrowdown',
  arrowleft: 'arrowleft',
  arrowright: 'arrowright',
  cmd: 'meta',
  command: 'meta',
  option: 'alt',
  control: 'ctrl',
  enter: 'enter',
  return: 'enter',
  tab: 'tab',
};

const formatModifier = (modifier: string): string => {
  switch (modifier) {
    case 'ctrl':
      return 'Ctrl';
    case 'meta':
      return 'Meta';
    case 'alt':
      return 'Alt';
    case 'shift':
      return 'Shift';
    case 'mod':
      return 'Mod';
    default:
      return modifier.toUpperCase();
  }
};

const formatKey = (key: string): string => {
  const printable = key.length === 1 ? key.toUpperCase() : key;
  switch (printable) {
    case 'SPACE':
      return 'Space';
    case 'ARROWUP':
      return 'Arrow ↑';
    case 'ARROWDOWN':
      return 'Arrow ↓';
    case 'ARROWLEFT':
      return 'Arrow ←';
    case 'ARROWRIGHT':
      return 'Arrow →';
    default:
      return printable.charAt(0).toUpperCase() + printable.slice(1).toLowerCase();
  }
};

const normalizeCombo = (combo: string): NormalizedCombo => {
  const parts = combo
    .split('+')
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);

  const modifiers = new Set<string>();
  let key = '';
  for (const part of parts) {
    const alias = KEY_ALIASES[part] ?? part;
    if (alias === 'mod') {
      modifiers.add('mod');
      continue;
    }
    if (ORDERED_MODIFIERS.includes(alias)) {
      modifiers.add(alias);
      continue;
    }
    key = alias;
  }

  const orderedModifiers = ORDERED_MODIFIERS.filter((modifier) => modifiers.has(modifier));
  const normalizedKey = key;
  const normalizedCombo = [...orderedModifiers, normalizedKey].filter(Boolean).join('+');

  const printableModifiers = orderedModifiers.map(formatModifier);
  const printableKey = normalizedKey ? formatKey(normalizedKey) : '';
  const printable = [...printableModifiers, printableKey].filter(Boolean).join(' + ');

  return {
    combo: normalizedCombo,
    printable,
    parts: {
      key: normalizedKey,
      modifiers,
      usesMod: modifiers.has('mod'),
    },
  };
};

const normalizeEventKey = (eventKey: string): string => {
  const lower = eventKey.toLowerCase();
  return KEY_ALIASES[lower] ?? lower;
};

const extractEventParts = (
  event: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey'>,
): NormalizedComboParts => {
  const modifiers = new Set<string>();
  if (event.ctrlKey) modifiers.add('ctrl');
  if (event.metaKey) modifiers.add('meta');
  if (event.altKey) modifiers.add('alt');
  if (event.shiftKey) modifiers.add('shift');
  const key = normalizeEventKey(event.key);
  return {
    key,
    modifiers,
    usesMod: false,
  };
};

const matchesCombo = (
  eventParts: NormalizedComboParts,
  binding: NormalizedComboParts,
): boolean => {
  if (binding.key && binding.key !== 'mod' && binding.key !== eventParts.key) {
    return false;
  }
  if (binding.key === 'mod' && !eventParts.modifiers.size) {
    return false;
  }
  for (const modifier of binding.modifiers) {
    if (modifier === 'mod') {
      if (!(eventParts.modifiers.has('meta') || eventParts.modifiers.has('ctrl'))) {
        return false;
      }
    } else if (!eventParts.modifiers.has(modifier)) {
      return false;
    }
  }
  for (const modifier of eventParts.modifiers) {
    if (binding.modifiers.has('mod') && (modifier === 'meta' || modifier === 'ctrl')) {
      continue;
    }
    if (!binding.modifiers.has(modifier)) {
      return false;
    }
  }
  return true;
};

export interface CheatSheetEntry {
  combo: string;
  printable: string;
  description?: string;
  group?: string;
  scope: string | null;
  global: boolean;
  hidden: boolean;
}

export class HotkeyManager {
  private readonly scopes = new Map<string, Map<string, HotkeyBinding[]>>();

  private focusTrapActive = false;

  register(combos: KeyCombo, handler: HotkeyHandler, options: HotkeyOptions = {}): () => void {
    const scope = options.scope ?? GLOBAL_SCOPE;
    const combosArray = Array.isArray(combos) ? combos : [combos];
    const bindings = combosArray.map((combo) => this.createBinding(combo, scope, handler, options));
    const scopeMap = this.ensureScope(scope);

    for (const binding of bindings) {
      const existing = scopeMap.get(binding.combo) ?? [];
      existing.push(binding);
      scopeMap.set(binding.combo, existing);
    }

    return () => {
      for (const binding of bindings) {
        const entries = scopeMap.get(binding.combo);
        if (!entries) continue;
        scopeMap.set(
          binding.combo,
          entries.filter((candidate) => candidate !== binding),
        );
        if (scopeMap.get(binding.combo)?.length === 0) {
          scopeMap.delete(binding.combo);
        }
      }
    };
  }

  handleKeydown(
    event: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey' | 'preventDefault'>,
    scope?: string,
  ): boolean {
    const scopesToCheck = scope ? [scope, GLOBAL_SCOPE] : [GLOBAL_SCOPE];
    const eventParts = extractEventParts(event);
    for (const currentScope of scopesToCheck) {
      const bindingsForScope = this.scopes.get(currentScope);
      if (!bindingsForScope) continue;
      for (const bindings of bindingsForScope.values()) {
        for (let index = bindings.length - 1; index >= 0; index -= 1) {
          const binding = bindings[index];
          if (this.focusTrapActive && binding.options.hideWhenFocusTrapped) {
            continue;
          }
          if (!matchesCombo(eventParts, binding.parts)) {
            continue;
          }
          const context: HotkeyContext = {
            combo: binding.combo,
            printable: binding.printable,
            scope: binding.scope === GLOBAL_SCOPE ? null : binding.scope,
            global: binding.scope === GLOBAL_SCOPE,
          };
          const result = binding.handler(event, context);
          if (binding.options.preventDefault !== false) {
            event.preventDefault?.();
          }
          if (result !== false) {
            return true;
          }
        }
      }
    }
    return false;
  }

  setFocusTrapActive(active: boolean): void {
    this.focusTrapActive = active;
  }

  getFocusTrapState(): boolean {
    return this.focusTrapActive;
  }

  getCheatSheet(options: { scope?: string; includeGlobal?: boolean } = {}): CheatSheetEntry[] {
    const { scope, includeGlobal = true } = options;
    const entries: CheatSheetEntry[] = [];
    const scopesToInclude = scope
      ? [scope, includeGlobal ? GLOBAL_SCOPE : undefined].filter(
          (value): value is string => Boolean(value),
        )
      : Array.from(this.scopes.keys());

    for (const currentScope of scopesToInclude) {
      const bindings = this.scopes.get(currentScope);
      if (!bindings) continue;
      for (const scopeBindings of bindings.values()) {
        for (const binding of scopeBindings) {
          const hidden = this.focusTrapActive && binding.options.hideWhenFocusTrapped;
          const entry: CheatSheetEntry = {
            combo: binding.combo,
            printable: binding.printable,
            scope: currentScope === GLOBAL_SCOPE ? null : currentScope,
            global: currentScope === GLOBAL_SCOPE,
            hidden,
          };
          if (binding.options.description !== undefined) {
            entry.description = binding.options.description;
          }
          if (binding.options.group !== undefined) {
            entry.group = binding.options.group;
          }
          entries.push(entry);
        }
      }
    }
    return entries;
  }

  private ensureScope(scope: string): Map<string, HotkeyBinding[]> {
    if (!this.scopes.has(scope)) {
      this.scopes.set(scope, new Map());
    }
    return this.scopes.get(scope)!;
  }

  private createBinding(
    combo: string,
    scope: string,
    handler: HotkeyHandler,
    options: HotkeyOptions,
  ): HotkeyBinding {
    const normalized = normalizeCombo(combo);
    const bindingOptions: HotkeyBinding['options'] = {
      hideWhenFocusTrapped: options.hideWhenFocusTrapped ?? false,
      preventDefault: options.preventDefault ?? true,
    };
    if (options.description !== undefined) {
      bindingOptions.description = options.description;
    }
    if (options.group !== undefined) {
      bindingOptions.group = options.group;
    }
    return {
      scope,
      combo: normalized.combo,
      printable: normalized.printable,
      parts: normalized.parts,
      handler,
      options: bindingOptions,
    };
  }
}
