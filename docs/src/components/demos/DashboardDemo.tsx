import { useMemo } from "react";

import {
  Badge,
  Box,
  Button,
  Card,
  DataTable,
  DatePicker,
  Progress,
  Stack,
  Text,
  type DataTableColumn,
} from "@apollo/ui";

interface WorkstreamRow {
  readonly id: number;
  readonly name: string;
  readonly status: "Ready" | "In review" | "Draft";
  readonly owner: string;
  readonly updated: string;
}

const STATUS_TONE: Record<WorkstreamRow["status"], "success" | "warning" | "neutral"> = {
  Ready: "success",
  "In review": "warning",
  Draft: "neutral",
};

const WORKSTREAM_ROWS: ReadonlyArray<WorkstreamRow> = [
  { id: 1, name: "Navigation shell", status: "Ready", owner: "Alex Morgan", updated: "2 days ago" },
  { id: 2, name: "Command palette", status: "In review", owner: "Priya Das", updated: "5 days ago" },
  { id: 3, name: "Context menu", status: "Draft", owner: "Liam Patel", updated: "1 day ago" },
];

export function DashboardDemo(): JSX.Element {
  const columns = useMemo<ReadonlyArray<DataTableColumn<WorkstreamRow>>>(() => [
    {
      id: "component",
      header: "Component",
      accessor: (row) => row.name,
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      accessor: (row) => row.status,
      cell: (row) => (
        <Badge variant="subtle" tone={STATUS_TONE[row.status]}>
          {row.status}
        </Badge>
      ),
    },
    {
      id: "owner",
      header: "Owner",
      accessor: (row) => row.owner,
    },
    {
      id: "updated",
      header: "Updated",
      accessor: (row) => row.updated,
      sortable: true,
      align: "right",
    },
  ], []);

  return (
    <Stack gap="5">
      <Stack direction="horizontal" align="center" justify="space-between" wrap gap="4">
        <Stack gap="1">
          <Text as="h4" variant="subtitle" weight="semibold">
            Release readiness dashboard
          </Text>
          <Text as="p" variant="detail" color="secondary">
            Monitor component health, adoption velocity, and review progress.
          </Text>
        </Stack>
        <Stack direction="horizontal" gap="3" align="center" wrap>
          <DatePicker placeholder="Filter by milestone" />
          <Button size="sm" variant="outline" tone="neutral">
            Export report
          </Button>
        </Stack>
      </Stack>
      <Stack direction="horizontal" gap="4" wrap>
        <Card padding="4" radius="lg" shadow="xs" background="surfaceRaised" style={{ flex: "1 1 180px" }}>
          <Stack gap="2">
            <Text as="span" variant="detail" color="secondary">
              Components ready
            </Text>
            <Text as="span" variant="headline" weight="semibold">
              18 / 24
            </Text>
            <Progress value={75} label="Components ready" />
            <Text as="span" variant="detail" color="muted">
              Ready to publish to kits
            </Text>
          </Stack>
        </Card>
        <Card padding="4" radius="lg" shadow="xs" background="surfaceRaised" style={{ flex: "1 1 180px" }}>
          <Stack gap="2">
            <Text as="span" variant="detail" color="secondary">
              Accessibility issues
            </Text>
            <Text as="span" variant="headline" weight="semibold">
              3 open
            </Text>
            <Progress value={40} tone="warning" label="Accessibility issues" />
            <Text as="span" variant="detail" color="muted">
              Focus on overlay primitives
            </Text>
          </Stack>
        </Card>
        <Card padding="4" radius="lg" shadow="xs" background="surfaceRaised" style={{ flex: "1 1 180px" }}>
          <Stack gap="2">
            <Text as="span" variant="detail" color="secondary">
              Contributors
            </Text>
            <Text as="span" variant="headline" weight="semibold">
              42
            </Text>
            <Progress value={90} tone="accent" label="Contributor growth" />
            <Text as="span" variant="detail" color="muted">
              Across product teams
            </Text>
          </Stack>
        </Card>
      </Stack>
      <Box padding="4" radius="lg" shadow="xs" background="surfaceRaised">
        <DataTable data={WORKSTREAM_ROWS} columns={columns} caption="Component review status" />
      </Box>
    </Stack>
  );
}
