/**
 * The 12 Eternity Challenges, built from the extracted game data (`#lib/data`). Goal and
 * unlock-requirement scaling follow upstream `src/core/eternity-challenge.js` and
 * `secret-formula/eternity/time-studies/ec-time-studies.js` at the pinned SHA.
 */
import { challenges, timeStudies } from '#lib/data/index.ts';
import type {
	DecimalString,
	EternityChallenge,
	TimeStudyRequirementType
} from '#lib/data/index.ts';
import { formatGameNumber } from '#lib/components/num.ts';

export const MAX_COMPLETIONS = 5;
export const EC_COUNT = 12;

export const ETERNITY_CHALLENGES: readonly EternityChallenge[] = challenges.eternity
	.slice()
	.sort((a, b) => a.id - b.id);

export function eternityChallenge(id: number): EternityChallenge {
	const ec = ETERNITY_CHALLENGES[id - 1];
	if (ec?.id !== id) throw new RangeError(`No Eternity Challenge ${id}`);
	return ec;
}

/**
 * In-game text for the descriptions the extractor leaves to source because they change after
 * Reality or in Doomed Reality. These are the pre-Reality wordings, which is when players run
 * this order.
 */
const PRE_REALITY_DESCRIPTIONS: Record<number, string> = {
	9: 'You cannot buy Tickspeed upgrades. Infinity Power instead multiplies Time Dimensions with greatly reduced effect.',
	10: 'Time Dimensions and Infinity Dimensions are disabled. You gain an immense boost from Infinities to Antimatter Dimensions (Infinities^950).',
	11: 'All Dimension multipliers and powers are disabled except for the multipliers from Infinity Power and Dimension Boosts (to Antimatter Dimensions).',
	12: 'The game runs ×1000 slower. The goal must be reached within a certain amount of time or you will fail the Challenge.'
};

/** What the challenge does while you are in it, as one sentence-cased paragraph. */
export function ecDescription(ec: EternityChallenge): string {
	const text = ec.description ?? PRE_REALITY_DESCRIPTIONS[ec.id];
	if (text === undefined) throw new Error(`No description for EC${ec.id}`);
	const flat = text.replace(/\s+/g, ' ').trim();
	return flat.charAt(0).toUpperCase() + flat.slice(1);
}

/**
 * Reward formulas, `c` = completions, written from the upstream `reward.effect` closures in
 * `secret-formula/challenges/eternity-challenges.js`.
 */
export const REWARD_FORMULAS: Record<number, string> = {
	1: 'Time Dimensions ×(time this Eternity in ms ÷ 10, at least 0.9)^(0.3 + 0.05c)',
	2: '1st Infinity Dimension ×(Infinity Power)^(1.5 ÷ (700 − 100c)), capped at ×1e100',
	3: '+0.72 per completion to the multiplier for buying 10 Antimatter Dimensions',
	4: 'Infinity Dimensions ×(unspent IP)^(0.003 + 0.002c), capped at ×1e200',
	5: 'Distant Galaxy cost scaling starts 5 Antimatter Galaxies later per completion',
	6: 'Antimatter Dimension cost multiplier growth −0.2 per completion',
	7: '1st Time Dimension makes (its production)^(0.2c) − 1 8th Infinity Dimensions per second',
	8: 'Replicanti Galaxies +((log10(log10(Infinity Power) + 1))^(0.03c) − 1) stronger',
	9: 'Infinity Dimensions ×(Time Shards)^(0.1c), capped at ×1e400',
	10: 'Time Dimensions ×(Infinities × 2.783e-6)^(0.4 + 0.1c), at least ×1 (Time Study 31 raises it further)',
	11: 'Tickspeed cost multiplier growth −0.07 per completion',
	12: 'Infinity Dimension cost multipliers ^(1 − 0.008c)'
};

/** Exponent of a goal stored as an exact power of ten (`"1e1800"`). */
function pow10Exponent(value: DecimalString): number {
	const match = /^1e(\d+)$/.exec(value);
	if (!match) throw new Error(`Expected a power of ten, got ${value}`);
	return Number(match[1]);
}

/**
 * Infinity Points needed for the next completion when `completions` are done
 * (upstream `goalAtCompletions`): `goal × goalIncrease^min(completions, 4)`. In Doomed Reality
 * the Pelle goal and increase apply where upstream defines them.
 */
export function goalAt(ec: EternityChallenge, completions: number, doomed = false): DecimalString {
	const base = pow10Exponent((doomed ? ec.pelleGoal : null) ?? ec.goal);
	const step = pow10Exponent((doomed ? ec.pelleGoalIncrease : null) ?? ec.goalIncrease);
	return `1e${base + step * Math.min(completions, MAX_COMPLETIONS - 1)}`;
}

/** Restriction on top of the goal for the next completion (EC4, EC12), else `null`. */
export function restrictionAt(ec: EternityChallenge, completions: number): string | null {
	return ec.restrictions?.[Math.min(completions, MAX_COMPLETIONS - 1)] ?? null;
}

/** A requirement amount the way the game shows it: grouped digits for counts, else scientific. */
function formatAmount(value: DecimalString): string {
	const n = Number(value);
	return Number.isInteger(n) && n < 1e9 ? n.toLocaleString('en-US') : formatGameNumber(value);
}

/**
 * The unlock study's second requirement for the next completion: a resource amount that
 * grows with completions, or a dimension path restriction (EC11, EC12).
 */
export function unlockRequirementAt(ec: EternityChallenge, completions: number): string {
	const secondary = ec.unlock.secondary;
	if (secondary.kind === 'path') {
		const forbidden = secondary.forbiddenStudies.map((id) => `TS${id}`).join(' or ');
		return `${secondary.path} path only (no ${forbidden})`;
	}
	const amount = secondary.amounts[Math.min(completions, MAX_COMPLETIONS - 1)];
	if (amount === undefined) throw new Error(`EC${ec.id} has no requirement amounts`);
	return `${formatAmount(amount)} ${secondary.resource}`;
}

const EC_COMPLETION_REQUIREMENT = /EternityChallenge\((\d+)\)\.completions > 0/g;
const normalStudies = new Map(timeStudies.normal.map((study) => [study.id, study]));

function combine(sets: ReadonlySet<number>[], type: TimeStudyRequirementType): Set<number> {
	if (sets.length === 0) return new Set();
	// `all`: every prerequisite is needed. Otherwise one suffices, so only the gates every
	// alternative shares are certain.
	if (type === 'all') return new Set(sets.flatMap((set) => [...set]));
	return new Set([...sets[0]!].filter((id) => sets.every((set) => set.has(id))));
}

const gateCache = new Map<number, ReadonlySet<number>>();

/** Eternity Challenges that must have one completion before the study can be bought. */
function studyGates(id: number): ReadonlySet<number> {
	const cached = gateCache.get(id);
	if (cached) return cached;
	const study = normalStudies.get(id);
	if (!study) throw new Error(`No time study ${id}`);
	const own = study.extraRequirementSources.flatMap((source) =>
		[...source.matchAll(EC_COMPLETION_REQUIREMENT)].map((match) => Number(match[1]))
	);
	const gates = combine(study.requires.map(studyGates), study.requirementType);
	for (const ec of own) gates.add(ec);
	gateCache.set(id, gates);
	return gates;
}

/**
 * Eternity Challenges that need at least one completion before this challenge's unlock study
 * can be reached, derived from the study tree's prerequisites (perk bypasses ignored: they
 * come after Reality). E.g. EC10 sits under TS181, which needs EC1–3 once.
 */
export function unlockGates(ec: EternityChallenge): number[] {
	const sets = ec.unlock.requires.map(studyGates);
	return [...combine(sets, ec.unlock.requirementType)].sort((a, b) => a - b);
}

/** Total Time Theorems needed to buy the Time Dilation study (upstream `DilationTimeStudyState.totalTimeTheoremRequirement`). */
export const DILATION_TOTAL_TT = 12900;

/** TT cost of the Time Dilation study. */
export const DILATION_COST = timeStudies.dilation.find((study) => study.id === 1)?.cost ?? 5000;
