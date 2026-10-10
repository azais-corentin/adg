import { stageItems } from '#lib/checklists/items.ts';
import type { StageId } from '#lib/stages.ts';
import { celestials } from '#lib/data/index.ts';
import { add, bigNum, formatBigNum, fromNumber, log10, parseBigNum, toNumber } from './bignum.ts';
import { detectStage } from './stage.ts';
import type { BigNum, Goal, NormalizedSave, PelleRiftId } from './types.ts';

/**
 * Next goals per stage: a few concrete goals of the moment first, then every item of the stage
 * checklist that a save can answer, with its live progress. Thresholds come from upstream source
 * at the pinned SHA or from the app where it differs; files named in comments are under `src/core/`.
 */

/** Thresholds are shown like the game shows costs (`format(x)`, 0 places); player values with 2. */
const fmtGoal = (value: BigNum) => formatBigNum(value, 0);
const fmt = (value: BigNum) => formatBigNum(value, 2);

/** `secret-formula/challenges/eternity-challenges.js` `[goal, goalIncrease]` IP exponents, EC1..EC12. */
const EC_GOAL_EXPONENT: readonly (readonly [number, number])[] = [
	[1800, 200],
	[975, 175],
	[600, 75],
	[2750, 550],
	[750, 400],
	[850, 250],
	[2000, 530],
	[1300, 900],
	[1750, 250],
	[3000, 300],
	[450, 200],
	[110000, 12000]
];

/**
 * `secret-formula/eternity/eternity-milestones.js` below 100, condensed, as Android 3.18.0 lists
 * them. The 100 and 1,000 milestones are checklist items.
 */
const ETERNITY_MILESTONES: readonly (readonly [number, string])[] = [
	[1, 'unlocks the Infinity Point multiplier autobuyer'],
	[2, 'Eternities start with all Normal Challenges, autobuyers and Infinity broken'],
	[3, 'unlocks the Replicanti Galaxy autobuyer'],
	[4, 'Eternities keep all Infinity Upgrades'],
	[5, 'unlocks more Big Crunch autobuyer modes'],
	[6, 'gain Eternity Points while offline'],
	[7, 'Infinity Challenges complete as soon as they unlock'],
	[8, 'Eternities keep all Break Infinity Upgrades'],
	[9, 'unlocks buy-max mode for the Antimatter Galaxy autobuyer'],
	[10, 'start with Replicanti unlocked'],
	[11, 'unlocks the 1st Infinity Dimension autobuyer'],
	[12, 'unlocks the 2nd Infinity Dimension autobuyer'],
	[13, 'unlocks the 3rd Infinity Dimension autobuyer'],
	[14, 'unlocks the 4th Infinity Dimension autobuyer'],
	[15, 'unlocks the 5th Infinity Dimension autobuyer'],
	[16, 'unlocks the 6th Infinity Dimension autobuyer'],
	[17, 'unlocks the 7th Infinity Dimension autobuyer'],
	[18, 'unlocks the 8th Infinity Dimension autobuyer'],
	[25, 'Infinity Dimensions unlock automatically'],
	[30, 'start with all Antimatter Dimensions available'],
	[40, 'Replicanti Galaxies no longer reset antimatter and Dimensions'],
	[50, 'unlocks the Replicanti Chance autobuyer'],
	[60, 'unlocks the Replicanti Interval autobuyer'],
	[80, 'unlocks the Max Replicanti Galaxy autobuyer']
];

function ecGoal(s: NormalizedSave, id: number): Goal {
	const completions = s.eternityChallenges[id - 1] ?? 0;
	const [goal, increase] = EC_GOAL_EXPONENT[id - 1] ?? [0, 0];
	return {
		id: `ec${id}`,
		text:
			completions >= 5
				? `Complete Eternity Challenge ${id} five times`
				: `Complete Eternity Challenge ${id} (${completions}/5; next goal ${fmtGoal(bigNum(1, goal + increase * completions))} IP)`,
		done: completions >= 5
	};
}

/** Joins `["ID1", "ID2", "ID3"]` as "ID1, ID2 and ID3". */
const list = (items: readonly string[]) =>
	items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;

/**
 * Infinity Dimensions the save's IP pays for and no autobuyer buys yet (the Eternity milestones
 * above: tier `t`'s autobuyer at `10 + t` Eternities). The Infinity subtab's Max all buys them,
 * and unlocks any tier whose antimatter threshold is reached.
 */
function idPurchaseGoals(s: NormalizedSave): Goal[] {
	const eternities = toNumber(s.eternities);
	const tiers = s.affordableInfinityDimensions.filter((tier) => eternities < 10 + tier);
	if (tiers.length === 0) return [];
	return [
		{
			id: 'buy-infinity-dimensions',
			text: `Buy Infinity Dimensions: you can afford ${list(tiers.map((t) => `ID${t}`))} (tap Max all on Dimensions → Infinity)`,
			done: false
		}
	];
}

/** Goals of the moment that the stage checklist has no item for; listed before it. */
const CURRENT: Partial<Record<StageId, (s: NormalizedSave) => Goal[]>> = {
	'break-infinity': idPurchaseGoals,
	replicanti: idPurchaseGoals,
	'early-eternity': (s) => {
		const eternities = toNumber(s.eternities);
		const milestone = ETERNITY_MILESTONES.find(([count]) => eternities < count);
		return [
			...idPurchaseGoals(s),
			...(milestone
				? [
						{
							id: `eternity-milestone-${milestone[0]}`,
							text: `Reach ${milestone[0]} Eternities: ${milestone[1]} (have ${eternities.toLocaleString('en-US')})`,
							done: false
						}
					]
				: [])
		];
	},
	// The next three Eternity Challenges below five completions, each with its next goal.
	'eternity-challenges': (s) =>
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
			.filter((id) => (s.eternityChallenges[id - 1] ?? 0) < 5)
			.slice(0, 3)
			.map((id) => ecGoal(s, id)),
	pelle: (s) => (s.pelleDoomed ? doomedGoals(s) : [])
};

/** secret-formula/celestials/strikes.js `requirementDescription`, with Strike 2 spelled out. */
const PELLE_STRIKES: readonly string[] = [
	'Reach Infinity',
	'Power-up Galaxies (buy the Break Infinity Upgrade that makes Galaxies stronger)',
	'Reach Eternity',
	'Reach 115 Time Theorems',
	'Dilate Time'
];

/** Rift fill as a fraction before spending (secret-formula/celestials/rifts.js `percentage`). */
const RIFT_PERCENTAGE: Record<PelleRiftId, (fill: BigNum) => number> = {
	vacuum: (fill) => Math.log10(log10(add(fill, fromNumber(1))) * 10 + 1) ** 2.5 / 100,
	decay: (fill) => log10(add(fill, fromNumber(1))) * 0.0005,
	chaos: (fill) => toNumber(fill) / 10,
	recursion: (fill) => log10(add(fill, fromNumber(1))) ** 0.4 / 4000 ** 0.4,
	paradox: (fill) => log10(add(fill, fromNumber(1))) / 100
};

/** The two milestone texts upstream builds from the cycling Rift name. */
const RIFT_MILESTONE_TEXT: Record<string, string> = {
	'vacuum-0.4': 'Vacuum also affects EP gain',
	'chaos-0.09': 'Decay effect is always maxed and milestones always active'
};

/**
 * The next Strike, the next milestone of each unlocked Rift, and the cheapest one-time Pelle Upgrade.
 * Strike 5 ("Dilate Time") needs Dilation unlocked in the Doomed Reality (achievement 187) first,
 * so until then it is one goal with the checklist's "Unlock Time Dilation while Doomed".
 */
function doomedGoals(s: NormalizedSave): Goal[] {
	const goals: Goal[] = [];
	const nextStrike = PELLE_STRIKES.findIndex((_, i) => !s.pelleStrikes.includes(i + 1));
	if (nextStrike === 4 && !s.achievements.includes(187)) {
		const gate = stageItems('pelle')
			.find((item) => item.id === 'pelle-dilation')
			?.progress?.(s);
		goals.push({
			id: 'pelle-dilation',
			text: `Unlock Time Dilation while Doomed (${gate}), then Dilate Time for Strike 5`,
			done: false
		});
	} else if (nextStrike >= 0) {
		goals.push({
			id: 'pelle-strike',
			text: `Strike ${nextStrike + 1}: ${PELLE_STRIKES[nextStrike]} inside the Doomed Reality`,
			done: false
		});
	}

	/** Like the Rift bar ("46.25%"), without trailing zeros ("9%"). */
	const percent = (fraction: number) => `${+(fraction * 100).toFixed(2)}%`;
	// pelle/rifts.js `percentage`: min(raw − spent, reducedTo = 1).
	const fill = (id: PelleRiftId) =>
		Math.min(RIFT_PERCENTAGE[id](s.pelleRifts[id].fill) - s.pelleRifts[id].spent, 1);
	for (const strike of celestials.pelle.strikes) {
		if (!s.pelleStrikes.includes(strike.id)) continue;
		const rift = celestials.pelle.rifts.find((r) => r.key === strike.rift);
		if (!rift) throw new Error(`No Rift ${strike.rift}`);
		const id = rift.key as PelleRiftId;
		// Chaos at 9% keeps every Decay milestone active whatever Decay's fill.
		if (id === 'decay' && fill('chaos') >= 0.09) continue;
		const now = fill(id);
		const next = rift.milestones.find((m) => now < m.requirement);
		if (!next) continue;
		const effect = next.description ?? RIFT_MILESTONE_TEXT[`${id}-${next.requirement}`];
		if (!effect) throw new Error(`No text for the ${id} milestone at ${next.requirement}`);
		goals.push({
			id: `rift-${id}`,
			text: `Fill ${rift.names[0]} to ${percent(next.requirement)} (${percent(now)} now): ${effect.replace(/\s+/g, ' ')}`,
			done: false
		});
	}

	// PelleUpgradePanel.vue lists the one-time upgrades cheapest first.
	const upgrade = celestials.pelle.upgrades
		.filter((u) => !u.rebuyable && !s.pelleUpgrades.includes(Number(u.id)))
		.sort((a, b) => Number(a.cost) - Number(b.cost))[0];
	const cost = upgrade && parseBigNum(upgrade.cost);
	if (upgrade && cost) {
		goals.push({
			id: 'pelle-upgrade',
			text: `Buy the Pelle Upgrade “${upgrade.description}” (${fmtGoal(cost)} Reality Shards; have ${fmt(s.pelleRealityShards)})`,
			done: false
		});
	}
	return goals;
}

/**
 * Ordered next goals for `stage` (defaults to the save's detected stage): the open ones first, the
 * goals of the moment before the stage checklist's items, then the done ones for context. A goal of
 * the moment stands in for the checklist item with the same id. Checklist items a save can't
 * answer (no `auto`) stay on the checklist only. `ticks` are the checklist's hand ticks: an item
 * the save doesn't show as done but the player ticked counts as done, like on the checklist.
 */
export function nextGoals(
	save: NormalizedSave,
	stage: StageId = detectStage(save).stage,
	ticks: Readonly<Record<string, boolean>> = {}
): Goal[] {
	const current = (CURRENT[stage]?.(save) ?? []).filter((goal) => !ticks[goal.id]);
	const checklist = stageItems(stage).flatMap(({ id, text, auto, progress }): Goal[] => {
		if (!auto || current.some((goal) => goal.id === id)) return [];
		if (auto(save)) return [{ id, text, done: true }];
		if (ticks[id]) return [{ id, text, done: true, byHand: true }];
		const live = progress?.(save);
		// "Unlock Effarig (pour 1e24 RM)" + "poured 1.06e14" → "Unlock Effarig (pour 1e24 RM; poured 1.06e14)".
		const shown = !live
			? text
			: text.endsWith(')')
				? `${text.slice(0, -1)}; ${live})`
				: `${text} (${live})`;
		return [{ id, text: shown, done: false }];
	});
	const goals = [...current, ...checklist];
	return [...goals.filter((goal) => !goal.done), ...goals.filter((goal) => goal.done)];
}
