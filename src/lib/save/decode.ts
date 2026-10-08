import type { SourceFormat } from './types.ts';

/**
 * Save-string decoding for both Android exports. Mirrors upstream
 * `src/core/storage/serializer.js` (`GameSaveSerializer.decodeText`) with the Android-native
 * envelope added; uses only web-platform APIs (`atob`, `DecompressionStream`).
 */

export type SaveDecodeErrorCode =
	| 'empty'
	| 'too-large'
	| 'unknown-envelope'
	| 'unsupported-version'
	| 'truncated'
	| 'corrupt'
	| 'not-a-player';

export class SaveDecodeError extends Error {
	readonly code: SaveDecodeErrorCode;

	constructor(code: SaveDecodeErrorCode, message: string, options?: { cause?: unknown }) {
		super(message, options);
		this.name = 'SaveDecodeError';
		this.code = code;
	}
}

export interface DecodedSave {
	format: SourceFormat;
	/** Three-letter transport version following the prefix (`AAA`, `AAB`). */
	transport: string;
	/** The raw player object, still in the schema of `format`; read it through `normalizeSave`. */
	player: object;
}

/** Longest accepted save string; real 3.18.0 exports are ~10 KB. */
export const MAX_SAVE_LENGTH = 4 * 1024 * 1024;
/** Longest accepted decompressed JSON, so a crafted string cannot exhaust memory. */
const MAX_JSON_BYTES = 64 * 1024 * 1024;

const SUFFIX = 'EndOfSavefile';

interface Envelope {
	prefix: string;
	format: SourceFormat;
	compression: 'gzip' | 'deflate';
	/** Supported transport versions → whether the `EndOfSavefile` suffix is part of them. */
	versions: Readonly<Record<string, boolean>>;
}

const ENVELOPES: readonly Envelope[] = [
	{
		prefix: 'AntimatterDimensionsAndroidSaveFormat',
		format: 'android-native',
		compression: 'gzip',
		versions: { AAA: true }
	},
	{
		// Upstream adds the suffix step from AAB on (`condition: version => version >= "AAB"`).
		prefix: 'AntimatterDimensionsSavefileFormat',
		format: 'web',
		compression: 'deflate',
		versions: { AAA: false, AAB: true }
	}
];

const TRUNCATED_HINT =
	'The save looks cut off. Chat apps often shorten long messages; copy it from a file or a paste site instead.';

async function decompress(bytes: Uint8Array<ArrayBuffer>, format: Envelope['compression']) {
	const reader = new Blob([bytes])
		.stream()
		.pipeThrough(new DecompressionStream(format))
		.getReader();
	const chunks: Uint8Array[] = [];
	let total = 0;
	for (;;) {
		const { done, value } = await reader.read();
		if (done) break;
		total += value.byteLength;
		if (total > MAX_JSON_BYTES) {
			await reader.cancel();
			throw new SaveDecodeError('too-large', 'The save expands to more data than any real save.');
		}
		chunks.push(value);
	}
	const out = new Uint8Array(total);
	let offset = 0;
	for (const chunk of chunks) {
		out.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return new TextDecoder('utf-8', { fatal: true }).decode(out);
}

/**
 * Decodes an exported save string into its raw player object. Throws `SaveDecodeError`.
 * Whitespace anywhere in the string (e.g. line breaks added when pasting) is ignored.
 */
export async function decodeSave(input: string): Promise<DecodedSave> {
	if (input.length > MAX_SAVE_LENGTH) {
		throw new SaveDecodeError('too-large', 'This is far longer than any save string (limit 4 MB).');
	}
	const text = input.replace(/\s+/g, '');
	if (text === '') throw new SaveDecodeError('empty', 'Paste a save string first.');

	const envelope = ENVELOPES.find((e) => text.startsWith(e.prefix));
	if (!envelope) {
		throw new SaveDecodeError(
			'unknown-envelope',
			'This is not an Antimatter Dimensions save. Exports start with "AntimatterDimensions…SaveFormat" or "…SavefileFormat".'
		);
	}
	const transport = text.slice(envelope.prefix.length, envelope.prefix.length + 3);
	const hasSuffixStep = envelope.versions[transport];
	if (hasSuffixStep === undefined) {
		throw new SaveDecodeError(
			transport.length < 3 ? 'truncated' : 'unsupported-version',
			transport.length < 3
				? TRUNCATED_HINT
				: `Save format version "${transport}" is not supported (known: ${Object.keys(envelope.versions).join(', ')}).`
		);
	}

	let body = text.slice(envelope.prefix.length + 3);
	if (hasSuffixStep) {
		if (!body.endsWith(SUFFIX)) throw new SaveDecodeError('truncated', TRUNCATED_HINT);
		body = body.slice(0, -SUFFIX.length);
	}
	// Damage inside a complete string is corruption; without a suffix to check, assume a cut-off paste.
	const damaged = (cause?: unknown) =>
		hasSuffixStep
			? new SaveDecodeError('corrupt', 'The save data is damaged and cannot be unpacked.', {
					cause
				})
			: new SaveDecodeError('truncated', TRUNCATED_HINT, { cause });
	if (!/^[A-Za-z0-9]*$/.test(body)) {
		throw new SaveDecodeError(
			'corrupt',
			'The save contains characters that cannot appear in a save.'
		);
	}
	// Every `0` in the body starts a printable escape (`0a`→`0`, `0b`→`+`, `0c`→`/`).
	if (/0(?![abc])/.test(body)) throw damaged();
	let base64 = body.replace(/0[abc]/g, (m) => (m === '0a' ? '0' : m === '0b' ? '+' : '/'));
	if (base64.length % 4 === 1) throw damaged();
	base64 += '='.repeat((4 - (base64.length % 4)) % 4);

	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

	let json: string;
	try {
		json = await decompress(bytes, envelope.compression);
	} catch (error) {
		if (error instanceof SaveDecodeError) throw error;
		throw damaged(error);
	}

	let player: unknown;
	try {
		// Upstream serializes `Infinity` as the string "Infinity" (`GameSaveSerializer.jsonConverter`).
		player = JSON.parse(json, (_key, value: unknown) => (value === 'Infinity' ? Infinity : value));
	} catch (error) {
		throw new SaveDecodeError('corrupt', 'The save data is damaged (invalid JSON).', {
			cause: error
		});
	}
	if (
		typeof player !== 'object' ||
		player === null ||
		Array.isArray(player) ||
		!('antimatter' in player) ||
		!('records' in player) ||
		!('challenge' in player)
	) {
		throw new SaveDecodeError('not-a-player', 'The string decodes, but it is not a game save.');
	}
	return { format: envelope.format, transport, player };
}
