/** Test-only helpers: real exports from `fixtures/saves/` and a save encoder for synthetic cases. */
import { readdirSync, readFileSync } from 'node:fs';

const FIXTURE_DIR = new URL('../../../fixtures/saves/', import.meta.url);

/** File names of the top-level save fixtures. */
export const FIXTURES = readdirSync(FIXTURE_DIR)
	.filter((name) => name.endsWith('.txt'))
	.sort();

export function readFixture(name: string): string {
	return readFileSync(new URL(name, FIXTURE_DIR), 'utf8');
}

/** Encodes like upstream `GameSaveSerializer.encodeText` (web) or the Android "Export to mobile". */
export async function encodeSave(
	json: string,
	{
		native = false,
		transport = native ? 'AAA' : 'AAB',
		suffix = true
	}: { native?: boolean; transport?: string; suffix?: boolean } = {}
): Promise<string> {
	const stream = new Blob([new TextEncoder().encode(json)])
		.stream()
		.pipeThrough(new CompressionStream(native ? 'gzip' : 'deflate'));
	const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
	const body = btoa(String.fromCharCode(...bytes))
		.replace(/=+$/, '')
		.replace(/0/g, '0a')
		.replace(/\+/g, '0b')
		.replace(/\//g, '0c');
	const prefix = native
		? 'AntimatterDimensionsAndroidSaveFormat'
		: 'AntimatterDimensionsSavefileFormat';
	return `${prefix}${transport}${body}${suffix ? 'EndOfSavefile' : ''}`;
}
