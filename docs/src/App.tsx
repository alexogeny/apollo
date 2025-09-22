import { useMemo } from "react";
import styled, { createGlobalStyle } from "styled-components";

import {
  Box,
  Button,
  Card,
  Stack,
  Text,
  type AppearanceOption,
  useApolloTheme,
} from "@apollo/ui";

import { AtomsSection } from "./sections/Atoms";
import { MoleculesSection } from "./sections/Molecules";
import { OrganismsSection } from "./sections/Organisms";

const GlobalStyles = createGlobalStyle`
  :root {
    color-scheme: ${({ theme }) => theme.appearance};
  }
  *, *::before, *::after {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    font-family: ${({ theme }) => theme.typography.fonts.sans};
    background-color: ${({ theme }) => theme.colors.surface.background};
    color: ${({ theme }) => theme.colors.text.primary};
    min-height: 100vh;
  }
  a {
    color: inherit;
  }
`;

const NAVIGATION_LINKS = [
  { id: "atoms", label: "Atoms" },
  { id: "molecules", label: "Molecules" },
  { id: "organisms", label: "Organisms" },
] as const;

const NavigationLink = styled.a`
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.space["2"]} ${theme.space["3"]}`};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.surface.surfaceSunken};
  color: ${({ theme }) => theme.colors.action.accent.solid};
  font-size: ${({ theme }) => theme.typography.variants.detail.fontSize};
  line-height: ${({ theme }) => theme.typography.variants.detail.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.variants.detail.letterSpacing};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  transition: ${({ theme }) =>
    theme.motion.reduced
      ? "none"
      : `background-color ${theme.motion.duration.fast} ${theme.motion.easing.standard}`};
  &:hover {
    background-color: ${({ theme }) => theme.colors.surface.surfaceRaised};
  }
  &:focus-visible {
    outline: none;
    box-shadow:
      ${({ theme }) => theme.shadows.xs},
      0 0 0 4px ${({ theme }) => theme.colors.states.focusRing};
  }
`;

interface ToggleOption<T extends string> {
  readonly value: T;
  readonly label: string;
}

interface ToggleGroupProps<T extends string> {
  readonly label: string;
  readonly value: T;
  readonly onChange: (value: T) => void;
  readonly options: ReadonlyArray<ToggleOption<T>>;
}

function ToggleGroup<T extends string>({
  label,
  value,
  onChange,
  options,
}: ToggleGroupProps<T>): JSX.Element {
  return (
    <Stack gap="2" as="div">
      <Text as="span" variant="detail" color="secondary" weight="semibold">
        {label}
      </Text>
      <Stack direction="horizontal" gap="2" wrap>
        {options.map((option) => {
          const isActive = option.value === value;
          return (
            <Button
              key={option.value}
              variant={isActive ? "solid" : "outline"}
              tone={isActive ? "accent" : "neutral"}
              size="sm"
              aria-pressed={isActive}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </Button>
          );
        })}
      </Stack>
    </Stack>
  );
}

type ContrastToggleValue = "enabled" | "disabled";

type DensityToggleValue = "comfortable" | "compact";

type AppearanceToggleValue = AppearanceOption;

function PreferencesPanel(): JSX.Element {
  const {
    appearancePreference,
    setAppearance,
    density,
    setDensity,
    highContrast,
    setHighContrast,
  } = useApolloTheme();

  const contrastValue: ContrastToggleValue = highContrast ? "enabled" : "disabled";

  const appearanceOptions = useMemo(
    () =>
      [
        { value: "system", label: "System" },
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
      ] as const,
    [],
  );

  const densityOptions = useMemo(
    () =>
      [
        { value: "comfortable", label: "Comfortable" },
        { value: "compact", label: "Compact" },
      ] as const,
    [],
  );

  const contrastOptions = useMemo(
    () =>
      [
        { value: "enabled", label: "Enabled" },
        { value: "disabled", label: "Disabled" },
      ] as const,
    [],
  );

  const handleContrastChange = (next: ContrastToggleValue) => {
    setHighContrast(next === "enabled");
  };

  return (
    <Card as="section" aria-labelledby="theme-controls-heading" padding="6">
      <Stack gap="4">
        <Stack gap="1">
          <Text as="h2" id="theme-controls-heading" variant="subtitle" weight="semibold">
            Theme controls
          </Text>
          <Text as="p" variant="body" color="secondary">
            Toggle appearance preferences to preview how primitives respond to density and contrast changes.
          </Text>
        </Stack>
        <Stack direction="horizontal" gap="6" wrap>
          <ToggleGroup<AppearanceToggleValue>
            label="Appearance"
            value={appearancePreference}
            onChange={setAppearance}
            options={appearanceOptions}
          />
          <ToggleGroup<DensityToggleValue>
            label="Density"
            value={density}
            onChange={setDensity}
            options={densityOptions}
          />
          <ToggleGroup<ContrastToggleValue>
            label="High contrast"
            value={contrastValue}
            onChange={handleContrastChange}
            options={contrastOptions}
          />
        </Stack>
      </Stack>
    </Card>
  );
}

export function App(): JSX.Element {
  return (
    <>
      <GlobalStyles />
      <Box as="main" paddingX="6" paddingY="12">
        <Stack gap="12" style={{ maxWidth: "1040px", margin: "0 auto" }}>
          <Stack as="header" gap="6">
            <Stack gap="2">
              <Text as="h1" variant="headline" weight="semibold" wrap="balance">
                Apollo UI design system documentation
              </Text>
              <Text as="p" variant="body" color="secondary">
                Explore the foundational atoms, composite molecules, and opinionated organisms built with Apollo UI primitives.
              </Text>
            </Stack>
            <Stack direction="horizontal" gap="3" wrap as="nav" aria-label="Section navigation">
              {NAVIGATION_LINKS.map((link) => (
                <NavigationLink key={link.id} href={`#${link.id}`}>
                  {link.label}
                </NavigationLink>
              ))}
            </Stack>
            <PreferencesPanel />
          </Stack>
          <AtomsSection />
          <MoleculesSection />
          <OrganismsSection />
          <Text as="p" variant="detail" color="secondary" align="center">
            Built with ❤️ using Apollo UI primitives.
          </Text>
        </Stack>
      </Box>
    </>
  );
}
