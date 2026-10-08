import { describe, expect, it } from 'vitest';
import {
	exportStudyString,
	importStudyString,
	isValidImportString,
	truncateInput
} from './study-string.ts';
import { PRESETS } from './presets.ts';
import { parsePlannerState } from './state.ts';
import { DEFAULT_CONTEXT, type TreeContext } from './tree.ts';

const ctx = DEFAULT_CONTEXT;

function imported(input: string, context: TreeContext = ctx) {
	const result = importStudyString(input, context);
	if (!result.ok) throw new Error(result.error);
	return result;
}

describe('format, as upstream isValidImportString(truncateInput(input))', () => {
	// Each case was traced through the upstream functions by hand.
	it.each([
		['11,21,31', true],
		['11, 21, 31 | 1', true],
		['11-62', true],
		['11,22,|0', true],
		['11,,21', true],
		['antimatter', true],
		['ANTIMATTER, Idle', true],
		['11,21|5!', true],
		['|3', true],
		['', false],
		['   ', false],
		['1,2', false],
		['1111', false],
		['11|123', false],
		['11|1|2', false],
		['11;21', false],
		['triad', false],
		['11-21-31', false],
		['11!|1', false]
	])('%j → %s', (input, valid) => {
		expect(isValidImportString(truncateInput(input, ctx), ctx)).toBe(valid);
	});

	it('truncates like upstream', () => {
		expect(truncateInput('Antimatter, 111 , ', ctx)).toBe('71,81,91,101,111,');
		expect(truncateInput('11,,,21,|1', ctx)).toBe('11,21|1');
		expect(truncateInput('11,21|', ctx)).toBe('11,21');
		expect(truncateInput('triad', { ...ctx, triads: 2 })).toBe('301,302');
	});
});

describe('import', () => {
	it('expands ranges to the studies that exist', () => {
		const result = imported('11-62|0');
		expect(result.tree.studies).toEqual([11, 21, 22, 31, 32, 33, 41, 42, 51, 61, 62]);
		expect(result.invalid).toEqual([]);
		expect(result.tree.ec).toBe(0);
		expect(result.tree.tt).toBe(32);
	});

	it('drops a range silently when an end is not a study', () => {
		const result = imported('11,12-22');
		expect(result.tree.studies).toEqual([11]);
		expect(result.invalid).toEqual([]);
	});

	it('reports ids that are not studies, like the game', () => {
		const result = imported('11,12,21|13');
		expect(result.tree.studies).toEqual([11, 21]);
		expect(result.invalid).toEqual(['12', 'EC13']);
	});

	it('expands set names and keeps the EC and the ! flag', () => {
		const result = imported('11-61,time,111,idle,151,161,171|2!');
		expect(result.tree.studies).toEqual([
			11, 21, 22, 31, 32, 33, 41, 42, 51, 61, 73, 83, 93, 103, 111, 123, 133, 143, 151, 161, 171
		]);
		expect(result.tree.ec).toBe(2);
		expect(result.startEC).toBe(true);
		expect(result.skipped).toEqual([]);
	});

	it('only expands the first occurrence of a set name per pass, as upstream', () => {
		// truncateInput runs twice (modal, then parser), so a third "idle" is left as a word.
		const result = imported('11-61,73,83,93,103,111,idle,idle,idle');
		expect(result.invalid).toEqual(['idle']);
	});

	it('reports studies the rules forbid', () => {
		const result = imported('11,21,22,31,32,33,41,42,51,61,71,72');
		expect(result.tree.studies.at(-1)).toBe(71);
		expect(result.skipped).toEqual([
			{
				ref: { kind: 'normal', id: 72 },
				reason: 'Only one Dimension path (71–103) until you buy study 201.'
			}
		]);
	});

	it('explains malformed strings', () => {
		const error = (input: string) => {
			const result = importStudyString(input, ctx);
			return result.ok ? null : result.error;
		};
		expect(error('11,foo')).toBe(
			'"foo" isn\'t a study or a group name. Names the game knows: antimatter, infinity, time, active, passive, idle, light, dark.'
		);
		expect(error('11;21')).toBe('Unexpected character ";". Separate studies with commas.');
		expect(error('11|1|2')).toBe('Only one "|" is allowed, before the EC number at the end.');
		expect(error('11|123')).toBe('After "|" put the EC number (1–12), optionally followed by "!".');
		expect(error('11,1111')).toBe('"1111" isn\'t a study number; they have 2 or 3 digits.');
		expect(error('triad')).toBe(
			'"triad" only works once Triad Studies are unlocked (see Game state).'
		);
	});
});

describe('export', () => {
	it('writes purchase order and always the EC slot, as upstream exportString', () => {
		expect(exportStudyString({ studies: [11, 22, 21], ec: 0 })).toBe('11,22,21|0');
		expect(exportStudyString({ studies: [11], ec: 5 }, true)).toBe('11|5!');
	});

	it('round-trips through import', () => {
		const input = '11,21,22,31,32,33,41,42,51,61,73,83,93,103,111,123,133,143,151,161,162,171|1';
		const result = imported(input);
		expect(exportStudyString(result.tree, result.startEC)).toBe(input);
		const again = imported(exportStudyString(result.tree));
		expect(again.tree).toEqual(result.tree);
	});
});

describe('presets', () => {
	it.each(PRESETS.map((p) => [p.id, p] as const))('%s imports cleanly', (_id, preset) => {
		const result = imported(preset.studies);
		expect(result.invalid).toEqual([]);
		expect(result.skipped).toEqual([]);
		expect(exportStudyString(result.tree)).toBe(preset.studies);
	});
});

describe('stored state', () => {
	it('keeps valid fields and drops the rest', () => {
		expect(parsePlannerState({ studies: [11, 12, 21], ec: 13, startEC: 'yes' })).toEqual({
			studies: [11, 21],
			ec: 0,
			startEC: false,
			context: null
		});
		expect(parsePlannerState('nope')).toEqual({
			studies: [],
			ec: 0,
			startEC: false,
			context: null
		});
		const context = { ...ctx, triads: 9 };
		expect(parsePlannerState({ studies: [], ec: 4, startEC: true, context }).context).toEqual({
			...ctx,
			triads: 4
		});
	});
});
