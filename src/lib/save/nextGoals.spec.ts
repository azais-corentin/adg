import { describe, expect, it } from 'vitest';
import { stageItems } from '#lib/checklists/items.ts';
import { STAGE_IDS } from '#lib/stages.ts';
import { decodeSave } from './decode.ts';
import { nextGoals } from './nextGoals.ts';
import { normalizeSave } from './normalize.ts';
import { readFixture } from './test-fixtures.ts';
import type { NormalizedSave } from './types.ts';

async function load(name: string): Promise<NormalizedSave> {
	return normalizeSave(await decodeSave(readFixture(name)));
}

const preBreak = await load('android-3.17.0-native-pre-break.txt');
const eternity = await load('android-3.18.0-native-eternity-paired.txt');
const replicanti = await load('android-web-export-break-infinity.txt');

describe('nextGoals', () => {
	it.each([
		'android-3.17.0-native-pre-break.txt',
		'community/pre-infinity.txt',
		'community/teresa.txt'
	])('%s: every checklist item a save can answer, open ones first, done alike', async (name) => {
		const save = await load(name);
		for (const stage of ['pre-infinity', 'teresa'] as const) {
			const answered = stageItems(stage).flatMap((item) =>
				item.auto ? [[item.id, item.auto(save)] as const] : []
			);
			expect(nextGoals(save, stage).map((g) => [g.id, g.done])).toEqual([
				...answered.filter(([, done]) => !done),
				...answered.filter(([, done]) => done)
			]);
		}
	});

	it('pre-break: Normal Challenges with counts and the crunch autobuyer upgrades left', () => {
		const goals = nextGoals(preBreak);
		expect(goals.every((g) => !g.done)).toBe(true);
		expect(goals.find((g) => g.id === 'inf-nc-1-9')?.text).toBe(
			'Complete Normal Challenges 1–9 (1/9)'
		);
		// 150000 × 0.6^15 hits the 100 ms floor; upgrades cost 1, 2, 4, … IP.
		expect(goals.find((g) => g.id === 'inf-crunch-autobuyer')?.text).toBe(
			'Max the Big Crunch autobuyer interval (100 ms; now 150,000 ms; 15 upgrades for 32,767 IP)'
		);
	});

	it('Replicanti stage: the next Infinity Dimension threshold, like the game shows it', () => {
		const goals = nextGoals(replicanti, 'replicanti');
		expect(goals.map((g) => [g.id, g.done])).toEqual([
			['rep-id8', false],
			['rep-eternity', false],
			['rep-galaxy', true],
			['rep-all-ic', true]
		]);
		expect(goals[0]?.text).toBe(
			'Unlock the 8th Infinity Dimension (5/8 unlocked; next at 1e45,000 antimatter, you have 1.54e44,731)'
		);
		const ready = { ...replicanti, antimatter: { mantissa: 1, exponent: 45001 } };
		expect(nextGoals(ready, 'replicanti')[0]?.text).toBe(
			'Unlock the 8th Infinity Dimension (5/8 unlocked; tap “Unlock a new Infinity Dimension”)'
		);
	});

	it('Infinity Dimensions the IP pays for come first, with the button that buys them', async () => {
		const decoded = await decodeSave(readFixture('android-web-export-break-infinity.txt'));
		// Costs in the fixture: ID1 1e200, ID2 1e201, ID3 1e202, ID4 1e200, ID5 1e200 IP.
		const rich = normalizeSave({
			...decoded,
			player: { ...decoded.player, infinityPoints: '1.5e201' }
		});
		expect(rich.affordableInfinityDimensions).toEqual([1, 2, 4, 5]);
		expect(nextGoals(rich, 'replicanti')[0]).toEqual({
			id: 'buy-infinity-dimensions',
			text: 'Buy Infinity Dimensions: you can afford ID1, ID2, ID4 and ID5 (tap Max all on Dimensions → Infinity)',
			done: false
		});
		expect(replicanti.affordableInfinityDimensions).toEqual([]);
	});

	it('a goal ticked by hand on the checklist counts as done, without its progress', () => {
		const ticks = { 'rep-id8': true, 'rep-galaxy': true };
		const goals = nextGoals(replicanti, 'replicanti', ticks);
		expect(goals).toEqual([
			{ id: 'rep-eternity', text: expect.any(String), done: false },
			{ id: 'rep-galaxy', text: expect.any(String), done: true },
			{ id: 'rep-all-ic', text: expect.any(String), done: true },
			{ id: 'rep-id8', text: 'Unlock the 8th Infinity Dimension', done: true, byHand: true }
		]);
	});

	it('early Eternity: next milestone first, then EC1 with its study and Eternities', () => {
		const goals = nextGoals(eternity);
		expect(goals.map((g) => [g.id, g.done])).toEqual([
			['eternity-milestone-14', false],
			['et-100-eternities', false],
			['et-all-milestones', false],
			['et-ec1', false],
			['et-first-study', true]
		]);
		expect(goals[0]?.text).toContain('have 13');
		expect(goals[3]?.text).toBe(
			'Complete Eternity Challenge 1 (buy Time Study 171; have 13 of 20,000 Eternities)'
		);
	});

	it('Eternity Challenge goals scale with completions', () => {
		const save = { ...eternity, eternityChallenges: [5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
		const goals = nextGoals(save, 'eternity-challenges');
		expect(goals.slice(0, 3).map((g) => g.text)).toEqual([
			'Complete Eternity Challenge 2 (2/5; next goal 1e1325 IP)',
			'Complete Eternity Challenge 3 (0/5; next goal 1e600 IP)',
			'Complete Eternity Challenge 4 (0/5; next goal 1e2750 IP)'
		]);
	});

	it('Teresa: unlock prices with what is poured', async () => {
		const goals = nextGoals(await load('community/teresa.txt'));
		expect(goals.find((g) => g.id === 'teresa-complete')?.done).toBe(true);
		expect(goals.find((g) => g.id === 'teresa-effarig')?.text).toBe(
			'Unlock Effarig (pour 1e24 RM; poured 1.06e14)'
		);
	});

	it("Effarig's Eternity layer: says whether the Infinity Point gain Glyph is equipped", async () => {
		const goals = nextGoals(await load('community/effarig.txt'));
		expect(goals.find((g) => g.id === 'effarig-eternity')?.text).toBe(
			"Clear the Eternity layer of Effarig's Reality (equip your Infinity Glyph with Infinity Point gain first)"
		);
	});

	it("V tab opened but V locked: unlock V first, with V's six requirements", async () => {
		const goals = nextGoals(await load('community/nameless.txt'));
		expect(goals[0]?.id).toBe('v-unlock');
		expect(goals[0]?.done).toBe(false);
		expect(goals[0]?.text).toContain('14,006 / 10,000 Realities');
		expect(goals[0]?.text).toContain('2.49e316,717 / 1.00e320,000 Replicanti');
		expect(nextGoals(await load('community/v.txt')).find((g) => g.id === 'v-unlock')).toEqual({
			id: 'v-unlock',
			text: 'Unlock V',
			done: true
		});
	});

	it('Imaginary Machines: one-time upgrades 12–14 before Fabrication, each with the iM cap', async () => {
		const save = await load('android-3.18.0-native-imaginary-paired.txt');
		expect(
			nextGoals(save)
				.filter((g) => !g.done)
				.map((g) => g.text)
		).toEqual([
			'Buy “Consequences of Illusions” (5e7 iM; iM cap 1.13e8)',
			'Buy “Transience of Information” (5e7 iM; iM cap 1.13e8)',
			'Buy “Recollection of Intrusion” (3.5e8 iM; iM cap 1.13e8)',
			"Buy “Fabrication of Ideals” (1e9 iM) to unlock Lai'tela (iM cap 1.13e8)"
		]);
		// Transience of Information multiplies the cap: 1 + 29 levels / 20 + 4 one-time upgrades / 2.
		const withUpgrades = { ...save, imaginaryUpgrades: [11, 12, 13, 14] };
		expect(nextGoals(withUpgrades).find((g) => g.id === 'im-laitela')?.text).toContain(
			'iM cap 5.04e8'
		);
	});

	it('Doomed: Dilation and Strike 5 as one goal, then Rift milestones and the cheapest Pelle Upgrade', async () => {
		const pelle = await load('community/pelle.txt');
		const goals = nextGoals(pelle);
		expect(goals.map((g) => g.text)).toEqual([
			// Strikes 1–4 are done; Strike 5 needs Dilation unlocked in the Doom first, and the
			// game's study shows the same 1,750/12,900 total Time Theorems.
			'Unlock Time Dilation while Doomed (EC11 0/5, EC12 0/5, 1,750/12,900 total Time Theorems), then Dilate Time for Strike 5',
			// Vacuum (79.46%) has every milestone; Chaos above 9% keeps Decay's on.
			'Fill Chaos to 100% (46.15% now): You gain 1% of your EP gained on Eternity per second',
			'Fill Recursion to 100% (32.46% now): Permanently unlock the Galaxy Generator',
			'Buy the Pelle Upgrade “Replicanti Galaxies no longer reset anything they normally reset” (1e30 Reality Shards; have 3.21e32)',
			'Beat the game',
			'Armageddon for your first Remnants',
			'Permanently regain every Antimatter Dimension autobuyer',
			'Encounter the third Pelle Strike: Reach Eternity'
		]);
		const dilated = { ...pelle, achievements: [...pelle.achievements, 187] };
		expect(nextGoals(dilated)[0]?.text).toBe('Strike 5: Dilate Time inside the Doomed Reality');
		expect(nextGoals(dilated).find((g) => g.id === 'pelle-dilation')?.done).toBe(true);
	});

	it.each(STAGE_IDS)('%s has goals with unique ids', (stage) => {
		const goals = nextGoals(eternity, stage);
		expect(goals.length).toBeGreaterThan(0);
		expect(new Set(goals.map((g) => g.id)).size).toBe(goals.length);
		for (const goal of goals) expect(goal.text).not.toMatch(/undefined|NaN/);
	});
});
