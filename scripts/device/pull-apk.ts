/**
 * `bun run device:pull-apk <phone-serial>`
 *
 * Copies the installed Antimatter Dimensions APK splits from the phone into
 * ~/.cache/adg/apk/3.18.0/ (outside the repo; the APK is never committed). Read-only on the
 * phone: only `pm path`, `dumpsys package` and `adb pull`.
 */
import { mkdirSync } from 'node:fs';
import { APK_DIR, APP_VERSION_CODE, PACKAGE, adb, fail } from './lib';

const serial = process.argv[2] ?? process.env.ADG_PHONE_SERIAL;
if (!serial) fail('usage: bun run device:pull-apk <phone adb serial> (or set ADG_PHONE_SERIAL)');

const info = adb(['shell', 'dumpsys', 'package', PACKAGE], serial);
if (!info.includes(`versionCode=${APP_VERSION_CODE}`)) {
	fail(`${serial} does not have ${PACKAGE} versionCode ${APP_VERSION_CODE} installed`);
}
const paths = adb(['shell', 'pm', 'path', PACKAGE], serial)
	.split('\n')
	.map((line) => line.trim().replace(/^package:/, ''))
	.filter((line) => line.endsWith('.apk'));
mkdirSync(APK_DIR, { recursive: true });
for (const path of paths) {
	adb(['pull', path, APK_DIR], serial);
	console.log(`pulled ${path.split('/').pop()}`);
}
console.log(`${paths.length} splits in ${APK_DIR}`);
