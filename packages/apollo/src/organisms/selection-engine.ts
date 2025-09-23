export interface SelectionState<Id> {
  items: Id[];
  selected: Id[];
  activeId: Id | null;
  anchorId: Id | null;
}

export interface SelectionModifiers {
  shiftKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
}

type KeyboardLikeEvent = Pick<
  KeyboardEvent,
  'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey' | 'preventDefault'
>;

export type SelectionKeyboardEvent = KeyboardLikeEvent;

export class SelectionEngine<Id extends string | number = string> {
  private items: Id[] = [];

  private selected = new Set<Id>();

  private activeId: Id | null = null;

  private anchorId: Id | null = null;

  private readonly listeners = new Set<(state: SelectionState<Id>) => void>();

  setItems(items: Id[]): void {
    this.items = [...items];
    if (!this.items.includes(this.activeId as Id)) {
      this.activeId = this.items[0] ?? null;
    }
    if (!this.items.includes(this.anchorId as Id)) {
      this.anchorId = this.selected.size ? Array.from(this.selected)[0] : this.activeId;
    }
    this.notify();
  }

  subscribe(listener: (state: SelectionState<Id>) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  getState(): SelectionState<Id> {
    return {
      items: [...this.items],
      selected: Array.from(this.selected),
      activeId: this.activeId,
      anchorId: this.anchorId,
    };
  }

  clear(): void {
    if (this.selected.size === 0) return;
    this.selected.clear();
    this.notify();
  }

  selectAll(): void {
    this.selected = new Set(this.items);
    this.anchorId = this.items[0] ?? null;
    this.notify();
  }

  setSelection(ids: Id[]): void {
    this.selected = new Set(ids.filter((id) => this.items.includes(id)));
    this.anchorId = ids[ids.length - 1] ?? null;
    this.notify();
  }

  isSelected(id: Id): boolean {
    return this.selected.has(id);
  }

  handlePointer(id: Id, modifiers: SelectionModifiers = {}): void {
    const { shiftKey, ctrlKey, metaKey } = modifiers;
    const multi = Boolean(ctrlKey || metaKey);
    const range = Boolean(shiftKey);
    if (!this.items.includes(id)) return;

    if (range) {
      this.selectRange(id, { additive: multi });
      this.setActive(id);
      return;
    }

    if (multi) {
      if (this.selected.has(id)) {
        this.selected.delete(id);
      } else {
        this.selected.add(id);
        this.anchorId = id;
      }
      this.setActive(id, { silent: true });
      this.notify();
      return;
    }

    this.selected = new Set([id]);
    this.anchorId = id;
    this.setActive(id);
    this.notify();
  }

  handleKey(event: KeyboardLikeEvent): Id | null {
    if (!this.items.length) return null;
    const key = event.key.toLowerCase();
    switch (key) {
      case 'arrowdown':
        event.preventDefault?.();
        return this.move(1, event.shiftKey, event.ctrlKey || event.metaKey);
      case 'arrowup':
        event.preventDefault?.();
        return this.move(-1, event.shiftKey, event.ctrlKey || event.metaKey);
      case 'home':
        event.preventDefault?.();
        return this.focusIndex(0, event.shiftKey, event.ctrlKey || event.metaKey);
      case 'end':
        event.preventDefault?.();
        return this.focusIndex(this.items.length - 1, event.shiftKey, event.ctrlKey || event.metaKey);
      case 'a':
        if (event.metaKey || event.ctrlKey) {
          event.preventDefault?.();
          this.selectAll();
          return this.activeId;
        }
        break;
      case ' ': // Space
      case 'enter':
        event.preventDefault?.();
        if (this.activeId !== null) {
          this.handlePointer(this.activeId, {
            ctrlKey: event.ctrlKey,
            metaKey: event.metaKey,
            shiftKey: event.shiftKey,
          });
          return this.activeId;
        }
        break;
      default:
        break;
    }
    return this.activeId;
  }

  getRovingTabIndex(id: Id): number {
    return this.activeId === id ? 0 : -1;
  }

  setActive(id: Id | null, options: { silent?: boolean } = {}): void {
    if (id !== null && !this.items.includes(id)) {
      return;
    }
    this.activeId = id;
    if (!options.silent) {
      this.notify();
    }
  }

  private move(delta: number, shiftKey: boolean, multi: boolean): Id | null {
    if (this.activeId === null) {
      this.activeId = this.items[0] ?? null;
      if (this.activeId === null) return null;
    }
    const currentIndex = this.items.indexOf(this.activeId);
    const nextIndex = Math.min(
      this.items.length - 1,
      Math.max(0, currentIndex + delta),
    );
    return this.focusIndex(nextIndex, shiftKey, multi);
  }

  private focusIndex(index: number, shiftKey: boolean, multi: boolean): Id | null {
    if (index < 0 || index >= this.items.length) {
      return this.activeId;
    }
    const id = this.items[index];
    this.setActive(id, { silent: true });
    if (shiftKey) {
      this.selectRange(id, { additive: multi });
    } else if (!multi) {
      this.selected = new Set([id]);
      this.anchorId = id;
    }
    this.notify();
    return id;
  }

  private selectRange(targetId: Id, options: { additive?: boolean } = {}): void {
    const anchor = this.anchorId ?? this.activeId ?? targetId;
    const anchorIndex = this.items.indexOf(anchor);
    const targetIndex = this.items.indexOf(targetId);
    if (anchorIndex === -1 || targetIndex === -1) {
      return;
    }
    const [start, end] = anchorIndex < targetIndex
      ? [anchorIndex, targetIndex]
      : [targetIndex, anchorIndex];
    const range = this.items.slice(start, end + 1);
    const next = options.additive ? new Set(this.selected) : new Set<Id>();
    range.forEach((id) => next.add(id));
    this.selected = next;
    this.anchorId = anchor;
    this.notify();
  }

  private notify(): void {
    const state = this.getState();
    for (const listener of this.listeners) {
      listener(state);
    }
  }
}
