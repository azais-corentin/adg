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
	/** The article title, normalized and padded like `head`. */
	titleText: string;
	/** `body` as a word list, for how close together the query words sit. */
	bodyWords: readonly string[];
}

export type PreparedIndex = readonly Entry[];

/** Normalizes the index once, after it loads. Terms come first: they win ties. */
export function prepareIndex(index: SearchIndex): PreparedIndex {
	const pad = (text: string) => ` ${normalize(text)} `;
	const words = (text: string) => normalize(text).split(' ').filter(Boolean);
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
			body: pad(t.text),
			titleText: pad(article(t.a).title),
			bodyWords: words(t.text)
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
				body: pad(s.text),
				titleText: pad(title),
				bodyWords: words(s.text)
			};
		})
	];
}

const SNIPPET_LENGTH = 180;
/** Text kept before the first match the snippet shows. */
const SNIPPET_LEAD = 60;

function wordPattern(words: readonly string[]): RegExp {
	const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
	return new RegExp(`(?<![\\p{L}\\p{N}])(?:${escaped.join('|')})`, 'giu');
}

/**
 * Where the snippet's first match sits: the match that starts the window holding the most
 * different query words, preferring the query's words next to each other in its order (the
 * table row "Tickspeed autobuyer upgrades" over "Tickspeed" alone further up); earliest on ties.
 */
function anchor(text: string, words: readonly string[], pattern: RegExp): number {
	const matches = [...text.matchAll(pattern)].map((m) => ({
		at: m.index,
		end: m.index + m[0].length,
		word: words.indexOf(m[0].toLowerCase())
	}));
	let best = { at: 0, score: -1 };
	for (const [i, first] of matches.entries()) {
		const seen = new Set<number>();
		let score = 0;
		for (let j = i; j < matches.length; j++) {
			const match = matches[j];
			if (match === undefined || match.at >= first.at + SNIPPET_LENGTH - SNIPPET_LEAD) break;
			seen.add(match.word);
			const next = matches[j + 1];
			const adjacent =
				next !== undefined &&
				next.word === match.word + 1 &&
				/^[^\p{L}\p{N}]{1,3}$/u.test(text.slice(match.end, next.at));
			if (adjacent) score += 1;
		}
		score += seen.size * 2;
		if (score > best.score) best = { at: first.at, score };
	}
	return best.at;
}

/** About `SNIPPET_LENGTH` characters of `text` around where the query words meet, matches marked. */
function snippet(text: string, words: readonly string[]): Piece[] {
	const pattern = wordPattern(words);
	const first = anchor(text, words, pattern);
	let start = Math.max(0, first - SNIPPET_LEAD);
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

/**
 * The fewest consecutive body words that hold every query word (as a word start), or Infinity.
 * "Reality Machines have a cap" holds "reality machines cap" in 5.
 */
function closestSpan(bodyWords: readonly string[], words: readonly string[]): number {
	const hits: { at: number; word: number }[] = [];
	for (const [at, bodyWord] of bodyWords.entries()) {
		for (const [word, query] of words.entries()) {
			if (bodyWord.startsWith(query)) hits.push({ at, word });
		}
	}
	const inWindow = new Map<number, number>();
	let best = Infinity;
	let first = 0;
	for (const hit of hits) {
		inWindow.set(hit.word, (inWindow.get(hit.word) ?? 0) + 1);
		while (inWindow.size === words.length) {
			const start = hits[first];
			if (start === undefined) break;
			best = Math.min(best, hit.at - start.at + 1);
			const left = (inWindow.get(start.word) ?? 1) - 1;
			if (left === 0) inWindow.delete(start.word);
			else inWindow.set(start.word, left);
			first++;
		}
	}
	return best;
}

/** Query words this close together in a body count as one statement about them. */
const NEAR_WORDS = 6;
const CLOSE_WORDS = 12;

/**
 * Ranked results for `query`, best first. Per query word: in a term's name 12, in a heading 8,
 * in the body 1 plus 0.5 per occurrence (up to 5), in the article title 2. For several words:
 * the whole query in the heading 15 or in the body 4, and all of them within 6 body words 10
 * (within 12, 5). Ties keep guide order.
 */
export function search(
	index: PreparedIndex,
	query: string,
	limit = 30
): { total: number; results: SearchResult[] } {
	const words = [
		...new Set(
			normalize(query)
				.split(' ')
				.map((w) => w.replace(/^\.+|\.+$/g, ''))
				.filter(Boolean)
		)
	];
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
			if (entry.titleText.includes(needle)) score += 2;
		}
		if (!all) continue;
		if (words.length > 1) {
			if (entry.head.includes(phrase)) score += 15;
			else if (entry.body.includes(phrase)) score += 4;
			const span = closestSpan(entry.bodyWords, words);
			if (span <= NEAR_WORDS) score += 10;
			else if (span <= CLOSE_WORDS) score += 5;
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
