import { describe, expect, it } from 'vitest';
import {
	bigNum,
	compare,
	formatBigNum,
	formatCount,
	formatGameNumber,
	fromNumber,
	gte,
	log10,
	parseBigNum,
	toNumber
} from './bignum.ts';

describe('parseBigNum', () => {
	it.each([
		['1.10077834299611e+490', { mantissa: 1.10077834299611, exponent: 490 }],
		['1.0e-2', { mantissa: 1, exponent: -2 }],
		['-1.0e0', { mantissa: -1, exponent: 0 }],
		['0.0e0', { mantissa: 0, exponent: 0 }],
		['123.5', { mantissa: 1.235, exponent: 2 }],
		[42, { mantissa: 4.2, exponent: 1 }],
		[
			{ mantissa: 2.61317024285814, exponent: 111437 },
			{ mantissa: 2.61317024285814, exponent: 111437 }
		],
		[
			{ mantissa: 25, exponent: 3 },
			{ mantissa: 2.5, exponent: 4 }
		],
		['Infinity', { mantissa: 1, exponent: Infinity }]
	])('%j', (input, expected) => {
		const value = parseBigNum(input);
		expect(value?.exponent).toBe(expected.exponent);
		expect(value?.mantissa).toBeCloseTo(expected.mantissa, 12);
	});

	it.each([['abc'], [''], [null], [{ mantissa: '1', exponent: 2 }], [NaN], ['1e2.5']])(
		'rejects %j',
		(input) => {
			expect(parseBigNum(input)).toBeUndefined();
		}
	);
});

describe('compare / log10 / toNumber', () => {
	it('orders by sign, exponent, then mantissa', () => {
		const sorted = [
			bigNum(-5, 3),
			bigNum(-1, 0),
			bigNum(0, 0),
			bigNum(1, -2),
			bigNum(9, 0),
			bigNum(1, 1),
			bigNum(2, 1)
		];
		const shuffled = [...sorted].reverse();
		expect(shuffled.sort(compare)).toEqual(sorted);
		expect(compare(bigNum(3, 5), bigNum(3, 5))).toBe(0);
		expect(gte(bigNum(1.6, 1), 16)).toBe(true);
		expect(gte(bigNum(1.5, 1), 16)).toBe(false);
	});

	it('log10 and toNumber', () => {
		expect(log10(bigNum(1, 140))).toBe(140);
		expect(log10(fromNumber(0))).toBe(-Infinity);
		expect(toNumber(bigNum(6.91802, 5))).toBeCloseTo(691802, 6);
		expect(toNumber(bigNum(1, 400))).toBe(Infinity);
	});
});

describe('formatBigNum (the app\'s Scientific notation)', () => {
	it.each([
		[fromNumber(0), '0'],
		[fromNumber(999.4), '999'],
		[fromNumber(1234), '1.23e3'],
		[bigNum(1.7976931348623157, 308), '1.80e308'],
		[bigNum(9.999, 5), '1.00e6'],
		[bigNum(-2.5, 4), '-2.50e4'],
		[{ mantissa: 1, exponent: Infinity }, 'Infinite'],
		// As the Android 3.18.0 captures show them: commas from a 5-digit exponent, a
		// scientific exponent with 3 places from 1e9.
		[bigNum(8.16, 3430), '8.16e3430'],
		[bigNum(2.74, 10422), '2.74e10,422'],
		[bigNum(3.30615479202856, 111541), '3.31e111,541'],
		[bigNum(6.26, 380575449), '6.26e380,575,449'],
		[bigNum(3.34, 1.312e9), '3.34e1.312e9']
	])('%j → %s', (value, text) => {
		expect(formatBigNum(value)).toBe(text);
	});

	it('uses 0 places for costs like the game', () => {
		expect(formatBigNum(bigNum(1, 140), 0)).toBe('1e140');
		expect(formatBigNum(bigNum(1, 10500), 0)).toBe('1e10,500');
		expect(formatBigNum(fromNumber(12.345), 2, 1)).toBe('12.3');
	});
});

describe('formatGameNumber', () => {
	it.each([
		['2.72e108838', '2.72e108,838'],
		['6.18e7650', '6.18e7650'],
		['1e308', '1.00e308'],
		[Number.MAX_VALUE, '1.80e308'],
		['446', '446'],
		[999.4, '999'],
		['0', '0'],
		['1000', '1.00e3'],
		['9.999e99', '1.00e100'],
		['0.05e10', '5.00e8'],
		['-2e5', '-2.00e5'],
		['1e1000000000', '1.00e1.000e9']
	])('%j → %s', (value, text) => {
		expect(formatGameNumber(value)).toBe(text);
	});

	it('rejects non-numbers', () => {
		expect(() => formatGameNumber('abc')).toThrow();
		expect(() => formatGameNumber('')).toThrow();
	});
});

describe('formatCount', () => {
	it('groups digits up to 1e9, then 3 places like the Statistics tab', () => {
		expect(formatCount(8584)).toBe('8,584');
		expect(formatCount(bigNum(3.759336, 6))).toBe('3,759,336');
		expect(formatCount(bigNum(1.2346, 12))).toBe('1.235e12');
	});
});
