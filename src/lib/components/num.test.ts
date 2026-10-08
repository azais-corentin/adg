import { describe, expect, it } from 'vitest';
import { formatGameNumber } from './num.ts';

describe('formatGameNumber', () => {
	it('formats like the game in Scientific notation', () => {
		// Values as shown on the Android 3.18.0 Antimatter tab capture.
		expect(formatGameNumber('2.72e108838')).toBe('2.72e108,838');
		expect(formatGameNumber('1.68e489')).toBe('1.68e489');
		expect(formatGameNumber('6.18e7650')).toBe('6.18e7650');
		expect(formatGameNumber('1.79e308')).toBe('1.79e308');
		expect(formatGameNumber('1e308')).toBe('1.00e308');
		expect(formatGameNumber(Number.MAX_VALUE)).toBe('1.80e308');
	});

	it('keeps numbers under 1000 plain', () => {
		expect(formatGameNumber('446')).toBe('446');
		expect(formatGameNumber(999.4)).toBe('999');
		expect(formatGameNumber('0.5', 2, 2)).toBe('0.50');
		expect(formatGameNumber('0')).toBe('0');
	});

	it('normalizes mantissa and rounding overflow', () => {
		expect(formatGameNumber('1000')).toBe('1.00e3');
		expect(formatGameNumber('12345')).toBe('1.23e4');
		expect(formatGameNumber('9.999e99')).toBe('1.00e100');
		expect(formatGameNumber('0.05e10')).toBe('5.00e8');
		expect(formatGameNumber('-2e5')).toBe('-2.00e5');
	});

	it('nests the exponent from 1e9', () => {
		expect(formatGameNumber('1e1000000000')).toBe('1.00e1.00e9');
	});

	it('rejects non-numbers', () => {
		expect(() => formatGameNumber('abc')).toThrow();
		expect(() => formatGameNumber('')).toThrow();
	});
});
