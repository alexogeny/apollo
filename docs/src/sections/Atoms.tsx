import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Skeleton,
  Spinner,
  Stack,
  Switch,
  Text,
} from "@apollo/ui";

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

const TEAM_MEMBERS = [
  { id: "aria", name: "Aria Chen", status: "online" as const },
  { id: "diego", name: "Diego Patel", status: "busy" as const },
  { id: "morgan", name: "Morgan Lee", status: "offline" as const },
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
        <ShowcaseCard
          title="Surfaces & layout"
          description="Combine Card and Stack primitives to organize dense interface regions with balanced spacing."
        >
          <Stack gap="3">
            <Stack direction="horizontal" gap="3" wrap>
              <Card padding="4" radius="lg" shadow="xs" background="surfaceRaised" style={{ flex: "1 1 200px" }}>
                <Stack gap="2">
                  <Text as="span" variant="detail" color="secondary">
                    Guidance update
                  </Text>
                  <Text as="h4" variant="subtitle" weight="semibold">
                    Publish new input patterns
                  </Text>
                  <Button size="sm" variant="outline" tone="neutral">
                    View guidance
                  </Button>
                </Stack>
              </Card>
              <Card tone="accent" padding="4" radius="lg" shadow="xs" style={{ flex: "1 1 200px" }}>
                <Stack gap="2">
                  <Text as="span" variant="detail" weight="semibold">
                    Token library
                  </Text>
                  <Text as="p" variant="body">
                    Density-aware spacing and responsive typography travel with Stack layouts.
                  </Text>
                </Stack>
              </Card>
            </Stack>
          </Stack>
        </ShowcaseCard>
        <ShowcaseCard
          title="Selection controls"
          description="Checkbox, radio group, and switch primitives ship accessible form semantics by default."
        >
          <Stack gap="3">
            <Checkbox label="Notify team" description="Send weekly status summaries" defaultChecked />
            <RadioGroup defaultValue="comfortable" orientation="horizontal" aria-label="Density">
              <RadioGroupItem value="comfortable" label="Comfortable" />
              <RadioGroupItem value="compact" label="Compact" />
            </RadioGroup>
            <Switch label="Enable analytics" defaultChecked />
          </Stack>
        </ShowcaseCard>
        <ShowcaseCard
          title="Avatars & skeletons"
          description="Represent collaborators with initials-based avatars and smooth-loading skeleton placeholders."
        >
          <Stack gap="3">
            <Stack direction="horizontal" gap="3" wrap align="center">
              {TEAM_MEMBERS.map((member) => (
                <Avatar key={member.id} name={member.name} status={member.status} size="md" />
              ))}
            </Stack>
            <Card padding="4" radius="lg" shadow="xs" background="surfaceSunken">
              <Stack gap="2">
                <Skeleton width="70%" height="0.9rem" radius="sm" />
                <Skeleton width="85%" height="0.75rem" radius="sm" />
                <Skeleton width="55%" height="0.75rem" radius="sm" />
              </Stack>
            </Card>
          </Stack>
        </ShowcaseCard>
        <ShowcaseCard
          title="Status indicators"
          description="Badges, progress, and spinners communicate real-time status with tone-aware palettes."
        >
          <Stack gap="3">
            <Stack direction="horizontal" gap="2" wrap align="center">
              <Badge tone="accent">New</Badge>
              <Badge tone="success" variant="subtle">
                Live
              </Badge>
              <Badge tone="warning" variant="outline">
                Attention
              </Badge>
            </Stack>
            <Stack gap="2">
              <Text as="span" variant="detail" color="secondary">
                Publishing tokens
              </Text>
              <Progress value={64} label="Publishing tokens" />
            </Stack>
            <Stack direction="horizontal" gap="3" align="center">
              <Spinner size="sm" label="Loading components" />
              <Text as="span" variant="detail" color="secondary">
                Loading component documentation…
              </Text>
            </Stack>
          </Stack>
        </ShowcaseCard>
      </Stack>
    </Section>
  );
}
