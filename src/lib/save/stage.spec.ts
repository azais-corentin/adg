import { describe, expect, it } from 'vitest';
import { STAGE_IDS, type StageId } from '#lib/stages.ts';
import { bigNum, gt } from './bignum.ts';
import { decodeSave } from './decode.ts';
import { normalizeSave } from './normalize.ts';
import { detectStage } from './stage.ts';
import { FIXTURES, readFixture } from './test-fixtures.ts';
import type { NormalizedSave } from './types.ts';

async function load(name: string): Promise<NormalizedSave> {
	return normalizeSave(await decodeSave(readFixture(name)));
}

describe('detectStage on fixtures', () => {
	it('3.17.0 pre-break: 5 Infinities, crunch autobuyer not maxed → early-infinity', async () => {
		const save = await load('android-3.17.0-native-pre-break.txt');
		expect(save.infinities).toEqual({ mantissa: 5, exponent: 0 });
		expect(save.crunchAutobuyerInterval).toBeGreaterThan(100);
		expect(detectStage(save).stage).toBe('early-infinity');
	});

	it('broken-infinity web export: Replicanti unlocked, no Eternity → replicanti', async () => {
		const save = await load('android-web-export-break-infinity.txt');
		expect(save.crunchAutobuyerInterval).toBe(100);
		expect(save.replicanti.unlocked).toBe(true);
		expect(gt(save.eternities, 0)).toBe(false);
		expect(detectStage(save).stage).toBe('replicanti');
	});

	it('3.18.0 pre-eternity: Replicanti unlocked, no Eternity → replicanti', async () => {
		const save = await load('android-3.18.0-native-pre-eternity.txt');
		expect(save.replicanti.unlocked).toBe(true);
		expect(gt(save.eternities, 0)).toBe(false);
		expect(detectStage(save).stage).toBe('replicanti');
	});

	it.each([
		'android-3.18.0-native-early-eternity.txt',
		'android-3.18.0-native-eternity-paired.txt',
		'android-3.18.0-web-export-eternity-paired.txt'
	])('%s → early-eternity', async (name) => {
		const save = await load(name);
		expect(save.eternityChallenges[0]).toBe(0);
		expect(detectStage(save).stage).toBe('early-eternity');
	});

	it.each(FIXTURES)('%s has subProgress in [0, 1]', async (name) => {
		const { subProgress } = detectStage(await load(name));
		expect(subProgress).toBeGreaterThanOrEqual(0);
		expect(subProgress).toBeLessThanOrEqual(1);
	});
});

const base = await load('android-3.17.0-native-pre-break.txt');

describe('detectStage precedence (upstream checks the last stage first)', () => {
	const quoted = (save: NormalizedSave, id: keyof NormalizedSave['celestials']) => ({
		...save.celestials,
		[id]: { quoteBits: 1, unlockBits: 0 }
	});

	const cases: [StageId, NormalizedSave][] = [
		['pre-infinity', { ...base, infinities: bigNum(0, 0) }],
		['early-infinity', base],
		['break-infinity', { ...base, crunchAutobuyerInterval: 100 }],
		['replicanti', { ...base, replicanti: { unlocked: true, galaxies: 0 } }],
		['early-eternity', { ...base, eternities: bigNum(1, 0) }],
		['eternity-challenges', { ...base, eternityChallenges: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }],
		['early-dilation', { ...base, dilation: { ...base.dilation, dilatedTime: bigNum(1, 3) } }],
		['late-eternity', { ...base, dilation: { ...base.dilation, dilatedTime: bigNum(1.1, 15) } }],
		['early-reality', { ...base, realities: 1 }],
		['teresa', { ...base, celestials: quoted(base, 'teresa') }],
		['effarig', { ...base, celestials: quoted(base, 'effarig') }],
		['nameless', { ...base, celestials: quoted(base, 'nameless') }],
		['v', { ...base, celestials: quoted(base, 'v') }],
		['ra', { ...base, celestials: quoted(base, 'ra') }],
		['imaginary-machines', { ...base, imaginaryMachineCap: 1 }],
		['laitela', { ...base, celestials: quoted(base, 'laitela') }],
		['pelle', { ...base, pelleDoomed: true }]
	];

	it('covers every stage', () => {
		expect(cases.map(([stage]) => stage)).toEqual(STAGE_IDS);
	});

	it.each(cases)('%s', (stage, save) => {
		expect(detectStage(save).stage).toBe(stage);
	});

	it('exactly 1e15 Dilated Time is still early-dilation', () => {
		const save = { ...base, dilation: { ...base.dilation, dilatedTime: bigNum(1, 15) } };
		expect(detectStage(save).stage).toBe('early-dilation');
	});

	it('a later stage wins even when earlier gates are unmet', () => {
		expect(detectStage({ ...base, pelleDoomed: true, infinities: bigNum(0, 0) }).stage).toBe(
			'pelle'
		);
	});
});
