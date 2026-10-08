/**
 * `bun run device:export <out.txt>`
 *
 * Exports the emulator game's current save in web/Steam format: taps Options → Save & Load →
 * "Export to web/steam", which copies the save to the clipboard, and reads the clipboard over
 * the emulator's gRPC endpoint. Useful to turn a legacy (pre-Reality, "eyJ…") save into a
 * current `AntimatterDimensionsSavefileFormat…` string: import it with `device:load`, then
 * export it here.
 */
import { writeFileSync } from 'node:fs';
import {
	ACTIVITY,
	dismissDialogs,
	fail,
	getClipboard,
	requireBooted,
	setClipboard,
	shell,
	tapOptionsButton
} from './lib';

const out = process.argv[2];
if (!out) fail('usage: bun run device:export <out.txt>');
requireBooted();

shell(`am start -n ${ACTIVITY}`);
await Bun.sleep(1500);
await setClipboard('');
// The button reads "Export to / web/steam" on two lines; OCR matches one line at a time.
await tapOptionsButton('web/steam');
await Bun.sleep(1500);
await dismissDialogs();
const save = (await getClipboard()).trim();
if (!/^AntimatterDimensionsSavefileFormatAAB[0-9A-Za-z]+EndOfSavefile$/.test(save)) {
	fail(`the clipboard does not hold a web/Steam save (${save.slice(0, 60)}…)`);
}
writeFileSync(out, save);
console.log(`Wrote ${out} (${save.length} chars)`);
