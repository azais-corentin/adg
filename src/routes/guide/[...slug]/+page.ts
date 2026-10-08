import { loadArticleComponent } from '#lib/content/index.ts';
import type { PageLoad } from './$types';

// Metadata comes from +page.server.ts (prerendered); the article body loads lazily here.
export const load: PageLoad = async ({ data }) => ({
	...data,
	component: await loadArticleComponent(data.article.slug)
});
