import { Box, Button, Stack, Text } from "@apollo/ui";

import { Section } from "../components/Section";
import { ShowcaseCard } from "../components/ShowcaseCard";

interface SurfaceExample {
  readonly token: "surface" | "surfaceRaised" | "surfaceContrast";
  readonly label: string;
  readonly textColor: "primary" | "contrast";
}

const SURFACE_EXAMPLES: ReadonlyArray<SurfaceExample> = [
  { token: "surface", label: "Surface", textColor: "primary" },
  { token: "surfaceRaised", label: "Raised", textColor: "primary" },
  { token: "surfaceContrast", label: "Contrast", textColor: "contrast" },
];

export function AtomsSection(): JSX.Element {
  return (
    <Section
      id="atoms"
      title="Atoms"
      description="Foundational primitives that wrap low-level HTML semantics with Apollo's design tokens."
    >
      <Stack direction="horizontal" gap="6" wrap>
        <ShowcaseCard
          title="Box"
          description="Layout primitive exposing consistent spacing, radius, borders, and surface colors."
        >
          <Stack direction="horizontal" gap="4" wrap>
            {SURFACE_EXAMPLES.map((surface) => (
              <Box
                key={surface.token}
                padding="5"
                radius="lg"
                shadow="xs"
                border="subtle"
                background={surface.token}
                style={{ minWidth: "200px" }}
              >
                <Stack gap="2">
                  <Text variant="subtitle" weight="semibold" color={surface.textColor}>
                    {surface.label} surface
                  </Text>
                  <Text variant="body" color={surface.textColor === "contrast" ? "contrast" : "secondary"}>
                    Use <Text as="code" variant="code">Box</Text> to orchestrate spacing, flex layouts, and background tokens.
                  </Text>
                </Stack>
              </Box>
            ))}
          </Stack>
        </ShowcaseCard>
        <ShowcaseCard
          title="Text"
          description="Typographic scale with semantic variants for headlines, paragraphs, and annotations."
        >
          <Stack gap="2">
            <Text as="p" variant="display" weight="semibold">
              Display emphasizes marquee messaging
            </Text>
            <Text as="p" variant="headline" weight="semibold">
              Headline drives prominent section titles
            </Text>
            <Text as="p" variant="subtitle" color="secondary">
              Subtitle introduces supporting context for subsections
            </Text>
            <Text as="p" variant="body">
              Body text balances readability with density-aware leading.
            </Text>
            <Text as="p" variant="detail" color="muted">
              Detail styles assist with captions, metadata, and helper text.
            </Text>
            <Text as="code" variant="code" background="surfaceSunken" padding="2" radius="sm">
              Inline code showcases monospaced typography.
            </Text>
          </Stack>
        </ShowcaseCard>
        <ShowcaseCard
          title="Button"
          description="Accessible actions with size presets, tone palettes, and interaction states."
        >
          <Stack gap="3">
            <Stack direction="horizontal" gap="2" wrap>
              <Button size="sm">Primary action</Button>
              <Button variant="outline" tone="neutral" size="sm">
                Secondary
              </Button>
              <Button variant="ghost" tone="neutral" size="sm">
                Ghost
              </Button>
              <Button variant="subtle" tone="accent" size="sm">
                Subtle CTA
              </Button>
            </Stack>
            <Stack direction="horizontal" gap="2" wrap>
              <Button tone="success">Success</Button>
              <Button tone="warning">Warning</Button>
              <Button tone="danger">Danger</Button>
            </Stack>
            <Stack direction="horizontal" gap="2" wrap>
              <Button size="xs">Extra small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large format</Button>
            </Stack>
          </Stack>
        </ShowcaseCard>
      </Stack>
    </Section>
  );
}
