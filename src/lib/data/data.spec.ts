import { describe, expect, it } from 'vitest';
import { STAGES } from '../stages';
import {
	achievements,
	automator,
	celestials,
	challenges,
	dilationUpgrades,
	eternity,
	glyphs,
	h2p,
	infinityUpgrades,
	perks,
	progressStages,
	realityUpgrades,
	timeStudies,
	type TimeStudyRef
} from './index';

const DATASETS = {
	achievements,
	automator,
	celestials,
	challenges,
	dilationUpgrades,
	eternity,
	glyphs,
	h2p,
	infinityUpgrades,
	perks,
	progressStages,
	realityUpgrades,
	timeStudies
};

const DECIMAL = /^-?\d+(\.\d+)?(e-?\d+)?$/;

describe('extracted game data', () => {
	it('comes from one pinned upstream commit', () => {
		const shas = new Set(Object.values(DATASETS).map((d) => d.source.sha));
		expect([...shas]).toHaveLength(1);
		expect([...shas][0]).toMatch(/^[0-9a-f]{40}$/);
		for (const dataset of Object.values(DATASETS))
			expect(dataset.source.files.length).toBeGreaterThan(0);
	});

	it('has a full 18×8 achievement grid plus secret achievements', () => {
		const ids = achievements.normal.map((a) => a.id);
		const expected = Array.from({ length: 18 }, (_, r) =>
			Array.from({ length: 8 }, (_, c) => (r + 1) * 10 + c + 1)
		).flat();
		expect(ids).toEqual(expected);
		expect(achievements.normal.find((a) => a.id === 147)?.reward).toContain('Teresa');
		expect(achievements.secret.length).toBeGreaterThan(0);
		for (const a of [...achievements.normal, ...achievements.secret]) {
			expect(a.row).toBe(Math.floor(a.id / 10));
			expect(a.name.length).toBeGreaterThan(0);
			expect(a.description ?? a.descriptionSource).toBeTruthy();
		}
	});

	it('has 12 normal, 8 infinity and 12 eternity challenges with known goals', () => {
		expect(challenges.normal.map((c) => c.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
		expect(challenges.infinity.map((c) => c.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
		expect(challenges.eternity.map((c) => c.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
		const ec1 = challenges.eternity[0];
		expect(ec1.goal).toBe('1e1800');
		expect(ec1.goals).toEqual(['1e1800', '1e2000', '1e2200', '1e2400', '1e2600']);
		expect(ec1.unlock).toMatchObject({ cost: 30, requires: [171] });
		expect(ec1.unlock.secondary).toEqual({
			kind: 'resource',
			resource: 'Eternities',
			amounts: ['20000', '40000', '60000', '80000', '100000']
		});
		expect(challenges.infinity[0]).toMatchObject({ goal: '1e650', unlockAntimatter: '1e2000' });
		for (const ec of challenges.eternity) {
			expect(ec.goals).toHaveLength(5);
			for (const goal of ec.goals) expect(goal).toMatch(DECIMAL);
		}
	});

	it('has a consistent time study tree', () => {
		const normalIds = new Set(timeStudies.normal.map((s) => s.id));
		expect(normalIds.size).toBe(timeStudies.normal.length);
		for (const id of [11, 21, 22, 171, 181, 234, 301, 304]) expect(normalIds.has(id)).toBe(true);
		for (const study of timeStudies.normal) {
			for (const id of [...study.requires, ...study.requiresST])
				expect(normalIds.has(id)).toBe(true);
			// Triad studies cost Space Theorems only.
			expect(study.cost > 0 || (study.isTriad && (study.stCost ?? 0) > 0)).toBe(true);
		}
		for (const ec of timeStudies.eternityChallenges) {
			for (const id of ec.requires) expect(normalIds.has(id)).toBe(true);
		}
		expect(timeStudies.normal.find((s) => s.id === 21)?.requires).toEqual([11]);
		expect(timeStudies.normal.find((s) => s.id === 71)?.path).toBe('antimatter-dim');
		expect(timeStudies.dilation.map((s) => s.key)).toEqual([
			'dilation',
			'td5',
			'td6',
			'td7',
			'td8',
			'reality'
		]);

		const exists = (ref: TimeStudyRef) =>
			ref.kind === 'normal'
				? normalIds.has(ref.id)
				: ref.kind === 'ec'
					? timeStudies.eternityChallenges.some((s) => s.id === ref.id)
					: timeStudies.dilation.some((s) => s.id === ref.id);
		for (const c of timeStudies.connections) {
			expect(exists(c.from)).toBe(true);
			expect(exists(c.to)).toBe(true);
		}
		const layout = timeStudies.layouts.find((l) => l.type === 'NORMAL');
		const normalCells = layout?.cells
			.filter((c) => c.study.kind === 'normal')
			.map((c) => c.study.id);
		const nonTriad = timeStudies.normal.filter((s) => !s.isTriad).map((s) => s.id);
		expect(normalCells?.toSorted((a, b) => a - b)).toEqual(nonTriad.toSorted((a, b) => a - b));
		const triadLayout = timeStudies.layouts.find((l) => l.type === 'ALTERNATIVE_TRIAD_STUDIES');
		expect(
			triadLayout?.cells.filter((c) => c.study.kind === 'normal' && c.study.id > 300)
		).toHaveLength(4);
		for (const l of timeStudies.layouts) {
			for (const cell of l.cells) {
				expect(exists(cell.study)).toBe(true);
				expect(cell.x + cell.width).toBeLessThanOrEqual(l.width);
			}
		}
	});

	it('has a connected, symmetric perk tree rooted at START', () => {
		const byId = new Map(perks.perks.map((p) => [p.id, p]));
		for (const perk of perks.perks) {
			for (const other of perk.connections) expect(byId.get(other)?.connections).toContain(perk.id);
			expect(perk.positions).toHaveLength(perks.layouts.length);
		}
		const seen = new Set([0]);
		const queue = [0];
		for (let id = queue.shift(); id !== undefined; id = queue.shift()) {
			for (const next of byId.get(id)?.connections ?? []) {
				if (!seen.has(next)) {
					seen.add(next);
					queue.push(next);
				}
			}
		}
		expect(seen.size).toBe(perks.perks.length);
		expect(perks.layouts.some((l) => l.name === 'Android Layout')).toBe(true);
	});

	it('maps every upstream progress stage onto the stage model', () => {
		expect(progressStages.stages.map((s) => s.stageId)).toEqual(STAGES.map((s) => s.id));
	});

	it('covers upgrades, glyphs, celestials, h2p and automator', () => {
		expect(infinityUpgrades.upgrades.length).toBeGreaterThan(10);
		expect(infinityUpgrades.breakUpgrades.filter((u) => u.rebuyable)).toHaveLength(3);
		expect(eternity.upgrades).toHaveLength(6);
		expect(eternity.milestones[0].eternities).toBe(1);
		expect(dilationUpgrades.upgrades.length).toBeGreaterThan(10);
		expect(realityUpgrades.upgrades.map((u) => u.id)).toEqual(
			Array.from({ length: 25 }, (_, i) => i + 1)
		);
		expect(realityUpgrades.imaginaryUpgrades).toHaveLength(25);
		expect(glyphs.types.map((t) => t.id)).toEqual(
			expect.arrayContaining(['time', 'dilation', 'replication', 'infinity', 'power'])
		);
		// `timeshardpow` has no types: upstream adds it to Time glyphs once unlocked.
		const typeIds = glyphs.types.map((t) => t.id);
		for (const effect of glyphs.effects) {
			for (const type of effect.glyphTypes) expect(typeIds).toContain(type);
		}
		expect(celestials.celestials.map((c) => c.id)).toEqual([
			'teresa',
			'effarig',
			'nameless',
			'v',
			'ra',
			'laitela',
			'pelle'
		]);
		expect(h2p.articles.length).toBeGreaterThan(40);
		for (const article of h2p.articles) expect(article.info ?? article.infoSource).toBeTruthy();
		expect(automator.commands.some((c) => c.keyword === 'STUDIES LOAD')).toBe(true);
	});
});
