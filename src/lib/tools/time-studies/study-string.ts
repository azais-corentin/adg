/**
 * Study strings exactly as the game reads and writes them: a port of upstream
 * `TimeStudyTree.isValidImportString`, `truncateInput`, `parseStudyImport`, `studyRangeToArray`
 * and `exportString` (`src/core/time-studies/time-study-tree.js`), with the import flow of
 * `components/modals/StudyStringModal.vue` (truncate, validate, then parse).
 */
import {
	buyAll,
	EC_STUDIES,
	EMPTY_TREE,
	NORMAL_STUDIES,
	type Build,
	type Skipped,
	type TimeStudyRef,
	type Tree,
	type TreeContext
} from './tree.ts';

/**
 * Upstream `TimeStudyTree.sets`: names that stand for groups of studies. The triad set only
 * exists once Triad Studies are unlocked, and holds as many as are.
 */
export function studySets(ctx: Pick<TreeContext, 'triads'>): [name: string, ids: number[]][] {
	const sets: [string, number[]][] = [
		['antimatter', [71, 81, 91, 101]],
		['infinity', [72, 82, 92, 102]],
		['time', [73, 83, 93, 103]],
		['active', [121, 131, 141]],
		['passive', [122, 132, 142]],
		['idle', [123, 133, 143]],
		['light', [221, 223, 225, 227, 231, 233]],
		['dark', [222, 224, 226, 228, 232, 234]]
	];
	if (ctx.triads > 0) sets.push(['triad', [301, 302, 303, 304].slice(0, ctx.triads)]);
	return sets;
}

/**
 * Upstream `truncateInput`: lowercases, swaps each set name's first occurrence for its ids,
 * drops one trailing `|` or `,`, removes spaces, and collapses `,,` and `,|`.
 */
export function truncateInput(input: string, ctx: Pick<TreeContext, 'triads'>): string {
	let internal = input.toLowerCase();
	for (const [name, ids] of studySets(ctx)) internal = internal.replace(name, ids.join());
	return internal
		.replace(/[|,]$/u, '')
		.replaceAll(' ', '')
		.replace(/,{2,}/gu, ',')
		.replace(/,\|/gu, '|');
}

/** Upstream `isValidImportString`: formatting only, not whether the ids exist. */
export function isValidImportString(input: string, ctx: Pick<TreeContext, 'triads'>): boolean {
	if (input.trim() === '') return false;
	let test = input.replaceAll(/ +/gu, '');
	for (const [name] of studySets(ctx)) test = test.replaceAll(new RegExp(`${name},?`, 'gu'), '');
	return /^,?((\d{2,3}(-\d{2,3})?)\b,?)*(\|\d{1,2}!?)?$/iu.test(test);
}

/** Upstream `checkTimeStudyNumber`: a range end must be a study (a triad only once unlocked). */
function rangeEnd(token: string, ctx: Pick<TreeContext, 'triads'>): number {
	const id = parseFloat(token);
	const study = NORMAL_STUDIES.get(id);
	if (!study || (study.isTriad && ctx.triads === 0)) return 0;
	return id;
}

/** Upstream `studyRangeToArray`: every study id from `first` to `last`, or none if an end isn't one. */
function studyRange(first: string, last: string, ctx: Pick<TreeContext, 'triads'>): string[] {
	const from = rangeEnd(first, ctx);
	const to = rangeEnd(last, ctx);
	if (from === 0 || to === 0) return [];
	const ids: string[] = [];
	for (let id = from; id <= to; id++) if (NORMAL_STUDIES.has(id)) ids.push(String(id));
	return ids;
}

export interface ParsedStudyString {
	/** Studies in string order, the EC last. Not yet checked against the tree rules. */
	refs: TimeStudyRef[];
	/** Well-formed entries that aren't studies (`"12"`, `"EC13"`), as upstream reports them. */
	invalid: string[];
	/** The string ends with `!`: the game also starts the EC after importing. */
	startEC: boolean;
}

/**
 * Upstream `parseStudyImport`, for an input that already went through `truncateInput`.
 * Range ends that aren't studies make the whole range vanish without a report, as upstream.
 */
function parseTruncated(input: string, ctx: Pick<TreeContext, 'triads'>): ParsedStudyString {
	const refs: TimeStudyRef[] = [];
	const invalid: string[] = [];
	const studiesString = truncateInput(input, ctx).split('|')[0] ?? '';
	if (studiesString.length > 0) {
		for (const cluster of studiesString.split(',')) {
			const [first = '', last] = cluster.split('-');
			const ids = last ? studyRange(first, last, ctx) : cluster.split('-');
			for (const token of ids) {
				const id = parseInt(token, 10);
				if (NORMAL_STUDIES.has(id)) refs.push({ kind: 'normal', id });
				else invalid.push(token);
			}
		}
	}

	const startEC = input.endsWith('!');
	const ecString = input.split('|')[1];
	if (ecString) {
		// parseInt ignores the trailing "!"; 0 is what presets store for "no EC".
		const ec = parseInt(ecString, 10);
		if (EC_STUDIES.has(ec)) refs.push({ kind: 'ec', id: ec });
		else if (ec !== 0) invalid.push(`EC${ec}`);
	}
	return { refs, invalid, startEC };
}

export type StudyStringResult =
	({ ok: true; tree: Tree; skipped: Skipped[] } & ParsedStudyString) | { ok: false; error: string };

/**
 * Imports a study string into an empty tree, the way the game's import modal previews it:
 * truncate, validate the format, parse, then buy in order and skip what the rules forbid.
 */
export function importStudyString(input: string, ctx: TreeContext): StudyStringResult {
	const truncated = truncateInput(input, ctx);
	if (!isValidImportString(truncated, ctx)) {
		return { ok: false, error: formatError(truncated, ctx) };
	}
	const parsed = parseTruncated(truncated, ctx);
	return { ok: true, ...parsed, ...buyAll(EMPTY_TREE, parsed.refs, ctx) };
}

/** Upstream `exportString`: normal studies in purchase order, then `|<EC or 0>`, then `!`. */
export function exportStudyString(build: Build, startEC = false): string {
	return `${build.studies.join(',')}|${build.ec}${startEC ? '!' : ''}`;
}

/**
 * Explains why a truncated string fails `isValidImportString`. The game itself only says
 * "Not a valid tree", so this looks for the first thing it would trip on.
 */
function formatError(truncated: string, ctx: Pick<TreeContext, 'triads'>): string {
	if (truncated.trim() === '') return 'Paste a study string first.';
	const names = studySets(ctx).map(([name]) => name);
	const word = truncated.match(/[a-z]+/gu)?.find((w) => !names.includes(w));
	if (word === 'triad') {
		return '"triad" only works once Triad Studies are unlocked (see Game state).';
	}
	if (word !== undefined) {
		return `"${word}" isn't a study or a group name. Names the game knows: ${names.join(', ')}.`;
	}
	const rest = names.reduce((s, name) => s.replaceAll(name, ''), truncated);
	const odd = /[^\d,|!-]/u.exec(rest)?.[0];
	if (odd !== undefined) return `Unexpected character "${odd}". Separate studies with commas.`;
	const [studies = '', ec, ...more] = rest.split('|');
	if (more.length > 0) return 'Only one "|" is allowed, before the EC number at the end.';
	if (ec !== undefined && !/^\d{1,2}!?$/u.test(ec)) {
		return 'After "|" put the EC number (1–12), optionally followed by "!".';
	}
	if (studies.includes('!')) return '"!" can only come last, right after the EC number.';
	for (const token of studies.split(',')) {
		if (token === '') continue;
		if (!/^\d+(-\d+)?$/u.test(token)) return `"${token}" isn't a study or a range like 11-62.`;
		const bad = token.split('-').find((n) => n.length < 2 || n.length > 3);
		if (bad !== undefined) return `"${bad}" isn't a study number; they have 2 or 3 digits.`;
	}
	return 'Not a valid study string.';
}
