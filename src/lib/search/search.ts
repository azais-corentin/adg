/**
 * Site search over the prerendered `/search-index.json`. Hand-rolled: about 70 articles and a
 * few hundred sections fit in one linear scan that takes a few milliseconds on a phone, so
 * no search library is needed. Every query word must start a word somewhere in the result.
 */

export interface SearchSection {
	/** Index into `SearchIndex.articles`. */
	a: number;
	/** Heading id to link to, or '' for the top of the article. */
	id: string;
	heading: string;
	text: string;
}

export interface SearchTerm {
	/** "Perk", "Reality Upgrade", … */
	kind: string;
	name: string;
	/** The game's description of it. */
	text: string;
	a: number;
	id: string;
}

export interface SearchIndex {
	articles: { slug: string; title: string }[];
	sections: SearchSection[];
	terms: SearchTerm[];
}

export interface Piece {
	text: string;
	mark: boolean;
}

export interface SearchResult {
	slug: string;
	/** Section id, '' for the article top. */
	id: string;
	title: string;
	/** Section heading; a term's name. */
	heading: string;
	/** Set for game terms. */
	kind?: string;
	snippet: Piece[];
}

/**
 * Lowercase ASCII-ish words: accents and apostrophes dropped ("Lai'tela" → "laitela"),
 * thousands separators dropped ("1e10,500" → "1e10500"), other punctuation as spaces. Dots
 * stay so "1.80e308" is one word.
 */
export function normalize(text: string): string {
	return text
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f'’]/g, '')
		.replace(/(\d),(?=\d)/g, '$1')
		.replace(/[^a-z0-9.]+/g, ' ');
}

interface Entry {
	slug: string;
	id: string;
	title: string;
	heading: string;
	kind?: string;
	text: string;
	/** Normalized, padded with spaces so `includes(' ' + word)` finds word starts. */
	head: string;
	body: string;
}

export type PreparedIndex = readonly Entry[];

/** Normalizes the index once, after it loads. Terms come first: they win ties. */
export function prepareIndex(index: SearchIndex): PreparedIndex {
	const pad = (text: string) => ` ${normalize(text)} `;
	const article = (a: number) => {
		const found = index.articles[a];
		if (!found) throw new Error(`Search index: no article ${a}`);
		return found;
	};
	return [
		...index.terms.map((t) => ({
			slug: article(t.a).slug,
			id: t.id,
			title: article(t.a).title,
			heading: t.name,
			kind: t.kind,
			text: t.text,
			head: pad(t.name),
			body: pad(t.text)
		})),
		...index.sections.map((s) => {
			const { slug, title } = article(s.a);
			// The article's top section carries its title as heading.
			return {
				slug,
				id: s.id,
				title,
				heading: s.heading,
				text: s.text,
				head: pad(s.id === '' ? title : s.heading),
				body: pad(s.text)
			};
		})
	];
}

const SNIPPET_LENGTH = 180;

function wordPattern(words: readonly string[]): RegExp {
	const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
	return new RegExp(`(?<![\\p{L}\\p{N}])(?:${escaped.join('|')})`, 'giu');
}

/** About `SNIPPET_LENGTH` characters of `text` around the first match, matches marked. */
function snippet(text: string, words: readonly string[]): Piece[] {
	const pattern = wordPattern(words);
	// `search` ignores the global flag's `lastIndex`, which `matchAll` below would inherit.
	const first = Math.max(0, text.search(pattern));
	let start = Math.max(0, first - 60);
	if (start > 0) start = text.indexOf(' ', start) + 1 || start;
	let end = Math.min(text.length, start + SNIPPET_LENGTH);
	if (end < text.length)
		end = text.lastIndexOf(' ', end) > start ? text.lastIndexOf(' ', end) : end;
	const window = `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`;
	return marked(window, pattern);
}

function marked(text: string, pattern: RegExp): Piece[] {
	const pieces: Piece[] = [];
	let last = 0;
	for (const match of text.matchAll(pattern)) {
		if (match.index > last) pieces.push({ text: text.slice(last, match.index), mark: false });
		pieces.push({ text: match[0], mark: true });
		last = match.index + match[0].length;
	}
	if (last < text.length) pieces.push({ text: text.slice(last), mark: false });
	return pieces;
}

function occurrences(haystack: string, needle: string): number {
	let count = 0;
	for (
		let i = haystack.indexOf(needle);
		i !== -1 && count < 5;
		i = haystack.indexOf(needle, i + 1)
	) {
		count++;
	}
	return count;
}

/** Ranked results for `query`, best first: a word in a term's name or a heading beats body text. */
export function search(
	index: PreparedIndex,
	query: string,
	limit = 30
): { total: number; results: SearchResult[] } {
	const words = normalize(query)
		.split(' ')
		.map((w) => w.replace(/^\.+|\.+$/g, ''))
		.filter(Boolean);
	if (words.length === 0) return { total: 0, results: [] };
	const phrase = ` ${words.join(' ')}`;

	const scored: { entry: Entry; score: number }[] = [];
	for (const entry of index) {
		let score = 0;
		let all = true;
		for (const word of words) {
			const needle = ` ${word}`;
			const inHead = entry.head.includes(needle);
			const inBody = occurrences(entry.body, needle);
			if (!inHead && inBody === 0) {
				all = false;
				break;
			}
			score += (inHead ? (entry.kind ? 12 : 8) : 0) + (inBody > 0 ? 1 + 0.5 * inBody : 0);
		}
		if (!all) continue;
		if (words.length > 1) {
			if (entry.head.includes(phrase)) score += 15;
			else if (entry.body.includes(phrase)) score += 4;
		}
		scored.push({ entry, score });
	}
	// Stable: equal scores keep guide order.
	scored.sort((x, y) => y.score - x.score);

	return {
		total: scored.length,
		results: scored.slice(0, limit).map(({ entry }) => ({
			slug: entry.slug,
			id: entry.id,
			title: entry.title,
			heading: entry.heading,
			kind: entry.kind,
			snippet: snippet(entry.text, words)
		}))
	};
}
