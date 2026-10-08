import type { BigNum } from './types.ts';

export const BIG_ZERO: BigNum = { mantissa: 0, exponent: 0 };

/** Builds a normalized BigNum (`1 ≤ |mantissa| < 10`, or zero). */
export function bigNum(mantissa: number, exponent: number): BigNum {
	if (Number.isNaN(mantissa) || Number.isNaN(exponent)) return { mantissa: NaN, exponent: 0 };
	if (mantissa === 0) return { mantissa: 0, exponent: 0 };
	if (!Number.isFinite(mantissa) || exponent === Infinity) {
		return { mantissa: Math.sign(mantissa), exponent: Infinity };
	}
	if (exponent === -Infinity) return { mantissa: 0, exponent: 0 };
	const shift = Math.floor(Math.log10(Math.abs(mantissa)));
	let m = mantissa / 10 ** shift;
	let e = exponent + shift;
	// Float division can land on 9.999…→10 or just under 1; nudge back into range.
	if (Math.abs(m) >= 10) {
		m /= 10;
		e += 1;
	} else if (Math.abs(m) < 1) {
		m *= 10;
		e -= 1;
	}
	return { mantissa: m, exponent: e };
}

export function fromNumber(value: number): BigNum {
	return bigNum(value, 0);
}

export function toNumber(value: BigNum): number {
	if (value.exponent === Infinity) return value.mantissa * Infinity;
	return value.mantissa * 10 ** value.exponent;
}

/** Parses a break_infinity string (`"1.5e+308"`, `"-1.0e0"`), a number, or `{mantissa, exponent}`. */
export function parseBigNum(value: unknown): BigNum | undefined {
	if (typeof value === 'number') return Number.isNaN(value) ? undefined : fromNumber(value);
	if (typeof value === 'string') {
		const text = value.trim();
		if (text === 'Infinity') return { mantissa: 1, exponent: Infinity };
		const e = text.search(/e/i);
		const mantissa = Number(e < 0 ? text : text.slice(0, e));
		const exponent = e < 0 ? 0 : Number(text.slice(e + 1));
		if (text === '' || Number.isNaN(mantissa) || !Number.isInteger(exponent)) return undefined;
		return bigNum(mantissa, exponent);
	}
	if (typeof value === 'object' && value !== null && 'mantissa' in value && 'exponent' in value) {
		const { mantissa, exponent } = value;
		if (typeof mantissa !== 'number' || typeof exponent !== 'number') return undefined;
		const result = bigNum(mantissa, exponent);
		return Number.isNaN(result.mantissa) ? undefined : result;
	}
	return undefined;
}

/** `-1`, `0` or `1` like a comparator. NaN sorts as zero. */
export function compare(a: BigNum, b: BigNum): number {
	const sa = Math.sign(a.mantissa) || 0;
	const sb = Math.sign(b.mantissa) || 0;
	if (sa !== sb) return sa < sb ? -1 : 1;
	if (sa === 0) return 0;
	let order: number;
	if (a.exponent !== b.exponent) order = a.exponent < b.exponent ? -1 : 1;
	else if (a.mantissa === b.mantissa) return 0;
	else order = Math.abs(a.mantissa) < Math.abs(b.mantissa) ? -1 : 1;
	return sa > 0 ? order : -order;
}

export function gte(a: BigNum, b: BigNum | number): boolean {
	return compare(a, typeof b === 'number' ? fromNumber(b) : b) >= 0;
}

export function gt(a: BigNum, b: BigNum | number): boolean {
	return compare(a, typeof b === 'number' ? fromNumber(b) : b) > 0;
}

/** `log10(value)`; `-Infinity` for zero, `NaN` for negatives. */
export function log10(value: BigNum): number {
	if (value.mantissa === 0) return -Infinity;
	if (value.mantissa < 0) return NaN;
	return value.exponent + Math.log10(value.mantissa);
}

/** Exponents from this size up are shown with thousands separators (notations `Settings`). */
const EXPONENT_COMMAS_MIN = 100_000;
/** Exponents from this size up are themselves formatted in scientific. */
const EXPONENT_COMMAS_MAX = 1_000_000_000;

/**
 * Formats like the game's default "Scientific" notation (`@antimatter-dimensions/notations`
 * `ScientificNotation` via `format(value, places, placesUnder1000)`): plain below 1000,
 * `m.mme<exp>` above, commas in exponents from 1e5, and `me<m.mme<exp>>` from 1e9.
 */
export function formatBigNum(value: BigNum, places = 2, placesUnder1000 = 0): string {
	if (Number.isNaN(value.mantissa)) return 'NaN';
	if (value.mantissa < 0) {
		return `-${formatBigNum({ mantissa: -value.mantissa, exponent: value.exponent }, places, placesUnder1000)}`;
	}
	if (value.exponent === Infinity) return 'Infinite';
	if (value.exponent < 3) return toNumber(value).toFixed(placesUnder1000);
	let mantissa = value.mantissa.toFixed(places);
	let exponent = value.exponent;
	if (mantissa === (10).toFixed(places)) {
		mantissa = (1).toFixed(places);
		exponent += 1;
	}
	if (exponent < EXPONENT_COMMAS_MIN) return `${mantissa}e${exponent}`;
	if (exponent < EXPONENT_COMMAS_MAX) {
		return `${mantissa}e${exponent.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
	}
	const exponentPlaces = Math.max(2, places);
	return `${value.mantissa.toFixed(0)}e${formatBigNum(fromNumber(exponent), exponentPlaces, exponentPlaces)}`;
}
