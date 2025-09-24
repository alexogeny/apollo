import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';

import { App, STYLE_PLACEHOLDER } from './app';
import { styleRegistry } from '../packages/apollo/src/styled';

const normalizeBasePath = (value: string): string => {
  if (!value) {
    return '/';
  }
  if (!value.endsWith('/')) {
    return `${value}/`;
  }
  return value;
};

const docsBase = normalizeBasePath(process.env.DOCS_BASE ?? '/');
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(currentDir, 'dist');

styleRegistry.clear();
const rendered = renderToStaticMarkup(<App basePath={docsBase} />);
const markup = `<!DOCTYPE html>${rendered.replace(STYLE_PLACEHOLDER, styleRegistry.getStyles())}`;

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });
await writeFile(path.join(distDir, 'index.html'), markup);

console.log(`Apollo docs built → ${distDir} (base: ${docsBase})`);
