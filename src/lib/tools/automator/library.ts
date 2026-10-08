/**
 * The Automator script library. Script texts live in `./scripts/<id>.txt`; everything a card
 * shows about them lives here. `library.test.ts` compiles every script with upstream's own
 * Automator compiler under exactly the `unlocks` declared below.
 */
import { eternity, perks, realityUpgrades } from '#lib/data/index.ts';
import type { StageId } from '#lib/stages.ts';

/**
 * Game unlocks that upstream's compiler checks before it accepts a command. A script that
 * uses a command without its unlock does not compile in the game.
 */
export type AutomatorUnlock =
	| 'infinityAutobuyer'
	| 'infinityAutobuyerModes'
	| 'eternityAutobuyer'
	| 'eternityAutobuyerModes'
	| 'realityAutobuyer'
	| 'storeGameTime'
	| 'triadStudies';

function milestoneEternities(key: string): number {
	const milestone = eternity.milestones.find((m) => m.key === key);
	if (!milestone) throw new Error(`unknown Eternity milestone ${key}`);
	return milestone.eternities;
}

function realityUpgradeName(id: number): string {
	const upgrade = realityUpgrades.upgrades.find((u) => u.id === id);
	if (!upgrade) throw new Error(`unknown Reality Upgrade ${id}`);
	return upgrade.name;
}

/** What each unlock is called in the game, for the prerequisites list. */
export const UNLOCK_LABELS: Record<AutomatorUnlock, string> = {
	infinityAutobuyer: 'The Big Crunch autobuyer (from its Normal Challenge)',
	infinityAutobuyerModes: `${milestoneEternities('bigCrunchModes')} Eternities (more Big Crunch autobuyer modes)`,
	eternityAutobuyer: `${milestoneEternities('autobuyerEternity')} Eternities (the Eternity autobuyer milestone). The Reality Upgrade ${realityUpgradeName(10)} starts every Reality with them.`,
	eternityAutobuyerModes: `The Reality Upgrade ${realityUpgradeName(13)} (more Eternity autobuyer modes)`,
	realityAutobuyer: `The Reality Upgrade ${realityUpgradeName(25)} (Reality autobuyer and command)`,
	storeGameTime: 'Storing game time, from The Nameless Ones',
	triadStudies: 'Triad Time Studies, from Ra'
};

export interface PerkRef {
	id: number;
	label: string;
	description: string;
}

export function perk(id: number): PerkRef {
	const found = perks.perks.find((p) => p.id === id);
	if (!found?.description) throw new Error(`unknown perk ${id}`);
	return { id, label: found.label, description: found.description.replace(/\s+/g, ' ') };
}

export interface Verification {
	/** Android app version the script ran on. */
	android: '3.18.0';
	/** ISO date of the run. */
	date: string;
	/** Community save (fixtures/saves/community/<save>.txt) the run started from. */
	save: string;
	/** What the run showed. */
	observed: string;
}

export interface AutomatorScript {
	/** File name in `./scripts/`, also the name to give the script in the game (max 15 characters). */
	id: string;
	title: string;
	stage: StageId;
	purpose: string;
	/** Unlocks the game's compiler requires for this script. */
	unlocks: readonly AutomatorUnlock[];
	/** Perks the script relies on at run time. */
	perks: readonly number[];
	/** Things to set up before pressing play. */
	setup: readonly string[];
	/** What to change for your own run. */
	tweaks: readonly string[];
	verified: Verification | null;
	text: string;
}

const TEXTS = import.meta.glob<string>('./scripts/*.txt', {
	query: '?raw',
	import: 'default',
	eager: true
});

function scriptText(id: string): string {
	const text = TEXTS[`./scripts/${id}.txt`];
	if (text === undefined) throw new Error(`missing script file scripts/${id}.txt`);
	// Files end with a newline; the script itself does not.
	return text.replace(/\n$/, '');
}

type ScriptMeta = Omit<AutomatorScript, 'text'>;

const META: readonly ScriptMeta[] = [
	{
		id: 'ep-doubler',
		title: 'EP doubler',
		stage: 'early-reality',
		purpose:
			'Grows Eternity Points by taking an Eternity only when it would at least double your EP, and buys more of your Time Study tree after each one.',
		unlocks: ['eternityAutobuyer'],
		perks: [],
		setup: [
			'Save the tree you want as Time Study preset 1 (Eternity tab, Studies). The script buys what it can afford from it after every Eternity.',
			'Keep your Big Crunch and dimension autobuyers on; the script turns only the Eternity autobuyer off, and back on when it ends.'
		],
		tweaks: [
			'The goal on the while line (1e300 EP). The script stops there.',
			'The preset number in "load id 1".'
		],
		verified: null
	},
	{
		id: 'ec-runner',
		title: 'Eternity Challenge runner',
		stage: 'early-reality',
		purpose:
			'Takes one Eternity Challenge up to 5 completions: respecs, buys a tree that reaches the challenge, starts it, and finishes each run as soon as it would add a completion.',
		unlocks: ['eternityAutobuyer'],
		perks: [72, 73],
		setup: [
			'The first lines respec your Time Studies and Eternity, so start it when losing the current tree is fine.'
		],
		tweaks: [
			'To run another challenge, change the 1 in ec1, EC1 and |1! to its number.',
			'Each challenge needs a different study before it: EC1–3 need 171 (the default tree), EC4 needs 143 (idle path), EC5 needs 42, EC6 needs 121 (active), EC7 needs 111, EC8 needs 123 (idle), EC9 needs 151, EC10 needs 181. Edit the list before the | to match.',
			'Lower the 5 on the until line to stop at fewer completions.'
		],
		verified: null
	},
	{
		id: 'dilation-tp',
		title: 'Dilation and Tachyon Particles',
		stage: 'early-reality',
		purpose:
			'Unlocks Time Dilation, then repeats dilated Eternities. Each one ends as soon as it would at least double your Tachyon Particles.',
		unlocks: ['eternityAutobuyer'],
		perks: [53],
		setup: [
			'Time Study preset 1 must include one of the studies 231–234; unlocking Dilation needs one of them.',
			'Without the DILR perk, unlocking Dilation also needs 5 completions of EC11 and EC12 and enough total Time Theorems.'
		],
		tweaks: [
			'The TP goal on the while line (1e20).',
			'If dilated runs take too long, replace "wait pending tp > tp" with a fixed amount, e.g. "wait pending tp > 1e10".'
		],
		verified: null
	},
	{
		id: 'reality-alert',
		title: 'Reality alert',
		stage: 'early-reality',
		purpose:
			'Before the Reality autobuyer, you Reality by hand. This script tells you when a Reality would give at least 1000 Reality Machines, then stops.',
		unlocks: [],
		perks: [],
		setup: [],
		tweaks: [
			'The 1000 on the wait line. Use "pending glyph level" instead of "pending rm" to wait for a glyph level.'
		],
		verified: null
	},
	{
		id: 'respec-tree',
		title: 'Switch Time Study tree',
		stage: 'early-reality',
		purpose:
			'Respecs your Time Studies at the next Eternity and then buys Time Study preset 2, for example to swap between an EP tree and a challenge tree.',
		unlocks: ['eternityAutobuyer'],
		perks: [],
		setup: ['Save the tree to switch to as Time Study preset 2.'],
		tweaks: ['The preset number in "load id 2".'],
		verified: null
	},
	{
		id: 'reality-loop',
		title: 'Reality loop',
		stage: 'teresa',
		purpose:
			'One full Reality per pass: Eternities that double your EP, Dilation unlocked on the way, and a Reality once it pays the RM you set. The Automator starts the script again after each Reality.',
		unlocks: ['realityAutobuyer', 'eternityAutobuyer'],
		perks: [53, 45, 46],
		setup: [
			'Time Study preset 1 holds your main tree, including one of the studies 231–234.',
			'Keep "Automatically restart the active script when finishing or restarting a Reality" on (the green arrow button next to the repeat button).',
			'The glyph is chosen like the Reality autobuyer does: the first one offered until you have the Glyph filter, then whatever the filter picks.'
		],
		tweaks: [
			'The RM target on the until line (1e12). Set it near what a good Reality gives you now.',
			'Use "pending glyph level >= 3000" instead to Reality at a glyph level.'
		],
		verified: null
	},
	{
		id: 'glyph-hunt',
		title: 'Glyph hunt',
		stage: 'effarig',
		purpose:
			"Uses Effarig's Glyph filter to look for a good glyph: quick Realities until the filter scores the glyph it would pick at 90 or more, then a notification and a stop, so you can push that Reality's glyph level up first.",
		unlocks: ['realityAutobuyer', 'eternityAutobuyer'],
		perks: [53, 45, 46],
		setup: [
			'Unlock and set up the Glyph filter (Glyphs tab). In Rarity Threshold mode the score is the rarity in %. In Specified Effect mode a glyph missing one of your effects scores below 0.',
			'Time Study preset 1 holds your main tree, including one of the studies 231–234.',
			'Keep "Automatically restart the active script when finishing or restarting a Reality" on.'
		],
		tweaks: ['The 90 on the if line.'],
		verified: null
	},
	{
		id: 'stored-time',
		title: 'Store and use game time',
		stage: 'nameless',
		purpose:
			'Stores the game time your Black Holes produce for 10 minutes, then uses all of it at once. With the repeat button on, it keeps cycling.',
		unlocks: ['storeGameTime'],
		perks: [],
		setup: [],
		tweaks: ['The 10 min on the pause line (real time).'],
		verified: null
	}
];

export const AUTOMATOR_SCRIPTS: readonly AutomatorScript[] = META.map((meta) => ({
	...meta,
	text: scriptText(meta.id)
}));
