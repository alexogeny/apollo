import { describe, expect, it } from 'bun:test';

import {
  SelectionEngine,
  type SelectionKeyboardEvent,
} from '../organisms/selection-engine';

describe('SelectionEngine', () => {
  it('handles pointer modifiers and range selection', () => {
    const engine = new SelectionEngine<string>();
    engine.setItems(['a', 'b', 'c', 'd']);
    engine.handlePointer('b');
    expect(engine.getState().selected).toEqual(['b']);
    engine.handlePointer('d', { shiftKey: true });
    expect(engine.getState().selected).toEqual(['b', 'c', 'd']);
    engine.handlePointer('c', { ctrlKey: true });
    expect(engine.getState().selected).toEqual(['b', 'd']);
  });

  it('supports keyboard navigation with shift range', () => {
    const engine = new SelectionEngine<string>();
    engine.setItems(['item-1', 'item-2', 'item-3']);
    engine.handlePointer('item-1');
    const event: SelectionKeyboardEvent = {
      key: 'ArrowDown',
      shiftKey: true,
      ctrlKey: false,
      metaKey: false,
      altKey: false,
      preventDefault: () => {},
    };
    engine.handleKey(event);
    expect(engine.getState().selected).toEqual(['item-1', 'item-2']);
    expect(engine.getRovingTabIndex('item-2')).toBe(0);
  });
});
