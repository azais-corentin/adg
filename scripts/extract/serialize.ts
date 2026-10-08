/**
 * Turns upstream config values into plain JSON: Decimals become strings, text closures are
 * evaluated when they only depend on formatters, and are otherwise kept as source text.
 */
import Decimal from 'break_infinity.js';
import { evaluateWith, StateAccessError } from './env';
import { UPSTREAM } from './pin';

export interface Source {
	repo: string;
	sha: string;
	files: string[];
}

/** Provenance block attached to every dataset; `files` are relative to upstream `src/`. */
export function source(...files: string[]): Source {
	return { repo: UPSTREAM.repo, sha: UPSTREAM.sha, files };
}

/** Canonical string for a Decimal-or-number: plain below 1e21, else `<mantissa>e<exponent>`. */
export function decimalString(value: unknown): string {
	if (!(value instanceof Decimal) && typeof value !== 'number') {
		throw new Error(`expected Decimal or number, got ${describe(value)}`);
	}
	const decimal = new Decimal(value);
	if (decimal.mantissa === 0) return '0';
	if (Math.abs(decimal.exponent) < 21) return String(decimal.toNumber());
	return `${Number(decimal.mantissa.toPrecision(15))}e${decimal.exponent}`;
}

export function isDecimal(value: unknown): value is Decimal {
	return value instanceof Decimal;
}

function describe(value: unknown): string {
	return typeof value === 'function' ? `function ${String(value).slice(0, 60)}` : String(value);
}

/** Dedents template-literal text and trims it; newlines are kept (HTML rendering collapses them). */
export function cleanText(text: string): string {
	return text.replace(/[ \t]*\n[ \t]*/g, '\n').trim();
}

/** Result of resolving a text field: `text` when it could be computed, else upstream `source`. */
export interface Resolved {
	text: string | null;
	source: string | null;
}

/** Reads `object[key]` without triggering getters, returning the getter function instead. */
export function rawField(object: object, key: string): unknown {
	const descriptor = Object.getOwnPropertyDescriptor(object, key);
	if (descriptor === undefined) return undefined;
	return descriptor.get ?? descriptor.value;
}

/** Why text closures could not be resolved (first game-state access → count), for the run log. */
export const unresolvedReasons = new Map<string, number>();

function unresolvedReason(error: unknown): string {
	if (error instanceof StateAccessError) return `state: ${error.message.split('.')[0]}`;
	if (error instanceof ReferenceError) return `global: ${error.message.split(' ')[0]}`;
	return `error: ${error instanceof Error ? error.constructor.name : typeof error}`;
}

/**
 * Resolves a text-ish value: strings pass through, closures/getters are called with `args` and
 * kept only if they return a string without touching unmodelled game state.
 */
export function resolveText(value: unknown, ...args: unknown[]): Resolved {
	if (typeof value === 'string') return { text: cleanText(value), source: null };
	if (typeof value !== 'function') throw new Error(`expected text, got ${describe(value)}`);
	let reason = 'non-string result';
	try {
		const result: unknown = evaluateWith({}, () => value(...args));
		if (typeof result === 'string') return { text: cleanText(result), source: null };
	} catch (error) {
		// Depends on game state: keep the source instead.
		reason = unresolvedReason(error);
	}
	unresolvedReasons.set(reason, (unresolvedReasons.get(reason) ?? 0) + 1);
	return { text: null, source: String(value) };
}

/** Resolves the text field `key` of `object` (plain value, closure, or getter). */
export function textField(object: object, key: string): Resolved {
	return resolveText(rawField(object, key));
}

/** Like {@link textField} but `null` when the field is absent. */
export function optionalTextField(object: object, key: string): Resolved | null {
	const value = rawField(object, key);
	return value === undefined ? null : resolveText(value);
}

export type TextPair<K extends string> = { [P in K]: string | null } & {
	[P in `${K}Source`]: string | null;
};

/** `{ [key]: text, [key + 'Source']: source }`, the flat shape used by every dataset. */
export function textPair<K extends string>(key: K, resolved: Resolved | null): TextPair<K> {
	// The mapped type cannot be built from a computed literal without a cast.
	return {
		[key]: resolved?.text ?? null,
		[`${key}Source`]: resolved?.source ?? null
	} as TextPair<K>;
}
/** Source text of a closure field, or `null` when absent. */
export function sourceField(object: object, key: string): string | null {
	const value = rawField(object, key);
	if (value === undefined) return null;
	if (typeof value !== 'function')
		throw new Error(`expected closure at ${key}, got ${describe(value)}`);
	return String(value);
}

/** A number, or `null` when absent; anything else is an extraction error. */
export function optionalNumber(object: object, key: string): number | null {
	const value = rawField(object, key);
	if (value === undefined) return null;
	if (typeof value !== 'number')
		throw new Error(`expected number at ${key}, got ${describe(value)}`);
	return value;
}

export function requireNumber(object: object, key: string): number {
	const value = optionalNumber(object, key);
	if (value === null) throw new Error(`missing number at ${key}`);
	return value;
}

export function requireString(object: object, key: string): string {
	const value = rawField(object, key);
	if (typeof value !== 'string')
		throw new Error(`expected string at ${key}, got ${describe(value)}`);
	return value;
}

export function optionalString(object: object, key: string): string | null {
	const value = rawField(object, key);
	if (value === undefined) return null;
	if (typeof value !== 'string')
		throw new Error(`expected string at ${key}, got ${describe(value)}`);
	return value;
}

export function optionalBoolean(object: object, key: string): boolean {
	const value = rawField(object, key);
	if (value === undefined) return false;
	if (typeof value !== 'boolean')
		throw new Error(`expected boolean at ${key}, got ${describe(value)}`);
	return value;
}

/** Decimal-or-number field as a canonical string, `null` when absent. */
export function optionalDecimal(object: object, key: string): string | null {
	const value = rawField(object, key);
	return value === undefined ? null : decimalString(value);
}

/** A static value (number/Decimal) or a closure, as `{ value, source }`. */
export function numericOrSource(
	object: object,
	key: string
): { value: string | null; source: string | null } {
	const value = rawField(object, key);
	if (value === undefined) return { value: null, source: null };
	if (typeof value === 'function') return { value: null, source: String(value) };
	return { value: decimalString(value), source: null };
}

export function asRecord(value: unknown, what: string): Record<string, unknown> {
	if (typeof value !== 'object' || value === null) throw new Error(`expected object for ${what}`);
	return value as Record<string, unknown>;
}

export function asArray(value: unknown, what: string): unknown[] {
	if (!Array.isArray(value)) throw new Error(`expected array for ${what}`);
	return value;
}

/** Upstream config objects keyed by name, as `[key, config]` pairs in upstream order. */
export function entries(value: unknown, what: string): [string, Record<string, unknown>][] {
	return Object.entries(asRecord(value, what)).map(([key, item]) => [
		key,
		asRecord(item, `${what}.${key}`)
	]);
}

/** Upstream config arrays (skipping holes), as records. */
export function records(value: unknown, what: string): Record<string, unknown>[] {
	return asArray(value, what)
		.filter((item) => item !== undefined && item !== null)
		.map((item, index) => asRecord(item, `${what}[${index}]`));
}
