import * as React from 'react';

import { createStyled } from '../styled';

const DEFAULT_MOBILE_BREAKPOINT = 960;

interface SidebarContextValue {
  readonly open: boolean;
  readonly isMobile: boolean;
  readonly navId: string;
  readonly toggle: () => void;
  readonly close: () => void;
  readonly openSidebar: () => void;
  readonly setNavId: (id: string) => void;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

const useSidebarContext = (): SidebarContextValue => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('Sidebar components must be used within <Sidebar.Provider>.');
  }
  return context;
};

const useMediaQuery = (query: string): boolean => {
  const getMatches = React.useCallback(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(query).matches;
  }, [query]);

  const [matches, setMatches] = React.useState<boolean>(() => getMatches());

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query, getMatches]);

  return matches;
};

const sanitizeId = (value: string): string => value.replace(/[^a-zA-Z0-9-_]/g, '');

interface SidebarProviderProps {
  readonly children: React.ReactNode;
  readonly mobileBreakpoint?: number;
  readonly defaultOpen?: boolean;
  readonly navId?: string;
}

const SidebarProvider = ({
  children,
  mobileBreakpoint = DEFAULT_MOBILE_BREAKPOINT,
  defaultOpen = false,
  navId: navIdProp,
}: SidebarProviderProps): JSX.Element => {
  const query = `(max-width: ${mobileBreakpoint}px)`;
  const isMobile = useMediaQuery(query);
  const generatedId = React.useId();
  const initialNavId = React.useMemo(
    () => navIdProp ?? `apollo-sidebar-${sanitizeId(generatedId)}`,
    [generatedId, navIdProp],
  );
  const [navIdState, setNavIdState] = React.useState<string>(initialNavId);

  React.useEffect(() => {
    if (navIdProp) {
      setNavIdState(navIdProp);
    }
  }, [navIdProp]);

  const [mobileOpen, setMobileOpen] = React.useState<boolean>(defaultOpen);

  React.useEffect(() => {
    if (isMobile) {
      setMobileOpen(defaultOpen);
    } else {
      setMobileOpen(true);
    }
  }, [isMobile, defaultOpen]);

  const open = isMobile ? mobileOpen : true;

  const toggle = React.useCallback(() => {
    if (!isMobile) {
      return;
    }
    setMobileOpen((previous) => !previous);
  }, [isMobile]);

  const close = React.useCallback(() => {
    if (!isMobile) {
      return;
    }
    setMobileOpen(false);
  }, [isMobile]);

  const openSidebar = React.useCallback(() => {
    if (!isMobile) {
      return;
    }
    setMobileOpen(true);
  }, [isMobile]);

  const setNavId = React.useCallback((nextId: string) => {
    setNavIdState(nextId);
  }, []);

  const contextValue = React.useMemo<SidebarContextValue>(
    () => ({
      open,
      isMobile,
      navId: navIdState,
      toggle,
      close,
      openSidebar,
      setNavId,
    }),
    [open, isMobile, navIdState, toggle, close, openSidebar, setNavId],
  );

  return <SidebarContext.Provider value={contextValue}>{children}</SidebarContext.Provider>;
};

const SidebarRootView = createStyled('nav', {
  base: {
    position: 'sticky',
    top: 'calc(var(--apollo-space-6) + 72px)',
    alignSelf: 'start',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--apollo-space-5)',
    padding: 'clamp(1rem, 2.5vw, 1.5rem)',
    borderRadius: 'var(--apollo-radius-lg)',
    border: '1px solid color-mix(in srgb, var(--apollo-color-border) 60%, transparent)',
    backgroundColor: 'color-mix(in srgb, var(--apollo-color-surface) 92%, transparent)',
    boxShadow: 'var(--apollo-shadow-low)',
    minWidth: 0,
    maxHeight: 'calc(100vh - clamp(5rem, 12vh, 7rem))',
    overflowY: 'auto',
    scrollbarWidth: 'thin',
    zIndex: 'calc(var(--apollo-z-overlay) + 1)',
    '@media (max-width: 960px)': {
      position: 'fixed',
      top: 'calc(var(--apollo-space-5) + 72px)',
      insetInlineStart: 'clamp(0.75rem, 4vw, 1.5rem)',
      insetInlineEnd: 'auto',
      bottom: 'clamp(0.75rem, 4vw, 1.5rem)',
      width: 'min(320px, calc(100vw - 2 * clamp(0.75rem, 4vw, 1.5rem)))',
      maxHeight: 'none',
      overflowY: 'auto',
      borderRadius: 'var(--apollo-radius-lg)',
      border: '1px solid color-mix(in srgb, var(--apollo-color-border) 65%, transparent)',
      boxShadow: 'var(--apollo-shadow-medium)',
      backgroundColor: 'color-mix(in srgb, var(--apollo-color-surface) 96%, transparent)',
      transform: 'translateX(-120%)',
      opacity: 0,
      pointerEvents: 'none',
      transition:
        'transform var(--apollo-motion-duration-medium) var(--apollo-motion-easing-entrance), opacity var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard)',
    },
    '&[data-state="open"]': {
      '@media (max-width: 960px)': {
        transform: 'translateX(0)',
        opacity: 1,
        pointerEvents: 'auto',
      },
    },
  },
  dataAttributes: (variants) => ({
    component: 'sidebar-root',
    variant: variants.variant ?? 'surface',
  }),
  variants: {
    variant: {
      surface: {},
      ghost: {
        backgroundColor: 'color-mix(in srgb, var(--apollo-color-bg-subtle) 70%, transparent)',
        borderColor: 'color-mix(in srgb, var(--apollo-color-border) 45%, transparent)',
        boxShadow: 'none',
      },
    },
  },
  defaultVariants: {
    variant: 'surface',
  },
  compoundVariants: [
    {
      variants: { variant: 'ghost' },
      style: {
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      },
    },
  ],
});

const SidebarHeader = createStyled('div', {
  base: {
    display: 'grid',
    gap: 'var(--apollo-space-2)',
  },
  dataAttributes: () => ({
    component: 'sidebar-header',
  }),
});

const SidebarSection = createStyled('section', {
  base: {
    display: 'grid',
    gap: 'var(--apollo-space-2)',
    paddingBlock: 'var(--apollo-space-2)',
    '& + &': {
      borderTop: '1px solid color-mix(in srgb, var(--apollo-color-border) 55%, transparent)',
      marginTop: 'var(--apollo-space-2)',
      paddingTop: 'var(--apollo-space-4)',
    },
  },
  dataAttributes: () => ({
    component: 'sidebar-section',
  }),
});

const SidebarSectionLabel = createStyled('span', {
  base: {
    fontSize: '0.72rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'color-mix(in srgb, var(--apollo-color-text-muted) 85%, var(--apollo-color-text) 15%)',
    fontWeight: 'var(--apollo-typography-weight-medium)',
  },
  dataAttributes: () => ({
    component: 'sidebar-section-label',
  }),
});

const SidebarList = createStyled('div', {
  base: {
    display: 'grid',
    gap: 'var(--apollo-space-1)',
  },
  dataAttributes: () => ({
    component: 'sidebar-list',
  }),
});

const SidebarItemBase = createStyled('button', {
  base: {
    appearance: 'none',
    border: '1px solid transparent',
    borderRadius: 'var(--apollo-radius-md)',
    borderLeftWidth: '3px',
    borderLeftColor: 'transparent',
    backgroundColor: 'transparent',
    display: 'grid',
    gap: '0.35rem',
    paddingBlock: 'calc(var(--apollo-space-2) + 2px)',
    paddingInlineStart: 'calc(var(--apollo-space-4) + 2px)',
    paddingInlineEnd: 'calc(var(--apollo-space-3) + 2px)',
    textAlign: 'left',
    cursor: 'pointer',
    color: 'color-mix(in srgb, var(--apollo-color-text-muted) 80%, var(--apollo-color-text) 20%)',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    letterSpacing: 'var(--apollo-typography-letter-spacing-tight)',
    transition:
      'background-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), border-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), box-shadow var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard)',
    minWidth: 0,
  },
  variants: {
    state: {
      idle: {
        '&:hover': {
          backgroundColor: 'color-mix(in srgb, var(--apollo-color-bg-subtle) 75%, transparent)',
          color: 'var(--apollo-color-text)',
          borderColor: 'color-mix(in srgb, var(--apollo-color-border) 55%, transparent)',
        },
      },
      active: {
        backgroundColor: 'color-mix(in srgb, var(--apollo-color-accent-subtle) 70%, transparent)',
        borderColor: 'color-mix(in srgb, var(--apollo-color-accent) 45%, transparent)',
        borderLeftColor: 'var(--apollo-color-accent)',
        color: 'var(--apollo-color-text)',
        boxShadow: '0 0 0 1px color-mix(in srgb, var(--apollo-color-accent) 30%, transparent)',
      },
    },
  },
  defaultVariants: {
    state: 'idle',
  },
  dataAttributes: (variants) => ({
    component: 'sidebar-item',
    state: variants.state ?? 'idle',
  }),
  compoundVariants: [
    {
      variants: { state: 'idle' },
      style: {
        '&:focus-visible': {
          outline: 'none',
          boxShadow: 'var(--apollo-shadow-focus)',
        },
      },
    },
    {
      variants: { state: 'active' },
      style: {
        '&:focus-visible': {
          outline: 'none',
          boxShadow: 'var(--apollo-shadow-focus-strong)',
        },
      },
    },
  ],
});

const SidebarItemLabel = createStyled('span', {
  base: {
    fontWeight: 'var(--apollo-typography-weight-semibold)',
    color: 'inherit',
    letterSpacing: 'var(--apollo-typography-letter-spacing-tight)',
  },
  dataAttributes: () => ({
    component: 'sidebar-item-label',
  }),
});

const SidebarItemDescription = createStyled('span', {
  base: {
    color: 'color-mix(in srgb, var(--apollo-color-text-muted) 88%, var(--apollo-color-text) 12%)',
    fontSize: '0.78rem',
    lineHeight: 1.5,
  },
  dataAttributes: () => ({
    component: 'sidebar-item-description',
  }),
});

const SidebarFooter = createStyled('div', {
  base: {
    fontSize: '0.78rem',
    color: 'color-mix(in srgb, var(--apollo-color-text-muted) 85%, var(--apollo-color-text) 15%)',
    lineHeight: 1.6,
  },
  dataAttributes: () => ({
    component: 'sidebar-footer',
  }),
});

const SidebarTriggerBase = createStyled('button', {
  base: {
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.75rem',
    height: '2.75rem',
    borderRadius: 'var(--apollo-radius-lg)',
    border: '1px solid color-mix(in srgb, var(--apollo-color-border) 60%, transparent)',
    backgroundColor: 'color-mix(in srgb, var(--apollo-color-surface) 95%, transparent)',
    color: 'var(--apollo-color-text)',
    cursor: 'pointer',
    transition:
      'background-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), border-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), box-shadow var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard)',
    '@media (max-width: 960px)': {
      display: 'inline-flex',
    },
    '&:hover': {
      backgroundColor: 'color-mix(in srgb, var(--apollo-color-bg-subtle) 75%, transparent)',
      borderColor: 'color-mix(in srgb, var(--apollo-color-border) 65%, transparent)',
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: 'var(--apollo-shadow-focus)',
    },
  },
  dataAttributes: (variants) => ({
    component: 'sidebar-trigger',
    state: variants.state ?? 'closed',
  }),
  variants: {
    state: {
      closed: {},
      open: {
        backgroundColor: 'color-mix(in srgb, var(--apollo-color-accent-subtle) 70%, transparent)',
        borderColor: 'color-mix(in srgb, var(--apollo-color-accent) 45%, transparent)',
      },
    },
  },
  defaultVariants: {
    state: 'closed',
  },
});

const SidebarTriggerIcon = createStyled('span', {
  base: {
    position: 'relative',
    width: '18px',
    height: '2px',
    borderRadius: '999px',
    backgroundColor: 'currentColor',
    transition:
      'background-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard)',
    '&::before, &::after': {
      content: "''",
      position: 'absolute',
      insetInlineStart: 0,
      width: '18px',
      height: '2px',
      borderRadius: '999px',
      backgroundColor: 'currentColor',
      transition:
        'transform var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), top var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), bottom var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard)',
    },
    '&::before': {
      top: '-6px',
    },
    '&::after': {
      bottom: '-6px',
    },
  },
  variants: {
    state: {
      closed: {},
      open: {
        backgroundColor: 'transparent',
        '&::before': {
          top: '0',
          transform: 'rotate(45deg)',
        },
        '&::after': {
          bottom: '0',
          transform: 'rotate(-45deg)',
        },
      },
    },
  },
  defaultVariants: {
    state: 'closed',
  },
  dataAttributes: (variants) => ({
    component: 'sidebar-trigger-icon',
    state: variants.state ?? 'closed',
  }),
});

const SidebarOverlayBase = createStyled('div', {
  base: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'color-mix(in srgb, var(--apollo-color-bg) 45%, rgba(15, 23, 42, 0.5))',
    opacity: 0,
    pointerEvents: 'none',
    transition: 'opacity var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard)',
    zIndex: 'var(--apollo-z-overlay)',
    '@media (min-width: 961px)': {
      display: 'none',
    },
    '&[data-state="open"]': {
      opacity: 1,
      pointerEvents: 'auto',
    },
  },
  dataAttributes: () => ({
    component: 'sidebar-overlay',
  }),
});

const SidebarRootInner = React.forwardRef<
  React.ElementRef<typeof SidebarRootView>,
  React.ComponentPropsWithoutRef<typeof SidebarRootView>
>(({ id: idProp, ...props }, ref) => {
  const { open, isMobile, navId, setNavId } = useSidebarContext();

  React.useEffect(() => {
    if (idProp) {
      setNavId(idProp);
    }
  }, [idProp, setNavId]);

  const computedId = idProp ?? navId;

  return (
    <SidebarRootView
      {...props}
      id={computedId}
      ref={ref}
      data-state={open ? 'open' : 'closed'}
      data-mode={isMobile ? 'mobile' : 'desktop'}
      aria-hidden={isMobile && !open ? true : undefined}
    />
  );
});

SidebarRootInner.displayName = 'SidebarRootInner';

export interface SidebarRootProps extends React.ComponentPropsWithoutRef<typeof SidebarRootView> {
  readonly mobileBreakpoint?: number;
  readonly defaultOpen?: boolean;
}

export const SidebarRoot = React.forwardRef<
  React.ElementRef<typeof SidebarRootView>,
  SidebarRootProps
>(({ mobileBreakpoint = DEFAULT_MOBILE_BREAKPOINT, defaultOpen = false, ...props }, ref) => {
  const context = React.useContext(SidebarContext);

  if (!context) {
    return (
      <SidebarProvider
        mobileBreakpoint={mobileBreakpoint}
        defaultOpen={defaultOpen}
        navId={props.id}
      >
        <SidebarRootInner {...props} ref={ref} />
      </SidebarProvider>
    );
  }

  return <SidebarRootInner {...props} ref={ref} />;
});

SidebarRoot.displayName = 'SidebarRoot';

export interface SidebarItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SidebarItemBase>, 'state'> {
  readonly active?: boolean;
}

export const SidebarItem = React.forwardRef<
  React.ElementRef<typeof SidebarItemBase>,
  SidebarItemProps
>(({ active = false, ...props }, ref) => (
  <SidebarItemBase {...props} ref={ref} state={active ? 'active' : 'idle'} />
));

SidebarItem.displayName = 'SidebarItem';

export interface SidebarTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SidebarTriggerBase> {}

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof SidebarTriggerBase>,
  SidebarTriggerProps
>(({ children, onClick, ...props }, ref) => {
  const { open, toggle, isMobile, navId } = useSidebarContext();

  const handleClick = React.useCallback<React.MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      onClick?.(event);
      toggle();
    },
    [onClick, toggle],
  );

  return (
    <SidebarTriggerBase
      {...props}
      ref={ref}
      type="button"
      onClick={handleClick}
      aria-expanded={open}
      aria-controls={navId}
      data-mode={isMobile ? 'mobile' : 'desktop'}
      state={open ? 'open' : 'closed'}
    >
      {children ?? <SidebarTriggerIcon aria-hidden="true" state={open ? 'open' : 'closed'} />}
    </SidebarTriggerBase>
  );
});

SidebarTrigger.displayName = 'SidebarTrigger';

export interface SidebarOverlayProps
  extends React.ComponentPropsWithoutRef<typeof SidebarOverlayBase> {}

const SidebarOverlay = React.forwardRef<
  React.ElementRef<typeof SidebarOverlayBase>,
  SidebarOverlayProps
>(({ onClick, ...props }, ref) => {
  const { open, close } = useSidebarContext();

  const handleClick = React.useCallback<React.MouseEventHandler<HTMLDivElement>>(
    (event) => {
      onClick?.(event);
      close();
    },
    [onClick, close],
  );

  return (
    <SidebarOverlayBase
      {...props}
      ref={ref}
      data-state={open ? 'open' : 'closed'}
      onClick={handleClick}
      aria-hidden="true"
    />
  );
});

SidebarOverlay.displayName = 'SidebarOverlay';

export const Sidebar = Object.assign(SidebarRoot, {
  Provider: SidebarProvider,
  Root: SidebarRoot,
  Header: SidebarHeader,
  Section: SidebarSection,
  SectionLabel: SidebarSectionLabel,
  List: SidebarList,
  Item: SidebarItem,
  ItemLabel: SidebarItemLabel,
  ItemDescription: SidebarItemDescription,
  Footer: SidebarFooter,
  Trigger: SidebarTrigger,
  Overlay: SidebarOverlay,
});
