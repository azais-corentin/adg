/**
 * What the planner says about each study: names, descriptions and requirements, from the
 * extracted data plus our wording where upstream builds the text from game state.
 */
import { challenges } from '#lib/data/index.ts';
import { formatAmount } from '#lib/save/bignum.ts';
import {
	DILATION_STUDIES,
	EC_STUDIES,
	joinIds,
	NORMAL_STUDIES,
	type TimeStudyRef
} from './tree.ts';

/**
 * Descriptions the extractor leaves to source because they read game state, worded as the
 * Android 3.18.0 tree shows them, before any perk, Achievement 103/138 or Celestial changes them.
 * 131 differs from upstream in substance: the app only disables automatic Replicanti Galaxies
 * offline (upstream: always, until Achievement 138).
 */
const DESCRIPTION_FALLBACKS: Record<number, string> = {
	111: 'Make the IP formula better 10^(x/308) ➜ 10^(x/285)',
	121: 'You gain more EP based on how fast your last 10 Eternities were',
	122: 'You gain ×35 more EP',
	131: 'Automatic Replicanti Galaxies are disabled while offline, but you can get 50% more of them',
	132: 'Replicanti Galaxies are 40% stronger and Replicanti are ×1.5 faster',
	133: 'Replicanti are ×10 slower until infinity, but their Galaxies are 50% stronger',
	141: 'Multiplier to IP, which decays over this Infinity',
	142: 'You gain ×1e25 more IP',
	192: 'Replicanti can go beyond 1.80e308, but growth slows down at higher amounts',
	224: 'Distant Galaxy cost scaling starts 1 Galaxy later per 2,000 Dimension Boosts',
	228: 'Dimensional Sacrifice formula scales better (its exponent gains another +0.2 factor)'
};

/** Requirements upstream writes as closures over game state, in our words. */
const EXTRA_REQUIREMENTS: Record<number, string> = {
	62: 'EC5 completed once, or its lock-bypass perk',
	71: 'EC12 not unlocked (a Reality perk lifts this)',
	72: 'Neither EC11 nor EC12 unlocked (a Reality perk lifts this)',
	73: 'EC11 not unlocked (a Reality perk lifts this)',
	181: 'EC1, EC2 and EC3 completed once, or their lock-bypass perks',
	191: 'EC10 completed once',
	192: "EC10 completed once; not inside The Nameless Ones' Reality",
	193: 'EC10 completed once'
};

/** Dilation study requirements (upstream `dilation-time-studies.js`), in our words. */
const DILATION_REQUIREMENTS: Record<number, string[]> = {
	1: [
		'One of studies 231, 232, 233 or 234',
		'EC11 and EC12 completed 5 times',
		'12,900 Time Theorems in total (bought plus spent)'
	],
	2: ['Time Dilation unlocked'],
	3: ['The 5th Time Dimension study'],
	4: ['The 6th Time Dimension study'],
	5: ['The 7th Time Dimension study'],
	6: [
		'The 8th Time Dimension study',
		'1e4000 Eternity Points this Reality',
		'All pre-Reality achievements, or the first Perk'
	]
};

const PACE_NOTE =
	'Without Space Theorems you can only have one of the Active, Passive and Idle paths.';
const LIGHT_DARK_NOTE =
	'Without Space Theorems you can only have one study of each light/dark pair.';

/** Short label drawn on the node. */
export function nodeLabel(ref: TimeStudyRef): string {
	switch (ref.kind) {
		case 'normal':
			return String(ref.id);
		case 'ec':
			return `EC${ref.id}`;
		case 'dilation':
			return ['', 'Dilation', 'TD5', 'TD6', 'TD7', 'TD8', 'Reality'][ref.id] ?? `D${ref.id}`;
	}
}

/** Heading for the details panel. */
export function studyTitle(ref: TimeStudyRef): string {
	switch (ref.kind) {
		case 'normal':
			return ref.id > 300 ? `Triad Study ${ref.id - 300} (${ref.id})` : `Time Study ${ref.id}`;
		case 'ec':
			return `Eternity Challenge ${ref.id}`;
		case 'dilation':
			return DILATION_STUDIES.get(ref.id)?.description ?? `Dilation study ${ref.id}`;
	}
}

export function studyDescription(ref: TimeStudyRef): string {
	let text: string | null | undefined;
	switch (ref.kind) {
		case 'normal':
			text = NORMAL_STUDIES.get(ref.id)?.description ?? DESCRIPTION_FALLBACKS[ref.id];
			break;
		case 'ec': {
			const ec = challenges.eternity.find((c) => c.id === ref.id);
			text = ec?.description
				? `Unlocks the challenge: ${ec.description}`
				: 'Unlocks the challenge.';
			break;
		}
		case 'dilation':
			text = DILATION_STUDIES.get(ref.id)?.description;
			break;
	}
	return (text ?? '').replace(/\s+/g, ' ').trim();
}

/** Requirement lines for the details panel, in game terms. */
export function requirementLines(ref: TimeStudyRef): string[] {
	if (ref.kind === 'normal') {
		const study = NORMAL_STUDIES.get(ref.id);
		if (!study) return [];
		const lines: string[] = [];
		if (study.requires.length > 0) {
			const all = study.requirementType !== 'at-least-one';
			lines.push(`Study ${joinIds(study.requires, all ? 'and' : 'or')}`);
		}
		if (study.requirementType === 'dimension-path') {
			lines.push('One Dimension path; 201 allows a second, a Dilation upgrade the third');
		}
		const extra = EXTRA_REQUIREMENTS[study.id];
		if (extra) lines.push(extra);
		if (study.isTriad) lines.push(`Ra's V at level ${(study.id - 300) * 6}`);
		if (study.path === 'active' || study.path === 'passive' || study.path === 'idle') {
			lines.push(PACE_NOTE);
		} else if (study.path === 'light' || study.path === 'dark') {
			lines.push(LIGHT_DARK_NOTE);
		}
		return lines;
	}
	if (ref.kind === 'ec') {
		const study = EC_STUDIES.get(ref.id);
		if (!study) return [];
		const lines = [
			`Study ${joinIds(study.requires, 'or')}`,
			'No other Eternity Challenge unlocked'
		];
		const secondary = study.secondary;
		if (secondary.kind === 'path') {
			const forbidden = joinIds(secondary.forbiddenStudies, 'or');
			lines.push(
				`Only the ${secondary.path} path: none of ${forbidden} (a Reality perk lifts this)`
			);
		} else {
			const amounts = secondary.amounts.map((a) => formatAmount(a)).join(' / ');
			lines.push(`${secondary.resource}: ${amounts} for completions 1–5 (checked in the game)`);
		}
		return lines;
	}
	return DILATION_REQUIREMENTS[ref.id] ?? [];
}

/** Space Theorem note for the details panel, or null when the study never costs any. */
export function stCostNote(ref: TimeStudyRef): string | null {
	if (ref.kind !== 'normal') return null;
	const study = NORMAL_STUDIES.get(ref.id);
	if (!study || study.stCost === null) return null;
	const when = study.isTriad ? '' : ` if ${joinIds(study.requiresST, 'or')} is in the build`;
	return `${study.stCost} Space Theorems${when} (2 less after 36 V-Achievements)`;
}
