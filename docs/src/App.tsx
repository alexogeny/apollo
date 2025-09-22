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

import { Section } from "./components/Section";
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
  html {
    scroll-behavior: smooth;
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
    text-decoration: none;
  }
`;

interface NavigationItem {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly badgeLabel?: string;
}

interface NavigationGroup {
  readonly id: string;
  readonly title: string;
  readonly items: ReadonlyArray<NavigationItem>;
}

const DOC_NAVIGATION: ReadonlyArray<NavigationGroup> = [
  {
    id: "guide",
    title: "Guide",
    items: [
      {
        id: "overview",
        label: "Overview",
        description: "Understand the Apollo UI design system",
      },
      {
        id: "installation",
        label: "Installation",
        description: "Install the package and wire the provider",
      },
      {
        id: "theming",
        label: "Theming",
        description: "Preview density, contrast, and tokens",
      },
    ],
  },
  {
    id: "catalog",
    title: "Component catalog",
    items: [
      {
        id: "atoms",
        label: "Atoms",
        description: "Foundational tokens and primitives",
      },
      {
        id: "molecules",
        label: "Molecules",
        description: "Composable interaction patterns",
      },
      {
        id: "organisms",
        label: "Organisms",
        description: "Application-level scaffolds",
        badgeLabel: "New",
      },
    ],
  },
  {
    id: "resources-nav",
    title: "Resources",
    items: [
      {
        id: "resources",
        label: "Resources",
        description: "Release notes, tokens, and support",
      },
    ],
  },
];

const SECTION_IDS = DOC_NAVIGATION.flatMap((group) => group.items.map((item) => item.id));

interface CatalogFeature {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly actionLabel: string;
  readonly href: string;
  readonly badge?: string;
}

const CATALOG_FEATURES: ReadonlyArray<CatalogFeature> = [
  {
    id: "feature-atoms",
    title: "Atoms",
    description: "Tokens, surfaces, and primitive controls tuned for accessibility.",
    actionLabel: "Review atoms",
    href: "#atoms",
    badge: "Foundations",
  },
  {
    id: "feature-molecules",
    title: "Molecules",
    description: "Dialogs, menus, tables, and overlays composed from atoms.",
    actionLabel: "Preview molecules",
    href: "#molecules",
    badge: "Patterns",
  },
  {
    id: "feature-organisms",
    title: "Organisms",
    description: "Dashboard layouts and app shells ready for product teams.",
    actionLabel: "Open organisms",
    href: "#organisms",
    badge: "Experiences",
  },
  {
    id: "feature-playground",
    title: "Developer playground",
    description: "Tune appearance, density, and contrast with live components.",
    actionLabel: "Launch theming controls",
    href: "#theming",
    badge: "Interactive",
  },
];

interface InstallStep {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly code: string;
  readonly ariaLabel: string;
  readonly hint?: string;
}
const INSTALL_STEPS: ReadonlyArray<InstallStep> = [
  {
    id: "install-packages",
    title: "Install the packages",
    description: "Add @apollo/ui and styled-components to your project using your package manager of choice.",
    code: "bun add @apollo/ui styled-components",
    ariaLabel: "Command to install Apollo UI and styled-components",
    hint: "Apollo UI targets React 18+ and pairs with the styled-components v6 runtime.",
  },
  {
    id: "wrap-provider",
    title: "Wrap your application",
    description: "Provide the ApolloThemeProvider near the root of your app to unlock tokens and preference controls.",
    code: `import { ApolloThemeProvider } from "@apollo/ui";

export function App() {
  return (
    <ApolloThemeProvider>
      <YourProduct />
    </ApolloThemeProvider>
  );
}`,
    ariaLabel: "Example of wrapping an application with ApolloThemeProvider",
    hint: "The provider respects system appearance, density, motion, and high-contrast preferences out of the box.",
  },
];

interface ThemeApiPoint {
  readonly id: string;
  readonly label: string;
  readonly description: string;
}

const THEME_API_POINTS: ReadonlyArray<ThemeApiPoint> = [
  {
    id: "appearance",
    label: "appearance",
    description: "Resolved light or dark theme derived from the user's preference.",
  },
  {
    id: "setAppearance",
    label: "setAppearance(next)",
    description: "Override appearance programmatically to preview themes.",
  },
  {
    id: "density",
    label: "density",
    description: "Active spacing scale (comfortable or compact) used across components.",
  },
  {
    id: "highContrast",
    label: "highContrast",
    description: "Boolean flag indicating when contrast-enhanced tokens are active.",
  },
];

interface ResourceItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly actionLabel: string;
  readonly href: string;
  readonly target?: "_blank";
  readonly rel?: string;
  readonly badge?: string;
}

const RESOURCE_ITEMS: ReadonlyArray<ResourceItem> = [
  {
    id: "resource-changelog",
    title: "Changelog",
    description: "Track changes to tokens, primitives, and high-level patterns as they ship.",
    actionLabel: "View release notes",
    href: "https://github.com/apollo/ui/releases",
    target: "_blank",
    rel: "noreferrer",
    badge: "Updated weekly",
  },
  {
    id: "resource-tokens",
    title: "Design tokens",
    description: "Explore the source of truth for colors, typography, spacing, and motion values.",
    actionLabel: "Browse theme tokens",
    href: "https://github.com/apollo/ui/tree/main/src/theme",
    target: "_blank",
    rel: "noreferrer",
  },
  {
    id: "resource-support",
    title: "Support",
    description: "Join the #apollo-ui channel or email the design systems team for implementation help.",
    actionLabel: "Email design@apollo.dev",
    href: "mailto:design@apollo.dev",
    badge: "Team inbox",
  },
];

const Layout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space["12"]};
  grid-template-columns: minmax(280px, 320px) minmax(0, 1fr);
  align-items: start;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.space["12"]} ${theme.space["8"]}`};

  @media (max-width: 1200px) {
    grid-template-columns: minmax(260px, 300px) minmax(0, 1fr);
  }

  @media (max-width: 1040px) {
    grid-template-columns: minmax(0, 1fr);
    padding: ${({ theme }) => `${theme.space["10"]} ${theme.space["6"]}`};
  }

  @media (max-width: 720px) {
    padding: ${({ theme }) => `${theme.space["8"]} ${theme.space["5"]}`};
  }
`;

const SidebarPanel = styled.div`
  position: sticky;
  top: ${({ theme }) => theme.space["10"]};
  align-self: start;
  max-height: ${({ theme }) => `calc(100vh - (${theme.space["10"]} * 2))`};
  width: 100%;
  display: flex;

  @media (max-width: 1040px) {
    position: static;
    max-height: none;
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space["14"]};
  min-width: 0;
`;

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space["8"]};
  scroll-margin-top: ${({ theme }) => `calc(${theme.space["12"]} + ${theme.space["4"]})`};
`;

const HeroContentGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space["6"]};
  grid-template-columns: minmax(0, 1fr) minmax(0, 420px);
  align-items: stretch;

  @media (max-width: 960px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space["4"]};
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`;

const InstallGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space["6"]};
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
`;

const ThemingGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space["6"]};
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
`;

const ResourceGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space["6"]};
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
`;

const CodeBlock = styled.pre`
  margin: 0;
  padding: ${({ theme }) => `${theme.space["3"]} ${theme.space["4"]}`};
  background: ${({ theme }) => theme.colors.surface.surface};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: ${({ theme }) => theme.typography.variants.code.fontSize};
  line-height: ${({ theme }) => theme.typography.variants.code.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.variants.code.letterSpacing};
  color: ${({ theme }) => theme.colors.text.primary};
  overflow-x: auto;
  tab-size: 2;
`;

const InlineCode = styled(Text).attrs({
  as: "code",
  variant: "code",
})`
  display: inline-flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.space["2"]};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surface.surfaceSunken};
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

type ThemeSummaryTone = "accent" | "neutral" | "warning";

function ThemePlayground(): JSX.Element {
  const {
    appearance,
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

  const summaryItems = useMemo<
    ReadonlyArray<{ id: string; label: string; value: string; tone: ThemeSummaryTone }>
  >(
    () => [
      {
        id: "appearance",
        label: "Appearance",
        value:
          appearancePreference === "system"
            ? `System (${appearance})`
            : appearancePreference,
        tone: "accent",
      },
      {
        id: "density",
        label: "Density",
        value: density,
        tone: "neutral",
      },
      {
        id: "contrast",
        label: "Contrast",
        value: highContrast ? "High" : "Standard",
        tone: highContrast ? "warning" : "neutral",
      },
    ],
    [appearance, appearancePreference, density, highContrast],
  );

  const handleContrastChange = (next: ContrastToggleValue) => {
    setHighContrast(next === "enabled");
  };

  return (
    <Card
      as="section"
      aria-labelledby="theme-playground-heading"
      padding="6"
      radius="lg"
      shadow="xs"
      border="subtle"
      background="surfaceRaised"
    >
      <Stack gap="5">
        <Stack gap="2">
          <Stack gap="1">
            <Text as="h3" id="theme-playground-heading" variant="subtitle" weight="semibold">
              Theming controls
            </Text>
            <Text as="p" variant="body" color="secondary">
              Adjust appearance, density, and high-contrast modes to preview how components respond in real time.
            </Text>
          </Stack>
          <Stack direction="horizontal" gap="2" wrap>
            {summaryItems.map((item) => (
              <Badge key={item.id} variant="subtle" tone={item.tone}>
                {item.label}: {item.value}
              </Badge>
            ))}
          </Stack>
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
  const [activeSection, setActiveSection] = useState<string>(SECTION_IDS[0] ?? "overview");

  const sidebarSections = useMemo<ReadonlyArray<SidebarSection>>(
    () =>
      DOC_NAVIGATION.map((group) => ({
        id: group.id,
        title: group.title,
        items: group.items.map((item) => ({
          id: item.id,
          label: item.label,
          description: item.description,
          href: `#${item.id}`,
          badge: item.badgeLabel
            ? { label: item.badgeLabel, tone: "accent", variant: "subtle" }
            : undefined,
        })),
      })),
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

    const elements = SECTION_IDS.map((sectionId) => document.getElementById(sectionId)).filter(
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
            ariaLabel="Apollo UI documentation navigation"
            header={
              <Stack gap="3">
                <Stack direction="horizontal" gap="2" align="center" wrap>
                  <Badge variant="subtle" tone="accent">
                    Apollo UI
                  </Badge>
                  <Badge variant="outline" tone="neutral">
                    Docs
                  </Badge>
                  <Badge variant="outline" tone="neutral">
                    v0.3 preview
                  </Badge>
                </Stack>
                <Text as="span" variant="detail" color="secondary">
                  Compose interfaces with atomic primitives, expressive molecules, and production-ready organisms.
                </Text>
              </Stack>
            }
            footer={
              <Stack gap="2">
                <Text as="span" variant="detail" color="secondary">
                  Need support? Visit resources below or reach out to the design systems team.
                </Text>
                <Text as="a" href="mailto:design@apollo.dev" variant="detail" color="accent">
                  design@apollo.dev
                </Text>
              </Stack>
            }
          />
        </SidebarPanel>
        <MainColumn>
          <HeroSection id="overview" aria-labelledby="overview-heading">
            <HeroContentGrid>
              <Stack gap="4">
                <Stack direction="horizontal" gap="2" align="center" wrap>
                  <Badge variant="subtle" tone="accent">
                    Apollo UI
                  </Badge>
                  <Badge variant="outline" tone="neutral">
                    React 18
                  </Badge>
                  <Badge variant="outline" tone="neutral">
                    v0.3 preview
                  </Badge>
                </Stack>
                <Stack gap="2">
                  <Text as="h1" id="overview-heading" variant="display" weight="semibold" wrap="balance">
                    Build polished product surfaces with atomic clarity
                  </Text>
                  <Text as="p" variant="body" color="secondary">
                    Compose atoms, molecules, and organisms to deliver accessible experiences with a single theme contract.
                  </Text>
                  <Text as="p" variant="detail" color="secondary">
                    Apollo UI pairs modern React patterns with an adaptive design token system so product teams can ship faster.
                  </Text>
                </Stack>
                <Stack direction="horizontal" gap="3" wrap>
                  <Button size="sm" as="a" href="#installation">
                    Get started
                  </Button>
                  <Button size="sm" variant="outline" tone="neutral" as="a" href="#molecules">
                    Browse components
                  </Button>
                </Stack>
              </Stack>
              <Card padding="6" radius="xl" shadow="xs" border="subtle" background="surfaceSunken">
                <Stack gap="4">
                  <Stack gap="1">
                    <Text as="span" variant="detail" color="secondary">
                      Quick start
                    </Text>
                    <Text as="span" variant="subtitle" weight="semibold">
                      Install and wrap your application
                    </Text>
                  </Stack>
                  <CodeBlock aria-label="Install Apollo UI">
                    bun add @apollo/ui styled-components
                  </CodeBlock>
                  <CodeBlock aria-label="Wrap your product with ApolloThemeProvider">
{`import { ApolloThemeProvider } from "@apollo/ui";

export function App() {
  return (
    <ApolloThemeProvider>
      <YourProduct />
    </ApolloThemeProvider>
  );
}`}
                  </CodeBlock>
                  <Text as="p" variant="detail" color="secondary">
                    Every primitive honors density, appearance, reduced motion, and high-contrast preferences by default.
                  </Text>
                </Stack>
              </Card>
            </HeroContentGrid>
            <FeatureGrid>
              {CATALOG_FEATURES.map((feature) => (
                <Card
                  key={feature.id}
                  padding="5"
                  radius="lg"
                  shadow="none"
                  border="subtle"
                  background="surfaceSunken"
                >
                  <Stack gap="3">
                    {feature.badge ? (
                      <Badge variant="subtle" tone="accent">
                        {feature.badge}
                      </Badge>
                    ) : null}
                    <Text as="h3" variant="subtitle" weight="semibold">
                      {feature.title}
                    </Text>
                    <Text as="p" variant="detail" color="secondary">
                      {feature.description}
                    </Text>
                    <Button size="sm" variant="ghost" tone="accent" as="a" href={feature.href}>
                      {feature.actionLabel}
                    </Button>
                  </Stack>
                </Card>
              ))}
            </FeatureGrid>
          </HeroSection>
          <Section
            id="installation"
            title="Installation"
            description="Add Apollo UI to your stack and initialize the theming provider."
          >
            <InstallGrid>
              {INSTALL_STEPS.map((step, index) => (
                <Card key={step.id} padding="6" radius="lg" shadow="xs" border="subtle" background="surface">
                  <Stack gap="4">
                    <Stack gap="2">
                      <Stack direction="horizontal" gap="2" align="center">
                        <Badge variant="subtle" tone="accent">
                          Step {index + 1}
                        </Badge>
                      </Stack>
                      <Text as="h3" variant="subtitle" weight="semibold">
                        {step.title}
                      </Text>
                      <Text as="p" variant="body" color="secondary">
                        {step.description}
                      </Text>
                    </Stack>
                    <CodeBlock aria-label={step.ariaLabel}>{step.code}</CodeBlock>
                    {step.hint ? (
                      <Text as="p" variant="detail" color="secondary">
                        {step.hint}
                      </Text>
                    ) : null}
                  </Stack>
                </Card>
              ))}
            </InstallGrid>
          </Section>
          <Section
            id="theming"
            title="Theming & preferences"
            description="Preview density, contrast, and appearance controls to understand how tokens respond."
          >
            <ThemingGrid>
              <ThemePlayground />
              <Card padding="6" radius="lg" shadow="xs" border="subtle" background="surfaceSunken">
                <Stack gap="4">
                  <Stack gap="1">
                    <Text as="span" variant="detail" color="secondary">
                      Developer API
                    </Text>
                    <Text as="h3" variant="subtitle" weight="semibold">
                      Access tokens in React
                    </Text>
                  </Stack>
                  <Text as="p" variant="body" color="secondary">
                    Use the <InlineCode>useApolloTheme</InlineCode> hook to read live design tokens and respond to user preferences across your product.
                  </Text>
                  <CodeBlock aria-label="Read tokens with useApolloTheme">
{`const { theme, density, highContrast } = useApolloTheme();

const accent = theme.colors.action.accent.solid;
`}
                  </CodeBlock>
                  <Stack gap="2">
                    {THEME_API_POINTS.map((point) => (
                      <Text as="p" key={point.id} variant="detail" color="secondary">
                        <InlineCode>{point.label}</InlineCode> — {point.description}
                      </Text>
                    ))}
                  </Stack>
                </Stack>
              </Card>
            </ThemingGrid>
          </Section>
          <AtomsSection />
          <MoleculesSection />
          <OrganismsSection />
          <Section
            id="resources"
            title="Resources"
            description="Stay aligned with Apollo UI releases, tokens, and support channels."
          >
            <ResourceGrid>
              {RESOURCE_ITEMS.map((item) => (
                <Card
                  key={item.id}
                  padding="6"
                  radius="lg"
                  shadow="xs"
                  border="subtle"
                  background="surfaceRaised"
                >
                  <Stack gap="3">
                    {item.badge ? (
                      <Badge variant="subtle" tone="accent">
                        {item.badge}
                      </Badge>
                    ) : null}
                    <Text as="h3" variant="subtitle" weight="semibold">
                      {item.title}
                    </Text>
                    <Text as="p" variant="body" color="secondary">
                      {item.description}
                    </Text>
                    <Button
                      size="sm"
                      variant="outline"
                      tone="neutral"
                      as="a"
                      href={item.href}
                      target={item.target}
                      rel={item.rel}
                    >
                      {item.actionLabel}
                    </Button>
                  </Stack>
                </Card>
              ))}
            </ResourceGrid>
          </Section>
          <Text as="p" variant="detail" color="secondary" align="center">
            Crafted for product teams — built with ❤️ using Apollo UI primitives.
          </Text>
        </MainColumn>
      </Layout>
    </>
  );
}
