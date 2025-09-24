import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { Accordion, Dialog, Popover, Tabs, Toast, Tooltip } from '../packages/apollo/src/molecules';
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
.hero {
  padding: clamp(2.5rem, 6vw, 4rem) 1.5rem;
  text-align: center;
  display: grid;
  gap: 1rem;
  background: linear-gradient(135deg, color-mix(in srgb, var(--apollo-color-accent) 18%, transparent), transparent);
  border-bottom: 1px solid var(--apollo-color-border);
}
.hero h1 {
  margin: 0;
  font-size: clamp(2.25rem, 5vw, 3rem);
  letter-spacing: -0.02em;
}
.hero p {
  margin: 0 auto;
  max-width: 60ch;
  color: var(--apollo-color-text-muted);
  font-size: 1.05rem;
}
.hero .tagline {
  color: var(--apollo-color-accent-strong);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.75rem;
}
.hero .base-hint {
  display: inline-flex;
  gap: 0.5rem;
  align-items: baseline;
  justify-content: center;
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: var(--apollo-color-text-muted);
}
.hero code {
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  background: var(--apollo-color-bg-subtle);
  border: 1px solid var(--apollo-color-border);
  border-radius: var(--apollo-radius-sm);
  padding: 0.2rem 0.45rem;
  color: var(--apollo-color-text);
}
main {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 1.5rem 4rem;
  display: grid;
  gap: clamp(2rem, 4vw, 3rem);
}
section {
  background: var(--apollo-color-surface);
  border-radius: var(--apollo-radius-xl);
  border: 1px solid var(--apollo-color-border);
  box-shadow: var(--apollo-shadow-low);
  padding: clamp(1.5rem, 3vw, 2.5rem);
  display: grid;
  gap: 1.75rem;
}
section h2 {
  margin: 0;
  font-size: clamp(1.5rem, 2.2vw, 1.875rem);
}
section p {
  margin: 0;
  color: var(--apollo-color-text-muted);
  max-width: 70ch;
}
.palette-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}
.palette-card {
  border: 1px solid var(--apollo-color-border);
  background: var(--apollo-color-bg-subtle);
  border-radius: var(--apollo-radius-lg);
  padding: 1rem;
  display: grid;
  gap: 0.75rem;
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
  gap: 0.75rem;
}
.swatch {
  display: grid;
  gap: 0.5rem;
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
  color: var(--apollo-color-text-muted);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.swatch-value {
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  color: var(--apollo-color-text);
  letter-spacing: normal;
  text-transform: none;
}
.foundation-grid {
  display: grid;
  gap: 1.5rem;
}
.foundation-card {
  border: 1px solid var(--apollo-color-border);
  background: var(--apollo-color-bg-subtle);
  border-radius: var(--apollo-radius-lg);
  padding: 1rem;
  display: grid;
  gap: 1rem;
}
.foundation-card h3 {
  margin: 0;
  font-size: 1rem;
  letter-spacing: var(--apollo-typography-letter-spacing-tight);
  text-transform: uppercase;
  color: var(--apollo-color-text-muted);
}
.token-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
.token-card {
  padding: 0.75rem;
  border-radius: var(--apollo-radius-md);
  background: var(--apollo-color-surface);
  border: 1px solid var(--apollo-color-border);
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
  font-size: 0.85rem;
  color: var(--apollo-color-text);
}
pre {
  margin: 0;
  background: var(--apollo-color-bg-subtle);
  border-radius: var(--apollo-radius-md);
  border: 1px solid var(--apollo-color-border);
  padding: 1rem;
  overflow-x: auto;
}
pre code {
  display: block;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.85rem;
  color: var(--apollo-color-text);
}
.component-shell {
  display: grid;
  gap: clamp(1.5rem, 4vw, 2.5rem);
  grid-template-columns: minmax(240px, 280px) 1fr;
}
.component-sidebar {
  display: grid;
  gap: var(--apollo-space-2);
  position: sticky;
  top: clamp(6rem, 12vh, 7rem);
  align-content: start;
}
.component-tab {
  display: grid;
  gap: 0.35rem;
  padding: calc(var(--apollo-space-3) + 2px);
  border-radius: var(--apollo-radius-lg);
  border: 1px solid color-mix(in srgb, var(--apollo-color-border) 65%, transparent);
  background: var(--apollo-color-bg-subtle);
  color: var(--apollo-color-text);
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
}
.component-tab[aria-selected='true'] {
  background: var(--apollo-color-accent-subtle);
  border-color: var(--apollo-color-accent);
  color: var(--apollo-color-accent-contrast);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--apollo-color-accent) 35%, transparent);
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
}
.component-panel {
  display: grid;
  gap: clamp(1.5rem, 4vw, 2.5rem);
}
.component-panel[hidden] {
  display: none;
}
.component-preview {
  display: grid;
  gap: var(--apollo-space-4);
  background: var(--apollo-color-bg-subtle);
  border: 1px solid color-mix(in srgb, var(--apollo-color-border) 60%, transparent);
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
  font-weight: var(--apollo-typography-weight-medium);
}
.demo-chip-row {
  display: inline-flex;
  align-items: center;
  gap: var(--apollo-space-2);
  flex-wrap: wrap;
}
.demo-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--apollo-space-1);
  border-radius: var(--apollo-radius-pill);
  padding: 0.35rem 0.6rem;
  background: var(--apollo-color-bg-subtle);
  color: var(--apollo-color-text-muted);
  font-size: 0.75rem;
  letter-spacing: 0.02em;
}
.demo-heading {
  margin: 0;
  font-size: 0.95rem;
  color: var(--apollo-color-text);
  font-weight: var(--apollo-typography-weight-semibold);
}
.component-preview [data-component='accordion-trigger']::after {
  margin-left: auto;
}
.component-preview [data-component='accordion-content'] {
  width: 100%;
}
.component-preview [data-component='tabs-content'] {
  background: var(--apollo-color-bg-subtle);
}
.component-preview [data-component='tabs-list'] {
  margin-bottom: var(--apollo-space-3);
}
.component-preview [data-component='tabs-trigger'] {
  min-width: 0;
}
.component-preview [data-component='tabs-trigger'][aria-selected='true'] {
  border-color: color-mix(in srgb, var(--apollo-color-accent) 35%, transparent);
}
.component-preview [data-component='tooltip-content'] {
  pointer-events: auto;
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
.footer {
  padding: 2.5rem 1.5rem 3.5rem;
  text-align: center;
  color: var(--apollo-color-text-muted);
  font-size: 0.875rem;
}
.footer a {
  color: inherit;
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
  section {
    padding: 1.25rem;
  }
  .hero {
    padding-left: 1.25rem;
    padding-right: 1.25rem;
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

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const id = trigger.dataset.moleculeTrigger;
      if (id) {
        activate(id, false);
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
  readonly title: string;
  readonly description?: string;
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

const toTitleCase = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

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

const Section = ({ title, description, children }: SectionProps): JSX.Element => (
  <section>
    <div>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
    {children}
  </section>
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

const DemoButton = ({ variant = 'solid', className, type, ...props }: DemoButtonProps): JSX.Element => (
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
            <input className="demo-input" id="demo-dialog-date" type="date" defaultValue="2024-09-21" />
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
          <span className="demo-helper">We'll ping whoever is on deck the morning of the visit.</span>
        </div>
        <Popover.Close aria-label="Close popover" />
        <Popover.Arrow />
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
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
          aria-controls={`${item.id}-panel`}
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
          id={`${item.id}-panel`}
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
        <style dangerouslySetInnerHTML={{ __html: `${APOLLO_THEME_CSS}${DOCS_STYLES}${STYLE_PLACEHOLDER}` }} />
      </head>
      <body>
        <header className="hero">
          <span className="tagline">Apollo UI</span>
          <h1>Design foundations & molecules</h1>
          <p>
            A snapshot of the tokens powering Apollo&apos;s UI system—fruit-forward palettes, neutral surfaces, tactile motion—and
            the Radix-powered molecules layered on top. Use the sidebar to explore live previews with accompanying code snippets.
          </p>
          <span className="base-hint">
            Served from base path <code>{basePath}</code>
          </span>
        </header>
        <main>
          <Section
            title="Molecule library"
            description="Dialogs, popovers, tabs, accordions, tooltips, and toasts wrapped with FruitUI styling. Browse with the sidebar to see each pattern in context."
          >
            <MoleculeShowcase items={MOLECULE_DOCS} />
          </Section>
          <Section
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
            title="Neutrals & statuses"
            description="Surface pairings for light and dark themes plus semantic feedback colors for success, warning, and danger flows."
          >
            <div className="palette-grid">
              {objectEntries(neutralTokens).map(([mode, ramp]) => (
                <article key={String(mode)} className="palette-card">
                  <h3>{`Neutrals · ${toTitleCase(String(mode))}`}</h3>
                  <ul className="swatch-list">
                    {objectEntries(ramp).map(([token, value]) => (
                      <ColorSwatch key={String(token)} label={String(token)} value={value} />
                    ))}
                  </ul>
                </article>
              ))}
              {objectEntries(statusTokens).map(([mode, ramp]) => (
                <article key={`${String(mode)}-status`} className="palette-card">
                  <h3>{`Statuses · ${toTitleCase(String(mode))}`}</h3>
                  <ul className="swatch-list">
                    {objectEntries(ramp).map(([token, value]) => (
                      <ColorSwatch key={String(token)} label={String(token)} value={value} />
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </Section>

          <Section
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
            title="Applying the theme"
            description="Inject the compiled CSS once and drive per-surface configuration via the headless theme helpers."
          >
            <pre>
              <code>{themeUsageExample}</code>
            </pre>
          </Section>
        </main>
        <footer className="footer">
          Built with the Apollo foundations &middot; Theme styles baked in via <code>@apollo/core</code>
        </footer>
        <script dangerouslySetInnerHTML={{ __html: MOLECULE_NAV_SCRIPT }} />
      </body>
    </html>
  );
};
