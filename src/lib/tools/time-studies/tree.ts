/**
 * Time Study tree rules, ported from upstream `src/core/time-studies/time-study-tree.js`
 * (`TimeStudyTree.hasRequirements`, `buySingleStudy`, `allowedDimPathCount`) and the study
 * configs in `secret-formula/eternity/time-studies/*` at the pinned SHA.
 *
 * Like upstream's virtual tree, nothing here reads the live game: closures that depend on the
 * game state (EC completions, perks, V, Ra) are answered from a `TreeContext`, and Time
 * Theorems are only totalled, never budgeted.
 */
import { timeStudies } from '#lib/data/index.ts';
import type {
	DilationTimeStudy,
	EternityChallengeStudy,
	NormalTimeStudy,
	TimeStudyConnection,
	TimeStudyLayout,
	TimeStudyLayoutCell,
	TimeStudyPath,
	TimeStudyRef
} from '#lib/data/index.ts';
import type { NormalizedSave } from '#lib/save/types.ts';

export type { TimeStudyRef };

/** Perks that change the tree (upstream `secret-formula/reality/perks.js` ids). */
export const PERK = {
	bypassEC1Lock: 54,
	bypassEC2Lock: 55,
	bypassEC3Lock: 56,
	bypassEC5Lock: 57,
	studyECRequirement: 72
} as const;

/** Game state the tree depends on, beyond the studies themselves. */
export interface TreeContext {
	/** Eternity Challenges completed at least once. Only 1, 2, 3, 5 and 10 gate studies. */
	completedECs: readonly number[];
	/** Owned perk ids; only the ones in `PERK` matter. */
	perks: readonly number[];
	/** Dilation upgrade "You can buy all three Time Study paths from the Dimension split". */
	dimensionSplit: boolean;
	/** Space Theorems from V (0 before V, and in Doomed Reality). */
	spaceTheorems: number;
	/** Triad Studies unlocked by Ra's V levels (one per 6 levels, 0–4). */
	triads: number;
}

/**
 * Planning default without an imported save: the EC completions that gate studies 62, 181 and
 * 191–193 count as done (so a full tree can be planned), nothing from Reality onward.
 */
export const DEFAULT_CONTEXT: TreeContext = {
	completedECs: [1, 2, 3, 5, 10],
	perks: [],
	dimensionSplit: false,
	spaceTheorems: 0,
	triads: 0
};

export const NORMAL_STUDIES: ReadonlyMap<number, NormalTimeStudy> = new Map(
	timeStudies.normal.map((s) => [s.id, s])
);
export const EC_STUDIES: ReadonlyMap<number, EternityChallengeStudy> = new Map(
	timeStudies.eternityChallenges.map((s) => [s.id, s])
);
export const DILATION_STUDIES: ReadonlyMap<number, DilationTimeStudy> = new Map(
	timeStudies.dilation.map((s) => [s.id, s])
);

const DIMENSION_PATH_STARTS = [71, 72, 73] as const;
const TRIAD_IDS = [301, 302, 303, 304] as const;

/** A build as stored and exported: normal studies in purchase order, plus one EC (0 = none). */
export interface Build {
	studies: readonly number[];
	ec: number;
}

/** A build with every study checked against the rules, and what it costs. */
export interface Tree extends Build {
	/** Time Theorems spent on the normal studies and the EC study. */
	tt: number;
	/** Space Theorems spent. */
	st: number;
}

export const EMPTY_TREE: Tree = { studies: [], ec: 0, tt: 0, st: 0 };

export type Verdict = { ok: true; st: number } | { ok: false; reason: string };

export interface Skipped {
	ref: TimeStudyRef;
	reason: string;
}

export function hasPerk(ctx: TreeContext, perk: number): boolean {
	return ctx.perks.includes(perk);
}

function ecDone(ctx: TreeContext, ec: number): boolean {
	return ctx.completedECs.includes(ec);
}

/** Upstream `TimeStudyTree.allowedDimPathCount`. */
export function allowedDimensionPaths(tree: Build, ctx: TreeContext): number {
	if (ctx.dimensionSplit) return 3;
	return tree.studies.includes(201) ? 2 : 1;
}

/** Space Theorem discount from V's 36-achievement reward (upstream `VUnlocks.raUnlock`). */
export function stDiscount(ctx: TreeContext): number {
	return ctx.spaceTheorems >= 36 ? 2 : 0;
}

/** Space Theorems the study costs on top of `tree` (upstream `buySingleStudy`). */
export function stCostIn(tree: Build, study: NormalTimeStudy, ctx: TreeContext): number {
	if (study.stCost === null || !study.requiresST.some((id) => tree.studies.includes(id))) return 0;
	return Math.max(study.stCost - stDiscount(ctx), 0);
}

/** "21", "41 or 42", "221, 222 and 231". */
export function joinIds(ids: readonly (number | string)[], conjunction: 'or' | 'and'): string {
	if (ids.length <= 1) return ids.join('');
	return `${ids.slice(0, -1).join(', ')} ${conjunction} ${ids.at(-1)}`;
}

function needs(ids: readonly number[], conjunction: 'or' | 'and'): string {
	return `Needs ${ids.length === 1 ? 'study' : 'studies'} ${joinIds(ids, conjunction)}.`;
}

/**
 * The upstream requirement closures (`extraRequirementSources`) answered from the context.
 * Returns why the study is locked, or null.
 */
function extraRequirement(id: number, tree: Build, ctx: TreeContext): string | null {
	const ecBypass = hasPerk(ctx, PERK.studyECRequirement);
	switch (id) {
		case 62:
			return hasPerk(ctx, PERK.bypassEC5Lock) || ecDone(ctx, 5)
				? null
				: 'Needs EC5 completed once (or the perk that bypasses its lock).';
		case 71:
			return ecBypass || tree.ec !== 12 ? null : "Can't be bought while EC12 is unlocked.";
		case 72:
			return ecBypass || (tree.ec !== 11 && tree.ec !== 12)
				? null
				: `Can't be bought while EC${tree.ec} is unlocked.`;
		case 73:
			return ecBypass || tree.ec !== 11 ? null : "Can't be bought while EC11 is unlocked.";
		case 181: {
			const bypass: readonly number[] = [
				PERK.bypassEC1Lock,
				PERK.bypassEC2Lock,
				PERK.bypassEC3Lock
			];
			const locked = [1, 2, 3].filter(
				(ec) => !ecDone(ctx, ec) && !ctx.perks.some((p) => p === bypass[ec - 1])
			);
			if (locked.length === 0) return null;
			const names = joinIds(
				locked.map((ec) => `EC${ec}`),
				'and'
			);
			return `Needs ${names} completed once (or the perks that bypass their locks).`;
		}
		case 191:
		case 192:
		case 193:
			return ecDone(ctx, 10) ? null : 'Needs EC10 completed once.';
		case 301:
		case 302:
		case 303:
		case 304: {
			const n = id - 300;
			return ctx.triads >= n ? null : `Needs Ra's V at level ${n * 6} (Triad Study ${n}).`;
		}
		default:
			return null;
	}
}

function checkNormal(tree: Tree, study: NormalTimeStudy, ctx: TreeContext): Verdict {
	if (tree.studies.includes(study.id)) return { ok: false, reason: 'Already in the build.' };
	const bought = (id: number) => tree.studies.includes(id);
	switch (study.requirementType) {
		case 'at-least-one':
			if (!study.requires.some(bought)) return { ok: false, reason: needs(study.requires, 'or') };
			break;
		case 'all':
			if (!study.requires.every(bought)) return { ok: false, reason: needs(study.requires, 'and') };
			break;
		case 'dimension-path': {
			if (!study.requires.every(bought)) return { ok: false, reason: needs(study.requires, 'and') };
			const allowed = allowedDimensionPaths(tree, ctx);
			if (DIMENSION_PATH_STARTS.filter(bought).length >= allowed) {
				return {
					ok: false,
					reason:
						allowed === 1
							? 'Only one Dimension path (71–103) until you buy study 201.'
							: 'Only two Dimension paths; the third needs a Dilation upgrade.'
				};
			}
			break;
		}
	}
	const extra = extraRequirement(study.id, tree, ctx);
	if (extra !== null) return { ok: false, reason: extra };

	const st = stCostIn(tree, study, ctx);
	if (st > 0 && tree.st + st > ctx.spaceTheorems) {
		if (ctx.spaceTheorems === 0) return { ok: false, reason: exclusivityReason(study) };
		const left = ctx.spaceTheorems - tree.st;
		return {
			ok: false,
			reason: `Costs ${st} Space Theorems here; ${left} of ${ctx.spaceTheorems} left.`
		};
	}
	return { ok: true, st };
}

function exclusivityReason(study: NormalTimeStudy): string {
	if (study.isTriad) return 'Triad Studies cost Space Theorems, which come from V.';
	if (study.path === 'light' || study.path === 'dark') {
		return `Only one study of each light/dark pair without Space Theorems from V (${joinIds(study.requiresST, 'or')} is in the build).`;
	}
	return 'Only one of the Active, Passive and Idle paths without Space Theorems from V.';
}

function checkEC(tree: Tree, study: EternityChallengeStudy, ctx: TreeContext): Verdict {
	if (tree.ec === study.id) return { ok: false, reason: 'Already in the build.' };
	if (tree.ec !== 0) {
		return {
			ok: false,
			reason: `Only one Eternity Challenge can be unlocked at a time; EC${tree.ec} is in the build.`
		};
	}
	if (!study.requires.some((id) => tree.studies.includes(id))) {
		return { ok: false, reason: needs(study.requires, 'or') };
	}
	if (study.secondary.kind === 'path' && !hasPerk(ctx, PERK.studyECRequirement)) {
		const forbidden = study.secondary.forbiddenStudies.filter((id) => tree.studies.includes(id));
		if (forbidden.length > 0) {
			return {
				ok: false,
				reason: `Needs the ${study.secondary.path} path only: remove ${joinIds(forbidden, 'and')}.`
			};
		}
	}
	return { ok: true, st: 0 };
}

/** Whether `ref` can be added to `tree` now, and why not. */
export function check(tree: Tree, ref: TimeStudyRef, ctx: TreeContext): Verdict {
	switch (ref.kind) {
		case 'normal': {
			const study = NORMAL_STUDIES.get(ref.id);
			return study ? checkNormal(tree, study, ctx) : { ok: false, reason: 'No such study.' };
		}
		case 'ec': {
			const study = EC_STUDIES.get(ref.id);
			return study ? checkEC(tree, study, ctx) : { ok: false, reason: 'No such study.' };
		}
		case 'dilation':
			return {
				ok: false,
				reason: "Dilation studies aren't part of study strings; buy them in the game."
			};
	}
}

/** Adds a study that passed `check`. */
function buy(tree: Tree, ref: TimeStudyRef, st: number): Tree {
	if (ref.kind === 'ec') {
		return { ...tree, ec: ref.id, tt: tree.tt + (EC_STUDIES.get(ref.id)?.cost ?? 0) };
	}
	return {
		...tree,
		studies: [...tree.studies, ref.id],
		tt: tree.tt + (NORMAL_STUDIES.get(ref.id)?.cost ?? 0),
		st: tree.st + st
	};
}

/**
 * Buys `refs` in order into `start`, skipping what the rules forbid (upstream
 * `attemptBuyArray`). Repeated entries are skipped silently, as upstream does.
 */
export function buyAll(
	start: Tree,
	refs: readonly TimeStudyRef[],
	ctx: TreeContext
): { tree: Tree; skipped: Skipped[] } {
	let tree = start;
	const skipped: Skipped[] = [];
	for (const ref of refs) {
		const verdict = check(tree, ref, ctx);
		if (verdict.ok) tree = buy(tree, ref, verdict.st);
		else if (verdict.reason !== 'Already in the build.')
			skipped.push({ ref, reason: verdict.reason });
	}
	return { tree, skipped };
}

/** The refs of a build in import order: the normal studies, then the EC (as in a study string). */
export function buildRefs(build: Build): TimeStudyRef[] {
	const refs: TimeStudyRef[] = build.studies.map((id) => ({ kind: 'normal', id }));
	if (build.ec !== 0) refs.push({ kind: 'ec', id: build.ec });
	return refs;
}

/** Re-checks a stored build, dropping what no longer fits (e.g. after the context changed). */
export function evaluate(build: Build, ctx: TreeContext): { tree: Tree; skipped: Skipped[] } {
	return buyAll(EMPTY_TREE, buildRefs(build), ctx);
}

export function isSelected(tree: Build, ref: TimeStudyRef): boolean {
	if (ref.kind === 'ec') return tree.ec === ref.id;
	return ref.kind === 'normal' && tree.studies.includes(ref.id);
}

/** Removes a study; studies that relied on it are dropped too and returned in `skipped`. */
export function remove(
	tree: Tree,
	ref: TimeStudyRef,
	ctx: TreeContext
): { tree: Tree; skipped: Skipped[] } {
	const rest: Build =
		ref.kind === 'ec'
			? { studies: tree.studies, ec: 0 }
			: {
					studies: tree.studies.filter((id) => !(ref.kind === 'normal' && id === ref.id)),
					ec: tree.ec
				};
	return evaluate(rest, ctx);
}

/** Toggles a study in or out of the tree. */
export function toggle(
	tree: Tree,
	ref: TimeStudyRef,
	ctx: TreeContext
): { ok: true; tree: Tree; skipped: Skipped[] } | { ok: false; reason: string } {
	if (isSelected(tree, ref)) return { ok: true, ...remove(tree, ref, ctx) };
	const verdict = check(tree, ref, ctx);
	if (!verdict.ok) return verdict;
	return { ok: true, tree: buy(tree, ref, verdict.st), skipped: [] };
}

function pathNames(tree: Build, paths: readonly TimeStudyPath[]): string[] {
	return timeStudies.paths
		.filter((p) => paths.includes(p.path) && p.studies.some((id) => tree.studies.includes(id)))
		.map((p) => p.name);
}

/** Upstream `TimeStudyTree.dimensionPaths`, e.g. `["Antimatter Dims"]`. */
export function dimensionPaths(tree: Build): string[] {
	return pathNames(tree, ['antimatter-dim', 'infinity-dim', 'time-dim']);
}

/** Upstream `TimeStudyTree.pacePaths`, e.g. `["Idle"]`. */
export function pacePaths(tree: Build): string[] {
	return pathNames(tree, ['active', 'passive', 'idle']);
}

// ---------------------------------------------------------------------------------------------
// Layout

/** Upstream `STUDY_TREE_LAYOUT_TYPE.current`. */
export function layoutType(ctx: TreeContext): string {
	const alt62 = hasPerk(ctx, PERK.bypassEC5Lock);
	const alt181 = [PERK.bypassEC1Lock, PERK.bypassEC2Lock, PERK.bypassEC3Lock].every((p) =>
		hasPerk(ctx, p)
	);
	if (ctx.triads > 0) return 'ALTERNATIVE_TRIAD_STUDIES';
	if (alt62 && alt181) return 'ALTERNATIVE_62_181';
	if (alt62) return 'ALTERNATIVE_62';
	if (alt181) return 'ALTERNATIVE_181';
	return 'NORMAL';
}

export interface LaidOutTree {
	layout: TimeStudyLayout;
	/** Cells to draw: triads beyond the unlocked count are hidden, as upstream does. */
	cells: TimeStudyLayoutCell[];
	connections: TimeStudyConnection[];
}

/** Upstream `TimeStudyConnection.isOverridden` for the perk-dependent EC lock lines. */
export function isConnectionHidden(connection: TimeStudyConnection, ctx: TreeContext): boolean {
	if (connection.overrideSource === null) return false;
	const key = `${refKey(connection.from)}>${refKey(connection.to)}`;
	switch (key) {
		case '42>62':
			return !hasPerk(ctx, PERK.bypassEC5Lock);
		case 'EC5>62':
			return hasPerk(ctx, PERK.bypassEC5Lock);
		case '171>181':
			return ![PERK.bypassEC1Lock, PERK.bypassEC2Lock, PERK.bypassEC3Lock].every((p) =>
				hasPerk(ctx, p)
			);
		case 'EC1>181':
			return hasPerk(ctx, PERK.bypassEC1Lock);
		case 'EC2>181':
			return hasPerk(ctx, PERK.bypassEC2Lock);
		case 'EC3>181':
			return hasPerk(ctx, PERK.bypassEC3Lock);
		default:
			throw new Error(`Unhandled connection override ${key}: ${connection.overrideSource}`);
	}
}

export function laidOutTree(ctx: TreeContext): LaidOutTree {
	const type = layoutType(ctx);
	const layout = timeStudies.layouts.find((l) => l.type === type);
	if (!layout) throw new Error(`No Time Study layout ${type}`);
	const cells = layout.cells.filter(
		(c) => !(c.study.kind === 'normal' && c.study.id > 300 && c.study.id - 300 > ctx.triads)
	);
	const shown = new Set(cells.map((c) => refKey(c.study)));
	const connections = timeStudies.connections.filter(
		(c) => shown.has(refKey(c.from)) && shown.has(refKey(c.to)) && !isConnectionHidden(c, ctx)
	);
	return { layout, cells, connections };
}

/** "11", "EC5", "D1" — unique per study across kinds. */
export function refKey(ref: TimeStudyRef): string {
	switch (ref.kind) {
		case 'normal':
			return String(ref.id);
		case 'ec':
			return `EC${ref.id}`;
		case 'dilation':
			return `D${ref.id}`;
	}
}

export function refCost(ref: TimeStudyRef): number {
	switch (ref.kind) {
		case 'normal':
			return NORMAL_STUDIES.get(ref.id)?.cost ?? 0;
		case 'ec':
			return EC_STUDIES.get(ref.id)?.cost ?? 0;
		case 'dilation':
			return DILATION_STUDIES.get(ref.id)?.cost ?? 0;
	}
}

export function isTriad(id: number): boolean {
	return (TRIAD_IDS as readonly number[]).includes(id);
}

// ---------------------------------------------------------------------------------------------
// Context from a save

/**
 * Reads the tree context from an imported save. Triads and the Dilation split are not in the
 * normalized save, so they are inferred from the studies the save owns.
 */
export function contextFromSave(save: NormalizedSave): TreeContext {
	const completedECs = save.eternityChallenges.flatMap((c, i) => (c > 0 ? [i + 1] : []));
	const perks = Object.values(PERK).filter((p) => save.perks.includes(p));
	// Upstream `V.updateTotalRunUnlocks`: hard V runs (index 6+) give two Space Theorems a tier.
	const spaceTheorems = save.pelleDoomed
		? 0
		: save.vRunUnlocks.reduce((sum, tiers, i) => sum + (i < 6 ? tiers : tiers * 2), 0);
	const owned = save.timeStudies;
	const paths = DIMENSION_PATH_STARTS.filter((id) => owned.includes(id)).length;
	const triads = save.pelleDoomed ? 0 : Math.max(0, ...owned.filter(isTriad).map((id) => id - 300));
	return {
		completedECs,
		perks,
		dimensionSplit: paths > (owned.includes(201) ? 2 : 1),
		spaceTheorems,
		triads
	};
}
