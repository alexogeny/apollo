import { Window } from "happy-dom";

const windowInstance = new Window();
const globalObject = globalThis as unknown as Record<string, unknown>;

globalObject.window = windowInstance as unknown;
globalObject.document = windowInstance.document;
globalObject.HTMLElement = windowInstance.HTMLElement;
globalObject.Node = windowInstance.Node;
globalObject.navigator = windowInstance.navigator;

globalObject.requestAnimationFrame = (() => 0) as unknown;
globalObject.cancelAnimationFrame = (() => undefined) as unknown;

process.env.TZ = "UTC";
