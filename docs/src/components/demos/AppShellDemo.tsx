import { useMemo } from "react";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Stack,
  Text,
  useApolloTheme,
} from "@apollo/ui";

interface NavigationItem {
  readonly id: string;
  readonly label: string;
  readonly helper: string;
  readonly active?: boolean;
  readonly badge?: string;
}

const NAVIGATION_ITEMS: ReadonlyArray<NavigationItem> = [
  { id: "overview", label: "Overview", helper: "System health", active: true },
  { id: "components", label: "Components", helper: "24 primitives", badge: "24" },
  { id: "tokens", label: "Tokens", helper: "Color & type" },
  { id: "patterns", label: "Patterns", helper: "Usage guidance" },
  { id: "changelog", label: "Changelog", helper: "Latest releases" },
];

const QUICK_LINKS = [
  { id: "accessibility", label: "Accessibility audit" },
  { id: "roadmap", label: "Roadmap review" },
  { id: "support", label: "Support requests" },
] as const;

const COLLABORATORS = [
  { id: "aria", name: "Aria Chen", status: "online" as const },
  { id: "diego", name: "Diego Patel", status: "busy" as const },
  { id: "morgan", name: "Morgan Lee", status: "offline" as const },
];

export function AppShellDemo(): JSX.Element {
  const { theme } = useApolloTheme();

  const collaboratorInitials = useMemo(
    () =>
      COLLABORATORS.map((person) => ({
        id: person.id,
        name: person.name,
        status: person.status,
        initials: person.name
          .split(/\s+/u)
          .map((part) => part[0])
          .join("")
          .toUpperCase(),
      })),
    [],
  );

  return (
    <Box
      display="grid"
      radius="xl"
      shadow="sm"
      border="subtle"
      background="surface"
      style={{
        gridTemplateColumns: "220px 1fr",
        minHeight: "320px",
        overflow: "hidden",
      }}
    >
      <Box
        as="aside"
        padding="5"
        background="surfaceSunken"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: theme.space["6"],
          borderRight: `1px solid ${theme.colors.border.subtle}`,
        }}
        aria-label="Primary navigation"
      >
        <Stack gap="3">
          <Stack gap="1">
            <Text as="span" variant="subtitle" weight="semibold">
              Apollo UI
            </Text>
            <Badge variant="subtle" tone="accent">
              v0.3 preview
            </Badge>
          </Stack>
          <Text as="p" variant="detail" color="secondary">
            Navigate tokens, primitives, and adoption resources.
          </Text>
        </Stack>
        <Stack gap="1" style={{ flex: "1 1 auto" }}>
          {NAVIGATION_ITEMS.map((item) => (
            <Button
              key={item.id}
              size="sm"
              fullWidth
              variant={item.active ? "solid" : "ghost"}
              tone={item.active ? "accent" : "neutral"}
              aria-current={item.active ? "page" : undefined}
            >
              <Box
                display="flex"
                justify="space-between"
                align="center"
                style={{ width: "100%" }}
              >
                <Stack gap="1">
                  <Text as="span" variant="bodySm" weight="semibold">
                    {item.label}
                  </Text>
                  <Text as="span" variant="detail" color="muted">
                    {item.helper}
                  </Text>
                </Stack>
                {item.badge ? (
                  <Badge variant="subtle" tone="accent">
                    {item.badge}
                  </Badge>
                ) : null}
              </Box>
            </Button>
          ))}
        </Stack>
        <Stack gap="3">
          <Text as="span" variant="detail" color="secondary" weight="semibold">
            Quick links
          </Text>
          <Stack gap="2">
            {QUICK_LINKS.map((link) => (
              <Button key={link.id} size="sm" variant="ghost" tone="neutral" fullWidth>
                {link.label}
              </Button>
            ))}
          </Stack>
        </Stack>
        <Card padding="4" radius="lg" shadow="xs" background="surfaceRaised">
          <Stack gap="3">
            <Stack gap="1">
              <Text as="span" variant="detail" color="secondary" weight="semibold">
                Collaborators
              </Text>
              <Text as="p" variant="bodySm">
                Invite partners to ship updates with shared guidelines.
              </Text>
            </Stack>
            <Stack direction="horizontal" gap="2">
              {collaboratorInitials.map((person) => (
                <Avatar
                  key={person.id}
                  name={person.name}
                  size="sm"
                  status={person.status}
                  aria-label={`${person.name} status ${person.status}`}
                >
                  {person.initials}
                </Avatar>
              ))}
            </Stack>
            <Button size="sm" tone="accent" variant="subtle" fullWidth>
              Invite teammate
            </Button>
          </Stack>
        </Card>
      </Box>
      <Box display="flex" direction="column">
        <Box
          as="header"
          paddingX="5"
          paddingY="4"
          style={{
            borderBottom: `1px solid ${theme.colors.border.subtle}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: theme.space["4"],
          }}
        >
          <Stack gap="1">
            <Text as="h4" variant="headline" weight="semibold">
              Design system overview
            </Text>
            <Text as="p" variant="detail" color="secondary">
              Track adoption, readiness, and guidance from a unified workspace.
            </Text>
          </Stack>
          <Stack direction="horizontal" gap="3" align="center">
            <Badge variant="subtle" tone="success">
              Stable
            </Badge>
            <Button size="sm" variant="outline" tone="neutral">
              Share feedback
            </Button>
            <Avatar name="Jordan Blake" size="sm" status="online" />
          </Stack>
        </Box>
        <Box as="section" padding="5" style={{ flex: "1 1 auto" }}>
          <Stack gap="4">
            <Card padding="5" radius="lg" shadow="xs" background="surfaceRaised">
              <Stack gap="2">
                <Text as="h5" variant="subtitle" weight="semibold">
                  This week’s highlights
                </Text>
                <Text as="p" variant="body" color="secondary">
                  Three new component drafts are ready for review and accessibility coverage increased by 12%.
                </Text>
              </Stack>
            </Card>
            <Stack direction="horizontal" gap="4" wrap>
              <Card padding="4" radius="lg" shadow="xs" background="surfaceSunken" style={{ flex: "1 1 180px" }}>
                <Stack gap="2">
                  <Text as="span" variant="detail" color="secondary">
                    Adoption
                  </Text>
                  <Text as="span" variant="subtitle" weight="semibold">
                    68%
                  </Text>
                  <Text as="span" variant="detail" color="muted">
                    Teams migrated to Apollo UI
                  </Text>
                </Stack>
              </Card>
              <Card padding="4" radius="lg" shadow="xs" background="surfaceSunken" style={{ flex: "1 1 180px" }}>
                <Stack gap="2">
                  <Text as="span" variant="detail" color="secondary">
                    Open feedback
                  </Text>
                  <Text as="span" variant="subtitle" weight="semibold">
                    14
                  </Text>
                  <Text as="span" variant="detail" color="muted">
                    Awaiting triage
                  </Text>
                </Stack>
              </Card>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
