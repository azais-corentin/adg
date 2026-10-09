import { describe, expect, it } from 'vitest';
import { compare, log10 } from './bignum.ts';
import { decodeSave } from './decode.ts';
import { normalizeSave } from './normalize.ts';
import { FIXTURES, readFixture } from './test-fixtures.ts';
import type { BigNum, NormalizedSave } from './types.ts';

async function load(name: string): Promise<NormalizedSave> {
	return normalizeSave(await decodeSave(readFixture(name)));
}

const isBigNum = (value: unknown): value is BigNum =>
	typeof value === 'object' && value !== null && 'mantissa' in value && 'exponent' in value;

describe('normalizeSave on every fixture', () => {
	it.each(FIXTURES)('%s has finite, normalized counters', async (name) => {
		const save = await load(name);
		const counters = Object.values(save).filter(isBigNum);
		expect(counters.length).toBeGreaterThan(5);
		for (const value of counters) {
			expect(Number.isFinite(value.mantissa)).toBe(true);
			expect(
				value.mantissa === 0 || (Math.abs(value.mantissa) >= 1 && Math.abs(value.mantissa) < 10)
			).toBe(true);
		}
		expect(save.eternityChallenges).toHaveLength(12);
		expect(save.lastUpdate).toBeGreaterThan(Date.UTC(2026, 0, 1));
	});
});

const native = await load('android-3.18.0-native-eternity-paired.txt');
const web = await load('android-3.18.0-web-export-eternity-paired.txt');

describe('paired fixtures (one game state exported both ways ~80 s apart)', () => {
	/** Counters that keep growing while the game runs between the two exports. */
	const growing = ['antimatter', 'infinities', 'infinityPoints', 'eternityPoints'] as const;

	it('identifies each envelope and version', () => {
		expect(native.source).toEqual({ format: 'android-native', transport: 'AAA' });
		expect(web.source).toEqual({ format: 'web', transport: 'AAB' });
		expect(native.version).toEqual({ save: undefined, appVersionCode: 30180000, app: '3.18.0' });
		expect(web.version).toEqual({ save: 25, appVersionCode: undefined, app: undefined });
	});

	it('was exported native first, then web', () => {
		const elapsed = web.lastUpdate - native.lastUpdate;
		expect(elapsed).toBeGreaterThan(0);
		expect(elapsed).toBeLessThan(5 * 60 * 1000);
		const played = web.records.totalTimePlayed - native.records.totalTimePlayed;
		expect(played).toBeGreaterThan(0);
		expect(played).toBeLessThanOrEqual(elapsed + 1000);
	});

	it.each(growing)('%s only grew, by a little', (key) => {
		expect(compare(web[key], native[key])).toBeGreaterThanOrEqual(0);
		expect(log10(web[key]) - log10(native[key])).toBeLessThan(0.001 * log10(native[key]) + 0.1);
	});

	it('agrees on every other field', () => {
		const skip: readonly string[] = ['source', 'version', 'lastUpdate', 'records', ...growing];
		const shared = (save: NormalizedSave) =>
			Object.fromEntries(Object.entries(save).filter(([key]) => !skip.includes(key)));
		expect(Object.keys(shared(web)).length).toBeGreaterThan(20);
		expect(shared(native)).toEqual(shared(web));
		expect({ ...native.records, totalTimePlayed: 0 }).toEqual({
			...web.records,
			totalTimePlayed: 0
		});
	});

	it('reads the expected state', () => {
		expect(web).toMatchObject({
			galaxies: 120,
			dimensionBoosts: 451,
			replicanti: { unlocked: true, galaxies: 4 },
			breakInfinity: true,
			crunchAutobuyerInterval: 100,
			normalChallenges: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
			infinityChallenges: [1, 2, 3, 4, 5, 6, 7, 8],
			eternityChallenges: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			timeStudies: [11, 22, 32, 42, 51],
			// Nothing unspent: the five studies cost 1 + 2 + 2 + 6 + 3.
			totalTimeTheorems: 14,
			secretAchievements: [11, 17, 18, 24, 31, 36, 44],
			realities: 0,
			records: { bestInfinityTime: 787, bestEternityTime: 267465 }
		});
		expect(web.eternities).toEqual({ mantissa: 1.3, exponent: 1 });
		// Rows 1–8 complete; row 9 is 191 = all but column 7.
		expect(web.achievements).toHaveLength(71);
		expect(web.achievements).not.toContain(97);
		expect(web.achievements).toContain(98);
		expect(web.achievements).not.toContain(101);
	});
});

describe('normalizeSave on single fixtures', () => {
	it('reads the 3.17.0 pre-break native save', async () => {
		const save = await load('android-3.17.0-native-pre-break.txt');
		expect(save.version.app).toBe('3.17.0');
		expect(save.infinities).toEqual({ mantissa: 5, exponent: 0 });
		expect(save.crunchAutobuyerInterval).toBe(150000);
		expect(save.breakInfinity).toBe(false);
		expect(save.normalChallenges).toEqual([1]);
		expect(save.replicanti.unlocked).toBe(false);
		// records.thisEternity.bestInfinityTime stands in for upstream records.bestInfinity.time.
		expect(save.records.bestInfinityTime).toBeLessThan(999999999999);
	});

	it('reads the broken-infinity web save', async () => {
		const save = await load('android-web-export-break-infinity.txt');
		expect(save.breakInfinity).toBe(true);
		expect(save.replicanti).toEqual({ unlocked: true, galaxies: 1 });
		expect(save.eternities).toEqual({ mantissa: 0, exponent: 0 });
	});
});
