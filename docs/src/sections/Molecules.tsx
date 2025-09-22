import { Box, Button, Stack, Text } from "@apollo/ui";

import { Section } from "../components/Section";
import { ShowcaseCard } from "../components/ShowcaseCard";

const FILTERS = ["Overview", "Components", "Tokens", "Accessibility"] as const;

interface MetricDefinition {
  readonly label: string;
  readonly value: string;
  readonly delta: string;
  readonly tone: "success" | "warning" | "danger";
}

const METRICS: ReadonlyArray<MetricDefinition> = [
  { label: "Components", value: "24", delta: "+3 new", tone: "success" },
  { label: "Patterns", value: "12", delta: "+1 update", tone: "warning" },
  { label: "Accessibility issues", value: "2", delta: "-5 resolved", tone: "success" },
];

const TAGS = ["Design tokens", "Accessibility", "Motion", "Dark mode"] as const;

export function MoleculesSection(): JSX.Element {
  const activeFilter = FILTERS[1];

  return (
    <Section
      id="molecules"
      title="Molecules"
      description="Composable assemblies of atoms that capture reusable interface patterns."
    >
      <Stack direction="horizontal" gap="6" wrap>
        <ShowcaseCard
          title="Filter toolbar"
          description="Buttons compose into toggle groups with clear selection and keyboard focus handling."
        >
          <Stack gap="3">
            <Text as="p" variant="detail" color="secondary">
              Combine <Text as="code" variant="code">Stack</Text> and <Text as="code" variant="code">Button</Text> to produce responsive filter controls.
            </Text>
            <Stack direction="horizontal" gap="2" wrap>
              {FILTERS.map((filter) => {
                const isActive = filter === activeFilter;
                return (
                  <Button
                    key={filter}
                    variant={isActive ? "solid" : "outline"}
                    tone={isActive ? "accent" : "neutral"}
                    aria-pressed={isActive}
                  >
                    {filter}
                  </Button>
                );
              })}
            </Stack>
          </Stack>
        </ShowcaseCard>
        <ShowcaseCard
          title="Metric tiles"
          description="Cards, text, and spacing tokens collaborate to communicate product health at a glance."
        >
          <Stack gap="3">
            {METRICS.map((metric) => (
              <Box
                key={metric.label}
                padding="4"
                radius="lg"
                background="surfaceSunken"
                border="none"
              >
                <Stack direction="horizontal" align="center" justify="space-between">
                  <Stack gap="1">
                    <Text variant="subtitle" weight="semibold">
                      {metric.value}
                    </Text>
                    <Text variant="detail" color="secondary">
                      {metric.label}
                    </Text>
                  </Stack>
                  <Text variant="detail" color={metric.tone} weight="medium">
                    {metric.delta}
                  </Text>
                </Stack>
              </Box>
            ))}
          </Stack>
        </ShowcaseCard>
        <ShowcaseCard
          title="Tag cloud"
          description="Atoms blend to produce pill treatments that respect tone palettes and density settings."
        >
          <Stack direction="horizontal" gap="2" wrap>
            {TAGS.map((tag) => (
              <Box
                key={tag}
                paddingX="4"
                paddingY="2"
                radius="pill"
                background="surfaceRaised"
                border="subtle"
                style={{ display: "inline-flex" }}
              >
                <Text variant="detail" weight="medium">
                  {tag}
                </Text>
              </Box>
            ))}
          </Stack>
        </ShowcaseCard>
      </Stack>
    </Section>
  );
}
