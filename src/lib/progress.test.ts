import { describe, expect, it } from 'vitest';
import { parseProgress } from './progress.svelte.ts';

describe('parseProgress', () => {
	it('returns the empty state for missing or corrupt data', () => {
		const empty = { stage: null, stageSource: null, checklist: {}, planner: {} };
		expect(parseProgress(null)).toEqual(empty);
		expect(parseProgress('{not json')).toEqual(empty);
		expect(parseProgress('[]')).toEqual(empty);
		expect(parseProgress(JSON.stringify({ version: 2, stage: 'teresa' }))).toEqual(empty);
	});

	it('keeps valid fields and drops invalid ones', () => {
		const state = parseProgress(
			JSON.stringify({
				version: 1,
				stage: 'replicanti',
				stageSource: 'import',
				importedAt: '2026-10-08T20:00:00.000Z',
				checklist: { a: true, b: false, c: 'yes' },
				planner: { 'time-studies': { tree: '11,21' } }
			})
		);
		expect(state).toEqual({
			stage: 'replicanti',
			stageSource: 'import',
			importedAt: '2026-10-08T20:00:00.000Z',
			checklist: { a: true },
			planner: { 'time-studies': { tree: '11,21' } }
		});
	});

	it('drops a stage with an unknown id or source', () => {
		expect(
			parseProgress(JSON.stringify({ version: 1, stage: 'nope', stageSource: 'manual' })).stage
		).toBe(null);
		expect(
			parseProgress(JSON.stringify({ version: 1, stage: 'v', stageSource: 'guess' })).stage
		).toBe(null);
		expect(
			parseProgress(
				JSON.stringify({ version: 1, stage: 'v', stageSource: 'manual', checklist: [] })
			)
		).toEqual({ stage: 'v', stageSource: 'manual', checklist: {}, planner: {} });
	});
});
