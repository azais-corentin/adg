import { describe, expect, it } from 'vitest';
import { importStudyString } from '../time-studies/study-string.ts';
import { DEFAULT_CONTEXT } from '../time-studies/tree.ts';
import { ORDER } from './order.ts';
import { stepTree } from './trees.ts';

describe('step trees', () => {
	it('import whole, with the step’s EC, into a tree owning only the completions before it', () => {
		ORDER.forEach((step, index) => {
			const done = [...new Set(ORDER.slice(0, index).map((s) => s.ec))];
			const { studies, tt } = stepTree(index);
			const result = importStudyString(studies, { ...DEFAULT_CONTEXT, completedECs: done });
			expect(result.ok, `step ${index + 1}`).toBe(true);
			if (!result.ok) return;
			expect(result.skipped, `step ${index + 1}`).toEqual([]);
			expect(result.tree.ec).toBe(step.ec);
			expect(result.tree.tt).toBe(tt);
		});
	});

	it('fit in the chart’s Time Theorems', () => {
		ORDER.forEach((step, index) => {
			expect(stepTree(index).tt, `EC${step.ec} ×${step.completion}`).toBeLessThanOrEqual(step.tt);
		});
	});

	it('take the step’s path and pace', () => {
		const ec1 = stepTree(ORDER.findIndex((s) => s.ec === 1 && s.completion === 1));
		expect(ec1.studies).toBe('11,22,32,42,51,61,72,82,92,102,111,121,131,141,151,161,171|1');
		const ec4 = stepTree(ORDER.findIndex((s) => s.ec === 4 && s.completion === 1)).studies;
		expect(ec4).toContain('73,83,93,103,111,123,133,143');
	});

	it('only include TS62 once EC5 has a completion', () => {
		const firstEc5 = ORDER.findIndex((s) => s.ec === 5);
		for (let index = 0; index < ORDER.length; index++) {
			const has62 = stepTree(index).studies.split(/[,|]/).includes('62');
			if (index <= firstEc5) expect(has62, `step ${index + 1}`).toBe(false);
		}
		expect(stepTree(firstEc5 + 1).studies.split(',')).toContain('62');
	});
});
