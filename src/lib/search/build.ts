/**
 * Builds the site search index at build time from the articles' Markdown and the game data.
 * Runs only on the server (prerender of `/search-index.json`); the browser loads the JSON.
 */
import { celestials, perks, realityUpgrades } from '#lib/data/index.ts';
import type { ArticleMeta } from '#lib/content/index.ts';
import { slugify } from '#lib/content/remark-headings.ts';
import { formatWrittenNumber } from '#lib/save/bignum.ts';
import { normalize, type SearchIndex, type SearchSection, type SearchTerm } from './search.ts';

export interface MarkdownSection {
	/** Heading id as `remark-headings` gives it, or '' for the text before the first h2. */
	id: string;
	heading: string;
	depth: 0 | 2 | 3;
	text: string;
}

const attr = (tag: string, name: string) =>
	new RegExp(`\\b${name}="([^"]*)"`).exec(tag)?.[1] ?? null;

/** `<Num>` as the article renders it, `<Screen>` as its caption and alt text, other tags dropped. */
function renderComponents(md: string): string {
	return md
		.replace(/<script\b[\s\S]*?<\/script>/g, '')
		.replace(/<style\b[\s\S]*?<\/style>/g, '')
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/<Num\b[^>]*?\/>/g, (tag) => {
			const value = attr(tag, 'value');
			if (value === null) throw new Error(`<Num> without a value: ${tag}`);
			const places = attr(tag, 'places');
			const under = attr(tag, 'placesUnder1000');
			return formatWrittenNumber(
				value,
				places === null ? undefined : Number(places),
				under === null ? undefined : Number(under)
			);
		})
		.replace(/<Screen\b[\s\S]*?\/>/g, (tag) =>
			['', attr(tag, 'caption'), attr(tag, 'alt'), ''].filter((s) => s !== null).join('\n\n')
		)
		.replace(/<\/?(?:Callout|Checklist|StageGate|span|sup|sub|br|strong|em|b|i)\b[^>]*>/g, ' ');
}

/**
 * One Markdown line as plain text: no list markers, table pipes, links, emphasis or code ticks,
 * and with the curly quotes and ellipses mdsvex's smartypants puts on the page.
 */
function inlineText(line: string): string {
	if (/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/.test(line)) return '';
	return line
		.replace(/^\s*>\s?/, '')
		.replace(/^\s*(?:[-*+]|\d+\.)\s+/, '')
		.replace(/\|/g, ' ')
		.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/\*\*|__/g, '')
		.replace(/(^|[^\p{L}\p{N}])[*_]([^*_\s][^*_]*?)[*_](?=[^\p{L}\p{N}]|$)/gu, '$1$2')
		.replace(/`/g, '')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/\.\.\./g, '…')
		.replace(/(^|[\s([{—–-])"/g, '$1“')
		.replace(/"/g, '”')
		.replace(/(^|[\s([{—–-])'/g, '$1‘')
		.replace(/'/g, '’');
}

/**
 * Splits an article's Markdown into sections at its h2 and h3 headings, with the same ids
 * `remark-headings` gives them (so results can link to `#id`), and each section's plain text.
 */
export function markdownSections(source: string): MarkdownSection[] {
	const body = renderComponents(source.replace(/^---\n[\s\S]*?\n---\n/, ''));
	const sections: MarkdownSection[] = [{ id: '', heading: '', depth: 0, text: '' }];
	const used = new Map<string, number>();
	const lines: string[][] = [[]];
	for (const line of body.split('\n')) {
		const heading = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
		if (!heading) {
			lines.at(-1)?.push(inlineText(line));
			continue;
		}
		const text = inlineText(heading[2]).trim();
		const base = slugify(text) || 'section';
		const count = used.get(base) ?? 0;
		used.set(base, count + 1);
		sections.push({
			id: count === 0 ? base : `${base}-${count + 1}`,
			heading: text,
			depth: heading[1].length === 2 ? 2 : 3,
			text: ''
		});
		lines.push([]);
	}
	for (const [i, section] of sections.entries()) {
		section.text = (lines[i] ?? []).join(' ').replace(/\s+/g, ' ').trim();
	}
	return sections.filter((s) => s.depth !== 0 || s.text !== '');
}

/** A game term and where the guide covers it. */
export interface TermSource {
	kind: string;
	name: string;
	text: string;
	slug: string;
	/** Section id to link to; by default the first section of the article that names the term. */
	section?: string;
}

const flat = (text: string | null | undefined) => (text ?? '').replace(/\s+/g, ' ').trim();

/** Game names players type: perk labels, Reality and Imaginary Upgrades, Ra memory levels. */
export function gameTerms(): TermSource[] {
	const terms: TermSource[] = [];
	for (const perk of perks.perks) {
		terms.push({
			kind: 'Perk',
			name: perk.label,
			text: flat(perk.description),
			slug: 'm1/perk-tree'
		});
	}
	for (const upgrade of realityUpgrades.upgrades) {
		terms.push({
			kind: 'Reality Upgrade',
			name: upgrade.name,
			text: flat(
				[upgrade.description, upgrade.requirement && `Requirement: ${upgrade.requirement}`]
					.filter(Boolean)
					.join('. ')
			),
			slug: upgrade.id <= 10 ? 'm1/reality-upgrades-1-2' : 'm1/reality-upgrades-3-5'
		});
	}
	for (const upgrade of realityUpgrades.imaginaryUpgrades) {
		terms.push({
			kind: 'Imaginary Upgrade',
			name: upgrade.name,
			text: flat(
				[upgrade.description, upgrade.requirement && `Requirement: ${upgrade.requirement}`]
					.filter(Boolean)
					.join('. ')
			),
			slug: upgrade.id <= 15 ? 'm2/imaginary-machines' : 'm2/imaginary-upgrades-16-to-25'
		});
	}
	const petName = new Map(celestials.ra.pets.map((p) => [p.id, p.name]));
	for (const unlock of celestials.ra.unlocks) {
		if (!unlock.reward) continue;
		terms.push({
			kind: 'Ra memory level',
			name: `${petName.get(unlock.pet) ?? unlock.pet} level ${unlock.level}`,
			text: flat(unlock.reward),
			slug: 'm2/ra-memories',
			section: 'key-levels-per-pet'
		});
	}
	return terms;
}

/** Builds the index from the ordered article list, each article's Markdown, and the game terms. */
export function buildSearchIndex(
	articles: readonly ArticleMeta[],
	sources: ReadonlyMap<string, string>,
	termSources: readonly TermSource[]
): SearchIndex {
	const sections: SearchSection[] = [];
	const bySlug = new Map<string, { a: number; sections: MarkdownSection[] }>();
	for (const [a, article] of articles.entries()) {
		const source = sources.get(article.slug);
		if (source === undefined) throw new Error(`No Markdown for article ${article.slug}`);
		const parsed = markdownSections(source);
		bySlug.set(article.slug, { a, sections: parsed });
		for (const s of parsed) sections.push({ a, id: s.id, heading: s.heading, text: s.text });
	}

	const terms: SearchTerm[] = termSources.map((term) => {
		const target = bySlug.get(term.slug);
		if (!target) throw new Error(`Term ${term.name}: no article ${term.slug}`);
		let id: string | undefined;
		if (term.section !== undefined) {
			id = target.sections.find((s) => s.id === term.section)?.id;
			if (id === undefined)
				throw new Error(`Term ${term.name}: no #${term.section} in ${term.slug}`);
		} else {
			const name = ` ${normalize(term.name)}`;
			id = target.sections.find((s) =>
				` ${normalize(`${s.heading} ${s.text}`)}`.includes(name)
			)?.id;
		}
		return { kind: term.kind, name: term.name, text: term.text, a: target.a, id: id ?? '' };
	});

	return {
		articles: articles.map(({ slug, title }) => ({ slug, title })),
		sections,
		terms
	};
}
