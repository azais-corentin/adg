import { beforeAll, describe, expect, it, vi } from 'vitest';
import { PROGRESS_KEY, parseProgress, progress } from './progress.svelte.ts';
import { importSave } from './save/index.ts';
import { readFixture } from './save/test-fixtures.ts';
import type { NormalizedSave } from './save/types.ts';

const EMPTY = { stage: null, stageSource: null, checklist: {}, planner: {}, save: null };

describe('parseProgress', () => {
	it('returns the empty state for missing or corrupt data', () => {
		expect(parseProgress(null)).toEqual(EMPTY);
		expect(parseProgress('{not json')).toEqual(EMPTY);
		expect(parseProgress('[]')).toEqual(EMPTY);
		expect(parseProgress(JSON.stringify({ version: 2, stage: 'teresa' }))).toEqual(EMPTY);
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
			planner: { 'time-studies': { tree: '11,21' } },
			save: null
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
		).toEqual({ ...EMPTY, stage: 'v', stageSource: 'manual' });
	});
});

describe('progress store persistence', () => {
	const storage = new Map<string, string>();
	let save: NormalizedSave;

	beforeAll(async () => {
		vi.stubGlobal('localStorage', {
			getItem: (key: string) => storage.get(key) ?? null,
			setItem: (key: string, value: string) => void storage.set(key, value),
			removeItem: (key: string) => void storage.delete(key)
		});
		vi.stubGlobal('window', { addEventListener: () => {} });
		save = await importSave(readFixture('android-3.18.0-web-export-eternity-paired.txt'));
		// An infinite BigNum has `exponent: Infinity`, which plain JSON would turn into null.
		save = { ...save, antimatter: { mantissa: 1, exponent: Infinity } };
	});

	it('round-trips an imported save, including non-finite numbers', () => {
		progress.toggleCheck('kept');
		progress.setImported(save);
		expect(progress.stage).toBe('early-eternity');
		expect(progress.stageSource).toBe('import');

		const restored = parseProgress(storage.get(PROGRESS_KEY) ?? null);
		expect(restored.save).toEqual(save);
		expect(restored.save?.antimatter.exponent).toBe(Infinity);
		expect(restored).toMatchObject({
			stage: 'early-eternity',
			stageSource: 'import',
			importedAt: progress.importedAt,
			checklist: { kept: true }
		});
	});

	it('drops a stored save with missing or mistyped fields but keeps the rest', () => {
		const stored = JSON.parse(storage.get(PROGRESS_KEY) ?? '{}') as { save: string };
		const { records: _records, ...withoutRecords } = JSON.parse(stored.save) as NormalizedSave;
		for (const broken of [
			JSON.stringify(withoutRecords),
			JSON.stringify({ ...save, timeStudies: ['11'] }),
			'{not json',
			{ inline: 'object' }
		]) {
			const state = parseProgress(JSON.stringify({ ...stored, save: broken }));
			expect(state.save).toBe(null);
			expect(state.stage).toBe('early-eternity');
		}
	});

	it('keeps the save on a manual stage change and forgets it on request', () => {
		progress.setStage('teresa', 'manual');
		expect(parseProgress(storage.get(PROGRESS_KEY) ?? null).save).toEqual(save);

		progress.forgetSave();
		expect(progress.save).toBe(null);
		expect(progress.stage).toBe('teresa');
		expect(parseProgress(storage.get(PROGRESS_KEY) ?? null)).toMatchObject({
			stage: 'teresa',
			save: null
		});

		progress.setImported(save);
		const importedAt = progress.importedAt;
		const undo = progress.forgetSave();
		expect(progress.stage).toBe(null);
		expect(progress.importedAt).toBe(undefined);

		undo();
		expect(progress.save).toEqual(save);
		expect(progress.stageSource).toBe('import');
		expect(progress.importedAt).toBe(importedAt);
		expect(parseProgress(storage.get(PROGRESS_KEY) ?? null).save).toEqual(save);
	});
});
