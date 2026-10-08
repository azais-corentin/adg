import { describe, expect, it } from 'vitest';
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

	it.each(STAGE_IDS)('%s has goals with unique ids', (stage) => {
		const goals = nextGoals(eternity, stage);
		expect(goals.length).toBeGreaterThan(0);
		expect(new Set(goals.map((g) => g.id)).size).toBe(goals.length);
		for (const goal of goals) expect(goal.text).not.toMatch(/undefined|NaN/);
	});
});
