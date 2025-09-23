# Apollo UI

Apollo UI is a React component system tailored for modern dashboard experiences. It embraces the [shadcn/ui manual installation approach](https://ui.shadcn.com/docs/installation/manual) to deliver a set of polished molecules and organisms backed by accessible primitives, WCAG-compliant color palettes, and reduced-motion awareness.

## Highlights

- **Adaptive theming** — light/dark switching, high-contrast tones, and motion preferences powered by a lightweight theme provider.
- **Accessible molecules** — metric cards, filter toolbars, insight lists, and activity timelines that communicate trend direction, sparklines, and statuses in screen-reader friendly ways.
- **Dashboard-ready organisms** — opinionated layouts such as the revenue overview composed with Radix primitives and utility-first styling.
- **Tailwind-first styling** — components ship with ready-to-use class names; import the shared stylesheet once to unlock the full design token set.
- **Bun-native toolchain** — testing, type-checking, and documentation all run via Bun for fast feedback loops.

## Getting started

Install dependencies and run the automated checks:

```bash
bun install
bun run typecheck
bun test --coverage
```

## Usage

Import the design tokens by including the stylesheet once in your application entry, then wrap your tree with the `ThemeProvider` to honour system preferences and runtime toggles.

```tsx
import "@apollo/ui/styles/tailwind.css";

import {
  ActivityTimeline,
  AnalyticsOverview,
  DashboardHeader,
  FilterToolbar,
  ThemeProvider,
} from "@apollo/ui";

export function App(): JSX.Element {
  return (
    <ThemeProvider>
      <div className="space-y-8">
        <DashboardHeader
          title="Revenue performance hub"
          description="Bring revenue, adoption, and engagement into one dashboard."
        />
        <FilterToolbar filters={[{ label: "Enterprise", value: "enterprise", active: true }]} />
        <AnalyticsOverview
          metrics={[]}
          timeline={{ events: [], title: "Activity" }}
        />
        <ActivityTimeline
          title="Key handoffs"
          events={[
            { id: "1", title: "Review", description: "Design review shipped", timestamp: "Today" },
          ]}
        />
      </div>
    </ThemeProvider>
  );
}
```

Every component ships with strict TypeScript types—hover tooltips surface the required props and sensible defaults.

### Theme provider controls

The `ThemeProvider` exposes `setSchemePreference`, `setHighContrastPreference`, and `setMotionPreference` for runtime adjustments. These preferences update `document.documentElement` attributes so Tailwind utilities and custom styles can react without extra configuration.

## Documentation

The `docs` package contains a Vite-powered preview of the molecules and organisms. Start it locally with:

```bash
bun run docs:dev
```

A GitHub Action named **Deploy documentation** builds `docs/dist` with Bun and publishes it to GitHub Pages on every push to `main`.

## Testing

Bun drives the test suite through `@testing-library/react`, ensuring theming hooks and dashboard patterns remain accessible. Run the full suite with:

```bash
bun test --coverage
```

Type checking uses the shared project configuration. Run it manually via:

```bash
bun run typecheck
```
