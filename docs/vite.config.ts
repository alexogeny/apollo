import { randomFillSync, webcrypto as nodeWebCrypto } from "node:crypto";
import { fileURLToPath, URL } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

type GetRandomValues = Crypto["getRandomValues"];
type RandomFillInput = Parameters<typeof randomFillSync>[0];
type GlobalWithOptionalCrypto = typeof globalThis & { crypto?: Crypto };

const globalObject = globalThis as GlobalWithOptionalCrypto;

const setCryptoGetRandomValues = (target: Crypto, implementation: GetRandomValues): void => {
  Object.defineProperty(target, "getRandomValues", {
    configurable: true,
    value: implementation,
    writable: true,
  });
};

const setGlobalCryptoValue = (value: Crypto): void => {
  Object.defineProperty(globalObject, "crypto", {
    configurable: true,
    writable: true,
    value,
  });
};

const ensureCryptoGetRandomValues = (): void => {
  const existingCrypto = globalObject.crypto;

  if (typeof existingCrypto?.getRandomValues === "function") {
    return;
  }

  if (typeof nodeWebCrypto?.getRandomValues === "function") {
    if (existingCrypto) {
      setCryptoGetRandomValues(
        existingCrypto,
        nodeWebCrypto.getRandomValues.bind(nodeWebCrypto) as GetRandomValues,
      );
    } else {
      setGlobalCryptoValue(nodeWebCrypto as unknown as Crypto);
    }
    return;
  }

  const fallbackGetRandomValues: GetRandomValues = <T extends ArrayBufferView>(array: T): T => {
    randomFillSync(array as unknown as RandomFillInput);
    return array;
  };

  if (existingCrypto) {
    setCryptoGetRandomValues(existingCrypto, fallbackGetRandomValues);
    return;
  }

  const cryptoWithGetRandomValues: Pick<Crypto, "getRandomValues"> = {
    getRandomValues: fallbackGetRandomValues,
  };

  setGlobalCryptoValue(cryptoWithGetRandomValues as Crypto);
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
