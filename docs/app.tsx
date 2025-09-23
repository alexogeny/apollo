import type { ReactNode } from 'react';

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
.footer {
  padding: 2.5rem 1.5rem 3.5rem;
  text-align: center;
  color: var(--apollo-color-text-muted);
  font-size: 0.875rem;
}
.footer a {
  color: inherit;
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
        <style dangerouslySetInnerHTML={{ __html: `${APOLLO_THEME_CSS}${DOCS_STYLES}` }} />
      </head>
      <body>
        <header className="hero">
          <span className="tagline">Apollo UI</span>
          <h1>Design tokens & primitives</h1>
          <p>
            A quick snapshot of the foundation layer powering Apollo&apos;s atoms and organisms — fruit-forward palettes,
            neutral surfaces, and tactile motion scales expressed as CSS variables.
          </p>
          <span className="base-hint">
            Served from base path <code>{basePath}</code>
          </span>
        </header>
        <main>
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
      </body>
    </html>
  );
};
