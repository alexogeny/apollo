export type ColorRamp = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

export type PaletteName =
  | 'apple'
  | 'blueberry'
  | 'lime'
  | 'papaya'
  | 'plum'
  | 'dragonfruit';

export interface PaletteDefinition {
  readonly name: PaletteName;
  readonly accent: ColorRamp;
}

const palette = (name: PaletteName, accent: ColorRamp): PaletteDefinition => ({
  name,
  accent,
});

export const palettes: Record<PaletteName, PaletteDefinition> = {
  apple: palette('apple', {
    50: '#f3faf2',
    100: '#e5f5e3',
    200: '#cceacc',
    300: '#a8dcb0',
    400: '#7fc98c',
    500: '#5bb55f',
    600: '#3fa147',
    700: '#2e7e37',
    800: '#276531',
    900: '#1a4823',
  }),
  blueberry: palette('blueberry', {
    50: '#f3f6fd',
    100: '#e4ecfb',
    200: '#cddbf7',
    300: '#aec4f2',
    400: '#8aa9ec',
    500: '#6c8fe4',
    600: '#4f71d1',
    700: '#3b58af',
    800: '#304792',
    900: '#243370',
  }),
  lime: palette('lime', {
    50: '#f5fae9',
    100: '#e9f4ce',
    200: '#d4ea9f',
    300: '#b9dd6d',
    400: '#9dce42',
    500: '#7bb91c',
    600: '#5b9a12',
    700: '#477611',
    800: '#395b14',
    900: '#263c0f',
  }),
  papaya: palette('papaya', {
    50: '#fff7f1',
    100: '#ffeadc',
    200: '#ffd0b0',
    300: '#ffb485',
    400: '#ff9757',
    500: '#ff7a29',
    600: '#ed5f12',
    700: '#c24a0a',
    800: '#933a0c',
    900: '#632608',
  }),
  plum: palette('plum', {
    50: '#f6f2fb',
    100: '#ebe0f7',
    200: '#d8c2ef',
    300: '#c09ee6',
    400: '#a374dc',
    500: '#8651d0',
    600: '#6a36ba',
    700: '#542996',
    800: '#422074',
    900: '#2c1450',
  }),
  dragonfruit: palette('dragonfruit', {
    50: '#fff2f7',
    100: '#ffd8ea',
    200: '#ffadd4',
    300: '#ff83bf',
    400: '#ff5aaa',
    500: '#f73798',
    600: '#d8207f',
    700: '#aa1665',
    800: '#7c114b',
    900: '#4e0b31',
  }),
};

export const neutralTokens = {
  light: {
    background: '#fdfdfc',
    backgroundSubtle: '#f6f6f8',
    surface: '#ffffff',
    surfaceRaised: '#f5f6fa',
    border: '#d6dbe4',
    borderStrong: '#aeb6c6',
    text: '#151823',
    muted: '#61667a',
  },
  dark: {
    background: '#10131a',
    backgroundSubtle: '#161a25',
    surface: '#1a1d2b',
    surfaceRaised: '#22263b',
    border: '#343a54',
    borderStrong: '#454d6d',
    text: '#f5f7ff',
    muted: '#a6aac7',
  },
};

export const statusTokens = {
  light: {
    success: '#2fa873',
    successSoft: '#e6f8f1',
    successContrast: '#082217',
    warning: '#f3a220',
    warningSoft: '#fff4df',
    warningContrast: '#221202',
    danger: '#e5484d',
    dangerSoft: '#ffe5e7',
    dangerContrast: '#2a0607',
  },
  dark: {
    success: '#5ed7a4',
    successSoft: '#143627',
    successContrast: '#03160d',
    warning: '#f8c35b',
    warningSoft: '#2d210d',
    warningContrast: '#0f0600',
    danger: '#ff7276',
    dangerSoft: '#3a1418',
    dangerContrast: '#170203',
  },
};

export const spaceScale = {
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.5rem',
  10: '3rem',
};

export const radiusScale = {
  xs: '0.125rem',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  pill: '9999px',
};

export const shadowTokens = {
  low: '0 1px 2px rgba(15, 23, 42, 0.08), 0 1px 1px rgba(15, 23, 42, 0.04)',
  medium: '0 8px 20px rgba(15, 23, 42, 0.16)',
  high: '0 16px 40px rgba(15, 23, 42, 0.2)',
};

export const motionTokens = {
  duration: {
    100: '120ms',
    150: '160ms',
    200: '200ms',
    300: '280ms',
  },
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    entrance: 'cubic-bezier(0.16, 1, 0.3, 1)',
    exit: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  pressScale: '0.97',
};

export const typographyTokens = {
  fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  size: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.2',
    snug: '1.35',
    normal: '1.5',
  },
  letterSpacing: {
    normal: '0',
    tight: '-0.01em',
  },
};

export const zIndexTokens = {
  base: '0',
  overlay: '1000',
  popover: '1200',
  modal: '2000',
  toast: '3000',
};

export interface ThemeConfig {
  palette: PaletteName;
  mode: 'light' | 'dark';
  contrast: 'standard' | 'high';
  reduceMotion: boolean;
}

export const defaultThemeConfig: ThemeConfig = {
  palette: 'apple',
  mode: 'light',
  contrast: 'standard',
  reduceMotion: false,
};
