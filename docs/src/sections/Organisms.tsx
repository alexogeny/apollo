import { Box, Button, Stack, Text } from "@apollo/ui";

import { Section } from "../components/Section";
import { ShowcaseCard } from "../components/ShowcaseCard";
import { AppShellDemo } from "../components/demos/AppShellDemo";
import { DashboardDemo } from "../components/demos/DashboardDemo";

const UPDATE_HIGHLIGHTS = [
  "Expanded accent palette for accessibility",
  "Density-aware spacing tokens",
  "High contrast modes across surfaces",
] as const;

interface ChecklistItem {
  readonly label: string;
  readonly complete: boolean;
}

const CHECKLIST: ReadonlyArray<ChecklistItem> = [
  { label: "Review typography scale", complete: true },
  { label: "Adopt new button variants", complete: false },
  { label: "Audit custom surfaces", complete: false },
];

export function OrganismsSection(): JSX.Element {
  return (
    <Section
      id="organisms"
      title="Organisms"
      description="High-order compositions that orchestrate atoms and molecules into product-ready experiences."
    >
      <Stack direction="horizontal" gap="6" wrap>
        <ShowcaseCard
          tone="accent"
          title="Product update panel"
          description="Stack, text, and button primitives create an announcement surface with clear hierarchy."
        >
          <Stack gap="4">
            <Stack gap="1">
              <Text as="h4" variant="headline" weight="semibold">
                Apollo UI 0.2 release
              </Text>
              <Text as="p" variant="body">
                Fresh palettes, denser spacing, and enhanced contrast modes keep teams shipping polished experiences.
              </Text>
            </Stack>
            <Stack gap="2">
              {UPDATE_HIGHLIGHTS.map((item) => (
                <Box
                  key={item}
                  as="p"
                  display="flex"
                  align="center"
                  gap="2"
                  margin="0"
                >
                  <Box
                    aria-hidden={true}
                    padding="1"
                    radius="pill"
                    background="surfaceContrast"
                    style={{ width: "16px", height: "16px" }}
                  />
                  <Text as="span" variant="body">
                    {item}
                  </Text>
                </Box>
              ))}
            </Stack>
            <Stack direction="horizontal" gap="3" wrap>
              <Button size="sm">Read release notes</Button>
              <Button size="sm" variant="outline" tone="neutral">
                View token changes
              </Button>
            </Stack>
          </Stack>
        </ShowcaseCard>
        <ShowcaseCard
          title="Application shell"
          description="Sidebar navigation, top-level actions, and content panels compose into a cohesive workspace chrome."
        >
          <AppShellDemo />
        </ShowcaseCard>
        <ShowcaseCard
          title="Design ops dashboard"
          description="Combine data tables, metrics, and pickers to track adoption and accessibility outcomes."
        >
          <DashboardDemo />
        </ShowcaseCard>
        <ShowcaseCard
          title="Onboarding checklist"
          description="Molecules combine into actionable flows with clear task progress and calls to action."
        >
          <Stack gap="3">
            <Stack as="ul" gap="2" style={{ padding: 0, margin: 0, listStyle: "none" }}>
              {CHECKLIST.map((item) => (
                <Box
                  key={item.label}
                  as="li"
                  display="flex"
                  align="center"
                  gap="3"
                  padding="3"
                  radius="lg"
                  background={item.complete ? "surfaceRaised" : "surfaceSunken"}
                  border={item.complete ? "subtle" : "none"}
                >
                  <Text
                    as="span"
                    variant="detail"
                    weight="semibold"
                    color={item.complete ? "success" : "muted"}
                  >
                    {item.complete ? "✓" : "○"}
                  </Text>
                  <Stack gap="1">
                    <Text variant="body" weight={item.complete ? "semibold" : "regular"}>
                      {item.label}
                    </Text>
                    <Text variant="detail" color="secondary">
                      {item.complete ? "Complete" : "Awaiting review"}
                    </Text>
                  </Stack>
                </Box>
              ))}
            </Stack>
            <Stack direction="horizontal" gap="3" wrap>
              <Button size="sm" tone="accent">
                Schedule walkthrough
              </Button>
              <Button size="sm" variant="ghost" tone="neutral">
                Share feedback
              </Button>
            </Stack>
          </Stack>
        </ShowcaseCard>
      </Stack>
    </Section>
  );
}
