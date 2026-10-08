import { describe, expect, it } from 'vitest';
import { articles } from './articles.server.ts';
import { buildArticleList, groupArticles, parseArticle } from './index.ts';

const valid = {
	title: 'Getting started',
	stage: 'pre-infinity',
	order: 1,
	summary: 'What the game is.',
	verified: { android: '3.18.0', upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca' },
	headings: [{ id: 'tabs', text: 'Tabs' }]
};

describe('parseArticle', () => {
	it('derives slug and milestone from the path', () => {
		const article = parseArticle('/src/content/m1/01-getting-started.md', valid);
		expect(article.slug).toBe('m1/getting-started');
		expect(article.milestone).toBe(1);
		expect(article.headings).toEqual([{ id: 'tabs', text: 'Tabs' }]);
	});

	it.each([
		['missing title', { ...valid, title: '' }, /title/],
		['unknown stage', { ...valid, stage: 'nope' }, /stage/],
		['non-integer order', { ...valid, order: 1.5 }, /order/],
		['missing summary', { ...valid, summary: undefined }, /summary/],
		[
			'numeric android version',
			{ ...valid, verified: { ...valid.verified, android: 3.18 } },
			/android/
		],
		['bad sha', { ...valid, verified: { ...valid.verified, upstream: 'main' } }, /upstream/],
		['stage from another milestone', { ...valid, stage: 'teresa' }, /milestone 2/]
	])('rejects %s', (_name, metadata, message) => {
		expect(() => parseArticle('/src/content/m1/01-getting-started.md', metadata)).toThrow(message);
	});

	it('rejects files outside the naming scheme', () => {
		expect(() => parseArticle('/src/content/m1/getting-started.md', valid)).toThrow(/path/);
		expect(() => parseArticle('/src/content/m1/01-Getting_Started.md', valid)).toThrow(/path/);
	});
});

describe('buildArticleList', () => {
	it('orders by stage, then order', () => {
		const list = buildArticleList({
			'/src/content/m1/03-c.md': { ...valid, stage: 'early-infinity', order: 1 },
			'/src/content/m1/02-b.md': { ...valid, order: 2 },
			'/src/content/m1/01-a.md': { ...valid, order: 1 }
		});
		expect(list.map((a) => a.slug)).toEqual(['m1/a', 'm1/b', 'm1/c']);
		expect(groupArticles(list).map((g) => g.stages.map((s) => s.stage.id))).toEqual([
			['pre-infinity', 'early-infinity']
		]);
	});

	it('rejects duplicate slugs and orders', () => {
		expect(() =>
			buildArticleList({
				'/src/content/m1/01-a.md': { ...valid, order: 1 },
				'/src/content/m1/02-a.md': { ...valid, order: 2 }
			})
		).toThrow(/Duplicate/);
		expect(() =>
			buildArticleList({
				'/src/content/m1/01-a.md': valid,
				'/src/content/m1/02-b.md': valid
			})
		).toThrow(/share stage and order/);
	});
});

describe('articles', () => {
	it('loads every real article with its h2s', () => {
		expect(articles.length).toBeGreaterThan(0);
		for (const article of articles) expect(article.headings.length).toBeGreaterThan(0);
	});
});
