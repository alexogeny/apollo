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

const withAlpha = (hex: string, alpha: number): string => {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) {
    return hex;
  }
  const red = parseInt(normalized.slice(0, 2), 16);
  const green = parseInt(normalized.slice(2, 4), 16);
  const blue = parseInt(normalized.slice(4, 6), 16);
  const clamped = Math.min(1, Math.max(0, alpha));
  return `rgba(${red}, ${green}, ${blue}, ${clamped})`;
};

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
    background-image: ${({ theme }) =>
      [
        `radial-gradient(140% 120% at 0% 0%, ${withAlpha(theme.colors.action.accent.subtle, 0.55)} 0%, transparent 70%)`,
        `radial-gradient(120% 120% at 100% 0%, ${withAlpha(theme.colors.action.accent.solid, 0.32)} 0%, transparent 65%)`,
      ].join(", ")};
    background-repeat: no-repeat;
    background-attachment: fixed;
    color: ${({ theme }) => theme.colors.text.primary};
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
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

const Navigation = styled.nav`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space["2"]};
  padding: ${({ theme }) => `${theme.space["2"]} ${theme.space["2"]}`};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background-color: ${({ theme }) => theme.colors.surface.surfaceRaised};
  box-shadow: ${({ theme }) => theme.shadows.xs};
`;

const NavigationLink = styled.a`
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.space["2"]} ${theme.space["3"]}`};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.variants.detail.fontSize};
  line-height: ${({ theme }) => theme.typography.variants.detail.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.variants.detail.letterSpacing};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  border: 1px solid transparent;
  transition: ${({ theme }) =>
    theme.motion.reduced
      ? "none"
      : [
          `background-color ${theme.motion.duration.fast} ${theme.motion.easing.standard}`,
          `color ${theme.motion.duration.fast} ${theme.motion.easing.standard}`,
          `border-color ${theme.motion.duration.fast} ${theme.motion.easing.standard}`,
        ].join(", ")};
  &:hover {
    color: ${({ theme }) => theme.colors.text.accent};
    border-color: ${({ theme }) => theme.colors.border.subtle};
    background-color: ${({ theme }) => theme.colors.surface.surfaceSunken};
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
    <Card
      as="section"
      aria-labelledby="theme-controls-heading"
      padding="6"
      radius="xl"
      shadow="sm"
      border="subtle"
      background="surfaceRaised"
    >
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
            <Navigation aria-label="Section navigation">
              {NAVIGATION_LINKS.map((link) => (
                <NavigationLink key={link.id} href={`#${link.id}`}>
                  {link.label}
                </NavigationLink>
              ))}
            </Navigation>
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
