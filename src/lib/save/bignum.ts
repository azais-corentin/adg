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

/**
 * Exponents from this size up are shown with thousands separators. The app's default
 * ("Commas on exponents", 5 digits) starts at 1e4: captures show `8.16e3430` and
 * `2.74e10,422`. Upstream's `Settings.exponentCommas.min` would be 1e5.
 */
const EXPONENT_COMMAS_MIN = 10_000;
/** Exponents from this size up are themselves formatted in scientific (`3.34e1.312e9`). */
const EXPONENT_COMMAS_MAX = 1_000_000_000;
/** Places of a scientific exponent: upstream `format()` passes `placesExponent = 3`. */
const EXPONENT_PLACES = 3;

/**
 * Formats like the app's default "Scientific" notation (`@antimatter-dimensions/notations`
 * `ScientificNotation` via upstream `format(value, places, placesUnder1000)`): plain below
 * 1000, `m.mme<exp>` above, commas in exponents from 1e4, and `m.mme<m.mmme<exp>>` from 1e9.
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
	if (exponent < EXPONENT_COMMAS_MAX) return `${mantissa}e${exponent.toLocaleString('en-US')}`;
	return `${mantissa}e${formatBigNum(fromNumber(exponent), EXPONENT_PLACES, EXPONENT_PLACES)}`;
}

/** `formatBigNum` for a number or a numeric string such as `"1e10500"`. Throws on anything else. */
export function formatGameNumber(value: string | number, places = 2, placesUnder1000 = 0): string {
	const parsed = parseBigNum(value);
	if (parsed === undefined) throw new Error(`Not a game number: ${value}`);
	return formatBigNum(parsed, places, placesUnder1000);
}

/**
 * A requirement amount as the game shows it (`ec-time-studies.js` `formatValue`): whole
 * numbers below 1e9 with separators (`formatInt`), anything else as `format(value)`, 0 places.
 */
export function formatAmount(value: string | number): string {
	const n = Number(value);
	return Number.isInteger(n) && n < 1e9 ? n.toLocaleString('en-US') : formatGameNumber(value, 0);
}

/**
 * A count (Infinities, Eternities, Realities) as the Statistics tab shows it: whole number
 * with separators up to 1e9, scientific with 3 places above (`StatisticsTab.vue`
 * `formatDecimalAmount`). The app's import summary also reads "Infinities: 5,832,648".
 */
export function formatCount(value: BigNum | number): string {
	const count = typeof value === 'number' ? fromNumber(value) : value;
	if (gt(count, 1e9)) return formatBigNum(count, 3);
	return Math.floor(toNumber(count)).toLocaleString('en-US');
}
