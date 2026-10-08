import { describe, expect, it } from 'vitest';
import {
	decodeSave,
	MAX_SAVE_LENGTH,
	SaveDecodeError,
	type SaveDecodeErrorCode
} from './decode.ts';
import { encodeSave, FIXTURES, readFixture } from './test-fixtures.ts';

async function expectCode(input: string, code: SaveDecodeErrorCode) {
	const error: unknown = await decodeSave(input).then(
		() => undefined,
		(e: unknown) => e
	);
	expect(error).toBeInstanceOf(SaveDecodeError);
	expect(error instanceof SaveDecodeError && error.code).toBe(code);
}

const PLAYER = '{"antimatter":"1.0e+1","records":{},"challenge":{}}';

describe('decodeSave', () => {
	it('finds the fixtures', () => {
		expect(FIXTURES.length).toBeGreaterThanOrEqual(6);
	});

	it.each(FIXTURES)('decodes %s', async (name) => {
		const save = await decodeSave(readFixture(name));
		expect(save.format).toBe(name.includes('native') ? 'android-native' : 'web');
		expect(save.transport).toBe(name.includes('native') ? 'AAA' : 'AAB');
		expect('antimatter' in save.player && 'dimensions' in save.player).toBe(true);
	});

	it('ignores whitespace and line breaks added while pasting', async () => {
		const text = readFixture('android-3.18.0-web-export-eternity-paired.txt').trim();
		const wrapped = `  ${text.replace(/(.{76})/g, '$1\r\n')}\n`;
		expect((await decodeSave(wrapped)).format).toBe('web');
	});

	it('maps "Infinity" strings back to Infinity', async () => {
		const json =
			'{"antimatter":"1.0e+1","records":{"bestInfinity":{"time":"Infinity"}},"challenge":{}}';
		const { player } = await decodeSave(await encodeSave(json));
		expect(player).toMatchObject({ records: { bestInfinity: { time: Infinity } } });
	});

	it('accepts legacy web AAA saves, which have no suffix', async () => {
		const save = await decodeSave(await encodeSave(PLAYER, { transport: 'AAA', suffix: false }));
		expect(save).toMatchObject({ format: 'web', transport: 'AAA' });
	});

	it('round-trips native gzip saves', async () => {
		const save = await decodeSave(await encodeSave(PLAYER, { native: true }));
		expect(save).toMatchObject({ format: 'android-native', transport: 'AAA' });
	});
});

describe('decodeSave errors', () => {
	const web = readFixture('android-3.18.0-web-export-eternity-paired.txt').trim();
	const native = readFixture('android-3.18.0-native-eternity-paired.txt').trim();

	it('rejects empty input', async () => {
		await expectCode('', 'empty');
		await expectCode(' \n\t ', 'empty');
	});

	it('rejects inputs over 4 MB', async () => {
		await expectCode('A'.repeat(MAX_SAVE_LENGTH + 1), 'too-large');
	});

	it('rejects strings without a save prefix', async () => {
		await expectCode('hello world', 'unknown-envelope');
		await expectCode(
			web.replace('AntimatterDimensions', 'AntimatterDimension'),
			'unknown-envelope'
		);
		await expectCode('eyJtb25leSI6IjEwIn0=', 'unknown-envelope');
	});

	it('rejects unknown transport versions', async () => {
		await expectCode(web.replace('SavefileFormatAAB', 'SavefileFormatAAC'), 'unsupported-version');
		await expectCode(native.replace('SaveFormatAAA', 'SaveFormatAAB'), 'unsupported-version');
	});

	it('reports a missing suffix as truncated', async () => {
		await expectCode(web.slice(0, -'EndOfSavefile'.length), 'truncated');
		await expectCode(native.slice(0, -'EndOfSavefile'.length), 'truncated');
	});

	it('reports a string cut short (as chat apps do) as truncated', async () => {
		await expectCode(web.slice(0, 2000), 'truncated');
		await expectCode(native.slice(0, Math.floor(native.length / 2)), 'truncated');
		await expectCode('AntimatterDimensionsSavefileFormatAA', 'truncated');
	});

	it('reports damaged data as corrupt', async () => {
		const body = web.slice(0, -'EndOfSavefile'.length);
		// Drop a chunk from the middle but keep the suffix.
		await expectCode(`${body.slice(0, 3000)}${body.slice(3400)}EndOfSavefile`, 'corrupt');
		await expectCode(web.replace('EndOfSavefile', '!!EndOfSavefile'), 'corrupt');
		await expectCode(web.replace(/0a/, '0z'), 'corrupt');
	});

	it('rejects valid saves that are not a player object', async () => {
		await expectCode(await encodeSave('[1,2,3]'), 'not-a-player');
		await expectCode(await encodeSave('{"automator":"x"}'), 'not-a-player');
		await expectCode(await encodeSave('not json'), 'corrupt');
	});
});
