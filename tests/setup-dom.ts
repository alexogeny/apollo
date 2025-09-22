import GlobalWindow from "happy-dom/lib/window/GlobalWindow.js";

const windowInstance = new GlobalWindow();
windowInstance.happyDOM.setURL("http://localhost");

Object.assign(globalThis, {
  window: windowInstance,
  document: windowInstance.document,
  navigator: windowInstance.navigator,
  HTMLElement: windowInstance.HTMLElement,
  HTMLDivElement: windowInstance.HTMLDivElement,
  HTMLButtonElement: windowInstance.HTMLButtonElement,
  SVGElement: windowInstance.SVGElement,
  CustomEvent: windowInstance.CustomEvent,
  Event: windowInstance.Event,
  Node: windowInstance.Node,
  Element: windowInstance.Element,
  MutationObserver: windowInstance.MutationObserver,
  ResizeObserver: windowInstance.ResizeObserver,
  getComputedStyle: windowInstance.getComputedStyle.bind(windowInstance),
  requestAnimationFrame: windowInstance.requestAnimationFrame.bind(windowInstance),
  cancelAnimationFrame: windowInstance.cancelAnimationFrame.bind(windowInstance),
  customElements: windowInstance.customElements,
});

if (!windowInstance.document.body) {
  const body = windowInstance.document.createElement("body");
  windowInstance.document.documentElement.appendChild(body);
}

if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => {
      const mediaQueryList: MediaQueryList = {
        media: query,
        matches: false,
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false,
      };
      return mediaQueryList;
    },
  });
}
