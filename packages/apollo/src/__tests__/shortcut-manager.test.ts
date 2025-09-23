import { describe, expect, it } from 'bun:test';

import {
  HotkeyManager,
  type HotkeyContext,
} from '../organisms/shortcut-manager';

describe('HotkeyManager', () => {
  it('registers and handles global hotkeys', () => {
    const manager = new HotkeyManager();
    let triggered = false;
    manager.register('Ctrl+K', () => {
      triggered = true;
    });
    const event: Parameters<HotkeyManager['handleKeydown']>[0] = {
      key: 'k',
      ctrlKey: true,
      metaKey: false,
      altKey: false,
      shiftKey: false,
      preventDefault: () => {},
    };
    const handled = manager.handleKeydown(event);
    expect(handled).toBe(true);
    expect(triggered).toBe(true);
  });

  it('respects scope precedence', () => {
    const manager = new HotkeyManager();
    const calls: string[] = [];
    manager.register('Mod+P', () => {
      calls.push('global');
    });
    manager.register(
      'Mod+P',
      (_event: Parameters<HotkeyManager['handleKeydown']>[0], context: HotkeyContext) => {
        calls.push(context.scope ?? 'global');
      },
      { scope: 'palette' },
    );
    const event: Parameters<HotkeyManager['handleKeydown']>[0] = {
      key: 'p',
      ctrlKey: true,
      metaKey: false,
      altKey: false,
      shiftKey: false,
      preventDefault: () => {},
    };
    manager.handleKeydown(event, 'palette');
    expect(calls).toEqual(['palette']);
  });

  it('hides bindings when focus is trapped', () => {
    const manager = new HotkeyManager();
    manager.register('Ctrl+/', () => {}, { description: 'Show cheatsheet', hideWhenFocusTrapped: true });
    manager.setFocusTrapActive(true);
    const sheet = manager.getCheatSheet();
    expect(sheet[0]?.hidden).toBe(true);
  });
});
