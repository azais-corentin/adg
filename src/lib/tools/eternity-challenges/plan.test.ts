import { describe, expect, it } from 'vitest';
import { importSave } from '#lib/save/index.ts';
import { readFixture } from '#lib/save/test-fixtures.ts';
import {
	eternityChallenge,
	ETERNITY_CHALLENGES,
	goalAt,
	MAX_COMPLETIONS,
	restrictionAt,
	unlockGates,
	unlockRequirementAt
} from './challenges.ts';
import { ORDER } from './order.ts';
import {
	effectiveSource,
	nextStep,
	NO_COMPLETIONS,
	normalizeCompletions,
	parsePlannerState,
	toggleStep
} from './plan.ts';

describe('challenge numbers match upstream', () => {
	it('scales goals by goalIncrease up to the fifth completion', () => {
		// EC4: 1e2750 × 1e550^c; EC12: 1e110000 × 1e12000^c (secret-formula eternity-challenges.js).
		expect(goalAt(eternityChallenge(4), 0)).toBe('1e2750');
		expect(goalAt(eternityChallenge(4), 2)).toBe('1e3850');
		expect(goalAt(eternityChallenge(12), 4)).toBe('1e158000');
		// Goal stops growing once all five are done (`min(completions, maxCompletions - 1)`).
		expect(goalAt(eternityChallenge(1), 5)).toBe('1e2600');
		for (const ec of ETERNITY_CHALLENGES) {
			expect(ec.goals.map((_, c) => goalAt(ec, c))).toEqual(ec.goals);
		}
	});

	it('uses Pelle goals in Doomed Reality', () => {
		// EC11: pelleGoal 1e11200, pelleGoalIncrease 1e1400; EC12 has no Pelle increase.
		expect(goalAt(eternityChallenge(11), 2, true)).toBe('1e14000');
		expect(goalAt(eternityChallenge(12), 1, true)).toBe('1e220000');
		expect(goalAt(eternityChallenge(1), 1, true)).toBe('1e2000');
	});

	it('scales unlock requirements per completion', () => {
		expect(unlockRequirementAt(eternityChallenge(1), 1)).toBe('40,000 Eternities');
		expect(unlockRequirementAt(eternityChallenge(4), 4)).toBe('200,000,000 Infinities');
		expect(unlockRequirementAt(eternityChallenge(5), 1)).toBe('174 Antimatter Galaxies');
		expect(unlockRequirementAt(eternityChallenge(7), 4)).toBe('1e1,700,000 antimatter');
		expect(unlockRequirementAt(eternityChallenge(9), 2)).toBe('1e21,500 Infinity Power');
		expect(unlockRequirementAt(eternityChallenge(11), 0)).toBe(
			'Antimatter Dimension path only (no TS72 or TS73)'
		);
		expect(restrictionAt(eternityChallenge(4), 4)).toBe('without any Infinities');
		expect(restrictionAt(eternityChallenge(2), 0)).toBeNull();
	});

	it('derives which completions gate each unlock study from the tree', () => {
		const gates = Object.fromEntries(ETERNITY_CHALLENGES.map((ec) => [ec.id, unlockGates(ec)]));
		expect(gates).toEqual({
			1: [],
			2: [],
			3: [],
			4: [],
			5: [],
			6: [],
			7: [],
			8: [],
			9: [],
			10: [1, 2, 3],
			11: [1, 2, 3, 10],
			12: [1, 2, 3, 10]
		});
	});
});

describe('recommended order', () => {
	it('earns every completion of every EC exactly once, tier by tier', () => {
		expect(ORDER).toHaveLength(ETERNITY_CHALLENGES.length * MAX_COMPLETIONS);
		const done = normalizeCompletions(NO_COMPLETIONS);
		for (const step of ORDER) {
			expect(step.completion, `EC${step.ec}x${step.completion}`).toBe(done[step.ec - 1]! + 1);
			done[step.ec - 1] = step.completion;
		}
	});

	it('only schedules steps whose unlock study is reachable', () => {
		const done = normalizeCompletions(NO_COMPLETIONS);
		for (const step of ORDER) {
			for (const gate of unlockGates(eternityChallenge(step.ec))) {
				expect(done[gate - 1], `EC${step.ec}x${step.completion} needs EC${gate}`).toBeGreaterThan(
					0
				);
			}
			done[step.ec - 1] = step.completion;
		}
	});

	it('suggests a growing Time Theorem total', () => {
		ORDER.slice(1).forEach((step, i) => expect(step.tt).toBeGreaterThanOrEqual(ORDER[i]!.tt));
	});
});

describe('next step', () => {
	it('starts at EC1 x1 for a save with no completions', async () => {
		const save = await importSave(readFixture('android-3.18.0-web-export-eternity-paired.txt'));
		expect(save.eternityChallenges).toEqual(NO_COMPLETIONS);
		expect(nextStep(save.eternityChallenges)).toMatchObject({
			index: 0,
			step: { ec: 1, completion: 1 }
		});
	});

	it('follows the order as completions come in', () => {
		// EC1 x2, EC2 x1: the order's next step is EC3 x1.
		expect(nextStep([2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).toMatchObject({
			index: 3,
			step: { ec: 3, completion: 1 }
		});
		// Out of order (EC2 skipped): the earliest missing step comes first.
		expect(nextStep([3, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0])?.step).toMatchObject({
			ec: 2,
			completion: 1
		});
		// Everything up to EC4 x4; EC4 x5 needs TS181 and is next.
		const beforeTs181 = normalizeCompletions([5, 5, 5, 4, 5, 5, 4, 2]);
		expect(nextStep(beforeTs181)?.step).toMatchObject({ ec: 4, completion: 5 });
	});

	it('is null once all 60 completions are done', () => {
		expect(nextStep(Array.from({ length: 12 }, () => 5))).toBeNull();
	});

	it('toggles a step on and back off', () => {
		const ec3x2 = ORDER.find((step) => step.ec === 3 && step.completion === 2)!;
		const on = toggleStep(NO_COMPLETIONS, ec3x2);
		expect(on[2]).toBe(2);
		expect(toggleStep(on, ec3x2)[2]).toBe(1);
	});
});

describe('planner state', () => {
	it('falls back field by field', () => {
		expect(parsePlannerState(undefined)).toEqual({
			source: 'save',
			completions: NO_COMPLETIONS,
			seededFrom: null
		});
		expect(
			parsePlannerState({ source: 'manual', completions: [9, -1, 2.7, 'x'], seededFrom: 'x' })
		).toEqual({
			source: 'manual',
			completions: [5, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			seededFrom: null
		});
	});

	it('keeps marks by hand for the save they started from, and follows a newer import', () => {
		const manual = { source: 'manual' as const, completions: [...NO_COMPLETIONS], seededFrom: 100 };
		expect(effectiveSource(manual, 100)).toBe('manual');
		expect(effectiveSource(manual, 200)).toBe('save');
		expect(effectiveSource({ ...manual, source: 'save' }, 100)).toBe('save');
		expect(effectiveSource({ ...manual, source: 'save' }, null)).toBe('manual');
	});
});
