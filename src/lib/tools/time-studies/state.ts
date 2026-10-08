/** The planner's slice of the progress store (`progress.planner['time-studies']`). */
import { EC_STUDIES, NORMAL_STUDIES, type TreeContext } from './tree.ts';

export const PLANNER_KEY = 'time-studies';

export interface PlannerState {
	/** Normal studies in purchase order. */
	studies: number[];
	/** EC study in the build, 0 for none. */
	ec: number;
	/** Export with a trailing `!` so the game also starts the EC. */
	startEC: boolean;
	/** Game state set by hand; null follows the imported save, or the defaults. */
	context: TreeContext | null;
}

export const EMPTY_STATE: PlannerState = { studies: [], ec: 0, startEC: false, context: null };

const isIntArray = (value: unknown): value is number[] =>
	Array.isArray(value) && value.every((v) => Number.isInteger(v));

function parseContext(value: unknown): TreeContext | null {
	if (typeof value !== 'object' || value === null) return null;
	const { completedECs, perks, dimensionSplit, spaceTheorems, triads } = value as Record<
		string,
		unknown
	>;
	if (
		!isIntArray(completedECs) ||
		!isIntArray(perks) ||
		typeof dimensionSplit !== 'boolean' ||
		!Number.isInteger(spaceTheorems) ||
		!Number.isInteger(triads)
	) {
		return null;
	}
	return {
		completedECs,
		perks,
		dimensionSplit,
		spaceTheorems: Math.max(0, Number(spaceTheorems)),
		triads: Math.min(4, Math.max(0, Number(triads)))
	};
}

/** Reads stored planner state; anything unreadable falls back field by field. */
export function parsePlannerState(value: unknown): PlannerState {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) return EMPTY_STATE;
	const { studies, ec, startEC, context } = value as Record<string, unknown>;
	return {
		studies: isIntArray(studies) ? studies.filter((id) => NORMAL_STUDIES.has(id)) : [],
		ec: typeof ec === 'number' && EC_STUDIES.has(ec) ? ec : 0,
		startEC: startEC === true,
		context: parseContext(context)
	};
}
