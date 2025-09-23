import "./setup-dom";

import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, render } from "@testing-library/react";

import {
  ActivityTimeline,
  Badge,
  Button,
  FilterToolbar,
  MetricCard,
  ThemeProvider,
} from "../src";

afterEach(() => cleanup());

describe("UI components", () => {
  it("renders buttons with variant data attributes and default type", () => {
    const { getByRole } = render(
      <ThemeProvider>
        <Button variant="secondary">Download</Button>
      </ThemeProvider>,
    );

    const button = getByRole("button", { name: "Download" });
    expect(button.getAttribute("type")).toBe("button");
    expect(button.dataset.variant).toBe("secondary");
  });

  it("supports badge variants", () => {
    const { getByText } = render(
      <ThemeProvider>
        <Badge variant="success">Healthy</Badge>
      </ThemeProvider>,
    );

    const badge = getByText("Healthy");
    expect(badge.dataset.variant).toBe("success");
    expect(badge.className).toContain("bg-chart-3/20");
  });
});

describe("Molecules", () => {
  it("annotates metric cards with sparkline labels", () => {
    const { getByRole, getByText } = render(
      <ThemeProvider>
        <MetricCard
          title="Pipeline coverage"
          value="$3.2M"
          trend={{ label: "vs goal", direction: "increase", delta: 3.4, tone: "success" }}
          sparkline={{ points: [1, 2, 3], label: "Coverage trend", tone: "accent" }}
          progress={{ value: 68, label: "Quarter goal", tone: "accent" }}
        />
      </ThemeProvider>,
    );

    expect(getByText("Pipeline coverage")).toBeTruthy();
    const sparkline = getByRole("img", { name: "Coverage trend" });
    expect(sparkline.tagName.toLowerCase()).toBe("svg");
  });

  it("renders activity timeline events with accessible ordering", () => {
    const { getAllByRole } = render(
      <ThemeProvider>
        <ActivityTimeline
          title="Workflow"
          events={[
            {
              id: "1",
              title: "Review",
              description: "Review session scheduled",
              timestamp: "2024-04-01",
              tone: "accent",
            },
            {
              id: "2",
              title: "Ship",
              description: "Release deployed",
              timestamp: "2024-04-02",
              tone: "success",
            },
          ]}
        />
      </ThemeProvider>,
    );

    const items = getAllByRole("listitem");
    expect(items).toHaveLength(2);
  });
});

describe("Filter toolbar", () => {
  it("reports active filter counts", () => {
    const { getByRole } = render(
      <ThemeProvider>
        <FilterToolbar
          filters={[
            { label: "Enterprise", value: "enterprise", active: true },
            { label: "Self-serve", value: "self", active: false },
          ]}
        />
      </ThemeProvider>,
    );

    const button = getByRole("button", { name: /filters/i });
    expect(button.textContent).toContain("1");
  });
});
