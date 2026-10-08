import type { Component } from 'svelte';
import { STAGES, getStage, isStageId, stageIndex, type Stage, type StageId } from '#lib/stages.ts';
import type { ArticleHeading } from './remark-headings.ts';

export type { ArticleHeading };

/** Frontmatter every article in `src/content/<milestone>/<NN-slug>.md` must declare. */
export interface ArticleFrontmatter {
	title: string;
	stage: StageId;
	order: number;
	summary: string;
	verified: { android: string; upstream: string };
}

export interface ArticleMeta extends ArticleFrontmatter {
	/** URL path below `/guide/`, e.g. `m1/getting-started`. */
	slug: string;
	milestone: number;
	/** h2s of the article, collected at build time by `remark-headings`. */
	headings: ArticleHeading[];
}

export interface StageGroup {
	stage: Stage;
	articles: ArticleMeta[];
}

export interface MilestoneGroup {
	milestone: number;
	stages: StageGroup[];
}

export const MILESTONE_NAMES: Record<number, string> = {
	1: 'Pre-Infinity to the first Reality',
	2: 'The Celestials to the end'
};

const PATH_RE = /^\/src\/content\/m(\d+)\/\d+-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;
const ANDROID_RE = /^\d+\.\d+\.(?:\d+|x)$/;
const SHA_RE = /^[0-9a-f]{7,40}$/;

type Fields = { [key: string]: unknown };

function isHeadingList(value: unknown): value is ArticleHeading[] {
	return (
		Array.isArray(value) &&
		value.every((h: Fields | null) => typeof h?.id === 'string' && typeof h.text === 'string')
	);
}

/** Validates one article's path and frontmatter. Throws a message naming the file. */
export function parseArticle(path: string, metadata: unknown): ArticleMeta {
	const fail = (reason: string): never => {
		throw new Error(`Invalid article ${path}: ${reason}`);
	};
	const match = PATH_RE.exec(path);
	if (!match) return fail('path must be src/content/m<milestone>/<NN>-<kebab-slug>.md');
	const milestone = Number(match[1]);
	if (typeof metadata !== 'object' || metadata === null) return fail('missing frontmatter');

	const { title, stage, order, summary, verified, headings } = metadata as Fields;
	if (typeof title !== 'string' || !title.trim()) return fail('`title` must be a non-empty string');
	if (!isStageId(stage))
		return fail(`\`stage\` must be one of ${STAGES.map((s) => s.id).join(', ')}`);
	if (typeof order !== 'number' || !Number.isInteger(order))
		return fail('`order` must be an integer');
	if (typeof summary !== 'string' || !summary.trim())
		return fail('`summary` must be a non-empty string');
	if (typeof verified !== 'object' || verified === null)
		return fail('`verified` must be { android, upstream }');
	const { android, upstream } = verified as Fields;
	if (typeof android !== 'string' || !ANDROID_RE.test(android))
		return fail('`verified.android` must be a quoted version string like "3.18.0"');
	if (typeof upstream !== 'string' || !SHA_RE.test(upstream))
		return fail('`verified.upstream` must be an upstream commit SHA');
	if (getStage(stage).milestone !== milestone)
		return fail(
			`stage \`${stage}\` belongs to milestone ${getStage(stage).milestone}, not m${milestone}`
		);
	if (headings !== undefined && !isHeadingList(headings))
		return fail('`headings` is reserved for generated data');

	return {
		title,
		stage,
		order,
		summary,
		verified: { android, upstream },
		slug: `m${milestone}/${match[2]}`,
		milestone,
		headings: headings ?? []
	};
}

/** Validates and orders articles: by stage, then `order`. Throws on duplicates. */
export function buildArticleList(modules: Record<string, unknown>): ArticleMeta[] {
	const list = Object.entries(modules).map(([path, metadata]) => parseArticle(path, metadata));
	list.sort((a, b) => stageIndex(a.stage) - stageIndex(b.stage) || a.order - b.order);
	const seen = new Set<string>();
	for (const [i, article] of list.entries()) {
		if (seen.has(article.slug)) throw new Error(`Duplicate article slug ${article.slug}`);
		seen.add(article.slug);
		const prev = list[i - 1];
		if (prev && prev.stage === article.stage && prev.order === article.order)
			throw new Error(`Articles ${prev.slug} and ${article.slug} share stage and order`);
	}
	return list;
}

export function groupArticles(list: readonly ArticleMeta[]): MilestoneGroup[] {
	const groups: MilestoneGroup[] = [];
	for (const stage of STAGES) {
		const articles = list.filter((a) => a.stage === stage.id);
		if (articles.length === 0) continue;
		let group = groups.find((g) => g.milestone === stage.milestone);
		if (!group) {
			group = { milestone: stage.milestone, stages: [] };
			groups.push(group);
		}
		group.stages.push({ stage, articles });
	}
	return groups;
}

/**
 * Articles to read at `stage`: that stage's own, or, if none exist yet, the closest
 * earlier stage that has some.
 */
export function articlesForStage(
	list: readonly ArticleMeta[],
	stage: StageId
): StageGroup | undefined {
	for (let i = stageIndex(stage); i >= 0; i--) {
		const stageArticles = list.filter((a) => a.stage === STAGES[i].id);
		if (stageArticles.length > 0) return { stage: STAGES[i], articles: stageArticles };
	}
	return undefined;
}

// Lazy: each article's code loads only when it is opened. The eager metadata lives in
// `articles.server.ts` and reaches the client as load data, so importing this module
// never bundles article bodies.
const componentModules = import.meta.glob<Component>('/src/content/*/*.md', {
	import: 'default'
});

export async function loadArticleComponent(slug: string): Promise<Component> {
	const entry = Object.entries(componentModules).find(([path]) => {
		const match = PATH_RE.exec(path);
		return match !== null && `m${match[1]}/${match[2]}` === slug;
	});
	if (!entry) throw new Error(`No article component for ${slug}`);
	return entry[1]();
}
