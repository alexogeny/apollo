import { useCallback, useEffect, useMemo, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";

import {
  Badge,
  Button,
  Card,
  Sidebar,
  Stack,
  Text,
  type AppearanceOption,
  type SidebarSection,
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

const NAVIGATION_LINKS: ReadonlyArray<{
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly badgeLabel?: string;
}> = [
  {
    id: "atoms",
    label: "Atoms",
    description: "Foundational tokens and primitives",
  },
  {
    id: "molecules",
    label: "Molecules",
    description: "Composable patterns and overlays",
  },
  {
    id: "organisms",
    label: "Organisms",
    description: "Product-ready experience templates",
    badgeLabel: "New",
  },
];

const Layout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space["10"]};
  grid-template-columns: minmax(260px, 320px) minmax(0, 1fr);
  align-items: start;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.space["10"]} ${theme.space["6"]}`};

  @media (max-width: 1024px) {
    grid-template-columns: minmax(0, 1fr);
    padding: ${({ theme }) => `${theme.space["8"]} ${theme.space["5"]}`};
  }
`;

const SidebarPanel = styled.div`
  position: sticky;
  top: ${({ theme }) => theme.space["8"]};
  align-self: start;
  max-height: ${({ theme }) => `calc(100vh - (${theme.space["8"]} * 2))`};
  width: 100%;
  display: flex;

  @media (max-width: 1024px) {
    position: static;
    max-height: none;
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space["12"]};
  min-width: 0;
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
  const [activeSection, setActiveSection] = useState<string>(NAVIGATION_LINKS[0]?.id ?? "atoms");

  const sidebarSections = useMemo<ReadonlyArray<SidebarSection>>(
    () => [
      {
        id: "page-navigation",
        title: "On this page",
        items: NAVIGATION_LINKS.map((link) => ({
          id: link.id,
          label: link.label,
          description: link.description,
          href: `#${link.id}`,
          badge: link.badgeLabel
            ? { label: link.badgeLabel, tone: "accent", variant: "subtle" }
            : undefined,
        })),
      },
    ],
    [],
  );

  const handleItemSelect = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.IntersectionObserver) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);
        if (visible[0]) {
          const nextId = visible[0].target.id;
          setActiveSection((prev) => (prev === nextId ? prev : nextId));
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0.25 },
    );

    const elements = NAVIGATION_LINKS.map((link) => document.getElementById(link.id)).filter(
      (element): element is HTMLElement => element !== null,
    );
    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <GlobalStyles />
      <Layout>
        <SidebarPanel>
          <Sidebar
            sections={sidebarSections}
            activeItemId={activeSection}
            onItemSelect={handleItemSelect}
            ariaLabel="Documentation navigation"
            header={
              <Stack gap="2">
                <Text as="span" variant="subtitle" weight="semibold">
                  Apollo UI
                </Text>
                <Stack direction="horizontal" gap="2" align="center">
                  <Badge variant="subtle" tone="accent">
                    v0.3 preview
                  </Badge>
                  <Text as="span" variant="detail" color="secondary">
                    Design system
                  </Text>
                </Stack>
                <Text as="p" variant="detail" color="secondary">
                  Navigate foundational atoms, expressive molecules, and opinionated organisms.
                </Text>
              </Stack>
            }
            footer={
              <Stack gap="2">
                <Text as="span" variant="detail" color="secondary">
                  Need a hand? Join the #apollo-ui channel or reach out at
                </Text>
                <Text as="a" href="mailto:design@apollo.dev" variant="detail" color="accent">
                  design@apollo.dev
                </Text>
              </Stack>
            }
          />
        </SidebarPanel>
        <MainColumn>
          <Stack as="header" gap="6">
            <Stack gap="3">
              <Stack direction="horizontal" gap="2" align="center">
                <Badge variant="subtle" tone="accent">
                  Update
                </Badge>
                <Text as="span" variant="detail" color="secondary">
                  Sidebar molecule and dashboard organism just landed.
                </Text>
              </Stack>
              <Stack gap="2">
                <Text as="h1" variant="headline" weight="semibold" wrap="balance">
                  Apollo UI design system documentation
                </Text>
                <Text as="p" variant="body" color="secondary">
                  Explore the foundational atoms, composite molecules, and production-ready organisms built with Apollo UI primitives.
                </Text>
              </Stack>
            </Stack>
            <PreferencesPanel />
          </Stack>
          <AtomsSection />
          <MoleculesSection />
          <OrganismsSection />
          <Text as="p" variant="detail" color="secondary" align="center">
            Built with ❤️ using Apollo UI primitives.
          </Text>
        </MainColumn>
      </Layout>
    </>
  );
}
