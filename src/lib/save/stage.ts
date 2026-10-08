import type { StageId } from '#lib/stages.ts';
import { gt, log10, toNumber } from './bignum.ts';
import type { BigNum, NormalizedSave, StageDetection } from './types.ts';

/**
 * Stage detection, ported from upstream `src/core/secret-formula/progress-checker.js`
 * (`progressStages`): `hasReached` predicates are checked from the last stage backwards and the
 * first match wins; `subProgress` is upstream's `subProgressValue`, clamped to [0, 1].
 */

interface StageRule {
	id: StageId;
	hasReached(save: NormalizedSave): boolean;
	subProgress(save: NormalizedSave): number;
}

/** `log10(1 + value)` without overflowing `toNumber` for huge values. */
function log10OnePlus(value: BigNum): number {
	const log = log10(value);
	return log > 15 ? log : Math.log10(1 + toNumber(value));
}

/** In game order (upstream `PROGRESS_STAGE`; upstream `ENSLAVED` is `nameless`). */
const RULES: readonly StageRule[] = [
	{
		id: 'pre-infinity',
		hasReached: () => true,
		// Galaxies are worth 1/3 each, boosts break ties within galaxies, antimatter within boosts.
		subProgress: (s) => 0.33 * s.galaxies + 0.02 * s.dimensionBoosts + log10(s.antimatter) / 16000
	},
	{
		id: 'early-infinity',
		hasReached: (s) => gt(s.infinities, 0),
		subProgress: (s) =>
			Math.min(toNumber(s.infinities), 500) / 1000 +
			Math.log10(150000 / s.crunchAutobuyerInterval) / 6.35
	},
	{
		id: 'break-infinity',
		hasReached: (s) => s.crunchAutobuyerInterval <= 100,
		subProgress: (s) => Math.sqrt(log10(s.infinityPoints) / 145)
	},
	{
		id: 'replicanti',
		hasReached: (s) => s.replicanti.unlocked,
		subProgress: (s) => Math.sqrt((log10(s.infinityPoints) - 140) / 170)
	},
	{
		id: 'early-eternity',
		hasReached: (s) => gt(s.eternities, 0),
		subProgress: (s) => Math.min(toNumber(s.eternities), 1e5) / 1e5
	},
	{
		id: 'eternity-challenges',
		hasReached: (s) => (s.eternityChallenges[0] ?? 0) > 0,
		// Half from EC completions, half from EP (up to e1300).
		subProgress: (s) =>
			0.008 * s.eternityChallenges.reduce((sum, c) => sum + c, 0) + log10(s.eternityPoints) / 2500
	},
	{
		id: 'early-dilation',
		hasReached: (s) => gt(s.dilation.dilatedTime, 0),
		subProgress: (s) => log10(s.dilation.dilatedTime) / 15
	},
	{
		id: 'late-eternity',
		hasReached: (s) => gt(s.dilation.dilatedTime, 1e15),
		subProgress: (s) => Math.sqrt((log10(s.eternityPoints) - 1300) / 6700)
	},
	{
		id: 'early-reality',
		hasReached: (s) => s.realities > 0,
		subProgress: (s) => s.realities / 100
	},
	{
		id: 'teresa',
		hasReached: (s) => s.celestials.teresa.quoteBits > 0,
		subProgress: (s) => Math.log10(1 + s.teresaPouredAmount) / 21
	},
	{
		id: 'effarig',
		hasReached: (s) => s.celestials.effarig.quoteBits > 0,
		subProgress: (s) => log10OnePlus(s.effarigRelicShards) / 14
	},
	{
		id: 'nameless',
		hasReached: (s) => s.celestials.nameless.quoteBits > 0,
		subProgress: (s) => Math.sqrt((log10(s.realityMachines) - 30) / 30)
	},
	{
		id: 'v',
		hasReached: (s) => s.celestials.v.quoteBits > 0,
		subProgress: (s) => 0.0277 * s.vRunUnlocks.reduce((sum, n) => sum + n, 0)
	},
	{
		id: 'ra',
		hasReached: (s) => s.celestials.ra.quoteBits > 0,
		subProgress: (s) => s.raPetLevels / 100
	},
	{
		id: 'imaginary-machines',
		hasReached: (s) => s.imaginaryMachineCap > 0,
		subProgress: (s) => Math.log10(1 + s.imaginaryMachineCap) / 9
	},
	{
		id: 'laitela',
		hasReached: (s) => s.celestials.laitela.quoteBits > 0,
		subProgress: (s) => log10(s.laitelaDarkMatter) / 308.25
	},
	{
		id: 'pelle',
		hasReached: (s) => s.pelleDoomed,
		subProgress: (s) => Math.log10(1 + s.pelleRemnants) / 9
	}
];

export function detectStage(save: NormalizedSave): StageDetection {
	const rule = RULES.findLast((r) => r.hasReached(save)) ?? RULES[0];
	const raw = rule.subProgress(save);
	return { stage: rule.id, subProgress: Number.isNaN(raw) ? 0 : Math.min(1, Math.max(0, raw)) };
}
