import { articles } from '#lib/content/articles.server.ts';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => ({ articles });
