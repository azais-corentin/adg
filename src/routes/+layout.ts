import { resolve } from '$app/paths';
import type { ArticleMeta } from '#lib/content/index.ts';
import type { LayoutLoad } from './$types';

export const prerender = true;

// A universal load over a prerendered file rather than a server load: the 404 page
// (Cloudflare serves build/404.html for unknown paths) renders in the browser, where a
// root server load has no data to fetch. Prerendered pages inline this response, so
// it is only requested on the 404 page.
export const load: LayoutLoad = async ({ fetch }) => {
	const response = await fetch(resolve('/articles.json'));
	return { articles: (await response.json()) as readonly ArticleMeta[] };
};
