import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ApolloThemeProvider } from "@apollo/ui";

import { App } from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to locate root element for Apollo UI documentation.");
}

createRoot(rootElement).render(
  <StrictMode>
    <ApolloThemeProvider>
      <App />
    </ApolloThemeProvider>
  </StrictMode>,
);
