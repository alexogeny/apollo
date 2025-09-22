# AGENTS.md — **Apollo (Frontend)**

---

## Tech Defaults

* **Runtime:** [bun.sh](https://bun.sh/) — build, test, run.
* **Language:** Pure **TypeScript** (`.tsx`).
* **Framework:** **React**, depending only on core primitives + types.
* **Styling:** **styled-components** allowed; no Tailwind or CSS frameworks.
* **Dependencies:** Avoid non-vanilla React libraries unless absolutely necessary and justified.

---

## Code Style

* **Strict typing.** All inputs/outputs must be typed; never use `any`.
* **Modern React.** Prefer `useTransition`, `Suspense`, server components, tokens, and signals over legacy patterns.
* **No "god props".** Keep components composable, granular, and ergonomic.
* **Semantic components.** Build atom → molecule → organism primitives, always declarative and reusable.
* **Declarative namespacing.** Organize components and APIs under logical, discoverable namespaces.

---

## Accessibility & User Experience

* Conform to **WCAG 2.0/2.1/2.2** accessibility standards.
* Support **color blindness** with validated palettes.
* Respect user settings: **reduced motion**, **high contrast**, **light/dark/system** themes.
* Test all primitives with accessibility tooling before release.

---

## Testing & CI

* All components must ship with tests covering rendering, typing, and accessibility.
* PRs must pass Bun test runner with coverage checks.
* No component merges without accessibility and theming verification.

---

## Definition of Done

* Runs with Bun, type-safe with TSX React primitives.
* Components are composable, semantic, and declarative.
* Accessibility and user preferences supported out-of-the-box.
* Zero lint/type errors, coverage near 100%, CI green.

*Keep it strict, clean, ergonomic, and accessible.*
