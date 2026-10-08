import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** The single place the upstream pin lives. Bump `sha` (and `date`) to re-extract. */
export const UPSTREAM = {
	repo: 'IvarK/AntimatterDimensionsSourceCode',
	url: 'https://github.com/IvarK/AntimatterDimensionsSourceCode.git',
	sha: '5409e320cecef96a917cca1dfb68f1f183e499ca',
	date: '2026-07-17'
} as const;

// `import.meta.url` (not Bun's `import.meta.dir`) so Vitest under Node can reuse the environment.
export const ROOT_DIR = fileURLToPath(new URL('../..', import.meta.url));
export const VENDOR_DIR = resolve(ROOT_DIR, 'vendor/ad-source');
export const UPSTREAM_SRC_DIR = resolve(VENDOR_DIR, 'src');
export const OUTPUT_DIR = resolve(ROOT_DIR, 'src/lib/data/generated');
