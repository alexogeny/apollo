import {
  type ColorRamp,
  type PaletteName,
  type ThemeConfig,
  defaultThemeConfig,
  motionTokens,
  neutralTokens,
  palettes,
  radiusScale,
  shadowTokens,
  spaceScale,
  statusTokens,
  typographyTokens,
  zIndexTokens,
} from './tokens';

export type ThemeMode = 'light' | 'dark';

export interface ThemeVariables {
  [cssVariable: string]: string;
}

type TokenPrimitive = string | number;

type TokenValue = TokenPrimitive | TokenRecord | null | undefined;

interface TokenRecord {
  [key: string]: TokenPrimitive | TokenRecord | null | undefined;
}

const isTokenRecord = (value: TokenValue): value is TokenRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const toKebab = (value: string): string =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();

const flattenTokens = (prefix: string[], source: TokenRecord, target: ThemeVariables) => {
  for (const [key, value] of Object.entries(source)) {
    const path = [...prefix, toKebab(key)];
    if (isTokenRecord(value)) {
      flattenTokens(path, value, target);
    } else if (value !== undefined && value !== null) {
      target[`--apollo-${path.join('-')}`] = String(value);
    }
  }
};

const buildBaseVariables = (): ThemeVariables => {
  const base: ThemeVariables = {};
  flattenTokens(['space'], spaceScale, base);
  flattenTokens(['radius'], radiusScale, base);
  flattenTokens(['shadow'], shadowTokens, base);
  flattenTokens(['motion'], motionTokens, base);
  flattenTokens(['typography'], typographyTokens, base);
  flattenTokens(['z'], zIndexTokens, base);
  base['--apollo-typography-font-family-base'] = typographyTokens.fontFamily;
  base['--apollo-shadow-focus'] = '0 0 0 3px var(--apollo-color-focus-ring)';
  base['--apollo-shadow-focus-strong'] =
    '0 0 0 4px color-mix(in srgb, var(--apollo-color-focus-ring) 60%, transparent)';
  base['--apollo-motion-duration-0'] = '0ms';
  base['--apollo-motion-duration-quick'] = motionTokens.duration[100];
  base['--apollo-motion-duration-fast'] = motionTokens.duration[150];
  base['--apollo-motion-duration-medium'] = motionTokens.duration[200];
  base['--apollo-motion-duration-slow'] = motionTokens.duration[300];
  base['--apollo-motion-easing-standard'] = motionTokens.easing.standard;
  base['--apollo-motion-easing-entrance'] = motionTokens.easing.entrance;
  base['--apollo-motion-easing-exit'] = motionTokens.easing.exit;
  base['--apollo-motion-press-scale'] = motionTokens.pressScale;
  return base;
};

const baseVariables = buildBaseVariables();

const accentRampVariables = (paletteName: PaletteName): ThemeVariables => {
  const palette = palettes[paletteName];
  const ramp: ThemeVariables = {};
  for (const step of Object.keys(palette.accent) as unknown as Array<keyof ColorRamp>) {
    ramp[`--apollo-accent-${step}`] = palette.accent[step];
  }
  ramp['--apollo-palette-name'] = palette.name;
  return ramp;
};

const buildModeVariables = (mode: ThemeMode, paletteName: PaletteName): ThemeVariables => {
  const neutrals = neutralTokens[mode];
  const status = statusTokens[mode];
  const accent = palettes[paletteName].accent;

  return {
    '--apollo-color-bg': neutrals.background,
    '--apollo-color-bg-subtle': neutrals.backgroundSubtle,
    '--apollo-color-surface': neutrals.surface,
    '--apollo-color-surface-raised': neutrals.surfaceRaised,
    '--apollo-color-border': neutrals.border,
    '--apollo-color-border-strong': neutrals.borderStrong,
    '--apollo-color-text': neutrals.text,
    '--apollo-color-text-muted': neutrals.muted,
    '--apollo-color-accent': accent['500'],
    '--apollo-color-accent-strong': accent['600'],
    '--apollo-color-accent-subtle': accent['200'],
    '--apollo-color-accent-muted': accent['100'],
    '--apollo-color-accent-contrast': mode === 'light' ? '#0f1812' : '#f9fbf9',
    '--apollo-color-focus-ring': accent['300'],
    '--apollo-color-success': status.success,
    '--apollo-color-success-soft': status.successSoft,
    '--apollo-color-success-contrast': status.successContrast,
    '--apollo-color-warning': status.warning,
    '--apollo-color-warning-soft': status.warningSoft,
    '--apollo-color-warning-contrast': status.warningContrast,
    '--apollo-color-danger': status.danger,
    '--apollo-color-danger-soft': status.dangerSoft,
    '--apollo-color-danger-contrast': status.dangerContrast,
    '--apollo-color-skeleton': mode === 'light' ? '#e7e9f0' : '#2b3044',
    '--apollo-color-backdrop': mode === 'light'
      ? 'rgba(13, 16, 26, 0.45)'
      : 'rgba(6, 8, 15, 0.65)',
  };
};

const toDeclarationString = (vars: ThemeVariables): string =>
  Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join('');

const buildThemeRule = (
  selector: string,
  vars: ThemeVariables,
): string => `${selector}{${toDeclarationString(vars)}}`;

const buildHighContrastRule = (): string =>
  [
    buildThemeRule(':root[data-contrast="high"]', {
      '--apollo-color-bg': 'Canvas',
      '--apollo-color-surface': 'Canvas',
      '--apollo-color-border': 'ButtonText',
      '--apollo-color-border-strong': 'ButtonText',
      '--apollo-color-text': 'ButtonText',
      '--apollo-color-text-muted': 'GrayText',
      '--apollo-color-accent': 'Highlight',
      '--apollo-color-accent-contrast': 'HighlightText',
      '--apollo-color-focus-ring': 'Highlight',
    }),
    '@media (forced-colors: active){:root{--apollo-motion-press-scale:1;}}',
  ].join('');

const buildReducedMotionRule = (): string =>
  buildThemeRule(':root[data-motion="reduced"]', {
    '--apollo-motion-duration-quick': '0ms',
    '--apollo-motion-duration-fast': '0ms',
    '--apollo-motion-duration-medium': '0ms',
    '--apollo-motion-duration-slow': '0ms',
    '--apollo-motion-press-scale': '1',
  });

export const createThemeStyles = (): string => {
  const rules: string[] = [];
  rules.push(buildThemeRule(':root', baseVariables));

  (Object.keys(palettes) as PaletteName[]).forEach((paletteName) => {
    const rampVars = accentRampVariables(paletteName);
    (['light', 'dark'] as ThemeMode[]).forEach((mode) => {
      const selector = `:root[data-theme="${mode}"][data-palette="${paletteName}"]`;
      const vars = {
        ...rampVars,
        ...buildModeVariables(mode, paletteName),
      };
      rules.push(buildThemeRule(selector, vars));
    });
  });

  rules.push(buildHighContrastRule());
  rules.push(buildReducedMotionRule());
  return rules.join('');
};

export const APOLLO_THEME_CSS = createThemeStyles();

export const injectThemeStyles = (
  targetDocument?: Document,
): string => {
  const css = APOLLO_THEME_CSS;
  if (typeof document === 'undefined' && !targetDocument) {
    return css;
  }

  const doc = targetDocument ?? document;
  const existing = doc.head.querySelector<HTMLStyleElement>('style[data-apollo-theme]');
  const style = existing ?? doc.createElement('style');
  style.setAttribute('data-apollo-theme', 'true');
  style.textContent = css;
  if (!existing) {
    doc.head.appendChild(style);
  }
  return css;
};

const resolveConfig = (config?: Partial<ThemeConfig>): ThemeConfig => ({
  ...defaultThemeConfig,
  ...config,
});

export const applyTheme = (
  target: HTMLElement,
  config?: Partial<ThemeConfig>,
): ThemeConfig => {
  const resolved = resolveConfig(config);
  target.dataset.theme = resolved.mode;
  target.dataset.palette = resolved.palette;
  if (resolved.contrast === 'high') {
    target.dataset.contrast = 'high';
  } else {
    delete target.dataset.contrast;
  }
  target.dataset.motion = resolved.reduceMotion ? 'reduced' : 'full';
  return resolved;
};

export const getThemeVariables = (
  config?: Partial<ThemeConfig>,
): ThemeVariables => {
  const resolved = resolveConfig(config);
  return {
    ...baseVariables,
    ...accentRampVariables(resolved.palette),
    ...buildModeVariables(resolved.mode, resolved.palette),
    ...(resolved.contrast === 'high'
      ? {
          '--apollo-color-bg': 'Canvas',
          '--apollo-color-surface': 'Canvas',
          '--apollo-color-border': 'ButtonText',
          '--apollo-color-border-strong': 'ButtonText',
          '--apollo-color-text': 'ButtonText',
          '--apollo-color-text-muted': 'GrayText',
          '--apollo-color-focus-ring': 'Highlight',
          '--apollo-color-accent': 'Highlight',
          '--apollo-color-accent-contrast': 'HighlightText',
        }
      : {}),
    ...(resolved.reduceMotion
      ? {
          '--apollo-motion-duration-quick': '0ms',
          '--apollo-motion-duration-fast': '0ms',
          '--apollo-motion-duration-medium': '0ms',
          '--apollo-motion-duration-slow': '0ms',
          '--apollo-motion-press-scale': '1',
        }
      : {}),
  };
};
