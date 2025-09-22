import "./setup-dom";
import { afterEach, describe, expect, it, vi } from "bun:test";
import { cleanup, fireEvent, render } from "@testing-library/react";

import {
  ApolloThemeProvider,
  Dashboard,
  Sidebar,
  type DashboardActivity,
  type DashboardMetric,
  type DashboardProps,
  type SidebarSection,
} from "../src";

afterEach(() => cleanup());

function renderWithProvider(ui: JSX.Element) {
  return render(<ApolloThemeProvider>{ui}</ApolloThemeProvider>);
}

describe("Sidebar", () => {
  it("highlights active item and handles selection", () => {
    const sections: ReadonlyArray<SidebarSection> = [
      {
        id: "main",
        title: "Library",
        items: [
          { id: "overview", label: "Overview", href: "#overview" },
          { id: "components", label: "Components", description: "24 primitives" },
          { id: "tokens", label: "Tokens", disabled: true },
        ],
      },
    ];

    const handleSelect = vi.fn();
    const utils = renderWithProvider(
      <Sidebar
        sections={sections}
        activeItemId="overview"
        onItemSelect={handleSelect}
        ariaLabel="Primary"
        header={<span>Header</span>}
        footer={<span>Footer</span>}
      />,
    );

    const active = utils.getByRole("link", { name: "Overview" });
    expect(active.getAttribute("aria-current")).toBe("page");

    const components = utils.getByRole("button", { name: /components/i });
    fireEvent.click(components);
    expect(handleSelect).toHaveBeenCalledWith("components");

    const disabled = utils.getByText("Tokens").closest("button");
    expect(disabled?.getAttribute("aria-disabled")).toBe("true");
    if (disabled) {
      fireEvent.click(disabled);
    }
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });
});

describe("Dashboard", () => {
  interface Row {
    readonly id: number;
    readonly name: string;
    readonly status: string;
  }

  const sidebarSections: ReadonlyArray<SidebarSection> = [
    {
      id: "nav",
      title: "Navigation",
      items: [
        { id: "overview", label: "Overview", href: "#overview" },
        { id: "reports", label: "Reports", href: "#reports" },
      ],
    },
  ];

  const metrics: ReadonlyArray<DashboardMetric> = [
    {
      id: "quality",
      label: "Accessibility",
      value: "92%",
      trend: { label: "+6% vs last week", tone: "positive" },
    },
  ];

  const activities: ReadonlyArray<DashboardActivity> = [
    {
      id: "activity-1",
      title: "Tokens synced",
      description: "Updated semantic color ramp",
      timestamp: "2 hours ago",
    },
  ];

  const tableRows: ReadonlyArray<Row> = [
    { id: 1, name: "Command palette", status: "Review" },
    { id: 2, name: "Context menu", status: "Draft" },
  ];

  const tableProps: DashboardProps<Row>["table"] = {
    title: "Workstreams",
    description: "Track readiness across product surfaces.",
    data: tableRows,
    columns: [
      { id: "name", header: "Name", accessor: (row) => row.name },
      { id: "status", header: "Status", accessor: (row) => row.status },
    ],
  };

  it("renders dashboard layout and forwards table props", () => {
    const filterSpy = vi.fn();
    const utils = renderWithProvider(
      <Dashboard<Row>
        title="Design operations"
        description="Monitor adoption and quality metrics."
        sidebar={{ sections: sidebarSections, activeItemId: "overview", ariaLabel: "Sections" }}
        metrics={metrics}
        activities={activities}
        table={tableProps}
        filters={[{ id: "active", label: "Active", active: true, onSelect: filterSpy }]}
        primaryAction={{ id: "new", label: "New report" }}
        secondaryAction={{ id: "share", label: "Share", variant: "outline" }}
      />,
    );

    expect(utils.getByRole("heading", { name: "Design operations" })).toBeTruthy();
    expect(utils.getByText("92%")).toBeTruthy();
    const caption = utils.container.querySelector("caption");
    expect(caption).not.toBeNull();
    expect(caption?.textContent).toBe("Workstreams");

    const filterButton = utils.getByRole("button", { name: "Active" });
    fireEvent.click(filterButton);
    expect(filterSpy).toHaveBeenCalledWith("active");

    const sidebarLink = utils.getByRole("link", { name: "Overview" });
    expect(sidebarLink.getAttribute("aria-current")).toBe("page");
  });
});
