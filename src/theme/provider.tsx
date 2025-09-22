import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

import {
  type ActionTone,
  type Appearance,
  type ApolloTheme,
  type Contrast,
  type Density,
  type ThemeOverride,
  createTheme,
} from "./tokens";

export type AppearanceOption = Appearance | "system";

const ACTION_TONES: ReadonlyArray<ActionTone> = [
  "accent",
  "neutral",
  "success",
  "warning",
  "danger",
];

export interface ApolloThemeProviderProps {
  readonly children: ReactNode;
  readonly appearance?: AppearanceOption;
  readonly density?: Density;
  readonly highContrast?: boolean;
  readonly overrides?: ThemeOverride;
  readonly onAppearanceChange?: (appearance: AppearanceOption) => void;
  readonly onDensityChange?: (density: Density) => void;
  readonly onHighContrastChange?: (enabled: boolean) => void;
}

export interface ApolloThemeContextValue {
  readonly theme: ApolloTheme;
  readonly appearance: Appearance;
  readonly appearancePreference: AppearanceOption;
  readonly setAppearance: (appearance: AppearanceOption) => void;
  readonly density: Density;
  readonly setDensity: (density: Density) => void;
  readonly highContrast: boolean;
  readonly setHighContrast: (enabled: boolean) => void;
  readonly systemAppearance: Appearance;
  readonly contrast: Contrast;
  readonly tones: ReadonlyArray<ActionTone>;
}

const ApolloThemeContext = createContext<ApolloThemeContextValue | undefined>(undefined);

const isBrowser = typeof window !== "undefined";

interface UseControllableStateOptions<T> {
  readonly value: T | undefined;
  readonly defaultValue: T;
  readonly onChange?: (next: T) => void;
}

function useControllableState<T>(
  options: UseControllableStateOptions<T>,
): readonly [T, (next: T) => void] {
  const { value, defaultValue, onChange } = options;
  const [internal, setInternal] = useState<T>(value ?? defaultValue);
  const isControlled = value !== undefined;

  useEffect(() => {
    if (!isControlled) {
      setInternal(defaultValue);
    }
  }, [defaultValue, isControlled]);

  useEffect(() => {
    if (isControlled && value !== undefined) {
      setInternal(value);
    }
  }, [isControlled, value]);

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) {
        setInternal(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [isControlled && value !== undefined ? value : internal, setValue] as const;
}

function useMediaQuery(query: string, fallback = false): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      if (!isBrowser) {
        return () => {};
      }
      const mql = window.matchMedia(query);
      const handler = () => callback();
      if (typeof mql.addEventListener === "function") {
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
      }
      const legacy = mql as MediaQueryList & {
        addListener?: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void) => void;
        removeListener?: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void) => void;
      };
      legacy.addListener?.(handler);
      return () => legacy.removeListener?.(handler);
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    if (!isBrowser) {
      return fallback;
    }
    return window.matchMedia(query).matches;
  }, [query, fallback]);

  const getServerSnapshot = useCallback(() => fallback, [fallback]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function useSystemAppearance(): Appearance {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)", false);
  return prefersDark ? "dark" : "light";
}

function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", false);
}

function usePrefersHighContrast(): boolean {
  return useMediaQuery("(prefers-contrast: more)", false);
}

export function ApolloThemeProvider({
  children,
  appearance,
  density,
  highContrast,
  overrides,
  onAppearanceChange,
  onDensityChange,
  onHighContrastChange,
}: ApolloThemeProviderProps): JSX.Element {
  const systemAppearance = useSystemAppearance();
  const [appearancePreference, setAppearancePreference] = useControllableState<AppearanceOption>({
    value: appearance,
    defaultValue: "system",
    onChange: onAppearanceChange,
  });

  const [densityState, setDensityState] = useControllableState<Density>({
    value: density,
    defaultValue: "comfortable",
    onChange: onDensityChange,
  });

  const prefersHighContrast = usePrefersHighContrast();
  const [highContrastState, setHighContrastState] = useControllableState<boolean>({
    value: highContrast,
    defaultValue: highContrast ?? prefersHighContrast,
    onChange: onHighContrastChange,
  });

  const reducedMotion = usePrefersReducedMotion();
  const resolvedAppearance =
    appearancePreference === "system" ? systemAppearance : appearancePreference;

  const theme = useMemo(
    () =>
      createTheme({
        appearance: resolvedAppearance,
        density: densityState,
        highContrast: highContrastState,
        reducedMotion,
        overrides,
      }),
    [densityState, highContrastState, overrides, reducedMotion, resolvedAppearance],
  );

  const contextValue = useMemo<ApolloThemeContextValue>(
    () => ({
      theme,
      appearance: resolvedAppearance,
      appearancePreference,
      setAppearance: setAppearancePreference,
      density: densityState,
      setDensity: setDensityState,
      highContrast: highContrastState,
      setHighContrast: setHighContrastState,
      systemAppearance,
      contrast: theme.contrast,
      tones: ACTION_TONES,
    }),
    [
      appearancePreference,
      densityState,
      highContrastState,
      resolvedAppearance,
      setAppearancePreference,
      setDensityState,
      setHighContrastState,
      systemAppearance,
      theme,
    ],
  );

  return (
    <ApolloThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ApolloThemeContext.Provider>
  );
}

export function useApolloTheme(): ApolloThemeContextValue {
  const context = useContext(ApolloThemeContext);
  if (!context) {
    throw new Error("useApolloTheme must be used within an ApolloThemeProvider");
  }
  return context;
}
