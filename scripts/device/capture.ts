/**
 * `bun run device:capture <stage> [tab…]`
 *
 * Screenshots every tab, subtab and scroll page of the game running in the emulator into
 * static/screens/<stage>/<tab>-<subtab>-<page>.webp (`top` when the page does not scroll,
 * otherwise 0, 1, …). Load a save first with `bun run device:load`. Optional tab names limit
 * the run (e.g. `bun run device:capture ra celestials reality`).
 *
 * It only ever taps bottom-navigation icons and subtab labels and only drags along the left
 * screen edge, so it never presses prestige buttons (Eternity, B.Crunch, D.Boost, A.Galaxy,
 * R.Galaxy, Max), upgrades or Time Study nodes. See docs/device/EMULATOR.md.
 */
import { mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { isStageId } from '../../src/lib/stages';
import {
	BANDS,
	REPO_ROOT,
	dismissDialogs,
	drag,
	dragHorizontal,
	fail,
	fling,
	scrollShift,
	lineLabels,
	navIcons,
	ocr,
	requireBooted,
	screencap,
	tap,
	writeWebp,
	type Frame
} from './lib';

/**
 * Bottom navigation, left to right, when every tab is unlocked. Locked tabs are simply
 * missing; they unlock in this order, and the last five are always present.
 */
const OPTIONAL_TABS = ['autobuyers', 'challenges', 'infinity', 'eternity', 'reality', 'celestials'];
const FIXED_TABS = ['achievements', 'statistics', 'options', 'shop', 'info'];

/** Subtab label (lowercased, as OCR reads it) expected first on known tabs; used as a sanity check. */
const FIRST_SUBTAB: Record<string, string> = {
	dimensions: 'antimatter',
	options: 'options',
	statistics: 'stats'
};

/**
 * Pages that must not be dragged: the Time Study tree and the Perk tree pan instead of
 * scrolling, and a hold on a study buys it.
 */
const NO_SCROLL = new Set(['eternity-studies', 'reality-perks']);

/** Drags happen along the left edge, where no game control lives. */
const DRAG_X = 5;
const CONTENT_TOP = BANDS.ticker[1];
const CONTENT_BOTTOM = BANDS.prestige[0];
/** Each page scrolls by this much, leaving ~650 px of overlap with the previous one. */
const PAGE_STEP = 1000;
/** A drag that moves the content less than this has hit the end of the page. */
const MIN_SHIFT = 24;
const MAX_PAGES = 40;

const slug = (label: string) => label.toLowerCase().replace(/[^a-z0-9]/g, '');

function tabNames(count: number): string[] {
	const optional = count - 1 - FIXED_TABS.length;
	if (optional < 0 || optional > OPTIONAL_TABS.length) fail(`unexpected ${count} navigation tabs`);
	return ['dimensions', ...OPTIONAL_TABS.slice(0, optional), ...FIXED_TABS];
}

function subtabLabels(): { text: string; cx: number; cy: number }[] {
	const [top, bottom] = BANDS.subtabs;
	return lineLabels(ocr(screencap(), top, bottom), 40)
		.filter((label) => /[a-z]/i.test(label.text))
		.map((label) => ({ text: label.text, cx: label.box.cx, cy: label.box.cy }))
		.sort((a, b) => a.cx - b.cx);
}

/** Scrolls the current page back to its top. */
async function scrollToTop(): Promise<void> {
	for (let i = 0; i < 20; i++) {
		const before = screencap();
		await fling(DRAG_X, CONTENT_TOP + 100, CONTENT_BOTTOM - 50, 700);
		const shift = scrollShift(before, screencap(), CONTENT_TOP, CONTENT_BOTTOM);
		if (Math.abs(shift) < MIN_SHIFT) return;
	}
}

/** Captures one subtab, page by page, stopping when a drag no longer moves the page. */
async function capturePages(name: string): Promise<Frame[]> {
	if (NO_SCROLL.has(name)) return [screencap()];
	await scrollToTop();
	const pages = [screencap()];
	while (pages.length < MAX_PAGES) {
		const from = CONTENT_BOTTOM - 150;
		await drag(DRAG_X, from, from - PAGE_STEP);
		const next = screencap();
		const shift = scrollShift(pages[pages.length - 1], next, CONTENT_TOP, CONTENT_BOTTOM);
		if (Math.abs(shift) < MIN_SHIFT) break;
		pages.push(next);
	}
	await scrollToTop();
	return pages;
}

function save(outDir: string, tab: string, subtab: string, pages: Frame[]): void {
	const prefix = `${tab}-${subtab}-`;
	for (const file of readdirSync(outDir)) {
		if (file.startsWith(prefix) && /^(top|\d+)\.webp$/.test(file.slice(prefix.length))) {
			rmSync(join(outDir, file));
		}
	}
	pages.forEach((frame, i) => {
		const file = `${prefix}${pages.length === 1 ? 'top' : i}.webp`;
		writeWebp(frame, join(outDir, file));
		console.log(`  ${file}`);
	});
}

async function captureTab(outDir: string, tab: string, x: number): Promise<void> {
	await dismissDialogs();
	await tap(x, (BANDS.navIcons[0] + BANDS.navIcons[1]) / 2, 1500);
	// Bring a horizontally scrolled subtab bar back to its start.
	const barY = Math.round((BANDS.subtabs[0] + BANDS.subtabs[1]) / 2);
	await dragHorizontal(barY, 150, 900);
	let labels = subtabLabels();
	if (labels.length === 0) fail(`no subtab labels under tab ${tab}`);
	const expected = FIRST_SUBTAB[tab];
	if (expected && slug(labels[0].text) !== expected) {
		fail(`tab ${tab} starts with subtab "${labels[0].text}", expected "${expected}"`);
	}
	const visited = new Set<string>();
	for (let round = 0; round < 6; round++) {
		const pending = labels.filter((label) => !visited.has(slug(label.text)));
		if (pending.length === 0) {
			// Look for subtabs hidden past the right edge of the bar.
			await dragHorizontal(barY, 800, 160);
			labels = subtabLabels();
			if (labels.every((label) => visited.has(slug(label.text)))) break;
			continue;
		}
		const label = pending[0];
		visited.add(slug(label.text));
		await dismissDialogs();
		await tap(label.cx, label.cy, 1500);
		const only = round === 0 && labels.length === 1;
		const subtab = only && slug(label.text) !== 'antimatter' ? 'main' : slug(label.text);
		console.log(`${tab} / ${label.text}`);
		save(outDir, tab, subtab, await capturePages(`${tab}-${subtab}`));
		labels = subtabLabels();
	}
}

const [stage, ...onlyTabs] = process.argv.slice(2);
if (!isStageId(stage))
	fail(`usage: bun run device:capture <stage id from src/lib/stages.ts> [tab…]`);
requireBooted();

const outDir = join(REPO_ROOT, 'static', 'screens', stage);
mkdirSync(outDir, { recursive: true });
await dismissDialogs();
const icons = navIcons(screencap());
const names = tabNames(icons.length);
console.log(`${icons.length} tabs: ${names.join(', ')}`);
for (const [i, tab] of names.entries()) {
	if (onlyTabs.length > 0 && !onlyTabs.includes(tab)) continue;
	await captureTab(outDir, tab, icons[i]);
}
console.log(`Screens in ${outDir}`);
