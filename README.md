# Apollo UI

Apollo UI is a type-safe React design system foundation built with Bun, inspired by the polish of [shadcn/ui](https://ui.shadcn.com/). It combines rich design tokens, an adaptive theme provider, and accessible primitives for quickly assembling product-quality interfaces.

## Features

- **Design tokens** for color, spacing, typography, motion, and state semantics.
- **Adaptive theming** with light/dark modes, high-contrast support, density scaling, and reduced-motion awareness.
- **Composable primitives** (`Box`, `Text`, `Button`, `Card`, `Stack`) powered by `styled-components`.
- **Strict TypeScript** APIs with zero `any`s and ergonomic defaults for frontend engineers.
- **Bun-native tooling** for rapid iteration with `bun test` and `bun run typecheck`.

## Getting started

```bash
bun install
bun run typecheck
bun test --coverage
```

## Usage

Wrap your application with `ApolloThemeProvider` to expose the theme context, then compose primitives to build surfaces.

```tsx
import {
  ApolloThemeProvider,
  Button,
  Card,
  Stack,
  Text,
} from "@apollo/ui";

export function Example(): JSX.Element {
  return (
    <ApolloThemeProvider>
      <Card padding="8" shadow="md" radius="xl" tone="accent">
        <Stack gap="4">
          <Text variant="headline">Welcome aboard</Text>
          <Text variant="body" color="muted">
            Build accessible experiences with Apollo UI primitives.
          </Text>
          <Button size="lg" tone="accent">
            Get started
          </Button>
        </Stack>
      </Card>
    </ApolloThemeProvider>
  );
}
```

### Theming controls

`ApolloThemeProvider` accepts `appearance`, `density`, and `highContrast` props (or corresponding change callbacks) to drive UI preferences. Consumers can also call `useApolloTheme()` to toggle modes at runtime.

Design tokens can be accessed directly via `createTheme`, `lightTheme`, and `darkTheme`, or by reading `theme` from the provider context.

## Testing

All primitives ship with Bun-powered tests to verify rendering, theming, and accessibility behaviours. Run the suite with coverage enabled via `bun test --coverage`.
