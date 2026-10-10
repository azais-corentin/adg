/** Progress through the recommended order, from a list of completions per Eternity Challenge. */
import { EC_COUNT, MAX_COMPLETIONS } from './challenges.ts';
import { ORDER, type OrderStep } from './order.ts';

/** Completions (0–5) per Eternity Challenge; index 0 is EC1, length 12 (as `NormalizedSave`). */
export type Completions = readonly number[];

export const NO_COMPLETIONS: Completions = Array.from({ length: EC_COUNT }, () => 0);

/** Clamps anything array-like into 12 integer completion counts in 0–5. */
export function normalizeCompletions(value: unknown): number[] {
	const list = Array.isArray(value) ? (value as unknown[]) : [];
	return Array.from({ length: EC_COUNT }, (_, i) => {
		const n = list[i];
		return typeof n === 'number' && Number.isFinite(n)
			? Math.min(Math.max(Math.trunc(n), 0), MAX_COMPLETIONS)
			: 0;
	});
}

export function isStepDone(step: OrderStep, completions: Completions): boolean {
	return (completions[step.ec - 1] ?? 0) >= step.completion;
}

/**
 * The first step of the order not done yet, with its index, or `null` once every EC is at ×5.
 * Completions done out of order count as done wherever they appear.
 */
export function nextStep(completions: Completions): { index: number; step: OrderStep } | null {
	const index = ORDER.findIndex((step) => !isStepDone(step, completions));
	return index === -1 ? null : { index, step: ORDER[index]! };
}

/** Marks a step done (completions of its EC become at least its tier) or, if done, undone. */
export function toggleStep(completions: Completions, step: OrderStep): number[] {
	const next = normalizeCompletions(completions);
	next[step.ec - 1] = isStepDone(step, completions) ? step.completion - 1 : step.completion;
	return next;
}

export type Source = 'save' | 'manual';

/** What the tool keeps in `progress.planner['eternity-challenges']`. */
export interface PlannerState {
	/** Where completions come from when a save is imported; without one, always manual. */
	source: Source;
	/** Completions marked by hand. */
	completions: number[];
	/**
	 * `lastUpdate` of the imported save the hand marks started from, null if none was imported.
	 * Marks by hand only apply to that save: importing another one follows the save again.
	 */
	seededFrom: number | null;
}

export const PLANNER_KEY = 'eternity-challenges';

/** Reads stored planner state, falling back to defaults field by field. */
export function parsePlannerState(value: unknown): PlannerState {
	const fields =
		typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
	return {
		source: fields.source === 'manual' ? 'manual' : 'save',
		completions: normalizeCompletions(fields.completions),
		seededFrom: typeof fields.seededFrom === 'number' ? fields.seededFrom : null
	};
}

/**
 * Where the planner's completions come from: by hand without a save, the save unless the
 * player switched to marking by hand for this very save (a newer import follows the save).
 */
export function effectiveSource(state: PlannerState, saveLastUpdate: number | null): Source {
	if (saveLastUpdate === null) return 'manual';
	return state.source === 'manual' && state.seededFrom === saveLastUpdate ? 'manual' : 'save';
}
