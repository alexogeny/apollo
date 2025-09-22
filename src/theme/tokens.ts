import type { CSSProperties } from "react";

export type Appearance = "light" | "dark";
export type Density = "comfortable" | "compact";
export type Contrast = "normal" | "high";
export type ActionTone = "accent" | "neutral" | "success" | "warning" | "danger";

export type SurfaceColorToken =
  | "background"
  | "surface"
  | "surfaceRaised"
  | "surfaceSunken"
  | "surfaceContrast";

export type TextColorToken =
  | "primary"
  | "secondary"
  | "muted"
  | "accent"
  | "contrast"
  | "success"
  | "warning"
  | "danger";

export type BorderToken = "subtle" | "strong";
export type RadiusToken = "none" | "sm" | "md" | "lg" | "xl" | "pill";
export type ShadowToken = "none" | "xs" | "sm" | "md" | "lg";
export type TextVariant =
  | "display"
  | "headline"
  | "title"
  | "subtitle"
  | "body"
  | "bodySm"
  | "detail"
  | "code";
export type FontWeightToken = "regular" | "medium" | "semibold" | "bold";

export interface ActionColorSet {
  readonly solid: string;
  readonly solidHover: string;
  readonly solidActive: string;
  readonly solidForeground: string;
  readonly subtle: string;
  readonly subtleHover: string;
  readonly subtleForeground: string;
  readonly outline: string;
}

export interface ThemeColorTokens {
  readonly surface: Record<SurfaceColorToken, string>;
  readonly text: Record<TextColorToken, string>;
  readonly border: Record<BorderToken, string>;
  readonly states: {
    readonly focusRing: string;
    readonly focusColor: string;
    readonly hoverOverlay: string;
    readonly activeOverlay: string;
    readonly backdrop: string;
  };
  readonly action: Record<ActionTone, ActionColorSet>;
}

export interface TypographyVariantDefinition {
  readonly fontSize: string;
  readonly lineHeight: string;
  readonly letterSpacing: string;
  readonly fontFamily?: keyof TypographyScale["fonts"];
  readonly textTransform?: CSSProperties["textTransform"];
}

export interface TypographyScale {
  readonly fonts: {
    readonly sans: string;
    readonly mono: string;
  };
  readonly weights: Record<FontWeightToken, number>;
  readonly variants: Record<TextVariant, TypographyVariantDefinition>;
}

export interface MotionScale {
  readonly duration: {
    readonly instant: string;
    readonly fast: string;
    readonly base: string;
    readonly slow: string;
  };
  readonly easing: {
    readonly standard: string;
    readonly emphasized: string;
  };
  readonly reduced: boolean;
}

export type SpacingScale =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "8"
  | "10"
  | "12"
  | "16"
  | "20";

export type ThemeSpace = Record<SpacingScale, string>;

export interface ApolloTheme {
  readonly appearance: Appearance;
  readonly density: Density;
  readonly contrast: Contrast;
  readonly colors: ThemeColorTokens;
  readonly space: ThemeSpace;
  readonly radii: Record<RadiusToken, string>;
  readonly shadows: Record<ShadowToken, string>;
  readonly typography: TypographyScale;
  readonly motion: MotionScale;
}

export type ThemeOverride = DeepPartial<Omit<ApolloTheme, "appearance" | "density" | "contrast" | "motion">> & {
  readonly motion?: DeepPartial<Omit<MotionScale, "reduced">>;
};

export interface CreateThemeOptions {
  readonly appearance: Appearance;
  readonly density: Density;
  readonly highContrast: boolean;
  readonly reducedMotion: boolean;
  readonly overrides?: ThemeOverride;
}

type PaletteStop =
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900;

export type Palette = Record<PaletteStop, string>;

type Primitive = string | number | boolean | bigint | symbol | null | undefined;

export type DeepPartial<T> = {
  readonly [K in keyof T]?: T[K] extends Primitive
    ? T[K]
    : T[K] extends Array<infer V>
      ? ReadonlyArray<DeepPartial<V>>
      : DeepPartial<T[K]>;
};

const baseSpacing: Record<SpacingScale, number> = {
  "0": 0,
  "1": 0.25,
  "2": 0.5,
  "3": 0.75,
  "4": 1,
  "5": 1.25,
  "6": 1.5,
  "8": 2,
  "10": 2.5,
  "12": 3,
  "16": 4,
  "20": 5,
};

const densityMultipliers: Record<Density, number> = {
  comfortable: 1,
  compact: 0.88,
};

const radii: Record<RadiusToken, string> = {
  none: "0px",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  pill: "9999px",
};

const lightShadows: Record<ShadowToken, string> = {
  none: "none",
  xs: "0 1px 2px rgba(15, 23, 42, 0.08)",
  sm: "0 4px 8px rgba(15, 23, 42, 0.06)",
  md: "0 10px 24px rgba(15, 23, 42, 0.08)",
  lg: "0 24px 48px rgba(15, 23, 42, 0.12)",
};

const darkShadows: Record<ShadowToken, string> = {
  none: "none",
  xs: "0 1px 2px rgba(2, 6, 23, 0.5)",
  sm: "0 4px 8px rgba(2, 6, 23, 0.4)",
  md: "0 10px 24px rgba(8, 47, 73, 0.45)",
  lg: "0 24px 52px rgba(8, 47, 73, 0.5)",
};

const neutral: Palette = {
  50: "#f8fafc",
  100: "#f1f5f9",
  200: "#e2e8f0",
  300: "#cbd5e1",
  400: "#94a3b8",
  500: "#64748b",
  600: "#475569",
  700: "#334155",
  800: "#1e293b",
  900: "#0f172a",
};

const accent: Palette = {
  50: "#eef2ff",
  100: "#e0e7ff",
  200: "#c7d2fe",
  300: "#a5b4fc",
  400: "#818cf8",
  500: "#6366f1",
  600: "#4f46e5",
  700: "#4338ca",
  800: "#3730a3",
  900: "#312e81",
};

const success: Palette = {
  50: "#ecfdf5",
  100: "#d1fae5",
  200: "#a7f3d0",
  300: "#6ee7b7",
  400: "#34d399",
  500: "#10b981",
  600: "#059669",
  700: "#047857",
  800: "#065f46",
  900: "#064e3b",
};

const warning: Palette = {
  50: "#fffbeb",
  100: "#fef3c7",
  200: "#fde68a",
  300: "#fcd34d",
  400: "#fbbf24",
  500: "#f59e0b",
  600: "#d97706",
  700: "#b45309",
  800: "#92400e",
  900: "#78350f",
};

const danger: Palette = {
  50: "#fef2f2",
  100: "#fee2e2",
  200: "#fecaca",
  300: "#fca5a5",
  400: "#f87171",
  500: "#ef4444",
  600: "#dc2626",
  700: "#b91c1c",
  800: "#991b1b",
  900: "#7f1d1d",
};

const palettes: Record<ActionTone, Palette> = {
  accent,
  neutral,
  success,
  warning,
  danger,
};

const typography: TypographyScale = {
  fonts: {
    sans: "'Inter Variable', 'Inter', 'SF Pro Display', 'Segoe UI', system-ui, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'SFMono-Regular', ui-monospace, monospace",
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  variants: {
    display: {
      fontSize: "2.5rem",
      lineHeight: "3rem",
      letterSpacing: "-0.04em",
    },
    headline: {
      fontSize: "2rem",
      lineHeight: "2.5rem",
      letterSpacing: "-0.02em",
    },
    title: {
      fontSize: "1.5rem",
      lineHeight: "2rem",
      letterSpacing: "-0.01em",
    },
    subtitle: {
      fontSize: "1.25rem",
      lineHeight: "1.75rem",
      letterSpacing: "-0.005em",
    },
    body: {
      fontSize: "1rem",
      lineHeight: "1.5rem",
      letterSpacing: "0em",
    },
    bodySm: {
      fontSize: "0.875rem",
      lineHeight: "1.35rem",
      letterSpacing: "0em",
    },
    detail: {
      fontSize: "0.75rem",
      lineHeight: "1.1rem",
      letterSpacing: "0.02em",
      textTransform: "uppercase",
    },
    code: {
      fontSize: "0.875rem",
      lineHeight: "1.35rem",
      letterSpacing: "0.01em",
      fontFamily: "mono",
    },
  },
};

function formatSpace(value: number): string {
  return `${Math.round(value * 1000) / 1000}rem`;
}

function buildSpace(density: Density): ThemeSpace {
  const factor = densityMultipliers[density];
  return Object.fromEntries(
    (Object.keys(baseSpacing) as SpacingScale[]).map((key) => [
      key,
      formatSpace(baseSpacing[key] * factor),
    ]),
  ) as ThemeSpace;
}

function buildShadows(appearance: Appearance): Record<ShadowToken, string> {
  return appearance === "light" ? lightShadows : darkShadows;
}

function mix(colorA: string, colorB: string, weight: number): string {
  const clamp = (value: number) => Math.min(255, Math.max(0, Math.round(value)));
  const parse = (color: string) => {
    const hex = color.replace("#", "");
    const bigint = parseInt(hex, 16);
    if (hex.length === 6) {
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
      };
    }
    throw new Error(`Unsupported color format: ${color}`);
  };
  const { r: r1, g: g1, b: b1 } = parse(colorA);
  const { r: r2, g: g2, b: b2 } = parse(colorB);
  const w = Math.min(Math.max(weight, 0), 1);
  const r = clamp(r1 * (1 - w) + r2 * w);
  const g = clamp(g1 * (1 - w) + g2 * w);
  const b = clamp(b1 * (1 - w) + b2 * w);
  const toHex = (value: number) => value.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function deriveActionColors(
  tone: ActionTone,
  palette: Palette,
  appearance: Appearance,
  highContrast: boolean,
): ActionColorSet {
  if (appearance === "light") {
    return {
      solid: highContrast ? palette[700] : palette[600],
      solidHover: highContrast ? palette[800] : palette[700],
      solidActive: highContrast ? palette[900] : palette[800],
      solidForeground: "#ffffff",
      subtle: highContrast ? palette[100] : palette[100],
      subtleHover: highContrast ? palette[200] : palette[200],
      subtleForeground:
        tone === "neutral"
          ? neutral[700]
          : highContrast
            ? palette[800]
            : palette[700],
      outline: highContrast ? palette[700] : palette[500],
    };
  }

  const baseForeground = tone === "neutral" ? neutral[100] : palette[200];
  return {
    solid: highContrast ? palette[300] : palette[400],
    solidHover: highContrast ? palette[200] : palette[300],
    solidActive: highContrast ? palette[100] : palette[200],
    solidForeground: "#080c16",
    subtle: highContrast ? palette[800] : palette[900],
    subtleHover: highContrast ? palette[700] : palette[800],
    subtleForeground: baseForeground,
    outline: highContrast ? palette[200] : palette[300],
  };
}

function buildColors(appearance: Appearance, highContrast: boolean): ThemeColorTokens {
  const surface: Record<SurfaceColorToken, string> =
    appearance === "light"
      ? {
          background: "#ffffff",
          surface: "#f8fafc",
          surfaceRaised: "#f1f5f9",
          surfaceSunken: "#e2e8f0",
          surfaceContrast: "#020617",
        }
      : {
          background: "#020617",
          surface: "#0f172a",
          surfaceRaised: "#1e293b",
          surfaceSunken: "#111827",
          surfaceContrast: "#f8fafc",
        };

  const text: Record<TextColorToken, string> =
    appearance === "light"
      ? {
          primary: "#0f172a",
          secondary: "#1e293b",
          muted: "#475569",
          accent: accent[600],
          contrast: "#ffffff",
          success: success[600],
          warning: warning[700],
          danger: danger[600],
        }
      : {
          primary: "#e2e8f0",
          secondary: "#cbd5f5",
          muted: "#94a3b8",
          accent: accent[300],
          contrast: "#020617",
          success: success[200],
          warning: warning[200],
          danger: danger[200],
        };

  if (highContrast) {
    if (appearance === "light") {
      text.secondary = "#0b1120";
      text.muted = "#1f2937";
      surface.surface = "#f3f4f6";
      surface.surfaceRaised = "#e5e7eb";
    } else {
      text.secondary = "#f1f5f9";
      text.muted = "#e2e8f0";
      surface.surface = "#0b1120";
      surface.surfaceRaised = "#15213b";
    }
  }

  const border: Record<BorderToken, string> =
    appearance === "light"
      ? {
          subtle: highContrast ? neutral[400] : neutral[200],
          strong: highContrast ? neutral[500] : neutral[300],
        }
      : {
          subtle: highContrast ? "rgba(226, 232, 240, 0.45)" : "rgba(148, 163, 184, 0.35)",
          strong: highContrast ? "rgba(226, 232, 240, 0.75)" : "rgba(148, 163, 184, 0.55)",
        };

  const focusRing = appearance === "light" ? accent[500] : accent[300];
  const hoverOverlay =
    appearance === "light"
      ? "rgba(15, 23, 42, 0.04)"
      : "rgba(226, 232, 240, 0.08)";
  const activeOverlay =
    appearance === "light"
      ? "rgba(15, 23, 42, 0.08)"
      : "rgba(226, 232, 240, 0.14)";

  const states = {
    focusRing,
    focusColor: appearance === "light" ? accent[600] : accent[300],
    hoverOverlay,
    activeOverlay,
    backdrop:
      appearance === "light"
        ? "rgba(15, 23, 42, 0.55)"
        : "rgba(2, 6, 23, 0.65)",
  } as const;

  const action: Record<ActionTone, ActionColorSet> = {
    accent: deriveActionColors("accent", accent, appearance, highContrast),
    neutral: deriveActionColors("neutral", neutral, appearance, highContrast),
    success: deriveActionColors("success", success, appearance, highContrast),
    warning: deriveActionColors("warning", warning, appearance, highContrast),
    danger: deriveActionColors("danger", danger, appearance, highContrast),
  };

  if (highContrast) {
    const accentAction = action.accent;
    action.accent = {
      ...accentAction,
      subtle: mix(accentAction.subtle, appearance === "light" ? "#ffffff" : "#020617", 0.2),
      subtleHover: mix(accentAction.subtleHover, appearance === "light" ? "#ffffff" : "#020617", 0.15),
    };
  }

  return {
    surface,
    text,
    border,
    states,
    action,
  };
}

function buildMotion(reduced: boolean): MotionScale {
  return {
    duration: {
      instant: "0ms",
      fast: reduced ? "0ms" : "120ms",
      base: reduced ? "40ms" : "180ms",
      slow: reduced ? "120ms" : "260ms",
    },
    easing: {
      standard: "cubic-bezier(0.2, 0, 0.38, 0.9)",
      emphasized: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
    reduced,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeTheme<T>(base: T, overrides?: DeepPartial<T>): T {
  if (!overrides) {
    return base;
  }

  const result: T = (Array.isArray(base) ? [...base] : { ...base }) as T;
  const record = result as Record<PropertyKey, unknown>;

  for (const key of Object.keys(overrides) as (keyof T)[]) {
    const overrideValue = overrides[key];
    if (overrideValue === undefined) {
      continue;
    }

    const baseValue = record[key as PropertyKey] as T[typeof key];

    if (isRecord(baseValue) && isRecord(overrideValue)) {
      record[key as PropertyKey] = mergeTheme(
        baseValue,
        overrideValue as DeepPartial<T[typeof key]>,
      ) as unknown;
      continue;
    }

    record[key as PropertyKey] = overrideValue as T[typeof key];
  }

  return result;
}

function createBaseTheme(
  appearance: Appearance,
  density: Density,
  highContrast: boolean,
  reducedMotion: boolean,
): ApolloTheme {
  const colors = buildColors(appearance, highContrast);
  const space = buildSpace(density);
  const motion = buildMotion(reducedMotion);
  const base: ApolloTheme = {
    appearance,
    density,
    contrast: highContrast ? "high" : "normal",
    colors,
    space,
    radii,
    shadows: buildShadows(appearance),
    typography,
    motion,
  };
  return base;
}

export function createTheme(options: CreateThemeOptions): ApolloTheme {
  const { appearance, density, highContrast, reducedMotion, overrides } = options;
  const base = createBaseTheme(appearance, density, highContrast, reducedMotion);
  if (!overrides) {
    return base;
  }

  const merged = mergeTheme(base, overrides);

  return {
    ...merged,
    appearance,
    density,
    contrast: highContrast ? "high" : "normal",
    motion: {
      ...merged.motion,
      reduced: reducedMotion,
    },
  };
}

export const lightTheme: ApolloTheme = createTheme({
  appearance: "light",
  density: "comfortable",
  highContrast: false,
  reducedMotion: false,
});

export const darkTheme: ApolloTheme = createTheme({
  appearance: "dark",
  density: "comfortable",
  highContrast: false,
  reducedMotion: false,
});

export const tokens = {
  spacing: baseSpacing,
  radii,
  typography,
  palettes,
} as const;

