import { json } from '@sveltejs/kit';
import { articles } from '#lib/content/articles.server.ts';

export const prerender = true;

/** The article list as a static file, loaded by the root layout (see `+layout.ts`). */
export const GET = () => json(articles);
