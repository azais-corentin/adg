import { describe, expect, it } from 'vitest';
import { timeStudies } from '#lib/data/index.ts';
import type { NormalizedSave } from '#lib/save/types.ts';
import {
	affordable,
	check,
	contextFromSave,
	DEFAULT_CONTEXT,
	dimensionPaths,
	EMPTY_TREE,
	evaluate,
	isConnectionHidden,
	laidOutTree,
	layoutType,
	pacePaths,
	PERK,
	toggle,
	type Tree,
	type TreeContext
} from './tree.ts';

const ABOVE_SPLIT = [11, 21, 22, 31, 32, 33, 41, 42, 51, 61];
const ctx = DEFAULT_CONTEXT;
const build = (studies: number[], ec = 0, context: TreeContext = ctx) =>
	evaluate({ studies, ec }, context);
const normal = (id: number) => ({ kind: 'normal', id }) as const;

describe('prerequisites', () => {
	it('drops studies whose prerequisites are missing, in order', () => {
		const { tree, skipped } = build([21, 11, 21, 31]);
		expect(tree.studies).toEqual([11, 21, 31]);
		expect(skipped).toEqual([{ ref: normal(21), reason: 'Needs study 11.' }]);
	});

	it('accepts either prerequisite for at-least-one studies', () => {
		expect(build([11, 22, 32, 42, 51]).tree.studies).toEqual([11, 22, 32, 42, 51]);
		expect(build([11, 21, 31, 41, 51]).tree.studies).toEqual([11, 21, 31, 41, 51]);
	});

	it('removing a study drops everything that relied on it', () => {
		const start = build([...ABOVE_SPLIT, 71, 81]).tree;
		const result = toggle(start, normal(51), ctx);
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.tree.studies).toEqual([11, 21, 22, 31, 32, 33, 41, 42]);
		expect(result.skipped.map((s) => s.ref)).toEqual([normal(61), normal(71), normal(81)]);
	});

	it('gates 62, 181 and 191 on EC completions or perks', () => {
		const none: TreeContext = { ...ctx, completedECs: [] };
		expect(check(build(ABOVE_SPLIT, 0, none).tree, normal(62), none)).toEqual({
			ok: false,
			reason: 'Needs EC5 completed once (or the perk that bypasses its lock).'
		});
		const perk: TreeContext = { ...none, perks: [PERK.bypassEC5Lock] };
		expect(check(build(ABOVE_SPLIT, 0, perk).tree, normal(62), perk).ok).toBe(true);

		const to171 = [...ABOVE_SPLIT, 71, 81, 91, 101, 111, 121, 131, 141, 151, 161, 171];
		const partial: TreeContext = { ...none, completedECs: [1], perks: [PERK.bypassEC3Lock] };
		const verdict = check(build(to171, 0, partial).tree, normal(181), partial);
		expect(verdict).toEqual({
			ok: false,
			reason: 'Needs EC2 completed once (or the perks that bypass their locks).'
		});
		expect(check(build([...to171, 181]).tree, normal(191), none).ok).toBe(false);
	});
});

describe('Dimension paths', () => {
	it('allows one path, two after 201, three with the Dilation upgrade', () => {
		const one = build([...ABOVE_SPLIT, 71, 72, 73]);
		expect(one.tree.studies.slice(-1)).toEqual([71]);
		expect(one.skipped.map((s) => s.reason)).toEqual([
			'Only one Dimension path (71–103) until you buy study 201.',
			'Only one Dimension path (71–103) until you buy study 201.'
		]);
		expect(dimensionPaths(one.tree)).toEqual(['Antimatter Dims']);

		const to201 = [...ABOVE_SPLIT, 73, 83, 93, 103, 111, 123, 133, 143, 151, 161, 162, 171];
		const two = build([...to201, 181, 191, 192, 193, 201, 71, 72]);
		expect(two.tree.studies).toContain(71);
		expect(two.tree.studies).not.toContain(72);
		expect(dimensionPaths(two.tree)).toEqual(['Antimatter Dims', 'Time Dims']);

		const split: TreeContext = { ...ctx, dimensionSplit: true };
		const three = build([...ABOVE_SPLIT, 71, 72, 73], 0, split);
		expect(three.skipped).toEqual([]);
	});

	it('order matters: a second path listed before 201 is skipped, as in the game', () => {
		const ids = [
			...ABOVE_SPLIT,
			71,
			72,
			81,
			91,
			101,
			111,
			121,
			131,
			141,
			151,
			161,
			171,
			181,
			192,
			201
		];
		const { tree } = build(ids);
		expect(tree.studies).not.toContain(72);
		expect(tree.studies).toContain(201);
	});

	it('locks 71/72/73 while EC11 or EC12 is in the build, unless the perk is owned', () => {
		const tree: Tree = { ...build(ABOVE_SPLIT).tree, ec: 12 };
		expect(check(tree, normal(71), ctx)).toEqual({
			ok: false,
			reason: "Can't be bought while EC12 is unlocked."
		});
		expect(check(tree, normal(73), ctx).ok).toBe(true);
		const perk = { ...ctx, perks: [PERK.studyECRequirement] };
		expect(check(tree, normal(71), perk).ok).toBe(true);
	});
});

describe('Space Theorem groups', () => {
	const to111 = [...ABOVE_SPLIT, 71, 81, 91, 101, 111];

	it('allows one pace path without Space Theorems', () => {
		const { tree, skipped } = build([...to111, 121, 122, 131, 132]);
		expect(tree.studies.slice(-2)).toEqual([121, 131]);
		expect(skipped).toHaveLength(2);
		expect(skipped[0]?.reason).toBe(
			'Only one of the Active, Passive and Idle paths without Space Theorems from V.'
		);
		expect(pacePaths(tree)).toEqual(['Active']);
	});

	it('charges ST for a second pace path and stops at the budget', () => {
		const v: TreeContext = { ...ctx, spaceTheorems: 10 };
		const { tree, skipped } = build([...to111, 121, 122, 123, 131, 132], 0, v);
		// 122 and 123 cost 2 ST each once 121 is in; 131 is free (no 132/133 yet), 132 costs 8.
		expect(tree.st).toBe(4);
		expect(skipped).toEqual([
			{ ref: normal(132), reason: 'Costs 8 Space Theorems here; 6 of 10 left.' }
		]);
		const discounted = build([...to111, 121, 122, 123, 131, 132], 0, { ...v, spaceTheorems: 36 });
		expect(discounted.tree.st).toBe(0 + 0 + 0 + 6);
	});

	it('keeps light/dark pairs exclusive without ST', () => {
		const to214 = [...to111, 121, 131, 141, 151, 161, 171, 181, 191, 193, 211, 212, 213, 214];
		const { tree, skipped } = build([...to214, 221, 222, 223, 231, 232]);
		expect(tree.studies.slice(-3)).toEqual([221, 223, 231]);
		expect(skipped.map((s) => s.ref.id)).toEqual([222, 232]);
		expect(skipped[0]?.reason).toBe(
			'Only one study of each light/dark pair without Space Theorems from V (221 is in the build).'
		);
	});

	it('needs Ra levels and ST for triads', () => {
		const to231 = [...to111, 121, 131, 141, 151, 161, 171, 181, 191, 193, 211, 221, 222, 231];
		const ra: TreeContext = { ...ctx, spaceTheorems: 66, triads: 1 };
		const { tree } = build([...to231, 301], 0, ra);
		expect(tree.studies.at(-1)).toBe(301);
		// 222 costs 4 − 2 and 301 costs 12 − 2 with 36+ ST.
		expect(tree.st).toBe(2 + 10);
		expect(check(tree, normal(302), ra)).toMatchObject({ ok: false });
	});
});

describe('Eternity Challenge studies', () => {
	const to171 = [...ABOVE_SPLIT, 72, 82, 92, 102, 111, 122, 132, 142, 151, 161, 171];

	it('allows one EC at a time and adds its cost', () => {
		const one = build(to171, 1);
		expect(one.tree.ec).toBe(1);
		expect(one.tree.tt).toBe(build(to171).tree.tt + 30);
		expect(check(one.tree, { kind: 'ec', id: 2 }, ctx)).toEqual({
			ok: false,
			reason: 'Only one Eternity Challenge can be unlocked at a time; EC1 is in the build.'
		});
	});

	it('enforces the EC11/EC12 path restriction', () => {
		const ids = [...ABOVE_SPLIT, 72, 82, 92, 102, 111, 121, 131, 141, 151, 161, 171, 181, 191];
		const tree = build([...ids, 211, 221, 231]).tree;
		expect(check(tree, { kind: 'ec', id: 11 }, ctx)).toEqual({
			ok: false,
			reason: 'Needs the Antimatter Dimension path only: remove 72.'
		});
		const perk = { ...ctx, perks: [PERK.studyECRequirement] };
		expect(check(tree, { kind: 'ec', id: 11 }, perk).ok).toBe(true);
	});

	it('drops the EC when its study is removed', () => {
		const start = build(to171, 3).tree;
		const result = toggle(start, normal(171), ctx);
		expect(result.ok && result.tree.ec).toBe(0);
	});
});

describe('costs', () => {
	it('totals TT over normal studies and the EC study', () => {
		expect(build(ABOVE_SPLIT).tree.tt).toBe(29);
		const ids = [...ABOVE_SPLIT, 71, 81, 91, 101, 111, 122, 132, 142, 151, 161, 162, 171];
		expect(build(ids).tree.tt).toBe(29 + 16 + 12 + 9 + 5 + 4 + 8 + 7 + 7 + 15);
		expect(build(ids, 2).tree.tt).toBe(112 + 35);
	});

	it('matches the data for a full tree', () => {
		const all = timeStudies.normal.filter((s) => !s.isTriad);
		const split: TreeContext = { ...ctx, dimensionSplit: true, spaceTheorems: 1000 };
		const { tree, skipped } = build(
			all.map((s) => s.id),
			0,
			split
		);
		expect(skipped).toEqual([]);
		expect(tree.tt).toBe(all.reduce((sum, s) => sum + s.cost, 0));
	});
});

describe('layout', () => {
	it('picks the layout like upstream STUDY_TREE_LAYOUT_TYPE.current', () => {
		expect(layoutType(ctx)).toBe('NORMAL');
		expect(layoutType({ ...ctx, perks: [PERK.bypassEC5Lock] })).toBe('ALTERNATIVE_62');
		const ec123 = [PERK.bypassEC1Lock, PERK.bypassEC2Lock, PERK.bypassEC3Lock];
		expect(layoutType({ ...ctx, perks: ec123 })).toBe('ALTERNATIVE_181');
		expect(layoutType({ ...ctx, perks: [...ec123, PERK.bypassEC5Lock] })).toBe(
			'ALTERNATIVE_62_181'
		);
		expect(layoutType({ ...ctx, triads: 2 })).toBe('ALTERNATIVE_TRIAD_STUDIES');
	});

	it('shows only unlocked triads and handles every connection override', () => {
		const tree = laidOutTree({ ...ctx, triads: 2 });
		const triads = tree.cells.filter((c) => c.study.id > 300).map((c) => c.study.id);
		expect(triads).toEqual([301, 302]);
		for (const c of timeStudies.connections) expect(() => isConnectionHidden(c, ctx)).not.toThrow();
		const keys = laidOutTree(ctx).connections.map((c) => `${c.from.id}>${c.to.id}`);
		expect(keys).not.toContain('42>62');
	});
});

describe('contextFromSave', () => {
	it('reads EC completions, perks, ST and infers the split and triads', () => {
		const save = {
			eternityChallenges: [5, 5, 5, 0, 1, 0, 0, 0, 0, 2, 0, 0],
			perks: [10, PERK.bypassEC5Lock, PERK.studyECRequirement],
			vRunUnlocks: [2, 2, 2, 2, 2, 2, 1, 0, 0],
			pelleDoomed: false,
			timeStudies: [...ABOVE_SPLIT, 71, 72, 73, 301, 302]
		} as Partial<NormalizedSave> as NormalizedSave;
		expect(contextFromSave(save)).toEqual({
			completedECs: [1, 2, 3, 5, 10],
			perks: [PERK.bypassEC5Lock, PERK.studyECRequirement],
			dimensionSplit: true,
			spaceTheorems: 14,
			triads: 2
		});
		expect(EMPTY_TREE.tt).toBe(0);
	});
});

describe('affordable', () => {
	it('skips what the TT do not cover, and what needs it, but buys cheaper studies after', () => {
		// 11 (1), 21 (3), 22 (2), 31 (3), 32 (2): with 8 TT, 31 doesn't fit but 32 still does.
		const { tree } = build([11, 21, 22, 31, 32]);
		const result = affordable(tree, ctx, 6);
		expect(result.tree.studies).toEqual([11, 21, 22]);
		expect(result.left).toEqual([normal(31), normal(32)]);
		expect(affordable(tree, ctx, 8).tree.studies).toEqual([11, 21, 22, 32]);
	});

	it('leaves out the EC study, bought last, when the tree uses up the TT', () => {
		const { tree } = build([11, 22, 32, 42], 5);
		expect(tree.tt).toBe(141);
		expect(affordable(tree, ctx, 140).left).toEqual([{ kind: 'ec', id: 5 }]);
		expect(affordable(tree, ctx, 141).left).toEqual([]);
	});
});
