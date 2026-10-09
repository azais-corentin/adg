/**
 * The recommended Eternity Challenge completion order, first EC1 to EC12 ×5, then Time
 * Dilation.
 *
 * Sources (sequence and Time Theorem amounts taken as facts; notes are our own words):
 * - Ninjatsu's "Eternity Challenges" order chart, the one the community wiki guide links:
 *   https://docs.google.com/spreadsheets/d/1NrYADsW4s7wRYTE91Z0EFHbXcHaswuuMzG9a2WyGG0A/edit#gid=1619783715
 * - Antimatter Dimensions Wiki, "Guide" (1e17–1e50 EP and EC10–EC12 sections), which follows
 *   the same order: https://antimatter-dimensions.fandom.com/wiki/Guide
 * Goals and unlock requirements come from the game data instead (see `challenges.ts`);
 * `order.test.ts` checks every step is reachable with the completions before it.
 */

export type PathTip = 'AD' | 'ID' | 'TD';
export type PaceTip = 'Active' | 'Passive' | 'Idle';

export interface OrderStep {
	/** Eternity Challenge number (1–12). */
	ec: number;
	/** Which completion this step earns (1–5). */
	completion: number;
	/** Total Time Theorems the chart suggests having before trying the step. */
	tt: number;
	/** Suggested dimension path and pace split for the run itself. */
	path: PathTip;
	pace: PaceTip;
	/** What to aim for, in a sentence or two. */
	note: string;
}

export interface OrderPhase {
	id: string;
	title: string;
	summary: string;
	steps: readonly OrderStep[];
}

const step = (
	ec: number,
	completion: number,
	tt: number,
	path: PathTip,
	pace: PaceTip,
	note: string
): OrderStep => ({ ec, completion, tt, path, pace, note });

const UNLOCK_ON_TD =
	'Buy the study on the Time Dimension path first: the game remembers you met its requirement. Then respec, Eternity and import the tree for the run; it buys the study again for its TT alone.';

export const ORDER_PHASES: readonly OrderPhase[] = [
	{
		id: 'early',
		title: 'First challenges',
		summary: 'ECs 1–5 open up between about 130 and 150 TT. Their rewards are small at first.',
		steps: [
			step(
				1,
				1,
				130,
				'ID',
				'Active',
				'Time Dimensions do nothing here, so take Infinity Dimensions. Farm the 20,000 Eternities for the study first.'
			),
			step(
				2,
				1,
				135,
				'TD',
				'Active',
				'Infinity Dimensions are off: Time Dimensions carry the run. TS33 helps.'
			),
			step(1, 2, 140, 'ID', 'Active', 'Same tree as before, with 40,000 Eternities to unlock.'),
			step(
				3,
				1,
				140,
				'AD',
				'Passive',
				`${UNLOCK_ON_TD} Passive is the better pace for this first one.`
			),
			step(
				4,
				1,
				142,
				'TD',
				'Idle',
				'Grind 100 million Infinities for the study with a short crunch interval. Inside, stay within 16 Infinities. Failing once on purpose earns the "You\'re a mistake" achievement.'
			),
			step(
				5,
				1,
				147,
				'ID',
				'Active',
				'The study sits under TS42 and needs 160 Antimatter Galaxies. Completing it opens TS62 for faster Replicanti.'
			),
			step(1, 3, 147, 'ID', 'Active', 'Keep the Active split: Idle is too slow for EC1.')
		]
	},
	{
		id: 'middle',
		title: 'Rounding out ECs 1–7',
		summary: 'Short runs that each add a few TT. Most of ECs 1–3 and 5 finish here.',
		steps: [
			step(3, 2, 155, 'AD', 'Active', UNLOCK_ON_TD),
			step(2, 2, 157, 'TD', 'Active', 'Let Time Shards build up for free Tickspeed upgrades.'),
			step(
				6,
				1,
				160,
				'ID',
				'Active',
				'The study is under TS121, so Active is forced. Crunch rarely and let the cheap Replicanti Galaxies pile up.'
			),
			step(1, 4, 163, 'ID', 'Active', 'Same ID + Active tree as the earlier EC1 runs.'),
			step(
				3,
				3,
				163,
				'ID',
				'Active',
				`${UNLOCK_ON_TD} From here EC3 runs best on Infinity Dimensions.`
			),
			step(
				7,
				1,
				166,
				'AD',
				'Active',
				'Needs 1e500,000 antimatter to unlock; the TD path gets there more easily, then switch back to AD.'
			),
			step(
				4,
				2,
				170,
				'TD',
				'Idle',
				'At most 12 Infinities now. Add TS33 or TS62 if you can spare the TT.'
			),
			step(
				4,
				3,
				175,
				'TD',
				'Idle',
				'At most 8 Infinities. Grind more Infinities for the study first.'
			),
			step(6, 2, 175, 'ID', 'Active', 'Same approach as the first run.'),
			step(1, 5, 175, 'ID', 'Active', 'Last EC1 completion.'),
			step(5, 2, 182, 'ID', 'Active', 'Needs 174 Antimatter Galaxies for the study.'),
			step(2, 3, 182, 'TD', 'Active', 'Same TD + Active tree.'),
			step(3, 4, 182, 'ID', 'Active', UNLOCK_ON_TD),
			step(
				7,
				2,
				193,
				'AD',
				'Active',
				'Unlock on the TD path, run on AD. Expect a range of about 190 to 215 TT.'
			)
		]
	},
	{
		id: 'ec8',
		title: 'EC8 and finishing ECs 2, 3, 5',
		summary: 'Around 200–320 TT. EC8 is slow: plan its Replicanti upgrades before you start.',
		steps: [
			step(5, 3, 200, 'ID', 'Active', 'Same tree as the earlier EC5 runs.'),
			step(
				8,
				1,
				200,
				'TD',
				'Idle',
				'Upgrades are limited: buy no Replicanti Galaxies, take Replicanti chance to 9% and the rest in interval, and spend every Infinity Dimension purchase on the 1st.'
			),
			step(3, 5, 200, 'ID', 'Active', `Last EC3 completion. ${UNLOCK_ON_TD}`),
			step(6, 3, 200, 'ID', 'Active', 'Same approach as before.'),
			step(2, 4, 200, 'TD', 'Active', 'Same TD + Active tree.'),
			step(5, 4, 215, 'ID', 'Active', 'Add TS33 if you farm up to about 218 TT.'),
			step(
				7,
				3,
				215,
				'AD',
				'Active',
				'Unlock on the TD path, run on AD. Earlier attempts stall around 1e3,000 IP.'
			),
			step(2, 5, 240, 'TD', 'Active', 'Last EC2 completion.'),
			step(5, 5, 245, 'ID', 'Active', 'Last EC5 completion. TS31 and TS41 help at about 252 TT.'),
			step(4, 4, 245, 'TD', 'Idle', 'At most 4 Infinities.'),
			step(6, 4, 264, 'ID', 'Active', 'Same approach as before.'),
			step(7, 4, 264, 'AD', 'Active', 'Unlock on the TD path, run on AD.'),
			step(
				8,
				2,
				310,
				'TD',
				'Idle',
				'Same upgrade plan as EC8 ×1: no Replicanti Galaxies, all on ID1.'
			),
			step(
				6,
				5,
				320,
				'ID',
				'Active',
				'Buy the 1e40 EP Eternity Upgrade (Time Dimensions × unspent TT) first. Last EC6 completion.'
			)
		]
	},
	{
		id: 'ts181',
		title: 'TS181, EC8 and EC9',
		summary: 'TS181 (200 TT) makes IP without crunching and drives everything up to EC10.',
		steps: [
			step(
				4,
				5,
				370,
				'TD',
				'Idle',
				'No Infinities allowed at all, so IP must come from TS181. Last EC4 completion.'
			),
			step(8, 3, 450, 'TD', 'Idle', 'Buy about 4 Replicanti Galaxies this time; rest as before.'),
			step(9, 1, 522, 'TD', 'Active', 'The study needs TS151 and 1e17,500 Infinity Power.'),
			step(9, 2, 575, 'TD', 'Active', 'Time Shards drive this run.'),
			step(8, 4, 600, 'TD', 'Idle', 'About 4 Replicanti Galaxies again.'),
			step(9, 3, 660, 'TD', 'Active', 'Expect a long wait for Time Shards.'),
			step(9, 4, 760, 'TD', 'Active', 'You can now afford TS181 alongside the challenge.'),
			step(
				8,
				5,
				825,
				'TD',
				'Idle',
				'Back to no Replicanti Galaxies; it takes a while. Last EC8 completion.'
			),
			step(9, 5, 830, 'TD', 'Active', 'Last EC9 completion.')
		]
	},
	{
		id: 'ec10',
		title: 'EC10 and the lower tree',
		summary: 'EC10 needs 1e100 EP and opens studies 191 and below.',
		steps: [
			step(
				10,
				1,
				858,
				'AD',
				'Active',
				'Your Infinities are the boost: farm about 150 million of them inside the challenge.'
			),
			step(
				7,
				5,
				858,
				'AD',
				'Active',
				'Only possible after EC10 ×1, with TS193. Last EC7 completion.'
			),
			step(
				10,
				2,
				1820,
				'AD',
				'Active',
				'Banked Infinities (TS191) help: about 10 million or more.'
			),
			step(10, 3, 2050, 'AD', 'Active', 'About 20 million Banked Infinities or more.'),
			step(10, 4, 2740, 'AD', 'Active', 'About 30 million Banked Infinities or more.')
		]
	},
	{
		id: 'ec11-12',
		title: 'EC11 and EC12',
		summary:
			'Both studies cost 1 TT but need a single dimension path. The last stretch before Dilation.',
		steps: [
			step(
				11,
				1,
				2886,
				'AD',
				'Active',
				'Get the "Popular music" achievement before your EC11 runs; it keeps Replicanti between galaxies.'
			),
			step(
				10,
				5,
				3615,
				'AD',
				'Passive',
				'About 45 million Banked Infinities. Last EC10 completion.'
			),
			step(
				11,
				2,
				4870,
				'AD',
				'Passive',
				'Switch to Passive; each run gets longer and Replicanti Galaxies matter more.'
			),
			step(11, 3, 5950, 'AD', 'Passive', 'Passive is still the faster split.'),
			step(11, 4, 5950, 'AD', 'Idle', 'Switch to Idle: the run takes about half an hour.'),
			step(11, 5, 5950, 'AD', 'Idle', 'Plan for close to two hours. Last EC11 completion.'),
			step(
				12,
				1,
				9800,
				'TD',
				'Passive',
				'Turn on the Eternity autobuyer so the run ends the moment you reach the goal inside the time limit.'
			),
			step(12, 2, 9800, 'TD', 'Passive', 'Keep the Eternity autobuyer on for every EC12 run.'),
			step(
				12,
				3,
				10750,
				'TD',
				'Passive',
				'"When will it be enough?" (1e18,000 Replicanti) speeds these runs.'
			),
			step(12, 4, 11200, 'TD', 'Passive', 'About 150 million Banked Infinities help.'),
			step(
				12,
				5,
				12350,
				'TD',
				'Passive',
				'The last completion; 0.2 in-game seconds is 200 real seconds.'
			)
		]
	}
];

export const ORDER: readonly OrderStep[] = ORDER_PHASES.flatMap((phase) => phase.steps);
