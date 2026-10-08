import { error } from '@sveltejs/kit';
import { articleNeighbours, articles } from '#lib/content/articles.server.ts';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => articles.map((article) => ({ slug: article.slug }));

export const load: PageServerLoad = ({ params }) => {
	const article = articles.find((a) => a.slug === params.slug);
	if (!article) error(404, `No article at /guide/${params.slug}`);
	return { article, ...articleNeighbours(article.slug) };
};
