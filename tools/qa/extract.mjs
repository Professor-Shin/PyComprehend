#!/usr/bin/env node
/**
 * extract.mjs — dependency-free extraction of the question bank from TypeScript
 * data files into JSON on stdout.
 *
 * The topic files are plain object literals with two TS-only constructs:
 *   `import { Topic } from '../types';`  and  `: Topic` on the export.
 * Stripping those yields valid ESM, so no transpiler / node_modules is needed.
 */
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(process.argv[2] ?? '.');
const TOPIC_DIR = join(ROOT, 'src/data/topics');

const tmp = mkdtempSync(join(tmpdir(), 'pyc-qa-'));
const topics = [];

for (const file of readdirSync(TOPIC_DIR).filter((f) => f.endsWith('.ts')).sort()) {
  const src = readFileSync(join(TOPIC_DIR, file), 'utf8')
    .replace(/^\s*import\s+.*?;\s*$/gm, '')      // drop type-only imports
    .replace(/(export\s+const\s+\w+)\s*:\s*Topic\b/g, '$1'); // drop type annotation
  const out = join(tmp, file.replace(/\.ts$/, '.mjs'));
  writeFileSync(out, src);
  const mod = await import(pathToFileURL(out).href);
  for (const value of Object.values(mod)) {
    if (value && typeof value === 'object' && Array.isArray(value.questions)) {
      topics.push({ ...value, sourceFile: `src/data/topics/${file}` });
    }
  }
}

process.stdout.write(JSON.stringify({ topics }, null, 2));
