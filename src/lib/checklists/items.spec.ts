import { describe, expect, it } from 'vitest';
import { importSave } from '#lib/save/index.ts';
import { readFixture } from '#lib/save/test-fixtures.ts';
import { STAGE_IDS } from '#lib/stages.ts';
import { CHECKLIST, stageItems } from './items.ts';
import { itemStatus, stageProgress } from './status.ts';

async function ticked(fixture: string): Promise<Set<string>> {
	const save = await importSave(readFixture(fixture));
	return new Set(CHECKLIST.filter((item) => item.auto?.(save)).map((item) => item.id));
}

describe('checklist items', () => {
	it('covers every stage with unique ids', () => {
		for (const stage of STAGE_IDS) expect(stageItems(stage).length).toBeGreaterThan(0);
		expect(new Set(CHECKLIST.map((item) => item.id)).size).toBe(CHECKLIST.length);
	});

	it('fills thresholds from the game data', () => {
		const text = CHECKLIST.map((item) => `${item.text} ${item.detail ?? ''}`).join('\n');
		expect(text).not.toMatch(/undefined|NaN/);
		expect(text).toContain('20,000 Eternities and 30 Time Theorems');
		expect(text).toContain("Unlock Teresa's Reality (pour 1e14 RM)");
	});
});

describe('auto ticks from real saves', () => {
	it.each([
		'android-3.18.0-native-eternity-paired.txt',
		'android-3.18.0-web-export-eternity-paired.txt'
	])('%s: first Eternity and Break Infinity, not EC1', async (fixture) => {
		const done = await ticked(fixture);
		expect(done).toContain('rep-eternity');
		expect(done).toContain('inf-break');
		expect(done).toContain('rep-all-ic');
		expect(done).not.toContain('et-ec1');
		expect(done).not.toContain('et-100-eternities');
		expect(done).not.toContain('ec-unlock-dilation');
	});

	it('pre-Break save: first Infinity only', async () => {
		const done = await ticked('android-3.17.0-native-pre-break.txt');
		expect(done).toContain('pre-inf-infinity');
		expect(done).toContain('pre-inf-8th-dimension');
		expect(done).not.toContain('inf-16-infinities');
		expect(done).not.toContain('inf-crunch-autobuyer');
		expect(done).not.toContain('inf-break');
	});

	it('2-Galaxy save: Boosts reset by the Galaxies still count as the 8th Dimension unlocked', async () => {
		const done = await ticked('community/pre-infinity.txt');
		expect(done).toContain('pre-inf-first-boost');
		expect(done).toContain('pre-inf-8th-dimension');
		expect(done).toContain('pre-inf-first-galaxy');
		expect(done).not.toContain('pre-inf-infinity');
	});

	it('Broken Infinity save: Sacrifice counts as used (Normal Challenge 8 is done)', async () => {
		const done = await ticked('community/break-infinity.txt');
		expect(stageItems('pre-infinity').every((item) => done.has(item.id))).toBe(true);
	});

	it('pre-Eternity save: Replicanti Galaxy but no Eternity yet', async () => {
		const done = await ticked('android-3.18.0-native-pre-eternity.txt');
		expect(done).toContain('break-replicanti');
		expect(done).toContain('rep-galaxy');
		expect(done).not.toContain('rep-eternity');
	});

	it('first Reality: earlier layers stay ticked although Reality re-locked achievements', async () => {
		const done = await ticked('community/early-reality-first.txt');
		expect(done).toContain('rep-all-ic');
		expect(done).toContain('ec-unlock-dilation');
		expect(done).toContain('late-first-reality');
		expect(done).not.toContain('late-achievements');
		expect(done).not.toContain('real-upgrades');
	});

	it('Teresa save: unlocks follow the RM poured', async () => {
		const done = await ticked('community/teresa.txt');
		expect(done).toContain('real-upgrades');
		expect(done).toContain('teresa-run');
		expect(done).toContain('teresa-complete');
		expect(done).not.toContain('teresa-epGen');
		expect(done).not.toContain('teresa-effarig');
	});

	it("Nameless save: stored game time and their Reality, V's tab open but V locked", async () => {
		const done = await ticked('community/nameless.txt');
		expect(done).toContain('nameless-store-time');
		expect(done).toContain('nameless-unlock-run');
		expect(done).toContain('nameless-complete');
		expect(done).toContain('nameless-ach151');
		expect(done).not.toContain('v-unlock');
	});

	it('Ra save: memory unlocks, no Imaginary Machines yet', async () => {
		const done = await ticked('community/ra.txt');
		expect(done).toContain('v-36');
		expect(done).toContain('ra-unlockHardV');
		expect(done).not.toContain('ra-imaginary-machines');
		expect(done).toContain('nameless-complete');
		expect(done).not.toContain('im-upgrade-11');
	});

	it("Lai'tela save: Imaginary Upgrades bought, Lai'tela only partly destabilized", async () => {
		const done = await ticked('community/laitela.txt');
		expect(done).toContain('im-first-upgrades');
		expect(done).toContain('im-upgrade-11');
		expect(done).not.toContain('laitela-destabilize');
	});

	it('Doomed save: Pelle progress and ECs cleared before Doom', async () => {
		const done = await ticked('community/pelle.txt');
		expect(done).toContain('laitela-doom');
		expect(done).toContain('laitela-destabilize');
		expect(done).toContain('pelle-remnants');
		expect(done).toContain('pelle-strike-3');
		expect(done).toContain('late-all-ec');
		expect(done).not.toContain('pelle-end');
	});
});

describe('status', () => {
	const item = CHECKLIST.find((i) => i.id === 'inf-break');
	const manualOnly = CHECKLIST.find((i) => i.id === 'dil-galaxy-threshold');
	if (!item || !manualOnly) throw new Error('fixture items missing');

	it('a save that shows the item done wins over manual ticks', async () => {
		const save = await importSave(readFixture('android-3.18.0-native-eternity-paired.txt'));
		expect(itemStatus(item, save, {})).toBe('auto');
		expect(itemStatus(item, save, { 'inf-break': true })).toBe('auto');
	});

	it('falls back to manual ticks without a save or when the save does not show it', async () => {
		const save = await importSave(readFixture('android-3.17.0-native-pre-break.txt'));
		expect(itemStatus(item, null, { 'inf-break': true })).toBe('manual');
		expect(itemStatus(item, save, { 'inf-break': true })).toBe('manual');
		expect(itemStatus(item, save, {})).toBe('open');
		expect(itemStatus(manualOnly, save, { 'dil-galaxy-threshold': true })).toBe('manual');
	});

	it('counts auto and manual ticks per stage', async () => {
		const save = await importSave(readFixture('android-3.17.0-native-pre-break.txt'));
		const total = stageItems('early-infinity').length;
		const auto = stageItems('early-infinity').filter((i) => i.auto?.(save)).length;
		expect(stageProgress('early-infinity', save, {})).toEqual({ done: auto, total });
		expect(stageProgress('early-infinity', save, { 'inf-break': true })).toEqual({
			done: auto + 1,
			total
		});
		expect(stageProgress('early-infinity', null, {})).toEqual({ done: 0, total });
	});

	it('a save past a stage completes every item of it, even ones a Reality reset', async () => {
		const save = await importSave(readFixture('community/effarig.txt'));
		expect(itemStatus(manualOnly, save, {})).toBe('implied');
		for (const stage of STAGE_IDS.slice(0, STAGE_IDS.indexOf('effarig'))) {
			const { done, total } = stageProgress(stage, save, {});
			expect(done, stage).toBe(total);
		}
		expect(stageProgress('effarig', save, {}).done).toBeLessThan(stageItems('effarig').length);
	});
});
