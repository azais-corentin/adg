/**
 * A Time Study tree for each step of the completion order: what to import after the respec
 * that every completion causes. Built from the step's suggested path, pace and Time Theorem
 * amount, with the tree rules of the Time Study planner.
 */
import { exportStudyString } from '../time-studies/study-string.ts';
import {
	check,
	DEFAULT_CONTEXT,
	EC_STUDIES,
	EMPTY_TREE,
	NORMAL_STUDIES,
	type Tree,
	type TreeContext
} from '../time-studies/tree.ts';
import { ORDER, type PaceTip, type PathTip } from './order.ts';

const PATH_STUDIES: Record<PathTip, readonly number[]> = {
	AD: [71, 81, 91, 101],
	ID: [72, 82, 92, 102],
	TD: [73, 83, 93, 103]
};

const PACE_STUDIES: Record<PaceTip, readonly number[]> = {
	Active: [121, 131, 141],
	Passive: [122, 132, 142],
	Idle: [123, 133, 143]
};

/**
 * What to buy once the challenge's own study is reachable, best first: the backbone, the
 * step's path and pace, the central column, the rest above the split, then the lower tree.
 * One study per light/dark pair, as in the planner's presets.
 */
function wishList(path: PathTip, pace: PaceTip): number[] {
	return [
		11,
		22,
		32,
		42,
		51,
		61,
		...PATH_STUDIES[path],
		111,
		...PACE_STUDIES[pace],
		151,
		161,
		171,
		162,
		33,
		62,
		21,
		31,
		41,
		181,
		193,
		191,
		211,
		212,
		213,
		214,
		222,
		224,
		225,
		228
	];
}

export interface StepTree {
	/** The study string, normal studies in buying order and then the EC. */
	studies: string;
	/** Time Theorems the whole tree costs, EC study included. */
	tt: number;
	/**
	 * Has study 131, which on Android stops automatic Replicanti Galaxies while the app is
	 * closed ("Automatic Replicanti Galaxies are disabled while offline").
	 */
	stopsOfflineGalaxies: boolean;
}

/** EC completions owned before `ORDER[index]`, which open studies 62, 181 and 191–193. */
function contextBefore(index: number): TreeContext {
	const done = new Set(ORDER.slice(0, index).map((step) => step.ec));
	return { ...DEFAULT_CONTEXT, completedECs: [...done].sort((a, b) => a - b) };
}

const cost = (id: number) => NORMAL_STUDIES.get(id)?.cost ?? 0;

/**
 * Buys `id` and whatever it still needs. For "at least one" requirements it takes the option
 * that comes first in `preferred`, else the cheapest. Returns null when the rules forbid it.
 */
function withStudy(
	tree: Tree,
	id: number,
	ctx: TreeContext,
	preferred: readonly number[]
): Tree | null {
	if (tree.studies.includes(id)) return tree;
	const study = NORMAL_STUDIES.get(id);
	if (!study) return null;
	const rank = (option: number) => {
		const at = preferred.indexOf(option);
		return at === -1 ? Infinity : at;
	};
	let next: Tree | null = tree;
	if (study.requirementType === 'at-least-one') {
		if (!study.requires.some((r) => tree.studies.includes(r))) {
			const options = [...study.requires].sort((a, b) => rank(a) - rank(b) || cost(a) - cost(b));
			next = null;
			for (const option of options) {
				next = withStudy(tree, option, ctx, preferred);
				if (next) break;
			}
		}
	} else {
		for (const r of study.requires) next = next && withStudy(next, r, ctx, preferred);
	}
	if (!next || !check(next, { kind: 'normal', id }, ctx).ok) return null;
	return { ...next, studies: [...next.studies, id], tt: next.tt + study.cost };
}

/**
 * The tree for `ORDER[index]`: first the shortest route to the challenge's study, then the
 * wish list while it fits in the step's Time Theorems (never less than the route itself).
 */
export function stepTree(index: number): StepTree {
	const step = ORDER[index];
	if (!step) throw new Error(`No order step ${index}`);
	return buildTree(index, step.path, step.pace);
}

/**
 * The step's tree for a run left going while the app is closed: an Active tree with Passive
 * (122/132/142) instead of 121/131/141, so Replicanti Galaxies keep coming offline. Undefined
 * when the step's tree has no study 131, or when the challenge's study needs 121 (EC6), so no
 * tree can leave the Active row.
 */
export function offlineTree(index: number): StepTree | undefined {
	if (!stepTree(index).stopsOfflineGalaxies) return undefined;
	const tree = buildTree(index, ORDER[index]!.path, 'Passive');
	return tree.studies.split(/[,|]/).includes('121') ? undefined : tree;
}

/**
 * The tree that buys the step's challenge study first, for steps whose unlock requirement comes
 * faster on another path than the run's (`unlockPath`). It takes the Idle row: in the EC7
 * measurements in `order.ts` antimatter went furthest with it, also while the app was closed.
 */
export function unlockTree(index: number): StepTree | undefined {
	const path = ORDER[index]?.unlockPath;
	return path ? buildTree(index, path, 'Idle') : undefined;
}

function buildTree(index: number, path: PathTip, pace: PaceTip): StepTree {
	const step = ORDER[index];
	if (!step) throw new Error(`No order step ${index}`);
	const ec = EC_STUDIES.get(step.ec);
	if (!ec) throw new Error(`No study for EC${step.ec}`);
	const ctx = contextBefore(index);
	const wishes = wishList(path, pace);

	let route: Tree | null = null;
	for (const requirement of [...ec.requires].sort((a, b) => cost(a) - cost(b))) {
		route = withStudy(EMPTY_TREE, requirement, ctx, wishes);
		if (route) break;
	}
	if (!route) throw new Error(`No route to EC${step.ec}`);

	const budget = Math.max(step.tt, route.tt + ec.cost);
	let tree = route;
	for (const id of wishes) {
		if (tree.studies.includes(id) || !check(tree, { kind: 'normal', id }, ctx).ok) continue;
		if (tree.tt + cost(id) + ec.cost > budget) continue;
		tree = { ...tree, studies: [...tree.studies, id], tt: tree.tt + cost(id) };
	}
	if (!check(tree, { kind: 'ec', id: step.ec }, ctx).ok) throw new Error(`EC${step.ec} locked`);
	const final = { ...tree, ec: step.ec, tt: tree.tt + ec.cost };
	return {
		studies: exportStudyString(final),
		tt: final.tt,
		stopsOfflineGalaxies: final.studies.includes(131)
	};
}
