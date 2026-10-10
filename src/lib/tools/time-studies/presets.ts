/**
 * adg's own suggested trees, one line of reasoning each. They are starting points written for
 * this guide, not the game's presets or anyone's optimal route.
 */
import type { StageId } from '#lib/stages.ts';
import { importStudyString } from './study-string.ts';
import { check, DEFAULT_CONTEXT, type Skipped, type Tree, type TreeContext } from './tree.ts';

export interface Preset {
	id: string;
	name: string;
	stage: StageId;
	/** In-game study string. */
	studies: string;
	rationale: string;
}

const ABOVE_SPLIT = '11,21,22,31,32,33,41,42,51,61';

export const PRESETS: readonly Preset[] = [
	{
		id: 'first-studies',
		name: 'Above the split',
		stage: 'early-eternity',
		studies: `${ABOVE_SPLIT}|0`,
		rationale:
			'Everything above the Dimension split for 29 TT: Replicanti, Infinity and EP boosts that every later tree keeps.'
	},
	{
		id: 'antimatter-passive',
		name: 'Antimatter path, passive',
		stage: 'early-eternity',
		studies: `${ABOVE_SPLIT},71,81,91,101,111,122,132,142,151,161,162,171|0`,
		rationale:
			'The Antimatter path boosts what you already push; the passive row needs no timing, so it suits leaving the game running.'
	},
	{
		id: 'time-idle',
		name: 'Time path, idle',
		stage: 'eternity-challenges',
		studies: `${ABOVE_SPLIT},62,73,83,93,103,111,123,133,143,151,161,162,171|0`,
		rationale:
			'103 grows with Replicanti Galaxies and the idle row with time spent, which fits the long Eternities of EC attempts.'
	},
	{
		id: 'ec10',
		name: 'EC10 unlock',
		stage: 'eternity-challenges',
		studies: `${ABOVE_SPLIT},62,73,83,93,103,111,123,133,143,151,161,162,171,181|10`,
		rationale: '181 opens after EC1–3 are each completed once; EC10’s study hangs right below it.'
	},
	{
		id: 'ec11',
		name: 'EC11 run',
		stage: 'eternity-challenges',
		studies: `${ABOVE_SPLIT},62,71,81,91,101,111,123,133,143,151,161,162,171,181,191,193,211,212,213,214,222,224,225,228,232|11`,
		rationale:
			'EC11 allows only the Antimatter path (no 72 or 73) and needs 231 or 232; one study per light/dark pair keeps it ST-free.'
	},
	{
		id: 'ec12',
		name: 'EC12 run',
		stage: 'eternity-challenges',
		studies: `${ABOVE_SPLIT},62,73,83,93,103,111,123,133,143,151,161,162,171,181,191,193,211,212,213,214,222,224,225,228,234|12`,
		rationale:
			'EC12 allows only the Time path (no 71 or 72) and needs 233 or 234, reached here through 228.'
	},
	{
		id: 'pre-dilation',
		name: 'Two paths, ready for Dilation',
		stage: 'early-dilation',
		studies: `${ABOVE_SPLIT},62,73,83,93,103,111,123,133,143,151,161,162,171,181,191,192,193,201,71,81,91,101,211,212,213,214,222,224,225,228,232|0`,
		rationale:
			'201 opens a second Dimension path (bought after it); any 23x study is what Time Dilation’s unlock looks for.'
	}
];

export interface PresetFit {
	/** The whole preset, bought with every EC gate open: what its card prices. */
	full: Tree;
	/** What the game state lets the game buy of it, in order. */
	fitted: Tree;
	skipped: Skipped[];
	/**
	 * Game-state requirements that cut it short, e.g. "Needs EC10 completed once." Studies that
	 * only fell out because a study they need did are not listed.
	 */
	blockers: string[];
}

function treeOf(preset: Preset, ctx: TreeContext) {
	const result = importStudyString(preset.studies, ctx);
	if (!result.ok) throw new Error(`Preset ${preset.id}: ${result.error}`);
	return result;
}

/** The preset in full and as far as `ctx` allows, with what blocks the rest. */
export function presetFit(preset: Preset, ctx: TreeContext): PresetFit {
	const full = treeOf(preset, DEFAULT_CONTEXT).tree;
	const { tree: fitted, skipped } = treeOf(preset, ctx);
	// A skipped study is blocked by the game state itself if it still fails with the rest of the
	// full tree bought; otherwise it only lacked a study that was skipped before it.
	const blockers = new Set<string>();
	for (const { ref } of skipped) {
		const rest =
			ref.kind === 'ec'
				? { ...full, ec: 0 }
				: { ...full, studies: full.studies.filter((id) => id !== ref.id) };
		const verdict = check(rest, ref, ctx);
		if (!verdict.ok) blockers.add(verdict.reason);
	}
	return { full, fitted, skipped, blockers: [...blockers] };
}
