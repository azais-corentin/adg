import { buildArticleList, groupArticles, type ArticleMeta, type MilestoneGroup } from './index.ts';

// Eager: every article's frontmatter, validated at build time (an invalid article fails
// the build). Server-only so article bodies stay out of the client bundle; pages get the
// list through the root layout's load data.
const metadataModules = import.meta.glob('/src/content/*/*.md', {
	eager: true,
	import: 'metadata'
});

/** Every article, in reading order. */
export const articles: readonly ArticleMeta[] = buildArticleList(metadataModules);
export const articleGroups: readonly MilestoneGroup[] = groupArticles(articles);

export function articleNeighbours(slug: string): { prev?: ArticleMeta; next?: ArticleMeta } {
	const i = articles.findIndex((a) => a.slug === slug);
	if (i === -1) return {};
	return { prev: articles[i - 1], next: articles[i + 1] };
}
