/**
 * Shared helpers for the Android emulator capture pipeline (docs/device/EMULATOR.md).
 *
 * Everything talks to the emulator through the `adb` on PATH (android-tools from the default
 * devShell). The phone's wireless adb connection lives in the same adb server, so every command
 * passes an explicit `-s <serial>` and nothing here ever addresses the phone.
 *
 * UI positions come from the screenshots themselves: OCR (tesseract) for text, pixel scans for
 * the bottom navigation icons and dialog panels. `uiautomator dump` is useless on this app (it
 * animates constantly and dumps include hidden views).
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { connect } from 'node:http2';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

export const PACKAGE = 'kajfosz.antimatterdimensions';
export const APP_VERSION = '3.18.0';
export const APP_VERSION_CODE = '30180000';
export const ACTIVITY = `${PACKAGE}/.MainActivity`;

/**
 * Console port of the emulator (even, 5554–5682); the adb serial follows from it. Set
 * ADG_EMULATOR_PORT (e.g. 5586) to run a second, independent instance next to the default
 * one; it gets its own AVD because a running emulator locks its AVD's disk images.
 */
export const EMULATOR_PORT = Number(process.env.ADG_EMULATOR_PORT ?? 5584);
export const SERIAL = `emulator-${EMULATOR_PORT}`;
export const AVD_NAME = `adg-pixel9pro-api35${EMULATOR_PORT === 5584 ? '' : `-${EMULATOR_PORT}`}`;

/** The phone's screen (Pixel 9 Pro at its current display settings, see docs/device/README.md). */
export const SCREEN = { width: 960, height: 2142, density: 360 } as const;

/**
 * Screen bands (pixels) of the game UI at this size, measured on emulator screenshots:
 * news ticker on top, bottom navigation icons, and the subtab label bar under them.
 */
export const BANDS = {
	ticker: [0, 130],
	navIcons: [1945, 2015],
	subtabs: [2030, 2142],
	/** Floating prestige buttons (Eternity, B.Crunch, …, Max) sit right above the navigation. */
	prestige: [1790, 1925]
} as const;

export const REPO_ROOT = resolve(import.meta.dir, '../..');
export const CACHE_DIR = join(homedir(), '.cache', 'adg');
export const APK_DIR = join(CACHE_DIR, 'apk', APP_VERSION);
export const AVD_HOME = join(CACHE_DIR, 'avd');
export const EMULATOR_LOG = join(CACHE_DIR, `emulator-${EMULATOR_PORT}.log`);

export function fail(message: string): never {
	console.error(`error: ${message}`);
	process.exit(1);
}

export function apkSplits(): string[] {
	if (!existsSync(APK_DIR)) return [];
	return readdirSync(APK_DIR)
		.filter((name) => name.endsWith('.apk'))
		.sort()
		.map((name) => join(APK_DIR, name));
}

interface RunResult {
	code: number;
	stdout: Uint8Array;
	stderr: string;
}

function run(cmd: string[], stdin?: Uint8Array): RunResult {
	const proc = Bun.spawnSync(cmd, {
		stdin: stdin ?? 'ignore',
		stdout: 'pipe',
		stderr: 'pipe'
	});
	return { code: proc.exitCode, stdout: proc.stdout, stderr: proc.stderr.toString() };
}

/** Runs `adb -s <serial> <args>` and returns stdout; throws on a non-zero exit. */
export function adb(args: string[], serial: string = SERIAL): string {
	const result = run(['adb', '-s', serial, ...args]);
	if (result.code !== 0) {
		throw new Error(`adb ${args.join(' ')} failed (${result.code}): ${result.stderr.trim()}`);
	}
	return new TextDecoder().decode(result.stdout);
}

/** Like `adb`, but never throws; used for polling. */
export function adbTry(args: string[]): string | null {
	const result = run(['adb', '-s', SERIAL, ...args]);
	return result.code === 0 ? new TextDecoder().decode(result.stdout) : null;
}

export function shell(command: string): string {
	return adb(['shell', command]);
}

export function isBooted(): boolean {
	return adbTry(['shell', 'getprop', 'sys.boot_completed'])?.trim() === '1';
}

export function requireBooted(): void {
	if (!isBooted()) fail(`emulator ${SERIAL} is not running; run \`bun run device:emulator\` first`);
}

export async function tap(x: number, y: number, settleMs = 900): Promise<void> {
	shell(`input tap ${Math.round(x)} ${Math.round(y)}`);
	await Bun.sleep(settleMs);
}

/**
 * Drags from (x, fromY) to (x, toY) and holds still before lifting, so the list stops exactly
 * where the finger stopped instead of flinging on.
 */
export async function drag(x: number, fromY: number, toY: number, settleMs = 700): Promise<void> {
	const steps = 12;
	const moves = Array.from({ length: steps }, (_, i) => {
		const y = Math.round(fromY + ((toY - fromY) * (i + 1)) / steps);
		return `input motionevent MOVE ${x} ${y}`;
	});
	shell(
		[
			`input motionevent DOWN ${x} ${fromY}`,
			...moves,
			'sleep 0.4',
			`input motionevent MOVE ${x} ${toY}`,
			`input motionevent UP ${x} ${toY}`
		].join('; ')
	);
	await Bun.sleep(settleMs);
}

/** A fast swipe that flings (used to jump back to the top of a page). */
export async function fling(x: number, fromY: number, toY: number, settleMs = 900): Promise<void> {
	shell(`input swipe ${x} ${fromY} ${x} ${toY} 120`);
	await Bun.sleep(settleMs);
}

/** A horizontal drag along one row (subtab bar). */
export async function dragHorizontal(y: number, fromX: number, toX: number): Promise<void> {
	shell(`input swipe ${fromX} ${y} ${toX} ${y} 500`);
	await Bun.sleep(900);
}

export interface Frame {
	width: number;
	height: number;
	/** Tightly packed RGBA rows. */
	rgba: Uint8Array;
}

/**
 * Grabs the framebuffer with `screencap` (raw mode, no PNG round trip). The raw header is
 * width, height, pixel format (1 = RGBA_8888) and, on API 28+, a colour-space word.
 */
export function screencap(): Frame {
	const result = run(['adb', '-s', SERIAL, 'exec-out', 'screencap']);
	if (result.code !== 0) throw new Error(`screencap failed: ${result.stderr.trim()}`);
	const view = new DataView(result.stdout.buffer, result.stdout.byteOffset, result.stdout.length);
	const width = view.getUint32(0, true);
	const height = view.getUint32(4, true);
	const format = view.getUint32(8, true);
	if (format !== 1) throw new Error(`unexpected screencap pixel format ${format}`);
	const header = result.stdout.length - width * height * 4;
	if (header !== 12 && header !== 16) {
		throw new Error(`unexpected screencap size ${result.stdout.length} for ${width}x${height}`);
	}
	return { width, height, rgba: result.stdout.subarray(header) };
}

export function pixel(frame: Frame, x: number, y: number): [number, number, number] {
	const i = (y * frame.width + x) * 4;
	return [frame.rgba[i], frame.rgba[i + 1], frame.rgba[i + 2]];
}

/**
 * How far the page content moved up between two frames (negative: down), over rows
 * [top, bottom). Compares per-row brightness profiles at every candidate offset, so ticking
 * numbers, which change a few pixels per row, do not read as a scroll.
 */
export function scrollShift(a: Frame, b: Frame, top: number, bottom: number): number {
	const profile = (frame: Frame) => {
		const rows = new Float64Array(bottom - top);
		for (let y = top; y < bottom; y++) {
			let sum = 0;
			for (let i = y * frame.width * 4, end = i + frame.width * 4; i < end; i += 8) {
				sum += frame.rgba[i] + frame.rgba[i + 1] + frame.rgba[i + 2];
			}
			rows[y - top] = sum / (frame.width / 2);
		}
		return rows;
	};
	const pa = profile(a);
	const pb = profile(b);
	const minOverlap = 400;
	let best = 0;
	let bestError = Infinity;
	for (let shift = -(pa.length - minOverlap); shift <= pa.length - minOverlap; shift++) {
		let error = 0;
		const from = Math.max(0, -shift);
		const to = Math.min(pb.length, pa.length - shift);
		for (let y = from; y < to; y++) error += Math.abs(pa[y + shift] - pb[y]);
		error /= to - from;
		if (
			error < bestError - 1e-9 ||
			(error <= bestError + 1e-9 && Math.abs(shift) < Math.abs(best))
		) {
			best = shift;
			bestError = error;
		}
	}
	return best;
}

/** Binary PPM (P6) of rows [top, bottom), the input format both cwebp and tesseract read. */
function toPpm(frame: Frame, top = 0, bottom = frame.height): Uint8Array {
	const header = new TextEncoder().encode(`P6\n${frame.width} ${bottom - top}\n255\n`);
	const out = new Uint8Array(header.length + frame.width * (bottom - top) * 3);
	out.set(header, 0);
	let o = header.length;
	for (let i = top * frame.width * 4, end = bottom * frame.width * 4; i < end; i += 4) {
		out[o++] = frame.rgba[i];
		out[o++] = frame.rgba[i + 1];
		out[o++] = frame.rgba[i + 2];
	}
	return out;
}

/** Writes the frame as WebP via `cwebp` (libwebp, from the devShell). */
export function writeWebp(frame: Frame, path: string, quality = 82): void {
	const tmp = join(CACHE_DIR, 'frame.ppm');
	writeFileSync(tmp, toPpm(frame));
	const result = run(['cwebp', '-quiet', '-q', String(quality), tmp, '-o', path]);
	if (result.code !== 0) throw new Error(`cwebp failed: ${result.stderr.trim()}`);
}

export interface Word {
	text: string;
	x: number;
	y: number;
	w: number;
	h: number;
}

/** OCR (tesseract, sparse-text mode) over rows [top, bottom); boxes are in screen pixels. */
export function ocr(frame: Frame, top = 0, bottom = frame.height): Word[] {
	const result = run(
		['tesseract', 'stdin', 'stdout', '--psm', '11', '-l', 'eng', 'tsv'],
		toPpm(frame, top, bottom)
	);
	if (result.code !== 0) throw new Error(`tesseract failed: ${result.stderr.trim()}`);
	const words: Word[] = [];
	for (const line of new TextDecoder().decode(result.stdout).split('\n').slice(1)) {
		const cols = line.split('\t');
		const text = cols[11]?.trim();
		if (!text || Number(cols[10]) < 40) continue;
		words.push({
			text,
			x: Number(cols[6]),
			y: Number(cols[7]) + top,
			w: Number(cols[8]),
			h: Number(cols[9])
		});
	}
	return words;
}

export interface Box {
	x: number;
	y: number;
	w: number;
	h: number;
	cx: number;
	cy: number;
}

/** Words that sit on one text line, left to right, with small gaps, joined into labels. */
export function lineLabels(words: Word[], maxGap = 28): { text: string; box: Box }[] {
	const sorted = [...words].sort((a, b) => a.y - b.y || a.x - b.x);
	const lines: Word[][] = [];
	for (const word of sorted) {
		const line = lines.find((l) => Math.abs(l[0].y + l[0].h / 2 - (word.y + word.h / 2)) < 14);
		if (line) line.push(word);
		else lines.push([word]);
	}
	const labels: { text: string; box: Box }[] = [];
	for (const line of lines) {
		line.sort((a, b) => a.x - b.x);
		let group: Word[] = [];
		const flush = () => {
			if (group.length === 0) return;
			const x = group[0].x;
			const y = Math.min(...group.map((w) => w.y));
			const right = Math.max(...group.map((w) => w.x + w.w));
			const bottom = Math.max(...group.map((w) => w.y + w.h));
			labels.push({
				text: group.map((w) => w.text).join(' '),
				box: { x, y, w: right - x, h: bottom - y, cx: (x + right) / 2, cy: (y + bottom) / 2 }
			});
			group = [];
		};
		for (const word of line) {
			const last = group.at(-1);
			if (last && word.x - (last.x + last.w) > maxGap) flush();
			group.push(word);
		}
		flush();
	}
	return labels;
}

/** Finds a phrase (case-insensitive, whole words, punctuation ignored, one line) on screen. */
export function findPhrase(words: Word[], phrase: string): Box | null {
	const clean = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '');
	const wanted = phrase.split(/\s+/).map(clean);
	for (const first of words) {
		if (clean(first.text) !== wanted[0]) continue;
		const run = [first];
		while (run.length < wanted.length) {
			const prev = run[run.length - 1];
			const next = words
				.filter((w) => w.x > prev.x && Math.abs(w.y + w.h / 2 - (prev.y + prev.h / 2)) < 14)
				.sort((a, b) => a.x - b.x)[0];
			if (!next || clean(next.text) !== wanted[run.length]) break;
			run.push(next);
		}
		if (run.length !== wanted.length) continue;
		const x = run[0].x;
		const y = Math.min(...run.map((w) => w.y));
		const right = Math.max(...run.map((w) => w.x + w.w));
		const bottom = Math.max(...run.map((w) => w.y + w.h));
		return { x, y, w: right - x, h: bottom - y, cx: (x + right) / 2, cy: (y + bottom) / 2 };
	}
	return null;
}

/**
 * The game's modal dialogs are a flat (34, 34, 34) panel from x≈30 to x≈930 over a dimmed
 * screen. Returns the panel's vertical extent, or null when no dialog is open.
 */
export function findDialog(frame: Frame): { top: number; bottom: number } | null {
	const isPanel = (x: number, y: number) => pixel(frame, x, y).every((c) => c === 34);
	let best: { top: number; bottom: number } | null = null;
	let start = -1;
	for (let y = 0; y <= frame.height; y++) {
		const inside = y < frame.height && isPanel(40, y) && isPanel(920, y) && !isPanel(10, y);
		if (inside && start < 0) start = y;
		if (!inside && start >= 0) {
			if (y - start > 150 && (!best || y - start > best.bottom - best.top)) {
				best = { top: start, bottom: y - 1 };
			}
			start = -1;
		}
	}
	return best;
}

/**
 * Closes open dialogs. Dialogs with a CANCEL button (import, prestige confirmations, …) are
 * cancelled; informational ones (changelog, cloud saving, "While you were away") are closed
 * with their CONFIRM/OK button. Returns how many it closed.
 */
export async function dismissDialogs(limit = 6): Promise<number> {
	let closed = 0;
	for (; closed < limit; closed++) {
		const frame = screencap();
		const dialog = findDialog(frame);
		if (!dialog) return closed;
		const words = ocr(frame, dialog.top, dialog.bottom + 1);
		const button =
			findPhrase(words, 'cancel') ??
			['confirm', 'ok', 'close', 'got it']
				.map((label) => findPhrase(words, label))
				.filter((box): box is Box => box !== null)
				.sort((a, b) => b.cy - a.cy)[0];
		if (!button) throw new Error(`dialog without a CANCEL/CONFIRM/OK button at y=${dialog.top}`);
		await tap(button.cx, button.cy, 1200);
	}
	return closed;
}

/**
 * Centres of the bottom navigation icons: columns with lit pixels (any channel above 80 on the
 * black bar; the green Reality icon is dark) inside the icon band, grouped into clusters.
 */
export function navIcons(frame: Frame): number[] {
	const [top, bottom] = BANDS.navIcons;
	const lit: boolean[] = [];
	for (let x = 0; x < frame.width; x++) {
		let on = false;
		for (let y = top; y < bottom && !on; y += 2) {
			on = Math.max(...pixel(frame, x, y)) > 80;
		}
		lit.push(on);
	}
	const centres: number[] = [];
	let start = -1;
	for (let x = 0; x <= frame.width; x++) {
		const on = x < frame.width && lit[x];
		if (on && start < 0) start = x;
		if (!on && start >= 0) {
			if (x - start >= 12) centres.push(Math.round((start + x - 1) / 2));
			start = -1;
		}
	}
	// Icons are a single glyph each; merge fragments closer than an icon width.
	return centres.reduce<number[]>((acc, c) => {
		const last = acc.at(-1);
		if (last !== undefined && c - last < 45) acc[acc.length - 1] = Math.round((last + c) / 2);
		else acc.push(c);
		return acc;
	}, []);
}

/**
 * Running emulators, as advertised by the emulator itself in
 * $XDG_RUNTIME_DIR/avd/running/pid_<pid>.ini (AVD name, ports, gRPC port and bearer token).
 */
export function runningEmulators(): Record<string, string>[] {
	const runtime = process.env.XDG_RUNTIME_DIR ?? `/run/user/${process.getuid?.() ?? 1000}`;
	const dir = join(runtime, 'avd', 'running');
	if (!existsSync(dir)) return [];
	return readdirSync(dir)
		.filter((name) => /^pid_\d+\.ini$/.test(name))
		.map((name) =>
			Object.fromEntries(
				readFileSync(join(dir, name), 'utf8')
					.split('\n')
					.filter((line) => line.includes('='))
					.map((line) => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1)])
			)
		);
}

/**
 * One unary call to the emulator's gRPC endpoint (android.emulation.control.EmulatorController),
 * over plain HTTP/2 with the advertised bearer token. `message` is an encoded protobuf; returns
 * the encoded response message.
 */
async function emulatorRpc(method: string, message: Uint8Array): Promise<Uint8Array> {
	const info = runningEmulators().find((ini) => ini['port.serial'] === String(EMULATOR_PORT));
	if (!info?.['grpc.port']) throw new Error(`no gRPC endpoint advertised for ${SERIAL}`);
	const frame = new Uint8Array(5 + message.length);
	new DataView(frame.buffer).setUint32(1, message.length);
	frame.set(message, 5);

	const client = connect(`http://127.0.0.1:${info['grpc.port']}`);
	const { promise, resolve, reject } = Promise.withResolvers<string | undefined>();
	const request = client.request({
		':method': 'POST',
		':path': `/android.emulation.control.EmulatorController/${method}`,
		'content-type': 'application/grpc',
		te: 'trailers',
		...(info['grpc.token'] ? { authorization: `Bearer ${info['grpc.token']}` } : {})
	});
	let status: string | undefined;
	const chunks: Buffer[] = [];
	request.on(
		'response',
		(headers) => (status ??= String(headers['grpc-status'] ?? '') || undefined)
	);
	request.on('trailers', (trailers) => (status = String(trailers['grpc-status'])));
	request.on('data', (chunk: Buffer) => chunks.push(chunk));
	request.on('end', () => resolve(status));
	request.on('error', reject);
	request.end(frame);
	try {
		const code = await promise;
		if (code !== '0') throw new Error(`${method} returned grpc-status ${code}`);
	} finally {
		client.close();
	}
	// Response: one gRPC frame (flag byte, big-endian length, message).
	return new Uint8Array(Buffer.concat(chunks).subarray(5));
}

/** Puts text on the emulator clipboard: `setClipboard(ClipData { string text = 1; })`. */
export async function setClipboard(text: string): Promise<void> {
	const bytes = new TextEncoder().encode(text);
	const varint: number[] = [];
	for (let n = bytes.length; ; n >>>= 7) {
		if (n < 0x80) {
			varint.push(n);
			break;
		}
		varint.push((n & 0x7f) | 0x80);
	}
	await emulatorRpc('setClipboard', new Uint8Array([0x0a, ...varint, ...bytes]));
}

/** Reads the emulator clipboard: `getClipboard(Empty) → ClipData { string text = 1; }`. */
export async function getClipboard(): Promise<string> {
	const message = await emulatorRpc('getClipboard', new Uint8Array());
	if (message.length === 0) return '';
	if (message[0] !== 0x0a) throw new Error('unexpected getClipboard response');
	let length = 0;
	let i = 1;
	for (let shift = 0; ; shift += 7) {
		const byte = message[i++];
		length += (byte & 0x7f) * 2 ** shift;
		if (byte < 0x80) break;
	}
	return new TextDecoder().decode(message.subarray(i, i + length));
}
