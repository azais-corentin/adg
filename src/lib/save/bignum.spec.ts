import { describe, expect, it } from 'vitest';
import {
	bigNum,
	compare,
	formatBigNum,
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

describe('formatBigNum (game Scientific notation)', () => {
	it.each([
		[fromNumber(0), '0'],
		[fromNumber(999.4), '999'],
		[fromNumber(1234), '1.23e3'],
		[bigNum(1.7976931348623157, 308), '1.80e308'],
		[bigNum(9.999, 5), '1.00e6'],
		[bigNum(3.30615479202856, 111541), '3.31e111,541'],
		[bigNum(1, 1.5e12), '1e1.50e12'],
		[bigNum(-2.5, 4), '-2.50e4'],
		[{ mantissa: 1, exponent: Infinity }, 'Infinite']
	])('%j → %s', (value, text) => {
		expect(formatBigNum(value)).toBe(text);
	});

	it('uses 0 places for costs like the game', () => {
		expect(formatBigNum(bigNum(1, 140), 0)).toBe('1e140');
		expect(formatBigNum(fromNumber(12.345), 2, 1)).toBe('12.3');
	});
});
