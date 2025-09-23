# Mission (Single Sentence)

Design and implement a pure React + TypeScript UI framework inspired by shadcn/ui’s visual language, but with no Tailwind or styled-components, featuring a tiny in-house styled-componentry helper, fully tokenized CSS variables, built-in themes (system/light/dark), high-contrast, reduced motion, color-blind safe palettes, and a layered atoms → molecules → organisms component architecture.

## Success Criteria (What “Good” Looks Like)

Ergonomics: Type-safe props, minimal surface area, easy composition; zero “god props”.

Visual parity: Feels like shadcn/ui’s aesthetic (spacing, radii, shadows), without copying code or requiring Tailwind.

Design tokens: 100% of color/space/typography/shadow/radius/z-index/motion defined as CSS variables with TypeScript types for intellisense.

Theming: Works out-of-the-box with system/light/dark + High Contrast (forced-colors) + Reduced Motion + color-blind safe palettes.

Accessibility: Conforms to WCAG 2.2 AA; proper roles/labels/tab order/focus states; passes automated checks.

Zero/near-zero deps: Only React + (optional) tiny utilities for testing/build; no Tailwind, no styled-components.

Documentation & Examples: Clear docs, live Storybook-like examples, usage recipes, and theming guides.

Testing & CI: Unit/visual/a11y tests; PR checks block regressions.

## Constraints / Ground Rules

Language/Runtime: TypeScript, React 18+; DOM web only (no RN).

Dependencies: React (required). Optional: @testing-library/react, vitest/jest, tsup/rollup. Avoid runtime deps beyond these.

Styling approach: CSS variables + a tiny styled() helper (in-house) that:

Merges classNames and style objects.

Applies variant maps → class/inline styles.

Emits data-attributes for states (e.g., data-state="open").

Zero runtime theme re-computation; themes via :root vars + scopes.

File structure: strict atoms/, molecules/, organisms/, foundations/; no cross-layer imports upward.

Accessibility: Build with semantic elements first; ARIA only when necessary; keyboard and screen reader parity required.

Performance: No layout thrash; avoid re-renders; motion honors prefers-reduced-motion.

Licensing: MIT; attribute visual inspiration to shadcn/ui in README.

## Information & Inspirations (Do Not Copy Code)

Visual tone: shadcn/ui (rounded, subtle shadows, soft radii, tasteful contrast).

Component coverage v1: Button, IconButton, Text, Heading, Input, Textarea, Select, Checkbox, Radio, Switch, Badge, Tag/Chip, Tooltip, Popover, Dialog/Modal, Toast, Card, Tabs, Accordion.

## Deliverables

Package @apollo/core with:
- foundations/ tokens & themes
- styled/ helper
- atoms/, molecules/, organisms/
- themes/ fruit palettes
- a11y/ utilities

Documentation site with live examples.

Test suite (unit + a11y + basic visual snapshots).

CI config (typecheck, lint, test, size-limit).

Playground app showing theme switching, HC mode, reduced motion.

Design Token reference (MDX): maps & rationale.

## Fruit-Themed Palettes (Color-blind Safe Emphasis)

Provide multiple palettes, each a set of HSL ramps with accessible contrasts:

Apple (neutral + red accent)

Blueberry (cool blues)

Lime (greens/teals)

Papaya (warm orange)

Plum (violet/purple)

Dragonfruit (magenta accent)