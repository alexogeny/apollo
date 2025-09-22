import { useMemo, useState } from "react";

import {
  Box,
  Button,
  CommandPalette,
  CommandPaletteTrigger,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  DataTable,
  DatePicker,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownTrigger,
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Stack,
  Switch,
  Text,
  ToastProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useApolloTheme,
  useToast,
  type DataTableColumn,
} from "@apollo/ui";

import { Section } from "../components/Section";
import { ShowcaseCard } from "../components/ShowcaseCard";

const FILTERS = ["Overview", "Components", "Tokens", "Accessibility"] as const;

type MetricTone = "success" | "warning" | "danger";

interface MetricDefinition {
  readonly label: string;
  readonly value: string;
  readonly delta: string;
  readonly tone: MetricTone;
}

const METRICS: ReadonlyArray<MetricDefinition> = [
  { label: "Components", value: "24", delta: "+3 new", tone: "success" },
  { label: "Patterns", value: "12", delta: "+1 update", tone: "warning" },
  { label: "Accessibility issues", value: "2", delta: "-5 resolved", tone: "success" },
];

const TAGS = ["Design tokens", "Accessibility", "Motion", "Dark mode"] as const;

interface RoadmapRow {
  readonly id: number;
  readonly initiative: string;
  readonly stage: "Research" | "In progress" | "Review";
  readonly owner: string;
}

const ROADMAP_ROWS: ReadonlyArray<RoadmapRow> = [
  { id: 1, initiative: "Color contrast audit", stage: "Review", owner: "Ana" },
  { id: 2, initiative: "Navigation patterns", stage: "In progress", owner: "Sam" },
  { id: 3, initiative: "Motion tokens", stage: "Research", owner: "Leah" },
];

function OverlayExamples(): JSX.Element {
  const { theme } = useApolloTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const triggerStyle = {
    borderRadius: theme.radii.md,
    border: `1px solid ${theme.colors.border.subtle}`,
    background: theme.colors.surface.surfaceRaised,
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.variants.bodySm.fontSize,
    lineHeight: theme.typography.variants.bodySm.lineHeight,
    padding: `${theme.space["2"]} ${theme.space["3"]}`,
    cursor: "pointer",
    color: theme.colors.text.primary,
  } as const;

  return (
    <Stack gap="3">
      <Stack direction="horizontal" gap="2" wrap>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button size="sm">Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share release notes</DialogTitle>
              <DialogDescription>Summarize new component additions for product teams.</DialogDescription>
            </DialogHeader>
            <Text as="p" variant="body">
              Dialog primitives provide accessible focus management, keyboard support, and escape-to-close behaviour out of the box.
            </Text>
            <DialogFooter>
              <Button variant="ghost" tone="neutral" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => setDialogOpen(false)}>
                Publish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Modal open={modalOpen} onOpenChange={setModalOpen}>
          <ModalTrigger>
            <Button size="sm" variant="outline" tone="neutral">
              Modal
            </Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Archive component</ModalTitle>
              <ModalDescription>Remove legacy variants while keeping tokens untouched.</ModalDescription>
            </ModalHeader>
            <Text as="p" variant="body">
              Modals reuse dialog primitives with opinionated sizing to emphasize confirmations and destructive flows.
            </Text>
            <ModalFooter>
              <Button variant="ghost" tone="neutral" onClick={() => setModalOpen(false)}>
                Dismiss
              </Button>
              <Button size="sm" tone="danger" onClick={() => setModalOpen(false)}>
                Archive
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger>
            <Button size="sm" variant="subtle" tone="neutral">
              Sheet
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Notification settings</SheetTitle>
              <SheetDescription>Toggle digest delivery for upcoming releases and audits.</SheetDescription>
            </SheetHeader>
            <Stack gap="2">
              <Switch label="Release emails" defaultChecked />
              <Switch label="Weekly digest" />
            </Stack>
            <SheetFooter>
              <Button variant="ghost" tone="neutral" onClick={() => setSheetOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => setSheetOpen(false)}>
                Save preferences
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Stack>
      <Stack direction="horizontal" gap="2" wrap align="center">
        <Dropdown>
          <DropdownTrigger style={triggerStyle}>Dropdown</DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Profile</DropdownItem>
            <DropdownItem>Billing</DropdownItem>
            <DropdownSeparator />
            <DropdownItem danger>Delete</DropdownItem>
          </DropdownContent>
        </Dropdown>
        <Tooltip>
          <TooltipTrigger>
            <Button size="sm" variant="ghost" tone="neutral">
              Tooltip
            </Button>
          </TooltipTrigger>
          <TooltipContent>Accessible helper text for icon-only controls.</TooltipContent>
        </Tooltip>
        <ContextMenu>
          <ContextMenuTrigger>
            <Button size="sm" variant="ghost" tone="neutral">
              Context menu
            </Button>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Duplicate</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Archive</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Stack>
    </Stack>
  );
}

function ToastTriggerButton(): JSX.Element {
  const { publish } = useToast();
  return (
    <Button
      size="sm"
      variant="outline"
      tone="neutral"
      onClick={() => publish({ title: "Saved", description: "Design tokens synced across apps." })}
    >
      Trigger toast
    </Button>
  );
}

function CommandPaletteShowcase(): JSX.Element {
  const [lastCommand, setLastCommand] = useState<string | null>(null);

  const commands = useMemo(
    () => [
      {
        id: "new-component",
        title: "Create component",
        description: "Generate a new primitive or molecule",
        shortcut: ["N"],
        onSelect: () => setLastCommand("Create component"),
        group: "Components",
      },
      {
        id: "open-docs",
        title: "Open documentation",
        description: "Jump to the component guidelines",
        shortcut: ["D"],
        onSelect: () => setLastCommand("Open documentation"),
        group: "Navigation",
      },
      {
        id: "theme",
        title: "Toggle appearance",
        description: "Switch between light and dark modes",
        shortcut: ["T"],
        onSelect: () => setLastCommand("Toggle appearance"),
        group: "Preferences",
      },
    ],
    [],
  );

  return (
    <Stack gap="2">
      <CommandPalette commands={commands} hotkey="k">
        <CommandPaletteTrigger>
          Open command palette
        </CommandPaletteTrigger>
      </CommandPalette>
      <Text as="span" variant="detail" color="secondary">
        Last command: {lastCommand ?? "Select an action or press ⌘K"}
      </Text>
    </Stack>
  );
}

export function MoleculesSection(): JSX.Element {
  const activeFilter = FILTERS[1];

  const roadmapColumns = useMemo<ReadonlyArray<DataTableColumn<RoadmapRow>>>(
    () => [
      {
        id: "initiative",
        header: "Initiative",
        accessor: (row) => row.initiative,
      },
      {
        id: "stage",
        header: "Stage",
        accessor: (row) => row.stage,
      },
      {
        id: "owner",
        header: "Owner",
        accessor: (row) => row.owner,
      },
    ],
    [],
  );

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
        <ShowcaseCard
          title="Data inputs"
          description="Pair structured pickers with sortable tables to summarize roadmap progress."
        >
          <Stack gap="3">
            <DatePicker placeholder="Filter by quarter" />
            <Box padding="3" radius="lg" background="surfaceSunken">
              <DataTable data={ROADMAP_ROWS} columns={roadmapColumns} caption="Roadmap initiatives" />
            </Box>
          </Stack>
        </ShowcaseCard>
        <ShowcaseCard
          title="Overlay interactions"
          description="Dialogs, modals, sheets, dropdowns, tooltips, and context menus share consistent behaviours."
        >
          <OverlayExamples />
        </ShowcaseCard>
        <ShowcaseCard
          title="Command palette & toasts"
          description="Global command menus and toast notifications coordinate feedback and shortcuts."
        >
          <ToastProvider>
            <Stack gap="3">
              <ToastTriggerButton />
              <CommandPaletteShowcase />
            </Stack>
          </ToastProvider>
        </ShowcaseCard>
      </Stack>
    </Section>
  );
}
