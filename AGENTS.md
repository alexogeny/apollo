# AGENTS.md — FruitUI (Radix-powered, Bun toolchain)

> Build a composable **React+TypeScript** UI system using **Radix UI** for behavior and our own **token-driven styling** (no Tailwind/SC). Keep Radix’s clean feel but add **character** via fruit-themed palettes, gentle radii, soft shadows, and tactile focus.

---

## Mission

Ship **FruitUI**: tokens → atoms → molecules → organisms. **Pure TS/React**, **Radix primitives**, **CSS variables** + a tiny `styled()` helper. First‑class themes: system/light/dark, High Contrast, Reduced Motion, color‑blind safe.

## Non-goals

No design tool sync, no CSS-in-JS libs, no heavy theming runtime.

---

## Tooling (Bun-first)

* **Runtime/Dev**: `bun` for install, scripts, test, bundling (`bun build`).
* **Lint/Format**: Add **ESLint** + **Prettier** (if Bun doesn’t provide). Strict TS.
* **Test**: `bun test` + Testing Library.
* **Scripts** (package.json):

  * `dev`: `bun run playground` (local docs app)
  * `build`: `bun build ./packages/fruitui/src/index.ts --outdir dist --target browser`
  * `lint`: `bunx eslint .`
  * `format`: `bunx prettier . --write`
  * `test`: `bun test`

---

## Packages & Layout

```
/packages/fruitui
  /src
    /foundations   # tokens, themes, modes, motions
    /styled        # createStyled(), cx()
    /atoms         # Button, Text, Input, Checkbox, Radio, Switch, Badge, Card
    /molecules     # Dialog*, Tooltip*, Popover*, Tabs*, Accordion*, Toast*
    /organisms     # ToastViewport, ModalStack
    index.ts
/docs (mdx)  /playground (bun dev)
```

\* built on **Radix UI** primitives.

---

## Visual Identity (give Radix character)

* **Fruit palettes** with subtle warmth: Apple, Blueberry, Lime, Papaya, Plum, Dragonfruit.
* **Signature touches** (tokenized):

  * Radius: `md` default, `xl` for interactive surfaces.
  * Shadows: low-elevation “velvet” shadow + crisp **focus ring**.
  * Motion: tiny spring‑like scale on press (disabled under PRM).
  * States: color + icon/shape (works for color blindness).

---

## Tokens (typed + CSS vars)

Categories: `color`, `space`, `radius`, `shadow`, `typography`, `motion`, `z`.
Scopes:

* `:root` (system) + `[data-theme="light|dark"]`
* `[data-palette]` for fruit ramps `--fruit-accent-50..900`
* HC: `@media (forced-colors: active)`
* PRM: `@media (prefers-reduced-motion: reduce)`
  Components **never hardcode** values; read from vars only.

---

## Styled Helper (rudimentary)

`styled(tag, { base, variants, compoundVariants, defaultVariants })` → returns typed component; maps variant props → classNames. Emits `data-*` state hooks. Zero theme math at runtime.

---

## Components

**Atoms**: Button, IconButton, Text, Heading, Input, Textarea, Select (headless+style), Checkbox, Radio, Switch, Badge/Tag, Card.
**Molecules (Radix)**: Dialog, Tooltip, Popover, Tabs, Accordion, Toast.
**Organisms**: ToastViewport, ModalStack.

Authoring rules: semantic HTML first; accessible by default; props `variant|tone|size`; no “god props”.

---

## Execution Steps (agent)

1. **Scaffold** repo (bun workspaces). Init TS strict, ESLint, Prettier.
2. **Foundations**: write `tokens.ts` + base `css-vars.css`; fruit palettes with contrast checks.
3. **Helper**: implement `cx()` + `createStyled()`; unit tests for variant typing.
4. **Atoms**: implement Button + tests as pattern baseline; then remaining atoms.
5. **Molecules**: wrap Radix primitives; add focus return, ARIA wiring.
6. **Docs**: MDX examples with theme/palette toggles, HC/PRM demos.
7. **QA**: axe, keyboard sweeps, contrast gate in CI; bundle size budget.
8. **Release** `0.1.0` via Bun scripts; MIT license; note shadcn/radix inspiration.

---

## Acceptance Criteria

* System/light/dark + HC + PRM verified.
* ≥3 fruit palettes pass contrast; states have non‑color affordances.
* Atoms+molecules ship with types, docs, tests; small bundle.
* Examples show composition **atoms → molecules → organisms**.

---

## Usage (consumer)

```tsx
<html data-theme="dark" data-palette="plum"/>
import { Button, Dialog } from "@fruitui/core";
<Button tone="accent" size="lg">Continue</Button>
<Dialog.Root>
  <Dialog.Trigger asChild><Button variant="outline">Open</Button></Dialog.Trigger>
  <Dialog.Content>{/* styled via tokens */}</Dialog.Content>
</Dialog.Root>
```

**North star**: Radix reliability, **FruitUI personality**—friendly radii, cozy shadows, vibrant fruit accents, disciplined tokens.
