import { resolve } from 'node:path';

/** The single place the upstream pin lives. Bump `sha` (and `date`) to re-extract. */
export const UPSTREAM = {
	repo: 'IvarK/AntimatterDimensionsSourceCode',
	url: 'https://github.com/IvarK/AntimatterDimensionsSourceCode.git',
	sha: '5409e320cecef96a917cca1dfb68f1f183e499ca',
	date: '2026-07-17'
} as const;

export const ROOT_DIR = resolve(import.meta.dir, '../..');
export const VENDOR_DIR = resolve(ROOT_DIR, 'vendor/ad-source');
export const UPSTREAM_SRC_DIR = resolve(VENDOR_DIR, 'src');
export const OUTPUT_DIR = resolve(ROOT_DIR, 'src/lib/data/generated');
