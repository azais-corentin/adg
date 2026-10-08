/**
 * `bun run device:emulator [--restart] [--reinstall]`
 *
 * Creates the AVD if it is missing, boots it headless (unless it already runs), waits for boot
 * completion, prepares it for screenshots and installs the Android 3.18.0 APK splits pulled from
 * the phone (`bun run device:pull-apk`). See docs/device/EMULATOR.md.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, openSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	APK_DIR,
	APP_VERSION_CODE,
	AVD_HOME,
	AVD_NAME,
	EMULATOR_LOG,
	EMULATOR_PORT,
	PACKAGE,
	REPO_ROOT,
	SCREEN,
	SERIAL,
	adb,
	adbTry,
	apkSplits,
	fail,
	isBooted,
	shell
} from './lib';

const SYSTEM_IMAGE = 'system-images/android-35/google_apis/x86_64/';
const BOOT_TIMEOUT_MS = 300_000;

const args = new Set(process.argv.slice(2));

/** The Nix-built SDK (`.#android-sdk`), unless ANDROID_HOME already points at one with an emulator. */
function androidSdk(): string {
	const fromEnv = process.env.ANDROID_HOME;
	if (fromEnv && existsSync(join(fromEnv, 'emulator', 'emulator'))) return fromEnv;
	console.log('Building the Android SDK (nix build .#android-sdk)…');
	const build = Bun.spawnSync(
		['nix', 'build', `${REPO_ROOT}#android-sdk`, '--no-link', '--print-out-paths'],
		{
			stdout: 'pipe',
			stderr: 'inherit'
		}
	);
	if (build.exitCode !== 0) fail('nix build .#android-sdk failed');
	return join(build.stdout.toString().trim(), 'libexec', 'android-sdk');
}

/** Writes the AVD by hand: avdmanager needs a JDK and adds nothing we need. */
function ensureAvd(sdk: string): void {
	const avdDir = join(AVD_HOME, `${AVD_NAME}.avd`);
	if (existsSync(join(avdDir, 'config.ini'))) return;
	if (!existsSync(join(sdk, SYSTEM_IMAGE, 'system.img'))) fail(`system image missing in ${sdk}`);
	mkdirSync(avdDir, { recursive: true });
	writeFileSync(
		join(AVD_HOME, `${AVD_NAME}.ini`),
		`avd.ini.encoding=UTF-8\npath=${avdDir}\npath.rel=avd/${AVD_NAME}.avd\ntarget=android-35\n`
	);
	const config: Record<string, string> = {
		AvdId: AVD_NAME,
		'avd.ini.displayname': AVD_NAME,
		'avd.ini.encoding': 'UTF-8',
		'abi.type': 'x86_64',
		'hw.cpu.arch': 'x86_64',
		'hw.cpu.ncore': '4',
		'hw.ramSize': '4096',
		'vm.heapSize': '512',
		'disk.dataPartition.size': '6G',
		'image.sysdir.1': SYSTEM_IMAGE,
		'tag.id': 'google_apis',
		'tag.display': 'Google APIs',
		'PlayStore.enabled': 'false',
		'hw.lcd.width': String(SCREEN.width),
		'hw.lcd.height': String(SCREEN.height),
		'hw.lcd.density': String(SCREEN.density),
		'hw.keyboard': 'yes',
		'hw.mainKeys': 'no',
		'hw.gpu.enabled': 'yes',
		'hw.gpu.mode': 'swiftshader_indirect',
		'hw.audioInput': 'no',
		'hw.audioOutput': 'no',
		'hw.camera.back': 'none',
		'hw.camera.front': 'none',
		showDeviceFrame: 'no',
		'fastboot.forceColdBoot': 'no'
	};
	writeFileSync(
		join(avdDir, 'config.ini'),
		Object.entries(config)
			.map(([key, value]) => `${key}=${value}`)
			.join('\n') + '\n'
	);
	console.log(`Created AVD ${AVD_NAME} in ${AVD_HOME}`);
}

async function boot(sdk: string): Promise<void> {
	const started = Date.now();
	const log = openSync(EMULATOR_LOG, 'w');
	const child = spawn(
		join(sdk, 'emulator', 'emulator'),
		[
			'-avd',
			AVD_NAME,
			'-port',
			String(EMULATOR_PORT),
			'-no-window',
			'-no-audio',
			'-no-boot-anim',
			'-gpu',
			'swiftshader_indirect',
			'-accel',
			'on',
			'-no-metrics'
		],
		{
			detached: true,
			stdio: ['ignore', log, log],
			env: { ...process.env, ANDROID_SDK_ROOT: sdk, ANDROID_HOME: sdk, ANDROID_AVD_HOME: AVD_HOME }
		}
	);
	child.unref();
	console.log(`Booting ${AVD_NAME} as ${SERIAL} (pid ${child.pid}, log ${EMULATOR_LOG})…`);
	while (!isBooted()) {
		if (Date.now() - started > BOOT_TIMEOUT_MS) fail(`boot timed out; see ${EMULATOR_LOG}`);
		if (child.exitCode !== null)
			fail(`emulator exited with ${child.exitCode}; see ${EMULATOR_LOG}`);
		await Bun.sleep(2000);
	}
	console.log(`Booted in ${((Date.now() - started) / 1000).toFixed(1)}s`);
}

/**
 * Stable, animation-free UI so consecutive screenshots only differ where the game changes;
 * no on-screen keyboard (pasting needs no IME, and a keyboard would cover dialogs); no
 * "Viewing full screen" hint over the game.
 */
function prepare(): void {
	for (const scale of [
		'window_animation_scale',
		'transition_animation_scale',
		'animator_duration_scale'
	]) {
		shell(`settings put global ${scale} 0`);
	}
	shell('settings put system screen_off_timeout 2147483647');
	shell('settings put secure immersive_mode_confirmations confirmed');
	shell('svc power stayon true');
	shell('input keyevent KEYCODE_WAKEUP');
	shell('wm dismiss-keyguard');
	for (const ime of shell('ime list -s').split('\n')) {
		if (ime.trim()) shell(`ime disable ${ime.trim()}`);
	}
}

function install(): void {
	const installed = adbTry(['shell', 'dumpsys', 'package', PACKAGE]) ?? '';
	if (!args.has('--reinstall') && installed.includes(`versionCode=${APP_VERSION_CODE}`)) {
		console.log(`${PACKAGE} ${APP_VERSION_CODE} already installed`);
		return;
	}
	const splits = apkSplits();
	if (splits.length === 0)
		fail(`no APK splits in ${APK_DIR}; run \`bun run device:pull-apk\` first`);
	console.log(`Installing ${splits.length} splits…`);
	adb(['install-multiple', '-r', '-g', ...splits]);
	console.log(`Installed ${PACKAGE}`);
}

const sdk = androidSdk();
mkdirSync(AVD_HOME, { recursive: true });
ensureAvd(sdk);
if (args.has('--restart') && isBooted()) {
	adbTry(['emu', 'kill']);
	while (adbTry(['get-state']) !== null) await Bun.sleep(1000);
}
if (isBooted()) console.log(`${SERIAL} already running`);
else await boot(sdk);
prepare();
install();
console.log(`Ready: ${SERIAL}`);
