/**
 * `bun run device:load <fixture.txt>`
 *
 * Imports a save into the emulator's game through Options → Save & Load → Import save:
 * the save goes onto the emulator clipboard (gRPC) and is pasted into the import dialog.
 *
 * Before importing, the save's `lastUpdate` is set to "now" so the game does not simulate
 * (possibly years of) offline progress, which would move the save away from the stage it
 * documents. Everything else is passed through unchanged, in the envelope it came in.
 * Runs only against the emulator (see lib.ts); never against the phone.
 */
import { readFileSync } from 'node:fs';
import { deflateSync, gunzipSync, gzipSync, inflateSync } from 'node:zlib';
import {
	ACTIVITY,
	PACKAGE,
	adbTry,
	fail,
	findDialog,
	findPhrase,
	ocr,
	reachMainUi,
	requireBooted,
	screencap,
	setClipboard,
	shell,
	tap,
	tapOptionsButton
} from './lib';

const WEB = 'AntimatterDimensionsSavefileFormat';
const ANDROID = 'AntimatterDimensionsAndroidSaveFormat';
const END = 'EndOfSavefile';

type Envelope = 'web' | 'android' | 'legacy';

function decode(save: string): { envelope: Envelope; player: Record<string, unknown> } {
	const unescape = (body: string) =>
		Buffer.from(body.replace(/0b/g, '+').replace(/0c/g, '/').replace(/0a/g, '0'), 'base64');
	let envelope: Envelope;
	let json: string;
	if (save.startsWith(WEB)) {
		envelope = 'web';
		json = inflateSync(unescape(save.slice(WEB.length + 3).replace(END, ''))).toString();
	} else if (save.startsWith(ANDROID)) {
		envelope = 'android';
		json = gunzipSync(unescape(save.slice(ANDROID.length + 3).replace(END, ''))).toString();
	} else {
		// Pre-Reality saves are plain base64 JSON ("eyJ…").
		envelope = 'legacy';
		json = Buffer.from(save, 'base64').toString();
	}
	const player: unknown = JSON.parse(json);
	if (typeof player !== 'object' || player === null || Array.isArray(player)) {
		throw new Error('save does not decode to an object');
	}
	return { envelope, player: player as Record<string, unknown> };
}

function encode(envelope: Envelope, player: Record<string, unknown>): string {
	const json = JSON.stringify(player);
	if (envelope === 'legacy') return Buffer.from(json).toString('base64');
	const packed = envelope === 'web' ? deflateSync(json) : gzipSync(json);
	const body = packed
		.toString('base64')
		.replace(/=+$/, '')
		.replace(/0/g, '0a')
		.replace(/\+/g, '0b')
		.replace(/\//g, '0c');
	return `${envelope === 'web' ? WEB + 'AAB' : ANDROID + 'AAA'}${body}${END}`;
}

async function pasteSave(save: string): Promise<void> {
	const frame = screencap();
	const dialog = findDialog(frame);
	if (!dialog) fail('the import dialog did not open');
	const words = ocr(frame, dialog.top, dialog.bottom + 1);
	if (!findPhrase(words, 'Input your save')) fail('the open dialog is not the import dialog');
	const invalid = findPhrase(words, 'Invalid save');
	// The text field sits between the title and the "Invalid save" line.
	await tap(480, invalid ? invalid.y - 45 : dialog.top + 260, 600);
	await setClipboard(save);
	shell('input keycombination KEYCODE_CTRL_LEFT KEYCODE_A');
	shell('input keyevent KEYCODE_DEL');
	shell('input keyevent KEYCODE_PASTE');
	await Bun.sleep(2500);
}

async function confirmImport(): Promise<void> {
	const frame = screencap();
	const dialog = findDialog(frame);
	if (!dialog) fail('the import dialog closed unexpectedly');
	const words = ocr(frame, dialog.top, dialog.bottom + 1);
	if (findPhrase(words, 'Invalid save')) fail('the game rejected the save ("Invalid save")');
	const summary = findPhrase(words, 'Antimatter:');
	const confirm = findPhrase(words, 'CONFIRM');
	if (!summary || !confirm) fail('no save summary / CONFIRM button in the import dialog');
	const preview = words
		.filter((w) => w.y > summary.y - 5 && w.y < confirm.y - 20)
		.map((w) => w.text)
		.join(' ');
	console.log(`Save summary: ${preview}`);
	await tap(confirm.cx, confirm.cy, 3000);
}

const fixture = process.argv[2];
if (!fixture) fail('usage: bun run device:load <save fixture .txt>');
requireBooted();

const { envelope, player } = decode(readFileSync(fixture, 'utf8').trim());
if (typeof player.lastUpdate === 'number') player.lastUpdate = Date.now();
else console.warn('warning: save has no numeric lastUpdate; offline progress will run');
const save = encode(envelope, player);
console.log(`Loaded ${fixture} (${envelope} envelope, ${save.length} chars)`);

shell('input keyevent KEYCODE_WAKEUP');
shell(`am start -n ${ACTIVITY}`);
await Bun.sleep(3000);
if (!adbTry(['shell', 'pidof', PACKAGE])?.trim()) fail('the game did not start');

await tapOptionsButton('Import save');
await pasteSave(save);
await confirmImport();
await reachMainUi();
console.log('Imported; the game is on its main screen.');
