/**
 * `bun scripts/device/inject-automator.ts <in.txt> <script-id> [--run] [--repeat=false] [--preset2=...] [--out=file]`
 *
 * Injects one of our library scripts into a save for in-game verification: replaces ALL
 * existing automator scripts with a single script (id 1, the test text), points both the
 * top-level and editor script at it, clears the execution stack, and optionally arms the
 * state to RUN mode so the game starts executing it as soon as the save loads
 * (`initializeFromSave` rebuilds the stack from the compiled script on load).
 *
 * Without this, verifying a script means pasting it by hand in the Automator tab, where
 * tap coordinates shift per save and the save's own running script hijacks play/stop.
 * With it, load the injected save with `device:load` and watch the Automator tab, or
 * export afterwards with `device:export` and diff the decoded game state.
 *
 * Extra save surgery for test preconditions lives in the caller (a small bun script),
 * not here — this only swaps the automator block. Optional flags:
 *   --run            set mode RUN with the stack pointing at the first command, so the game
 *                    starts executing it as soon as the save loads
 *   --repeat=false   clear the repeat toggle (default keeps the save's value; pass
 *                    --repeat=false for scripts ending in `stop`)
 *   --preset2=<...>  set Time Study preset slot 2 (index 1) to the given studies string,
 *                    e.g. "11,22|0" — needed by respec-tree, which loads preset 2.
 *   --out=<file>     write the injected save here instead of stdout.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { deflateSync, gunzipSync, gzipSync, inflateSync } from 'node:zlib';

const WEB = 'AntimatterDimensionsSavefileFormat';
const ANDROID = 'AntimatterDimensionsAndroidSaveFormat';
const END = 'EndOfSavefile';

type Envelope = 'web' | 'android' | 'legacy';

function decode(save: string): { envelope: Envelope; player: Record<string, unknown> } {
	const unescape = (body: string) =>
		Buffer.from(
			body.replace(/0b/g, '+').replace(/0c/g, '/').replace(/0a/g, '0'),
			'base64'
		);
	let envelope: Envelope;
	let json: string;
	if (save.startsWith(WEB)) {
		envelope = 'web';
		json = inflateSync(unescape(save.slice(WEB.length + 3).replace(END, ''))).toString();
	} else if (save.startsWith(ANDROID)) {
		envelope = 'android';
		json = gunzipSync(unescape(save.slice(ANDROID.length + 3).replace(END, ''))).toString();
	} else {
		envelope = 'legacy';
		json = Buffer.from(save, 'base64').toString();
	}
	return { envelope, player: JSON.parse(json) as Record<string, unknown> };
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
const [saveFile, scriptId, ...flags] = process.argv.slice(2);
if (!saveFile || !scriptId) {
	console.error(
		'inject-automator: usage: bun scripts/device/inject-automator.ts <save.txt> <script-id> [flags]'
	);
	process.exit(1);
}
// AUTOMATOR_MODE in upstream automator-backend.js: PAUSE 1, RUN 2.
const repeatFlag = flags.find((f) => f.startsWith('--repeat='));
const preset2Flag = flags.find((f) => f.startsWith('--preset2='));
const outFlag = flags.find((f) => f.startsWith('--out='));

const text = readFileSync(`src/lib/tools/automator/scripts/${scriptId}.txt`, 'utf8');
const { envelope, player } = decode(readFileSync(saveFile, 'utf8').trim());
const auto = (player.reality as Record<string, unknown>).automator as Record<string, unknown>;
const state = auto.state as Record<string, unknown>;
auto.scripts = { 1: { id: 1, name: scriptId.slice(0, 15), content: text } };
auto.constants = {};
auto.constantSortOrder = [];
auto.execTimer = 0;
state.topLevelScript = 1;
state.editorScript = 1;
state.stack = [];
state.mode = flags.includes('--run') ? 2 : 1;
if (flags.includes('--run')) {
	const firstLine = text.split('\n').findIndex((line) => /^\s*[^#\s]/.test(line)) + 1;
	if (firstLine < 1) {
		console.error('inject-automator: script has no commands to run');
		process.exit(1);
	}
	state.stack = [{ lineNumber: firstLine, commandState: null }];
}
if (preset2Flag) {
	const studies = preset2Flag.slice('--preset2='.length);
	const presets = (player.timestudy as Record<string, unknown>).presets as Array<
		Record<string, string>
	>;
	presets[1] = { name: 'verify-target', studies: `${studies}|0` };
}
// Like device:load: stamp now so the game does not simulate years of offline progress.
if (typeof player.lastUpdate === 'number') player.lastUpdate = Date.now();
const out = encode(envelope, player);
if (outFlag) {
	writeFileSync(outFlag.slice('--out='.length), out);
	console.log(`Wrote injected save (${out.length} chars)`);
} else {
	process.stdout.write(out);
}
