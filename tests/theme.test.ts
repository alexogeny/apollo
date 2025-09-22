import { describe, expect, it } from "bun:test";

import { createTheme, lightTheme } from "../src/theme/tokens";

describe("createTheme", () => {
  it("produces density-aware spacing", () => {
    const comfortable = createTheme({
      appearance: "light",
      density: "comfortable",
      highContrast: false,
      reducedMotion: false,
    });

    const compact = createTheme({
      appearance: "light",
      density: "compact",
      highContrast: false,
      reducedMotion: false,
    });

    const comfortableSpacing = parseFloat(comfortable.space["4"].replace("rem", ""));
    const compactSpacing = parseFloat(compact.space["4"].replace("rem", ""));

    expect(compactSpacing).toBeLessThan(comfortableSpacing);
  });

  it("applies high contrast palettes", () => {
    const standard = createTheme({
      appearance: "light",
      density: "comfortable",
      highContrast: false,
      reducedMotion: false,
    });

    const highContrast = createTheme({
      appearance: "light",
      density: "comfortable",
      highContrast: true,
      reducedMotion: false,
    });

    expect(standard.colors.border.subtle).not.toBe(highContrast.colors.border.subtle);
    expect(highContrast.contrast).toBe("high");
  });

  it("accepts token overrides", () => {
    const theme = createTheme({
      appearance: "dark",
      density: "comfortable",
      highContrast: false,
      reducedMotion: false,
      overrides: {
        radii: { md: "0.75rem" },
        colors: {
          surface: {
            background: "#050814",
          },
        },
      },
    });

    expect(theme.radii.md).toBe("0.75rem");
    expect(theme.colors.surface.background).toBe("#050814");
  });
});

describe("preset themes", () => {
  it("exports a light theme with semantic tokens", () => {
    expect(lightTheme.appearance).toBe("light");
    expect(lightTheme.colors.text.primary).toBeDefined();
  });
});
