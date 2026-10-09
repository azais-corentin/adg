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
	])('%s: every checklist item a save can answer, in checklist order, done alike', async (name) => {
		const save = await load(name);
		const goals = nextGoals(save, 'pre-infinity').concat(nextGoals(save, 'teresa'));
		const items = stageItems('pre-infinity').concat(stageItems('teresa'));
		expect(goals.map((g) => [g.id, g.done])).toEqual(
			items.flatMap((item) => (item.auto ? [[item.id, item.auto(save)]] : []))
		);
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
			['rep-galaxy', true],
			['rep-all-ic', true],
			['rep-id8', false],
			['rep-eternity', false]
		]);
		expect(goals[2]?.text).toBe(
			'Unlock the 8th Infinity Dimension (5/8 unlocked; next at 1e45,000 antimatter, you have 1.54e44,731)'
		);
	});

	it('early Eternity: next milestone first, then EC1 with its study and Eternities', () => {
		const goals = nextGoals(eternity);
		expect(goals.map((g) => g.id)).toEqual([
			'eternity-milestone-14',
			'et-first-study',
			'et-100-eternities',
			'et-all-milestones',
			'et-ec1'
		]);
		expect(goals[0]?.text).toContain('have 13');
		expect(goals.at(-1)?.text).toBe(
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
		expect(goals.at(-1)?.text).toBe('Unlock Effarig (pour 1e24 RM; poured 1.06e14)');
	});

	it("V tab opened but V locked: unlock V first, with V's six requirements", async () => {
		const goals = nextGoals(await load('community/nameless.txt'));
		expect(goals[0]?.id).toBe('v-unlock');
		expect(goals[0]?.done).toBe(false);
		expect(goals[0]?.text).toContain('14,006 / 10,000 Realities');
		expect(goals[0]?.text).toContain('2.49e316,717 / 1.00e320,000 Replicanti');
		expect(nextGoals(await load('community/v.txt'))[0]).toEqual({
			id: 'v-unlock',
			text: 'Unlock V',
			done: true
		});
	});

	it('Doomed: next Strike, unfinished Rift milestones and the cheapest Pelle Upgrade first', async () => {
		const goals = nextGoals(await load('community/pelle.txt'));
		expect(goals.slice(0, 4).map((g) => g.text)).toEqual([
			'Strike 5: Dilate Time inside the Doomed Reality',
			// Vacuum (79.46%) has every milestone; Chaos above 9% keeps Decay's on.
			'Fill Chaos to 100% (46.15% now): You gain 1% of your EP gained on Eternity per second',
			'Fill Recursion to 100% (32.46% now): Permanently unlock the Galaxy Generator',
			'Buy the Pelle Upgrade “Replicanti Galaxies no longer reset anything they normally reset” (1e30 Reality Shards; have 3.21e32)'
		]);
		expect(goals.at(-1)).toEqual({ id: 'pelle-end', text: 'Beat the game', done: false });
	});

	it.each(STAGE_IDS)('%s has goals with unique ids', (stage) => {
		const goals = nextGoals(eternity, stage);
		expect(goals.length).toBeGreaterThan(0);
		expect(new Set(goals.map((g) => g.id)).size).toBe(goals.length);
		for (const goal of goals) expect(goal.text).not.toMatch(/undefined|NaN/);
	});
});
