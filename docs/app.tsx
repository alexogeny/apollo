import type { ButtonHTMLAttributes, ReactNode } from 'react';

import {
  Accordion,
  ContextMenu,
  Dialog,
  DropdownMenu,
  HoverCard,
  Page,
  Popover,
  Sidebar,
  Tabs,
  Toast,
  Tooltip,
  Topbar,
} from '../packages/apollo/src/molecules';
import { APOLLO_THEME_CSS } from '../packages/apollo/src/foundations/theme';
import {
  motionTokens,
  neutralTokens,
  palettes,
  radiusScale,
  shadowTokens,
  spaceScale,
  statusTokens,
  typographyTokens,
  zIndexTokens,
} from '../packages/apollo/src/foundations/tokens';
import { Dashboard } from '../packages/apollo/src/organisms';
import { cx } from '../packages/apollo/src/styled';

export const STYLE_PLACEHOLDER = '/*__APOLLO_DYNAMIC_STYLES__*/';

const DOCS_STYLES = `
:root {
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
  }
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  min-height: 100vh;
  font-family: var(--apollo-typography-font-family-base, 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
  background: var(--apollo-color-bg);
  color: var(--apollo-color-text);
}
a {
  color: inherit;
  text-decoration: none;
}
code {
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  background: color-mix(in srgb, var(--apollo-color-bg-subtle) 85%, transparent);
  border-radius: var(--apollo-radius-sm);
  border: 1px solid color-mix(in srgb, var(--apollo-color-border) 65%, transparent);
  padding: 0.2rem 0.45rem;
  color: var(--apollo-color-text);
}
pre {
  margin: 0;
  background: var(--apollo-color-bg-subtle);
  border-radius: var(--apollo-radius-xl);
  border: 1px solid color-mix(in srgb, var(--apollo-color-border) 55%, transparent);
  padding: clamp(1.25rem, 3vw, 2rem);
  overflow-x: auto;
}
pre code {
  display: block;
  font-size: 0.85rem;
  background: transparent;
  border: 0;
  padding: 0;
  color: var(--apollo-color-text);
}
.palette-grid {
  display: grid;
  gap: var(--apollo-space-3);
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}
.palette-card {
  border: 1px solid color-mix(in srgb, var(--apollo-color-border) 60%, transparent);
  background: color-mix(in srgb, var(--apollo-color-bg-subtle) 70%, transparent);
  border-radius: var(--apollo-radius-lg);
  padding: var(--apollo-space-4);
  display: grid;
  gap: var(--apollo-space-3);
}
.palette-card h3 {
  margin: 0;
  font-size: 1rem;
  text-transform: capitalize;
  letter-spacing: var(--apollo-typography-letter-spacing-tight);
}
.swatch-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--apollo-space-3);
}
.swatch {
  display: grid;
  gap: var(--apollo-space-2);
}
.swatch-color {
  height: 48px;
  border-radius: var(--apollo-radius-md);
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.08);
}
.swatch-meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--apollo-color-text-muted);
}
.swatch-value {
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}
.foundation-grid {
  display: grid;
  gap: var(--apollo-space-3);
}
.foundation-card {
  border: 1px solid color-mix(in srgb, var(--apollo-color-border) 60%, transparent);
  background: color-mix(in srgb, var(--apollo-color-bg-subtle) 70%, transparent);
  border-radius: var(--apollo-radius-lg);
  padding: clamp(1.25rem, 3vw, 1.75rem);
  display: grid;
  gap: var(--apollo-space-3);
}
.foundation-card h3 {
  margin: 0;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: var(--apollo-typography-letter-spacing-tight);
  color: var(--apollo-color-text-muted);
}
.token-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--apollo-space-2);
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
.token-card {
  padding: var(--apollo-space-3);
  border-radius: var(--apollo-radius-md);
  background: var(--apollo-color-surface);
  border: 1px solid color-mix(in srgb, var(--apollo-color-border) 55%, transparent);
  display: grid;
  gap: 0.35rem;
}
.token-name {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: var(--apollo-typography-letter-spacing-tight);
  color: var(--apollo-color-text-muted);
}
.token-value {
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  color: var(--apollo-color-text);
  font-size: 0.85rem;
}
.component-shell {
  display: grid;
  gap: clamp(var(--apollo-space-5), 4vw, var(--apollo-space-7));
  grid-template-columns: minmax(200px, 260px) minmax(0, 1fr);
}
.component-sidebar {
  display: grid;
  gap: var(--apollo-space-2);
  align-content: start;
  position: sticky;
  top: calc(var(--apollo-space-9) + 72px);
}
.component-tab {
  display: grid;
  gap: 0.35rem;
  padding: calc(var(--apollo-space-3) + 2px);
  border-radius: var(--apollo-radius-lg);
  border: 1px solid color-mix(in srgb, var(--apollo-color-border) 65%, transparent);
  background: color-mix(in srgb, var(--apollo-color-bg-subtle) 70%, transparent);
  color: var(--apollo-color-text-muted);
  text-align: left;
  cursor: pointer;
  font-family: var(--apollo-typography-font-family-base);
  font-size: 0.9rem;
  letter-spacing: var(--apollo-typography-letter-spacing-tight);
  transition:
    border-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard),
    background-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard),
    box-shadow var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard),
    color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard);
}
.component-tab:hover {
  border-color: color-mix(in srgb, var(--apollo-color-accent) 30%, transparent);
  color: var(--apollo-color-text);
}
.component-tab[aria-selected='true'] {
  background: var(--apollo-color-accent-subtle);
  border-color: color-mix(in srgb, var(--apollo-color-accent) 45%, transparent);
  color: var(--apollo-color-accent-contrast);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--apollo-color-accent) 40%, transparent);
}
.component-tab:focus-visible {
  outline: none;
  box-shadow: var(--apollo-shadow-focus);
}
.component-tab-name {
  font-weight: var(--apollo-typography-weight-semibold);
}
.component-tab-description {
  color: var(--apollo-color-text-muted);
  font-size: 0.8rem;
  line-height: 1.5;
}
.component-tab[aria-selected='true'] .component-tab-description {
  color: color-mix(in srgb, var(--apollo-color-accent-contrast) 85%, var(--apollo-color-accent-subtle) 15%);
}
.component-panels {
  display: grid;
  gap: var(--apollo-space-4);
}
.component-panel {
  display: grid;
  gap: clamp(var(--apollo-space-5), 4vw, var(--apollo-space-7));
}
.component-panel[hidden] {
  display: none;
}
.component-preview {
  display: grid;
  gap: var(--apollo-space-4);
  background: color-mix(in srgb, var(--apollo-color-bg-subtle) 75%, transparent);
  border: 1px solid color-mix(in srgb, var(--apollo-color-border) 55%, transparent);
  border-radius: var(--apollo-radius-xl);
  padding: clamp(1.25rem, 3vw, 2rem);
}
.component-preview-stage {
  position: relative;
  display: grid;
  place-items: center;
  border-radius: var(--apollo-radius-lg);
  border: 1px solid color-mix(in srgb, var(--apollo-color-border) 55%, transparent);
  background: var(--apollo-color-surface);
  min-height: 260px;
  padding: clamp(1.5rem, 4vw, 2.5rem);
  overflow: hidden;
}
.component-preview-stage[data-compact='true'] {
  min-height: 200px;
}
.component-preview-stage[data-align='start'] {
  justify-items: start;
  align-items: start;
}
.component-preview-summary {
  margin: 0;
  color: var(--apollo-color-text-muted);
  font-size: 0.95rem;
  line-height: 1.6;
}
.component-code {
  margin: 0;
}
.demo-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--apollo-space-2);
  border-radius: var(--apollo-radius-md);
  border: none;
  padding-block: calc(var(--apollo-space-2) + 1px);
  padding-inline: calc(var(--apollo-space-4) + 2px);
  font-family: var(--apollo-typography-font-family-base);
  font-size: var(--apollo-typography-size-sm);
  font-weight: var(--apollo-typography-weight-semibold);
  letter-spacing: var(--apollo-typography-letter-spacing-tight);
  background: var(--apollo-color-accent);
  color: var(--apollo-color-accent-contrast);
  cursor: pointer;
  transition:
    box-shadow var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard),
    filter var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard),
    transform var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard);
}
.demo-button:hover {
  filter: brightness(1.05);
}
.demo-button:focus-visible {
  outline: none;
  box-shadow: var(--apollo-shadow-focus);
}
.demo-button--outline {
  background: transparent;
  color: var(--apollo-color-text);
  border: 1px solid color-mix(in srgb, var(--apollo-color-border) 70%, transparent);
}
.demo-button--ghost {
  background: color-mix(in srgb, var(--apollo-color-accent-subtle) 60%, transparent);
  color: var(--apollo-color-accent);
}
.demo-stack {
  display: grid;
  gap: var(--apollo-space-2);
}
.demo-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--apollo-color-text-muted);
}
.demo-input {
  font-family: var(--apollo-typography-font-family-base);
  font-size: var(--apollo-typography-size-sm);
  color: var(--apollo-color-text);
  background: var(--apollo-color-surface);
  border-radius: var(--apollo-radius-md);
  border: 1px solid color-mix(in srgb, var(--apollo-color-border) 70%, transparent);
  padding: calc(var(--apollo-space-2) + 2px) var(--apollo-space-3);
  resize: vertical;
  transition:
    border-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard),
    box-shadow var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard);
}
.demo-input:focus-visible {
  outline: none;
  border-color: var(--apollo-color-accent);
  box-shadow: var(--apollo-shadow-focus);
}
.demo-helper {
  font-size: 0.8rem;
  color: var(--apollo-color-text-muted);
}
.demo-trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--apollo-space-2);
  padding: calc(var(--apollo-space-2) + 1px) calc(var(--apollo-space-3) + 2px);
  border-radius: var(--apollo-radius-pill);
  background: color-mix(in srgb, var(--apollo-color-accent-subtle) 60%, transparent);
  color: var(--apollo-color-accent);
}
.demo-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--apollo-space-2);
}
.demo-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding-inline: calc(var(--apollo-space-3) + 1px);
  padding-block: calc(var(--apollo-space-1) + 2px);
  border-radius: var(--apollo-radius-pill);
  background: color-mix(in srgb, var(--apollo-color-bg-subtle) 75%, transparent);
  color: var(--apollo-color-text);
  font-size: 0.75rem;
  letter-spacing: var(--apollo-typography-letter-spacing-tight);
}
.demo-heading {
  margin: 0;
  font-weight: var(--apollo-typography-weight-semibold);
  letter-spacing: var(--apollo-typography-letter-spacing-tight);
}
.demo-hover-trigger {
  color: var(--apollo-color-accent);
  font-weight: var(--apollo-typography-weight-semibold);
}
.demo-hovercard {
  display: grid;
  gap: var(--apollo-space-3);
}
.demo-hovercard-header {
  display: flex;
  align-items: center;
  gap: var(--apollo-space-3);
}
.demo-hovercard-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--apollo-radius-pill);
  background: var(--apollo-color-accent);
  color: var(--apollo-color-accent-contrast);
  display: grid;
  place-items: center;
  font-weight: var(--apollo-typography-weight-semibold);
}
.demo-hovercard-meta {
  display: grid;
  gap: 0.25rem;
}
.demo-context-target {
  padding: var(--apollo-space-4);
  border-radius: var(--apollo-radius-lg);
  border: 1px dashed color-mix(in srgb, var(--apollo-color-border) 70%, transparent);
  background: color-mix(in srgb, var(--apollo-color-bg-subtle) 65%, transparent);
  cursor: context-menu;
  transition:
    border-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard),
    box-shadow var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard);
}
.demo-context-target:hover {
  border-color: color-mix(in srgb, var(--apollo-color-accent) 40%, transparent);
  box-shadow: var(--apollo-shadow-low);
}
.component-preview [data-component='dialog-overlay'] {
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, var(--apollo-color-backdrop) 65%, transparent);
  border-radius: var(--apollo-radius-lg);
  pointer-events: none;
}
.component-preview [data-component='dialog-content'] {
  position: relative;
  inset: auto;
  transform: none;
  width: min(520px, 100%);
  max-height: none;
  box-shadow: var(--apollo-shadow-high);
}
.component-preview [data-component='popover-content'],
.component-preview [data-component='tooltip-content'] {
  position: relative;
  transform: none;
  inset: auto;
  opacity: 1;
}
.component-preview [data-component='popover-arrow'],
.component-preview [data-component='tooltip-arrow'] {
  display: none;
}
.component-preview [data-component='toast-viewport'] {
  position: relative;
  bottom: auto;
  right: auto;
  width: 100%;
  gap: var(--apollo-space-3);
}
.component-preview [data-component='toast-root'] {
  transform: none !important;
  opacity: 1 !important;
}
.component-preview [data-component='toast-root']::before {
  border-radius: 0 999px 999px 0;
}
.component-preview [data-component='toast-root'] .demo-button {
  background: transparent;
  border: 1px solid color-mix(in srgb, var(--apollo-toast-fg) 30%, transparent);
  color: var(--apollo-toast-fg);
  padding-inline: calc(var(--apollo-space-3) + 2px);
  padding-block: calc(var(--apollo-space-2) + 2px);
}
.component-preview [data-component='toast-root'] .demo-button:hover {
  filter: none;
  background: color-mix(in srgb, var(--apollo-toast-bg) 80%, var(--apollo-toast-fg) 20%);
}
.component-preview [data-component='toast-root'] .demo-button:focus-visible {
  box-shadow: var(--apollo-shadow-focus);
}
.component-preview [data-component='toast-root'] .demo-button--ghost {
  background: color-mix(in srgb, var(--apollo-toast-bg) 75%, var(--apollo-toast-fg) 25%);
}
.component-preview [data-component='toast-root'] .demo-button--outline {
  border: 1px solid color-mix(in srgb, var(--apollo-toast-fg) 35%, transparent);
}
@media (max-width: 960px) {
  .component-shell {
    grid-template-columns: 1fr;
  }
  .component-sidebar {
    position: static;
  }
  .component-preview-stage {
    min-height: 220px;
  }
}
@media (max-width: 640px) {
  .palette-grid {
    grid-template-columns: 1fr;
  }
  .foundation-grid {
    grid-template-columns: 1fr;
  }
}
`;

const MOLECULE_NAV_SCRIPT = `
(function () {
  const nav = document.querySelector('[data-molecule-nav]');
  if (!nav) return;
  const triggers = Array.from(nav.querySelectorAll('[data-molecule-trigger]'));
  const panels = Array.from(document.querySelectorAll('[data-molecule-panel]'));
  if (!triggers.length || !panels.length) return;

  const defaultId = triggers[0]?.dataset.moleculeTrigger;

  const activate = (id, focusTarget) => {
    triggers.forEach((trigger) => {
      const isActive = trigger.dataset.moleculeTrigger === id;
      trigger.setAttribute('aria-selected', String(isActive));
      trigger.setAttribute('tabindex', isActive ? '0' : '-1');
      if (isActive && focusTarget) {
        trigger.focus();
      }
    });
    panels.forEach((panel) => {
      const isActive = panel.dataset.moleculePanel === id;
      panel.hidden = !isActive;
      panel.setAttribute('aria-hidden', String(!isActive));
    });
  };

  const getHashTarget = () => {
    const hash = window.location.hash;
    if (!hash.startsWith('#molecule-')) {
      return null;
    }
    return hash.slice('#molecule-'.length);
  };

  const syncFromHash = (shouldFocus = false) => {
    const target = getHashTarget();
    if (!target) {
      return false;
    }
    const exists = triggers.some((trigger) => trigger.dataset.moleculeTrigger === target);
    if (!exists) {
      return false;
    }
    activate(target, shouldFocus);
    return true;
  };

  if (!syncFromHash()) {
    if (defaultId) {
      activate(defaultId, false);
    }
  }

  window.addEventListener('hashchange', () => {
    if (!syncFromHash(true) && defaultId) {
      activate(defaultId, false);
    }
  });

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const id = trigger.dataset.moleculeTrigger;
      if (id) {
        activate(id, false);
        const hash = '#molecule-' + id;
        if (window.location.hash !== hash) {
          window.history.replaceState(null, '', hash);
        }
      }
    });

    trigger.addEventListener('keydown', (event) => {
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        return;
      }
      event.preventDefault();
      const index = triggers.indexOf(trigger);
      if (index === -1) {
        return;
      }
      let targetIndex = index;
      if (event.key === 'ArrowDown') {
        targetIndex = (index + 1) % triggers.length;
      } else if (event.key === 'ArrowUp') {
        targetIndex = (index - 1 + triggers.length) % triggers.length;
      } else if (event.key === 'Home') {
        targetIndex = 0;
      } else if (event.key === 'End') {
        targetIndex = triggers.length - 1;
      }
      const target = triggers[targetIndex];
      const id = target?.dataset.moleculeTrigger;
      if (target && id) {
        activate(id, true);
        const hash = '#molecule-' + id;
        if (window.location.hash !== hash) {
          window.history.replaceState(null, '', hash);
        }
      }
    });
  });
})();
`;

type TokenPrimitive = string | number;

type TokenValue = TokenPrimitive | TokenRecord;

interface TokenRecord {
  readonly [key: string]: TokenValue;
}

interface TokenEntry {
  readonly name: string;
  readonly value: string;
}

interface SectionProps {
  readonly id?: string;
  readonly title: string;
  readonly description?: string;
  readonly variant?: 'surface' | 'plain';
  readonly children: ReactNode;
}

interface ColorSwatchProps {
  readonly label: string;
  readonly value: string;
}

interface FoundationGroup {
  readonly title: string;
  readonly entries: TokenEntry[];
}

interface MoleculeStageConfig {
  readonly compact?: boolean;
  readonly align?: 'start' | 'center';
}

interface MoleculeDoc {
  readonly id: string;
  readonly name: string;
  readonly tagline: string;
  readonly blurb: string;
  readonly preview: ReactNode;
  readonly code: string;
  readonly stage?: MoleculeStageConfig;
}

const objectEntries = <T extends Record<string, unknown>>(value: T) =>
  Object.entries(value) as Array<[keyof T, T[keyof T]]>;

const toTitleCase = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

const toTokenKey = (value: string): string =>
  value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const isTokenRecord = (value: TokenValue): value is TokenRecord =>
  typeof value === 'object' && value !== null;

const flattenTokenTree = (
  tree: TokenRecord,
  prefix: string[] = [],
  output: TokenEntry[] = [],
): TokenEntry[] => {
  for (const [key, rawValue] of objectEntries(tree)) {
    const tokenKey = String(key);
    const path = [...prefix, toTokenKey(tokenKey)];
    if (isTokenRecord(rawValue)) {
      flattenTokenTree(rawValue, path, output);
    } else {
      output.push({
        name: path.join('.'),
        value: String(rawValue),
      });
    }
  }
  return output;
};

const Section = ({
  id,
  title,
  description,
  variant = 'surface',
  children,
}: SectionProps): JSX.Element => (
  <Page.Section id={id} variant={variant}>
    <Page.SectionHeader>
      <Page.SectionTitle>{title}</Page.SectionTitle>
      {description ? <Page.SectionDescription>{description}</Page.SectionDescription> : null}
    </Page.SectionHeader>
    {children}
  </Page.Section>
);

const ColorSwatch = ({ label, value }: ColorSwatchProps): JSX.Element => (
  <li className="swatch">
    <span className="swatch-color" style={{ backgroundColor: value }} aria-hidden="true" />
    <span className="swatch-meta">
      <span className="swatch-label">{label}</span>
      <span className="swatch-value">{value}</span>
    </span>
  </li>
);

const TokenGrid = ({ entries }: { readonly entries: TokenEntry[] }): JSX.Element => (
  <ul className="token-grid">
    {entries.map((entry) => (
      <li key={entry.name} className="token-card">
        <span className="token-name">{entry.name}</span>
        <span className="token-value">{entry.value}</span>
      </li>
    ))}
  </ul>
);

interface DemoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: 'solid' | 'outline' | 'ghost';
}

const DemoButton = ({
  variant = 'solid',
  className,
  type,
  ...props
}: DemoButtonProps): JSX.Element => (
  <button
    {...props}
    type={type ?? 'button'}
    className={cx('demo-button', variant !== 'solid' ? `demo-button--${variant}` : null, className)}
  />
);

const dialogCode = `import { Dialog } from '@apollo/core';

<Dialog.Root>
  <Dialog.Trigger asChild>
    <button type="button">Schedule tasting</button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content size="md">
      <Dialog.Close aria-label="Close dialog" />
      <Dialog.Header>
        <Dialog.Title>Schedule a tasting</Dialog.Title>
        <Dialog.Description>
          Invite the orchard team to sample the latest blends together.
        </Dialog.Description>
      </Dialog.Header>
      <Dialog.Footer>
        <Dialog.Close asChild>
          <button type="button">Cancel</button>
        </Dialog.Close>
        <button type="submit">Book tasting</button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>;`;

const tooltipCode = `import { Tooltip } from '@apollo/core';

<Tooltip.Provider delayDuration={120}>
  <Tooltip.Root>
    <Tooltip.Trigger>Harvest ETA</Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content side="top">
        Fresh crates arrive in 12 minutes.
        <Tooltip.Arrow />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>;`;

const popoverCode = `import { Popover } from '@apollo/core';

<Popover.Root>
  <Popover.Trigger>Open summary</Popover.Trigger>
  <Popover.Portal>
    <Popover.Content side="bottom" align="start">
      <p>Assign crew roles and confirm supplies.</p>
      <Popover.Close aria-label="Close" />
      <Popover.Arrow />
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>;`;

const hoverCardCode = `import { HoverCard } from '@apollo/core';

<HoverCard.Root>
  <HoverCard.Trigger>Orchard lead</HoverCard.Trigger>
  <HoverCard.Portal>
    <HoverCard.Content side="right" align="center">
      <div>
        <strong>Camille Rivera</strong>
        <p>Guides seasonal blends and tasting tours.</p>
      </div>
      <HoverCard.Arrow />
    </HoverCard.Content>
  </HoverCard.Portal>
</HoverCard.Root>;`;

const dropdownMenuCode = `import { DropdownMenu } from '@apollo/core';

<DropdownMenu.Root>
  <DropdownMenu.Trigger>Share canvas</DropdownMenu.Trigger>
  <DropdownMenu.Portal>
    <DropdownMenu.Content sideOffset={8}>
      <DropdownMenu.Label>Workspace</DropdownMenu.Label>
      <DropdownMenu.Item>Invite teammate</DropdownMenu.Item>
      <DropdownMenu.Item>Share link</DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.CheckboxItem checked>Notify crew</DropdownMenu.CheckboxItem>
      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger>Palette</DropdownMenu.SubTrigger>
        <DropdownMenu.SubContent sideOffset={8} alignOffset={-4}>
          <DropdownMenu.RadioGroup value="papaya">
            <DropdownMenu.RadioItem value="papaya">Papaya</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="plum">Plum</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="lime">Lime</DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.SubContent>
      </DropdownMenu.Sub>
      <DropdownMenu.Separator />
      <DropdownMenu.Item>
        Settings
        <DropdownMenu.Shortcut>⌘,</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>;`;

const tabsCode = `import { Tabs } from '@apollo/core';

<Tabs.Root defaultValue="tastings">
  <Tabs.List>
    <Tabs.Trigger value="tastings">Tastings</Tabs.Trigger>
    <Tabs.Trigger value="deliveries">Deliveries</Tabs.Trigger>
    <Tabs.Trigger value="insights">Insights</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tastings">
    Curate seasonal flights for each fruit palette.
  </Tabs.Content>
  <Tabs.Content value="deliveries">
    Track outgoing boxes and route adjustments.
  </Tabs.Content>
  <Tabs.Content value="insights">
    Share orchard trends and blend feedback with the crew.
  </Tabs.Content>
</Tabs.Root>;`;

const accordionCode = `import { Accordion } from '@apollo/core';

<Accordion.Root type="single" collapsible defaultValue="storage">
  <Accordion.Item value="storage">
    <Accordion.Header>
      <Accordion.Trigger>Cold storage</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>
      Chill bottled blends at 36°F before tastings to preserve aromatics.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="logistics">
    <Accordion.Header>
      <Accordion.Trigger>Logistics</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>
      Coordinate crew arrivals and confirm transport windows.
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>;`;

const toastCode = `import { Toast } from '@apollo/core';

<Toast.Provider swipeDirection="right">
  <Toast.Root>
    <Toast.Title>Order confirmed</Toast.Title>
    <Toast.Description>
      We'll coordinate with the orchard and send tracking details.
    </Toast.Description>
    <Toast.Action altText="View order">View order</Toast.Action>
    <Toast.Close aria-label="Dismiss" />
  </Toast.Root>
  <Toast.Viewport />
</Toast.Provider>;`;

const contextMenuCode = `import { ContextMenu } from '@apollo/core';

<ContextMenu.Root>
  <ContextMenu.Trigger asChild>
    <div className="note">Right-click to assign</div>
  </ContextMenu.Trigger>
  <ContextMenu.Portal>
    <ContextMenu.Content>
      <ContextMenu.Label>Assign label</ContextMenu.Label>
      <ContextMenu.RadioGroup value="priority">
        <ContextMenu.RadioItem value="priority">Priority</ContextMenu.RadioItem>
        <ContextMenu.RadioItem value="follow-up">Follow up</ContextMenu.RadioItem>
        <ContextMenu.RadioItem value="archive">Archive</ContextMenu.RadioItem>
      </ContextMenu.RadioGroup>
      <ContextMenu.Separator />
      <ContextMenu.Item>Archive note</ContextMenu.Item>
    </ContextMenu.Content>
  </ContextMenu.Portal>
</ContextMenu.Root>;`;

const DialogExample = (): JSX.Element => (
  <Dialog.Root open>
    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content size="md">
        <Dialog.Close aria-label="Close dialog" />
        <Dialog.Header>
          <Dialog.Title>Schedule a tasting</Dialog.Title>
          <Dialog.Description>
            Invite the orchard team to sample the latest blends together.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <div className="demo-stack">
            <label className="demo-label" htmlFor="demo-dialog-date">
              Date
            </label>
            <input
              className="demo-input"
              id="demo-dialog-date"
              type="date"
              defaultValue="2024-09-21"
            />
          </div>
          <div className="demo-stack">
            <label className="demo-label" htmlFor="demo-dialog-notes">
              Notes
            </label>
            <textarea
              className="demo-input"
              id="demo-dialog-notes"
              rows={3}
              defaultValue="Confirm seasonal availability and route the crew through the orchard."
            />
            <span className="demo-helper">We'll send a calendar hold with the confirmed plan.</span>
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          <DemoButton variant="ghost">Cancel</DemoButton>
          <DemoButton>Book tasting</DemoButton>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

const TooltipExample = (): JSX.Element => (
  <Tooltip.Provider delayDuration={0}>
    <Tooltip.Root defaultOpen>
      <Tooltip.Trigger asChild>
        <span className="demo-trigger">Harvest ETA</span>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content side="top" align="center">
          Fresh crates arrive in 12 minutes.
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);

const PopoverExample = (): JSX.Element => (
  <Popover.Root open>
    <Popover.Trigger asChild>
      <DemoButton variant="outline">Packing list</DemoButton>
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Content side="bottom" align="start">
        <div className="demo-stack">
          <h4 className="demo-heading">Crew assignments</h4>
          <div className="demo-chip-row">
            <span className="demo-chip">Pressing</span>
            <span className="demo-chip">Tasting</span>
            <span className="demo-chip">Logistics</span>
          </div>
          <span className="demo-helper">
            We'll ping whoever is on deck the morning of the visit.
          </span>
        </div>
        <Popover.Close aria-label="Close popover" />
        <Popover.Arrow />
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
);

const HoverCardExample = (): JSX.Element => (
  <HoverCard.Root openDelay={0} closeDelay={100}>
    <HoverCard.Trigger className="demo-hover-trigger">Camille Rivera</HoverCard.Trigger>
    <HoverCard.Portal>
      <HoverCard.Content sideOffset={16} align="start">
        <div className="demo-hovercard">
          <div className="demo-hovercard-header">
            <span className="demo-hovercard-avatar" aria-hidden="true">
              CR
            </span>
            <div className="demo-hovercard-meta">
              <span className="demo-heading">Camille Rivera</span>
              <span className="demo-helper">Orchard lead · Plum palette</span>
            </div>
          </div>
          <p className="demo-helper">
            Coordinates harvest tastings and curates seasonal blending feedback with growers.
          </p>
        </div>
        <HoverCard.Arrow />
      </HoverCard.Content>
    </HoverCard.Portal>
  </HoverCard.Root>
);

const DropdownMenuExample = (): JSX.Element => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild>
      <DemoButton variant="outline">Share canvas</DemoButton>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content sideOffset={8} align="start">
        <DropdownMenu.Label>Workspace</DropdownMenu.Label>
        <DropdownMenu.Item>Invite teammate</DropdownMenu.Item>
        <DropdownMenu.Item>Copy link</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.CheckboxItem checked>Notify crew</DropdownMenu.CheckboxItem>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>Palette</DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent sideOffset={8} alignOffset={-4}>
            <DropdownMenu.RadioGroup value="papaya">
              <DropdownMenu.RadioItem value="papaya">Papaya</DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="plum">Plum</DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="lime">Lime</DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          Settings
          <DropdownMenu.Shortcut>⌘,</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

const TabsExample = (): JSX.Element => (
  <Tabs.Root defaultValue="tastings">
    <Tabs.List>
      <Tabs.Trigger value="tastings">Tastings</Tabs.Trigger>
      <Tabs.Trigger value="deliveries">Deliveries</Tabs.Trigger>
      <Tabs.Trigger value="insights">Insights</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="tastings">
      <p className="demo-helper">Plan curated flights for each fruit palette.</p>
    </Tabs.Content>
    <Tabs.Content value="deliveries">
      <p className="demo-helper">Track outgoing crates and adjust routes in real time.</p>
    </Tabs.Content>
    <Tabs.Content value="insights">
      <p className="demo-helper">Share orchard trends and blend feedback with the crew.</p>
    </Tabs.Content>
  </Tabs.Root>
);

const AccordionExample = (): JSX.Element => (
  <Accordion.Root type="single" collapsible defaultValue="storage">
    <Accordion.Item value="storage">
      <Accordion.Header>
        <Accordion.Trigger>Cold storage</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content>
        Chill bottled blends at 36°F before tastings to preserve aromatics.
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="logistics">
      <Accordion.Header>
        <Accordion.Trigger>Logistics</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content>
        Coordinate crew arrivals and confirm transport windows with the orchard.
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
);

const ToastExample = (): JSX.Element => (
  <Toast.Provider swipeDirection="right">
    <Toast.Root open tone="success">
      <Toast.Title>Order confirmed</Toast.Title>
      <Toast.Description>
        We'll coordinate with the orchard and send tracking details.
      </Toast.Description>
      <Toast.Action altText="View order" asChild>
        <DemoButton variant="outline">View order</DemoButton>
      </Toast.Action>
      <Toast.Close aria-label="Dismiss toast" />
    </Toast.Root>
    <Toast.Viewport />
  </Toast.Provider>
);

const ContextMenuExample = (): JSX.Element => (
  <ContextMenu.Root>
    <ContextMenu.Trigger asChild>
      <div className="demo-context-target">
        <h4 className="demo-heading">Field note</h4>
        <p className="demo-helper">Right-click to label this observation for follow-up.</p>
      </div>
    </ContextMenu.Trigger>
    <ContextMenu.Portal>
      <ContextMenu.Content>
        <ContextMenu.Label>Assign label</ContextMenu.Label>
        <ContextMenu.RadioGroup value="follow-up">
          <ContextMenu.RadioItem value="priority">Priority</ContextMenu.RadioItem>
          <ContextMenu.RadioItem value="follow-up">Follow up</ContextMenu.RadioItem>
          <ContextMenu.RadioItem value="archive">Archive</ContextMenu.RadioItem>
        </ContextMenu.RadioGroup>
        <ContextMenu.Separator />
        <ContextMenu.Item>Archive note</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Portal>
  </ContextMenu.Root>
);

const MOLECULE_DOCS: MoleculeDoc[] = [
  {
    id: 'dialog',
    name: 'Dialog',
    tagline: 'Modal focus for confirmations and multi-step flows.',
    blurb:
      'Dialogs layer over the page with soft-backdrop motion and guaranteed focus return, ideal for concentrated editing or confirmations.',
    preview: <DialogExample />,
    code: dialogCode,
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    tagline: 'Lightweight hints for icons and terse copy.',
    blurb:
      'Tooltips stay concise, follow pointer intent, and respect reduced motion. Use them to clarify abbreviations or icon-only controls.',
    preview: <TooltipExample />,
    code: tooltipCode,
    stage: { compact: true },
  },
  {
    id: 'popover',
    name: 'Popover',
    tagline: 'Surface inline edits without breaking flow.',
    blurb:
      'Popovers anchor to triggers for quick adjustments—think filters, role pickers, or lightweight menus with contextual actions.',
    preview: <PopoverExample />,
    code: popoverCode,
    stage: { align: 'start' },
  },
  {
    id: 'hover-card',
    name: 'Hover Card',
    tagline: 'Preview people and entities without commitment.',
    blurb:
      'Hover cards gently introduce richer context on hover, ideal for showing teammate bios, orchard stats, or quick entity summaries.',
    preview: <HoverCardExample />,
    code: hoverCardCode,
    stage: { align: 'start' },
  },
  {
    id: 'dropdown-menu',
    name: 'Dropdown Menu',
    tagline: 'Compact menus for clustered actions.',
    blurb:
      'Dropdown menus keep primary actions close to their trigger, support submenus, and celebrate shortcuts without overwhelming the interface.',
    preview: <DropdownMenuExample />,
    code: dropdownMenuCode,
    stage: { align: 'start' },
  },
  {
    id: 'tabs',
    name: 'Tabs',
    tagline: 'Organize peer content in a single viewport.',
    blurb:
      'Tabs keep related panels in one place while still allowing keyboard or assistive tech users to navigate confidently.',
    preview: <TabsExample />,
    code: tabsCode,
    stage: { align: 'start' },
  },
  {
    id: 'accordion',
    name: 'Accordion',
    tagline: 'Progressive disclosure for long-form details.',
    blurb:
      'Accordions soften dense information into approachable slices, supporting single or multiple open items with smooth motion.',
    preview: <AccordionExample />,
    code: accordionCode,
    stage: { align: 'start' },
  },
  {
    id: 'toast',
    name: 'Toast',
    tagline: 'Transient feedback with strong affordances.',
    blurb:
      'Toasts pop into view with tone-aware accents, offering optional actions while honoring swipe gestures and reduced motion.',
    preview: <ToastExample />,
    code: toastCode,
    stage: { align: 'start' },
  },
  {
    id: 'context-menu',
    name: 'Context Menu',
    tagline: 'Right-click affordances for spatial canvases.',
    blurb:
      'Context menus unlock secondary actions where space is at a premium—perfect for boards, annotations, and data-rich grids.',
    preview: <ContextMenuExample />,
    code: contextMenuCode,
    stage: { align: 'start' },
  },
];

const DOC_NAV_ITEMS = [
  {
    id: 'overview',
    label: 'Overview',
    description: 'System snapshot and intent for FruitUI.',
  },
  {
    id: 'molecules',
    label: 'Molecule library',
    description: 'Radix-driven overlays, menus, and feedback.',
  },
  {
    id: 'palettes',
    label: 'Fruit palettes',
    description: 'Accent ramps tuned for each orchard palette.',
  },
  {
    id: 'neutrals-status',
    label: 'Neutrals & statuses',
    description: 'Theme-aware surfaces and state colors.',
  },
  {
    id: 'scales',
    label: 'Core scales',
    description: 'Spacing, radii, motion, type, and layers.',
  },
  {
    id: 'theme',
    label: 'Applying the theme',
    description: 'Inject CSS once and drive themed surfaces.',
  },
];

const MoleculeShowcase = ({ items }: { readonly items: MoleculeDoc[] }): JSX.Element => (
  <div className="component-shell">
    <aside
      className="component-sidebar"
      data-molecule-nav
      role="tablist"
      aria-orientation="vertical"
    >
      {items.map((item, index) => (
        <button
          key={item.id}
          id={`${item.id}-trigger`}
          type="button"
          className="component-tab"
          role="tab"
          data-molecule-trigger={item.id}
          aria-controls={`molecule-${item.id}`}
          aria-selected={index === 0 ? 'true' : 'false'}
          tabIndex={index === 0 ? 0 : -1}
        >
          <span className="component-tab-name">{item.name}</span>
          <span className="component-tab-description">{item.tagline}</span>
        </button>
      ))}
    </aside>
    <div className="component-panels">
      {items.map((item, index) => (
        <article
          key={item.id}
          id={`molecule-${item.id}`}
          className="component-panel"
          role="tabpanel"
          aria-labelledby={`${item.id}-trigger`}
          data-molecule-panel={item.id}
          hidden={index !== 0}
          aria-hidden={index !== 0}
        >
          <div className="component-preview">
            <div
              className="component-preview-stage"
              data-compact={item.stage?.compact ? 'true' : undefined}
              data-align={item.stage?.align}
            >
              {item.preview}
            </div>
            <p className="component-preview-summary">{item.blurb}</p>
          </div>
          <pre className="component-code">
            <code>{item.code}</code>
          </pre>
        </article>
      ))}
    </div>
  </div>
);

const themeUsageExample = `import { APOLLO_THEME_CSS, injectThemeStyles, applyTheme } from '@apollo/core';

const root = document.documentElement;

if (!document.querySelector('style[data-apollo-theme]')) {
  const style = document.createElement('style');
  style.dataset.apolloTheme = 'true';
  style.textContent = APOLLO_THEME_CSS;
  document.head.appendChild(style);
}

applyTheme(root, { palette: 'plum', mode: 'dark' });`;

export interface AppProps {
  readonly basePath: string;
}

export const App = ({ basePath }: AppProps): JSX.Element => {
  const foundationGroups: FoundationGroup[] = [
    {
      title: 'Space scale',
      entries: flattenTokenTree(spaceScale, ['space']),
    },
    {
      title: 'Radii',
      entries: flattenTokenTree(radiusScale, ['radius']),
    },
    {
      title: 'Shadows',
      entries: flattenTokenTree(shadowTokens, ['shadow']),
    },
    {
      title: 'Motion',
      entries: flattenTokenTree(motionTokens, ['motion']),
    },
    {
      title: 'Typography',
      entries: flattenTokenTree(typographyTokens, ['typography']),
    },
    {
      title: 'Layers',
      entries: flattenTokenTree(zIndexTokens, ['z']),
    },
  ];

  return (
    <html lang="en" data-theme="light" data-palette="apple" data-motion="full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Apollo UI · System foundations</title>
        <base href={basePath} />
        <style
          dangerouslySetInnerHTML={{
            __html: `${APOLLO_THEME_CSS}${DOCS_STYLES}${STYLE_PLACEHOLDER}`,
          }}
        />
      </head>
      <body>
        <Sidebar.Provider>
          <Dashboard.Root>
            <Topbar.Root>
              <Topbar.Section>
                <Topbar.Badge>FruitUI</Topbar.Badge>
                <div style={{ display: 'grid', gap: '0.25rem' }}>
                  <Topbar.Title>Apollo design system</Topbar.Title>
                  <Topbar.Subtitle>Foundations & molecules</Topbar.Subtitle>
                </div>
              </Topbar.Section>
              <Topbar.Section align="end">
                <Topbar.Actions>
                  <Sidebar.Trigger aria-label="Toggle navigation" />
                  <Topbar.Badge tone="neutral">
                    Base path <code>{basePath}</code>
                  </Topbar.Badge>
                </Topbar.Actions>
              </Topbar.Section>
            </Topbar.Root>
            <Dashboard.Main as="main">
              <Dashboard.Sidebar>
                <Sidebar.Root aria-label="Documentation navigation">
                  <Sidebar.Section>
                    <Sidebar.SectionLabel>System sections</Sidebar.SectionLabel>
                    <Sidebar.List>
                      {DOC_NAV_ITEMS.map((item, index) => (
                        <Sidebar.Item
                          key={item.id}
                          as="a"
                          href={`#${item.id}`}
                          active={index === 0}
                          aria-current={index === 0 ? 'page' : undefined}
                        >
                          <Sidebar.ItemLabel>{item.label}</Sidebar.ItemLabel>
                          <Sidebar.ItemDescription>{item.description}</Sidebar.ItemDescription>
                        </Sidebar.Item>
                      ))}
                    </Sidebar.List>
                  </Sidebar.Section>
                  <Sidebar.Section>
                    <Sidebar.SectionLabel>Molecule patterns</Sidebar.SectionLabel>
                    <Sidebar.List>
                      {MOLECULE_DOCS.map((item) => (
                        <Sidebar.Item key={item.id} as="a" href={`#molecule-${item.id}`}>
                          <Sidebar.ItemLabel>{item.name}</Sidebar.ItemLabel>
                          <Sidebar.ItemDescription>{item.tagline}</Sidebar.ItemDescription>
                        </Sidebar.Item>
                      ))}
                    </Sidebar.List>
                  </Sidebar.Section>
                  <Sidebar.Footer>
                    FruitUI tokens meet Radix reliability—browse patterns and tokens without losing
                    your place.
                  </Sidebar.Footer>
                </Sidebar.Root>
              </Dashboard.Sidebar>
              <Dashboard.Content>
                <Page.Content>
                  <Page.Section id="overview" variant="hero">
                    <Page.Eyebrow>Design system</Page.Eyebrow>
                    <Page.Heading>Design foundations & molecules</Page.Heading>
                    <Page.Lead>
                      Fruit-forward palettes, neutral surfaces, and tactile motion built on Radix
                      primitives with custom styling.
                    </Page.Lead>
                    <Page.Lead>
                      Use the sidebar to browse live molecule previews and token scales. Served from{' '}
                      <code>{basePath}</code>.
                    </Page.Lead>
                  </Page.Section>

                  <Section
                    id="molecules"
                    title="Molecule library"
                    description="Dialogs, popovers, tabs, accordions, tooltips, and toasts wrapped with FruitUI styling. Browse with the inline nav to see each pattern in context."
                  >
                    <MoleculeShowcase items={MOLECULE_DOCS} />
                  </Section>

                  <Section
                    id="palettes"
                    title="Fruit palettes"
                    description="Accent ramps tuned for each signature fruit. Values map to variables such as --apollo-accent-500 and inform interactive states."
                  >
                    <div className="palette-grid">
                      {objectEntries(palettes).map(([name, definition]) => (
                        <article key={String(name)} className="palette-card">
                          <h3>{toTitleCase(String(name))}</h3>
                          <ul className="swatch-list">
                            {objectEntries(definition.accent).map(([step, hex]) => (
                              <ColorSwatch key={String(step)} label={String(step)} value={hex} />
                            ))}
                          </ul>
                        </article>
                      ))}
                    </div>
                  </Section>

                  <Section
                    id="neutrals-status"
                    title="Neutrals & statuses"
                    description="Surface pairings for light and dark themes plus semantic feedback colors for success, warning, and danger flows."
                  >
                    <div className="palette-grid">
                      {objectEntries(neutralTokens).map(([mode, ramp]) => (
                        <article key={String(mode)} className="palette-card">
                          <h3>{`Neutrals · ${toTitleCase(String(mode))}`}</h3>
                          <ul className="swatch-list">
                            {objectEntries(ramp).map(([token, value]) => (
                              <ColorSwatch
                                key={String(token)}
                                label={String(token)}
                                value={value}
                              />
                            ))}
                          </ul>
                        </article>
                      ))}
                      {objectEntries(statusTokens).map(([mode, ramp]) => (
                        <article key={`${String(mode)}-status`} className="palette-card">
                          <h3>{`Statuses · ${toTitleCase(String(mode))}`}</h3>
                          <ul className="swatch-list">
                            {objectEntries(ramp).map(([token, value]) => (
                              <ColorSwatch
                                key={String(token)}
                                label={String(token)}
                                value={value}
                              />
                            ))}
                          </ul>
                        </article>
                      ))}
                    </div>
                  </Section>

                  <Section
                    id="scales"
                    title="Core scales"
                    description="Spacing, radius, typography, motion, and elevation scales collapse into semantic CSS variables scoped by theme."
                  >
                    <div className="foundation-grid">
                      {foundationGroups.map((group) => (
                        <article key={group.title} className="foundation-card">
                          <h3>{group.title}</h3>
                          <TokenGrid entries={group.entries} />
                        </article>
                      ))}
                    </div>
                  </Section>

                  <Section
                    id="theme"
                    title="Applying the theme"
                    description="Inject the compiled CSS once and drive per-surface configuration via the headless theme helpers."
                  >
                    <pre>
                      <code>{themeUsageExample}</code>
                    </pre>
                  </Section>
                </Page.Content>
              </Dashboard.Content>
            </Dashboard.Main>
            <Page.Footer>
              Built with the Apollo foundations · Theme styles baked in via{' '}
              <code>@apollo/core</code>
            </Page.Footer>
            <script dangerouslySetInnerHTML={{ __html: MOLECULE_NAV_SCRIPT }} />
          </Dashboard.Root>
          <Sidebar.Overlay />
        </Sidebar.Provider>
      </body>
    </html>
  );
};
