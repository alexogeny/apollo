import { describe, expect, it } from 'bun:test';

import {
  CommandPaletteController,
  type CommandPaletteItem,
  type CommandPaletteKeyboardEvent,
} from '../organisms/command-palette';

describe('CommandPaletteController', () => {
  const baseItems: CommandPaletteItem[] = [
    { id: 'open', label: 'Open File', keywords: ['file', 'document'], section: 'File' },
    { id: 'save', label: 'Save Workspace', keywords: ['write'], section: 'File' },
    { id: 'close', label: 'Close Editor', keywords: ['quit'], section: 'File' },
    { id: 'help', label: 'Show Help', keywords: ['docs'], section: 'General' },
  ];

  it('ranks results and groups by section', () => {
    const controller = new CommandPaletteController({ items: baseItems });
    controller.open();
    controller.setQuery('fi');
    const state = controller.getState();
    const fileSection = state.sections.find((section) => section.label === 'File');
    expect(fileSection?.items.length).toBeGreaterThan(0);
    expect(state.results[0].item.id).toBe('open');
  });

  it('supports async data resolution', async () => {
    const controller = new CommandPaletteController({
      resolver: async (query: string) => {
        await Promise.resolve();
        return query
          ? [
              {
                id: `remote-${query}`,
                label: `Remote ${query}`,
                keywords: ['async'],
                section: 'Remote',
              },
            ]
          : [];
      },
    });
    controller.open();
    controller.setQuery('item');
    expect(controller.getState().loading).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 0));
    const state = controller.getState();
    expect(state.loading).toBe(false);
    expect(state.results[0]?.item.id).toBe('remote-item');
  });

  it('exposes keyboard navigation', () => {
    const controller = new CommandPaletteController({ items: baseItems });
    controller.open();
    expect(controller.getState().highlightedIndex).toBe(0);
    const downEvent: CommandPaletteKeyboardEvent = {
      key: 'ArrowDown',
      preventDefault: () => {},
      ctrlKey: false,
      metaKey: false,
      altKey: false,
      shiftKey: false,
    };
    controller.handleKey(downEvent);
    expect(controller.getState().highlightedIndex).toBe(1);
    const upEvent: CommandPaletteKeyboardEvent = {
      key: 'ArrowUp',
      preventDefault: () => {},
      ctrlKey: false,
      metaKey: false,
      altKey: false,
      shiftKey: false,
    };
    controller.handleKey(upEvent);
    expect(controller.getState().highlightedIndex).toBe(0);
    const enterEvent: CommandPaletteKeyboardEvent = {
      key: 'Enter',
      preventDefault: () => {},
      ctrlKey: false,
      metaKey: false,
      altKey: false,
      shiftKey: false,
    };
    const selected = controller.handleKey(enterEvent);
    expect(selected?.id).toBe('open');
  });
});
