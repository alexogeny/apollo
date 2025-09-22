import { randomFillSync, webcrypto as nodeWebCrypto } from "node:crypto";
import { fileURLToPath, URL } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

type CryptoWithGetRandomValues = Partial<Crypto> & Pick<Crypto, "getRandomValues">;

const defineGlobalCrypto = (value: CryptoWithGetRandomValues): void => {
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value,
  });
};

const ensureCryptoGetRandomValues = (): void => {
  const existingCrypto = globalThis.crypto as Crypto | undefined;

  if (typeof existingCrypto?.getRandomValues === "function") {
    return;
  }

  const webCryptoCandidate = nodeWebCrypto as Crypto | undefined;

  if (typeof webCryptoCandidate?.getRandomValues === "function") {
    defineGlobalCrypto(webCryptoCandidate);
    return;
  }

  const getRandomValues = <T extends ArrayBufferView>(array: T): T => {
    randomFillSync(array);
    return array;
  };

  if (existingCrypto) {
    Object.defineProperty(existingCrypto, "getRandomValues", {
      configurable: true,
      value: getRandomValues,
      writable: true,
    });
    return;
  }

  const polyfilledCrypto: CryptoWithGetRandomValues = {
    getRandomValues,
  };

  defineGlobalCrypto(polyfilledCrypto);
};

ensureCryptoGetRandomValues();

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const defaultBase = repositoryName ? `/${repositoryName}/` : "/";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: process.env.DOCS_BASE ?? defaultBase,
  plugins: [react()],
  resolve: {
    alias: {
      "@apollo/ui": fileURLToPath(new URL("../src", import.meta.url)),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
