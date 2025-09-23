import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

const isBrowser = typeof window !== "undefined";

type ColorScheme = "light" | "dark";
type ColorSchemePreference = ColorScheme | "system";
type ContrastPreference = "high" | "normal" | "system";
type MotionPreference = "reduced" | "default" | "system";

type MotionState = "reduced" | "default";

type ThemeProviderContextValue = {
  readonly scheme: ColorScheme;
  readonly schemePreference: ColorSchemePreference;
  readonly setSchemePreference: Dispatch<SetStateAction<ColorSchemePreference>>;
  readonly highContrast: boolean;
  readonly highContrastPreference: ContrastPreference;
  readonly setHighContrastPreference: Dispatch<SetStateAction<ContrastPreference>>;
  readonly motion: MotionState;
  readonly motionPreference: MotionPreference;
  readonly setMotionPreference: Dispatch<SetStateAction<MotionPreference>>;
};

const ThemeProviderContext = createContext<ThemeProviderContextValue | null>(null);

interface ThemeProviderProps {
  readonly children: ReactNode;
  readonly defaultScheme?: ColorSchemePreference;
  readonly defaultHighContrast?: ContrastPreference;
  readonly defaultMotion?: MotionPreference;
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

function useSystemColorScheme(): ColorScheme {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  return prefersDark ? "dark" : "light";
}

function useSystemHighContrast(): boolean {
  return useMediaQuery("(prefers-contrast: more)");
}

function useSystemReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function ThemeProvider({
  children,
  defaultScheme = "system",
  defaultHighContrast = "system",
  defaultMotion = "system",
}: ThemeProviderProps): JSX.Element {
  const systemScheme = useSystemColorScheme();
  const systemHighContrast = useSystemHighContrast();
  const systemReducedMotion = useSystemReducedMotion();

  const [schemePreference, setSchemePreference] = useState<ColorSchemePreference>(defaultScheme);
  const [highContrastPreference, setHighContrastPreference] =
    useState<ContrastPreference>(defaultHighContrast);
  const [motionPreference, setMotionPreference] = useState<MotionPreference>(defaultMotion);

  const resolvedScheme = schemePreference === "system" ? systemScheme : schemePreference;
  const resolvedHighContrast =
    highContrastPreference === "system" ? systemHighContrast : highContrastPreference === "high";

  const resolvedMotion: MotionState =
    motionPreference === "system"
      ? systemReducedMotion
        ? "reduced"
        : "default"
      : motionPreference === "reduced"
        ? "reduced"
        : "default";

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    const root = window.document.documentElement;
    root.dataset.theme = resolvedScheme;
    root.dataset.contrast = resolvedHighContrast ? "high" : "normal";
    root.dataset.motion = resolvedMotion;
    root.style.colorScheme = resolvedScheme;

    if (resolvedScheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [resolvedHighContrast, resolvedMotion, resolvedScheme]);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    const root = window.document.documentElement;
    if (resolvedMotion === "reduced") {
      root.style.setProperty("--apollo-motion-duration", "0ms");
    } else {
      root.style.removeProperty("--apollo-motion-duration");
    }
  }, [resolvedMotion]);

  const value = useMemo<ThemeProviderContextValue>(
    () => ({
      scheme: resolvedScheme,
      schemePreference,
      setSchemePreference,
      highContrast: resolvedHighContrast,
      highContrastPreference,
      setHighContrastPreference,
      motion: resolvedMotion,
      motionPreference,
      setMotionPreference,
    }),
    [
      resolvedScheme,
      schemePreference,
      resolvedHighContrast,
      highContrastPreference,
      resolvedMotion,
      motionPreference,
    ],
  );

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
}

export function useTheme(): ThemeProviderContextValue {
  const context = useContext(ThemeProviderContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export type { ColorSchemePreference, ContrastPreference, MotionPreference };
