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

describe('nextGoals', () => {
	it('pre-break: Normal Challenges, then the crunch autobuyer, then Break Infinity', () => {
		const goals = nextGoals(preBreak);
		expect(goals.map((g) => g.id)).toEqual([
			'normal-challenges-1-9',
			'infinities-16',
			'nc12',
			'crunch-interval',
			'break-infinity'
		]);
		expect(goals.every((g) => !g.done)).toBe(true);
		const crunch = goals.find((g) => g.id === 'crunch-interval');
		// 150000 × 0.6^15 hits the 100 ms floor; upgrades cost 1, 2, 4, … IP.
		expect(crunch?.text).toContain('now 150,000 ms');
		expect(crunch?.text).toContain('15 upgrades for 32,767 IP');
		expect(goals[0]?.text).toContain('(1/9)');
	});

	it('pre-Infinity goals match the stage checklist for the same save', async () => {
		const twoGalaxies = await load('community/pre-infinity.txt');
		const goals = nextGoals(twoGalaxies, 'pre-infinity');
		expect(goals.map((g) => [g.id, g.done])).toEqual(
			stageItems('pre-infinity').map((item) => [item.id, item.auto?.(twoGalaxies) ?? false])
		);
		expect(goals.find((g) => g.id === 'pre-inf-8th-dimension')?.done).toBe(true);
		expect(goals.at(-1)?.text).toBe('Reach 1.80e308 antimatter and Big Crunch (now 10)');
	});

	it('early Eternity: next milestone, TS171, then EC1', () => {
		const goals = nextGoals(eternity);
		expect(goals.map((g) => g.id)).toEqual(['eternity-milestone-14', 'ts171', 'ec1-unlock', 'ec1']);
		expect(goals[0]?.text).toContain('have 13');
		expect(goals.at(-1)?.text).toContain('1e1800 IP');
	});

	it('replicanti: marks finished goals done', () => {
		const goals = nextGoals(eternity, 'replicanti');
		expect(goals.map((g) => [g.id, g.done])).toEqual([
			['infinity-challenges', true],
			['replicanti-galaxy', true],
			['eternity', true]
		]);
		expect(nextGoals(eternity, 'break-infinity').find((g) => g.id === 'replicanti')?.done).toBe(
			true
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

	it("Teresa: a completed Teresa's Reality is done", async () => {
		const goals = nextGoals(await load('community/teresa.txt'));
		expect(goals.map((g) => [g.id, g.done])).toEqual([
			['teresa-reality', true],
			['effarig', false]
		]);
	});

	it("V tab opened but V locked: unlock V first, with V's six requirements", async () => {
		const goals = nextGoals(await load('community/nameless.txt'));
		expect(goals.map((g) => [g.id, g.done])).toEqual([
			['v-unlock', false],
			['ra', false]
		]);
		expect(goals[0]?.text).toContain('14,006 / 10,000 Realities');
		expect(goals[0]?.text).toContain('2.49e316,717 / 1.00e320,000 Replicanti');
		expect(nextGoals(await load('community/v.txt'))[0]).toEqual({
			id: 'v-unlock',
			text: 'Unlock V',
			done: true
		});
	});

	it('Doomed: next Strike, unfinished Rift milestones and the cheapest Pelle Upgrade', async () => {
		const goals = nextGoals(await load('community/pelle.txt'));
		expect(goals.map((g) => g.text)).toEqual([
			'Strike 5: Dilate Time inside the Doomed Reality',
			// Vacuum (79.46%) has every milestone; Chaos above 9% keeps Decay's on.
			'Fill Chaos to 100% (46.15% now): You gain 1% of your EP gained on Eternity per second',
			'Fill Recursion to 100% (32.46% now): Permanently unlock the Galaxy Generator',
			'Buy the Pelle Upgrade “Replicanti Galaxies no longer reset anything they normally reset” (1e30 Reality Shards; have 3.21e32)',
			'Reach the end of the game'
		]);
	});

	it.each(STAGE_IDS)('%s has goals with unique ids', (stage) => {
		const goals = nextGoals(eternity, stage);
		expect(goals.length).toBeGreaterThan(0);
		expect(new Set(goals.map((g) => g.id)).size).toBe(goals.length);
		for (const goal of goals) expect(goal.text).not.toMatch(/undefined|NaN/);
	});
});
