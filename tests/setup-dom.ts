import GlobalWindow from "happy-dom/lib/window/GlobalWindow.js";

const windowInstance = new GlobalWindow();
windowInstance.happyDOM.setURL("http://localhost");

const typedGlobal = globalThis as typeof globalThis & Record<string, unknown>;
const typedWindow = windowInstance as unknown as typeof window;

typedGlobal.window = typedWindow;
typedGlobal.document = typedWindow.document;
typedGlobal.navigator = typedWindow.navigator;
typedGlobal.HTMLElement = typedWindow.HTMLElement;
typedGlobal.HTMLDivElement = typedWindow.HTMLDivElement;
typedGlobal.HTMLButtonElement = typedWindow.HTMLButtonElement;
typedGlobal.SVGElement = typedWindow.SVGElement;
typedGlobal.CustomEvent = typedWindow.CustomEvent;
typedGlobal.Event = typedWindow.Event;
typedGlobal.Node = typedWindow.Node;
typedGlobal.Element = typedWindow.Element;
typedGlobal.MutationObserver = typedWindow.MutationObserver;
typedGlobal.ResizeObserver = typedWindow.ResizeObserver;
typedGlobal.getComputedStyle = typedWindow.getComputedStyle.bind(typedWindow);
typedGlobal.requestAnimationFrame = typedWindow.requestAnimationFrame.bind(typedWindow);
typedGlobal.cancelAnimationFrame = typedWindow.cancelAnimationFrame.bind(typedWindow);
typedGlobal.customElements = typedWindow.customElements;

if (!typedWindow.document.body) {
  const body = typedWindow.document.createElement("body");
  typedWindow.document.documentElement.append(body);
}

if (!typedWindow.matchMedia) {
  Object.defineProperty(typedWindow, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string): MediaQueryList => {
      const listeners = new Set<(event: MediaQueryListEvent) => void>();

      const mediaQueryList: MediaQueryList = {
        media: query,
        matches: false,
        onchange: null,
        addEventListener: (
          _eventName: string,
          listener: EventListenerOrEventListenerObject | null,
          _options?: boolean | AddEventListenerOptions,
        ) => {
          if (!listener) {
            return;
          }

          if (typeof listener === "function") {
            listeners.add(listener as (event: MediaQueryListEvent) => void);
            return;
          }

          if ("handleEvent" in listener && typeof listener.handleEvent === "function") {
            listeners.add(listener.handleEvent as (event: MediaQueryListEvent) => void);
          }
        },
        removeEventListener: (
          _eventName: string,
          listener: EventListenerOrEventListenerObject | null,
          _options?: boolean | EventListenerOptions,
        ) => {
          if (!listener) {
            return;
          }

          if (typeof listener === "function") {
            listeners.delete(listener as (event: MediaQueryListEvent) => void);
            return;
          }

          if ("handleEvent" in listener && typeof listener.handleEvent === "function") {
            listeners.delete(listener.handleEvent as (event: MediaQueryListEvent) => void);
          }
        },
        dispatchEvent: (event: Event) => {
          listeners.forEach((listener) => listener(event as MediaQueryListEvent));
          return true;
        },
        addListener: (listener: (event: MediaQueryListEvent) => void) => {
          listeners.add(listener);
        },
        removeListener: (listener: (event: MediaQueryListEvent) => void) => {
          listeners.delete(listener);
        },
      };

      return mediaQueryList;
    },
  });
}

process.env.TZ = "UTC";
