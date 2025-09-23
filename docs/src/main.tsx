import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ThemeProvider } from "@apollo/ui";

import "../../src/styles/tailwind.css";
import "./app.css";

import { App } from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to locate root element for Apollo UI documentation.");
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
