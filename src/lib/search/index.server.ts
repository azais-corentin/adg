import { articles } from '#lib/content/articles.server.ts';
import { buildSearchIndex, gameTerms } from './build.ts';
import type { SearchIndex } from './search.ts';

// The raw Markdown of every article; server-only, like the article metadata.
const markdown = import.meta.glob<string>('/src/content/*/*.md', {
	eager: true,
	query: '?raw',
	import: 'default'
});

const SLUG_RE = /^\/src\/content\/(m\d+)\/\d+-(.+)\.md$/;

const sources = new Map(
	Object.entries(markdown).map(([path, text]) => {
		const match = SLUG_RE.exec(path);
		if (!match) throw new Error(`Unexpected article path ${path}`);
		return [`${match[1]}/${match[2]}`, text];
	})
);

/** The site search index, built once per build and served as `/search-index.json`. */
export const searchIndex: SearchIndex = buildSearchIndex(articles, sources, gameTerms());
