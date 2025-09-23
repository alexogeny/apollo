export type CommandPaletteSectionRef =
  | string
  | {
      id: string;
      label?: string;
    };

export interface CommandPaletteItem {
  id: string;
  label: string;
  keywords?: string[];
  section?: CommandPaletteSectionRef;
  data?: unknown;
  disabled?: boolean;
}

export interface CommandResultItem {
  item: CommandPaletteItem;
  score: number;
  index: number;
  sectionId: string | null;
}

export interface CommandSection {
  id: string | null;
  label: string | null;
  items: CommandResultItem[];
}

export interface CommandPaletteState {
  open: boolean;
  query: string;
  loading: boolean;
  sections: CommandSection[];
  results: CommandResultItem[];
  highlightedIndex: number;
}

export type FuzzyScorer = (query: string, item: CommandPaletteItem) => number;

export type CommandDataResolver = (query: string) => Promise<CommandPaletteItem[]>;

export interface CommandPaletteOptions {
  items?: CommandPaletteItem[];
  scorers?: FuzzyScorer[];
  resolver?: CommandDataResolver;
  maxResults?: number;
  onSelect?: (item: CommandPaletteItem) => void;
}

const DEFAULT_SCORER: FuzzyScorer = (query, item) => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return 0;
  const haystacks = [item.label, ...(item.keywords ?? [])];
  let best = Number.NEGATIVE_INFINITY;
  for (const haystack of haystacks) {
    const candidate = scoreFuzzy(normalizedQuery, (haystack ?? '').toLowerCase());
    if (candidate > best) {
      best = candidate;
    }
  }
  return best;
};

const scoreFuzzy = (query: string, target: string): number => {
  if (!query) return 0;
  let score = 0;
  let lastIndex = -1;
  for (let i = 0; i < query.length; i += 1) {
    const char = query[i];
    const foundIndex = target.indexOf(char, lastIndex + 1);
    if (foundIndex === -1) {
      return Number.NEGATIVE_INFINITY;
    }
    if (foundIndex === lastIndex + 1) {
      score += 3;
    } else {
      score += 1;
    }
    if (foundIndex === 0) {
      score += 1;
    }
    lastIndex = foundIndex;
  }
  return score - (target.length - query.length) * 0.1;
};

const toSectionKey = (
  section?: CommandPaletteSectionRef,
): { id: string | null; label: string | null } => {
  if (!section) {
    return { id: null, label: null };
  }
  if (typeof section === 'string') {
    return { id: section, label: section };
  }
  return { id: section.id, label: section.label ?? section.id };
};

type KeyboardLikeEvent = Pick<
  KeyboardEvent,
  'key' | 'metaKey' | 'ctrlKey' | 'altKey' | 'shiftKey' | 'preventDefault'
>;

export type CommandPaletteKeyboardEvent = KeyboardLikeEvent;

export class CommandPaletteController {
  private staticItems: CommandPaletteItem[];

  private remoteItems: CommandPaletteItem[] = [];

  private scorers: FuzzyScorer[];

  private resolver: CommandDataResolver | undefined;

  private maxResults: number | undefined;

  private readonly listeners = new Set<(state: CommandPaletteState) => void>();

  private state: CommandPaletteState = {
    open: false,
    query: '',
    loading: false,
    sections: [],
    results: [],
    highlightedIndex: -1,
  };

  private requestToken = 0;

  private onSelect: ((item: CommandPaletteItem) => void) | undefined;

  constructor(options: CommandPaletteOptions = {}) {
    this.staticItems = [...(options.items ?? [])];
    this.scorers = options.scorers && options.scorers.length > 0 ? options.scorers : [DEFAULT_SCORER];
    this.resolver = options.resolver;
    this.maxResults = options.maxResults;
    this.onSelect = options.onSelect;
    this.search();
  }

  public getState(): CommandPaletteState {
    return this.state;
  }

  public setItems(items: CommandPaletteItem[]): void {
    this.staticItems = [...items];
    this.search();
  }

  public addItems(items: CommandPaletteItem[]): void {
    this.staticItems = [...this.staticItems, ...items];
    this.search();
  }

  public setResolver(resolver?: CommandDataResolver): void {
    this.resolver = resolver;
  }

  public setOnSelect(handler?: (item: CommandPaletteItem) => void): void {
    this.onSelect = handler;
  }

  public setMaxResults(limit?: number): void {
    this.maxResults = limit;
    this.search();
  }

  public registerScorer(scorer: FuzzyScorer): void {
    this.scorers = [...this.scorers, scorer];
    this.search();
  }

  public clearScorers(): void {
    this.scorers = [DEFAULT_SCORER];
    this.search();
  }

  public subscribe(listener: (state: CommandPaletteState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public open(): void {
    if (!this.state.open) {
      this.updateState({ open: true });
      if (this.resolver && !this.state.query) {
        void this.resolveRemote('');
      }
    }
  }

  public close(): void {
    if (this.state.open) {
      this.updateState({ open: false });
    }
  }

  public toggle(): void {
    if (this.state.open) {
      this.close();
    } else {
      this.open();
    }
  }

  public setQuery(query: string): void {
    if (query === this.state.query) return;
    this.updateState({ query });
    this.search();
    if (this.resolver) {
      void this.resolveRemote(query);
    }
  }

  public clearQuery(): void {
    this.setQuery('');
  }

  public handleKey(event: KeyboardLikeEvent): CommandPaletteItem | null {
    if (!this.state.open) {
      return null;
    }
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault?.();
        this.moveHighlight(1);
        return this.current();
      case 'ArrowUp':
        event.preventDefault?.();
        this.moveHighlight(-1);
        return this.current();
      case 'Home':
        event.preventDefault?.();
        this.setHighlight(this.findNext(-1, 1));
        return this.current();
      case 'End':
        event.preventDefault?.();
        this.setHighlight(this.findNext(this.state.results.length, -1));
        return this.current();
      case 'PageDown':
        event.preventDefault?.();
        this.moveHighlight(5);
        return this.current();
      case 'PageUp':
        event.preventDefault?.();
        this.moveHighlight(-5);
        return this.current();
      case 'Enter':
        event.preventDefault?.();
        return this.select(this.state.highlightedIndex);
      case 'Escape':
        event.preventDefault?.();
        this.close();
        return null;
      default:
        return null;
    }
  }

  public highlightById(id: string): void {
    const index = this.state.results.findIndex((result) => result.item.id === id);
    if (index >= 0) {
      this.setHighlight(index);
    }
  }

  public select(index: number): CommandPaletteItem | null {
    const result = this.state.results[index];
    if (!result || result.item.disabled) {
      return null;
    }
    this.onSelect?.(result.item);
    return result.item;
  }

  private current(): CommandPaletteItem | null {
    if (this.state.highlightedIndex < 0) {
      return null;
    }
    const result = this.state.results[this.state.highlightedIndex];
    return result?.item ?? null;
  }

  private moveHighlight(delta: number): void {
    if (!this.state.results.length) {
      this.setHighlight(-1);
      return;
    }
    const next = this.findNext(this.state.highlightedIndex, delta);
    this.setHighlight(next);
  }

  private findNext(startIndex: number, step: number): number {
    const { results } = this.state;
    if (!results.length) return -1;
    let index = startIndex;
    do {
      index += step;
      if (index < 0 || index >= results.length) {
        return startIndex >= 0 ? startIndex : -1;
      }
      if (!results[index].item.disabled) {
        return index;
      }
    } while (index >= 0 && index < results.length);
    return -1;
  }

  private setHighlight(index: number): void {
    if (index === this.state.highlightedIndex) return;
    this.updateState({ highlightedIndex: index });
  }

  private updateState(patch: Partial<CommandPaletteState>): void {
    this.state = { ...this.state, ...patch };
    this.notify();
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  private computeScore(query: string, item: CommandPaletteItem): number {
    if (!this.scorers.length) return 0;
    const scores = this.scorers.map((scorer) => scorer(query, item));
    return Math.max(...scores);
  }

  private search(): void {
    const query = this.state.query.trim().toLowerCase();
    const allItems = [...this.staticItems, ...this.remoteItems];
    const scored: Array<{ item: CommandPaletteItem; score: number; order: number }> = [];
    allItems.forEach((item, order) => {
      const score = this.computeScore(query, item);
      if (score === Number.NEGATIVE_INFINITY) {
        return;
      }
      scored.push({ item, score, order });
    });

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.order !== b.order) return a.order - b.order;
      return a.item.label.localeCompare(b.item.label);
    });

    const limited = this.maxResults ? scored.slice(0, this.maxResults) : scored;
    const sections = new Map<string | null, CommandSection>();
    const flat: CommandResultItem[] = [];

    limited.forEach(({ item, score }) => {
      const { id, label } = toSectionKey(item.section);
      if (!sections.has(id)) {
        sections.set(id, { id, label, items: [] });
      }
      const section = sections.get(id)!;
      const entry: CommandResultItem = {
        item,
        score,
        index: flat.length,
        sectionId: id,
      };
      section.items.push(entry);
      flat.push(entry);
    });

    const firstActive = flat.findIndex((entry) => !entry.item.disabled);
    this.updateState({
      sections: Array.from(sections.values()),
      results: flat,
      highlightedIndex: firstActive,
    });
  }

  private async resolveRemote(query: string): Promise<void> {
    if (!this.resolver) return;
    const token = ++this.requestToken;
    this.updateState({ loading: true });
    try {
      const items = await this.resolver(query);
      if (this.requestToken !== token) return;
      this.remoteItems = Array.isArray(items) ? items : [];
    } catch {
      if (this.requestToken !== token) return;
      this.remoteItems = [];
    } finally {
      if (this.requestToken === token) {
        this.updateState({ loading: false });
        this.search();
      }
    }
  }
}
