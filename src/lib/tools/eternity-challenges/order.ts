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
 * `plan.test.ts` checks every step is reachable with the completions before it.
 * Paths and paces follow the chart, except EC5, which runs on the Passive split (`EC5_PASSIVE`).
 * EC7 ×3 and ×4 come later than in the chart, where the unlock tree reaches their antimatter
 * (`EC7_UNLOCK`).
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
	/**
	 * Path of a separate tree that buys the challenge's study first, when its unlock requirement
	 * comes faster on another path than the run's. Unlock trees use the Idle row.
	 */
	unlockPath?: PathTip;
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
	note: string,
	unlockPath?: PathTip
): OrderStep => ({ ec, completion, tt, path, pace, note, ...(unlockPath && { unlockPath }) });

/**
 * EC7's antimatter requirement, measured on Android 3.18.0 with offline progress: a save right
 * after EC5 ×4 (EC7 ×2 done, 219 TT, 5e27 EP), unlock trees on the TD path with the Idle row,
 * the Big Crunch autobuyer crunching every 15 seconds and then turned off. The later rows set
 * that save's completions and TT (and EP for 320 and 450 TT: 1e40, 1e45) to the step's.
 * - 219 TT (103 TT of studies beside the 115 TT study): after 1 hour of crunching, antimatter
 *   levelled off at 1e1,003,601 within an hour without crunching and 1e1,009,509 after four;
 *   after 8 hours of crunching, 1e1,025,133. Short of EC7 ×3's 1e1,100,000.
 * - 245 TT with EC2 and EC5 at ×5 (the full 122 TT tree): 1e1,136,518 an hour after 4 hours
 *   of crunching. At 245 TT without them, 1e1,098,379 after four hours.
 * - 264 TT after EC4 ×4, EC6 ×4 and EC7 ×3: 1e1,214,120; 320 TT after EC6 ×5 with the 1e40 EP
 *   upgrade: 1e1,370,067. Both short of EC7 ×4's 1e1,400,000.
 * - 450 TT with study 181 (322 TT of studies) after EC8 ×3, no crunching at all: 1e1,990,427
 *   after an hour. Study 181 makes IP without a Big Crunch, so Infinity Dimensions keep growing.
 * The Infinity Dimension (ID) path levels off lower than TD (1e579,402 against 1e603,642 after
 * 8 hours at 219 TT without the crunching hour), and Passive lower than Idle (1e596,387).
 */
const EC7_UNLOCK =
	'For the antimatter, crunch as usual for an hour or so, then turn off Automatic Big Crunch (Autobuyers tab): only a Big Crunch resets antimatter, and it levels off within about an hour.';

/**
 * Android 3.18.0, eternity-challenges save, EC5 ×4 at 219 TT, game on screen: the Passive tree
 * (122/132/142) passed the 1e1950 IP goal in about 3¼ minutes; the Active tree (121/131/141)
 * was at 6.40e1744 IP after 23 minutes. EC5 makes Antimatter Galaxies expensive from the
 * first one, so Replicanti Galaxies carry the run and 132's 40% stronger ones win. The chart
 * this order comes from picks Active.
 */
const EC5_PASSIVE =
	'Passive split: in EC5 the stronger Replicanti Galaxies of study 132 matter more than anything on the Active row, with the game on screen or not.';

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
			step(3, 1, 140, 'AD', 'Passive', 'Passive is the better pace for this first one.', 'TD'),
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
				'Passive',
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
			step(
				3,
				2,
				155,
				'AD',
				'Active',
				'The 8th Antimatter Dimensions for the study come faster on the unlock tree.',
				'TD'
			),
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
			step(3, 3, 163, 'ID', 'Active', 'From here EC3 runs best on Infinity Dimensions.', 'TD'),
			step(7, 1, 166, 'AD', 'Active', EC7_UNLOCK),
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
			step(5, 2, 182, 'ID', 'Passive', 'Needs 174 Antimatter Galaxies for the study.'),
			step(2, 3, 182, 'TD', 'Active', 'Same TD + Active tree.'),
			step(3, 4, 182, 'ID', 'Active', 'Same ID + Active tree as EC3 ×3.', 'TD'),
			step(7, 2, 193, 'AD', 'Active', `${EC7_UNLOCK} Expect a range of about 190 to 215 TT.`, 'TD')
		]
	},
	{
		id: 'ec8',
		title: 'EC8 and finishing ECs 2, 3, 5',
		summary: 'Around 200–320 TT. EC8 is slow: plan its Replicanti upgrades before you start.',
		steps: [
			step(5, 3, 200, 'ID', 'Passive', EC5_PASSIVE),
			step(
				8,
				1,
				200,
				'TD',
				'Idle',
				'Upgrades are limited: buy no Replicanti Galaxies, take Replicanti chance to 9% and the rest in interval, and spend every Infinity Dimension purchase on the 1st.'
			),
			step(3, 5, 200, 'ID', 'Active', 'Last EC3 completion.', 'TD'),
			step(6, 3, 200, 'ID', 'Active', 'Same approach as before.'),
			step(2, 4, 200, 'TD', 'Active', 'Same TD + Active tree.'),
			step(5, 4, 215, 'ID', 'Passive', `${EC5_PASSIVE} Add TS33 if you farm up to about 218 TT.`),
			step(2, 5, 240, 'TD', 'Active', 'Last EC2 completion.'),
			step(
				5,
				5,
				245,
				'ID',
				'Passive',
				`Last EC5 completion. ${EC5_PASSIVE} TS31 and TS41 help at about 252 TT.`
			),
			step(
				7,
				3,
				245,
				'AD',
				'Active',
				`${EC7_UNLOCK} Before EC2 ×5 and EC5 ×5, the unlock tree levels off short of 1e1,100,000 antimatter, and the run stalls around 1e3,000 IP.`,
				'TD'
			),
			step(4, 4, 245, 'TD', 'Idle', 'At most 4 Infinities.'),
			step(6, 4, 264, 'ID', 'Active', 'Same approach as before.'),
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
		title: 'TS181, EC7 ×4, EC8 and EC9',
		summary:
			'TS181 (200 TT) makes IP without crunching. It drives everything up to EC10 and gets EC7 ×4 unlocked.',
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
			step(
				7,
				4,
				450,
				'AD',
				'Active',
				'The unlock tree now has TS181, which makes IP without a Big Crunch: turn off Automatic Big Crunch (Autobuyers tab) right away, and antimatter passes 1e1,400,000 within about an hour. Without TS181 it levels off short of it.',
				'TD'
			),
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
				'Only possible after EC10 ×1, with TS193. Unlock it as for ×4. Last EC7 completion.',
				'TD'
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
