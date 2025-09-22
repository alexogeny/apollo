import "./setup-dom";
import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, fireEvent, render } from "@testing-library/react";

import {
  ApolloThemeProvider,
  Button,
  Card,
  Stack,
  Text,
  useApolloTheme,
  Box,
} from "../src";

afterEach(() => cleanup());

describe("ApolloThemeProvider", () => {
  it("exposes appearance toggles via context", () => {
    function ThemeToggle(): JSX.Element {
      const { appearance, setAppearance } = useApolloTheme();
      return (
        <button
          type="button"
          data-testid="appearance-toggle"
          onClick={() => setAppearance(appearance === "light" ? "dark" : "light")}
        >
          {appearance}
        </button>
      );
    }

    const { getByTestId } = render(
      <ApolloThemeProvider>
        <ThemeToggle />
      </ApolloThemeProvider>,
    );

    const toggle = getByTestId("appearance-toggle");
    expect(toggle.textContent).toBe("light");
    fireEvent.click(toggle);
    expect(toggle.textContent).toBe("dark");
  });
});

describe("Button", () => {
  it("renders with accessible defaults", () => {
    const { getByRole } = render(
      <ApolloThemeProvider>
        <Button>Confirm</Button>
      </ApolloThemeProvider>,
    );

    const button = getByRole("button", { name: "Confirm" });
    expect(button.getAttribute("type")).toBe("button");
    expect(button.dataset.variant).toBe("solid");
    expect(button.dataset.tone).toBe("accent");
  });

  it("honors tone and variant props", () => {
    const { getByRole } = render(
      <ApolloThemeProvider>
        <Button variant="outline" tone="danger">
          Delete
        </Button>
      </ApolloThemeProvider>,
    );

    const button = getByRole("button", { name: "Delete" });
    expect(button.dataset.variant).toBe("outline");
    expect(button.dataset.tone).toBe("danger");
  });
});

describe("Text", () => {
  it("respects semantic elements and variants", () => {
    const { getByText } = render(
      <ApolloThemeProvider>
        <Text as="label" htmlFor="field" variant="detail">
          Label
        </Text>
      </ApolloThemeProvider>,
    );

    const label = getByText("Label");
    expect(label.tagName).toBe("LABEL");
    expect(label.getAttribute("for")).toBe("field");
  });
});

describe("Card", () => {
  it("adds keyboard affordances when interactive", () => {
    const { getByTestId } = render(
      <ApolloThemeProvider>
        <Card interactive data-testid="card">
          Content
        </Card>
      </ApolloThemeProvider>,
    );

    const card = getByTestId("card");
    expect(card.getAttribute("tabindex")).toBe("0");
    expect(card.getAttribute("role")).toBe("button");
  });
});

describe("Stack", () => {
  it("lays out children horizontally when requested", () => {
    const { getByTestId } = render(
      <ApolloThemeProvider>
        <Stack direction="horizontal" data-testid="stack">
          <span>One</span>
          <span>Two</span>
        </Stack>
      </ApolloThemeProvider>,
    );

    const stack = getByTestId("stack");
    expect(stack.dataset.apolloDirection).toBe("row");
  });
});

describe("Box", () => {
  it("applies spacing tokens", () => {
    const { getByTestId } = render(
      <ApolloThemeProvider>
        <Box padding="4" data-testid="box" />
      </ApolloThemeProvider>,
    );

    const box = getByTestId("box");
    expect(box.dataset.apolloPadding).toBe("4");
  });
});
