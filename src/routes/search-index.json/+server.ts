import { json } from '@sveltejs/kit';
import { searchIndex } from '#lib/search/index.server.ts';

export const prerender = true;

/**
 * The search index as a static file. The search page fetches it on first use, and the
 * service worker precaches it with the other prerendered files, so search works offline.
 */
export const GET = () => json(searchIndex);
