import "./setup-dom";

import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, fireEvent, render } from "@testing-library/react";

import { ThemeProvider, useTheme } from "../src";

afterEach(() => {
  cleanup();
});

describe("ThemeProvider", () => {
  it("toggles between color schemes", () => {
    function ThemeToggle(): JSX.Element {
      const { scheme, setSchemePreference } = useTheme();
      return (
        <button type="button" onClick={() => setSchemePreference(scheme === "dark" ? "light" : "dark")}
          data-theme={scheme}
        >
          {scheme}
        </button>
      );
    }

    const { getByRole } = render(
      <ThemeProvider defaultScheme="light">
        <ThemeToggle />
      </ThemeProvider>,
    );

    const button = getByRole("button");
    expect(button.dataset.theme).toBe("light");
    fireEvent.click(button);
    expect(button.dataset.theme).toBe("dark");
  });
});
