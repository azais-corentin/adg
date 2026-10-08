/**
 * Progression stages, in game order. Mirrors upstream
 * `src/core/secret-formula/progress-checker.js` (PROGRESS_STAGE) so that stage
 * detection can follow the game's own definitions.
 *
 * Milestone 1 covers Pre-Infinity through the first Reality; milestone 2 covers
 * the Celestials through the end of the game.
 */
export const STAGES = [
	{ id: 'pre-infinity', name: 'Antimatter Production', milestone: 1 },
	{ id: 'early-infinity', name: 'Infinity', milestone: 1 },
	{ id: 'break-infinity', name: 'Broken Infinity', milestone: 1 },
	{ id: 'replicanti', name: 'Replicanti', milestone: 1 },
	{ id: 'early-eternity', name: 'Eternity', milestone: 1 },
	{ id: 'eternity-challenges', name: 'Eternity Challenges', milestone: 1 },
	{ id: 'early-dilation', name: 'Time Dilation', milestone: 1 },
	{ id: 'late-eternity', name: 'Late Eternity', milestone: 1 },
	{ id: 'early-reality', name: 'Reality', milestone: 1 },
	{ id: 'teresa', name: 'Teresa (1st Celestial)', milestone: 2 },
	{ id: 'effarig', name: 'Effarig (2nd Celestial)', milestone: 2 },
	{ id: 'nameless', name: 'The Nameless Ones (3rd Celestial)', milestone: 2 },
	{ id: 'v', name: 'V (4th Celestial)', milestone: 2 },
	{ id: 'ra', name: 'Ra (5th Celestial)', milestone: 2 },
	{ id: 'imaginary-machines', name: 'Imaginary Machines', milestone: 2 },
	{ id: 'laitela', name: "Lai'tela (6th Celestial)", milestone: 2 },
	{ id: 'pelle', name: 'Pelle (7th Celestial)', milestone: 2 }
] as const;

export type Stage = (typeof STAGES)[number];
export type StageId = Stage['id'];

export const STAGE_IDS: readonly StageId[] = STAGES.map((s) => s.id);

export function stageIndex(id: StageId): number {
	return STAGE_IDS.indexOf(id);
}

export function isStageId(value: unknown): value is StageId {
	return typeof value === 'string' && (STAGE_IDS as readonly string[]).includes(value);
}

export function getStage(id: StageId): Stage {
	const stage = STAGES.find((s) => s.id === id);
	if (!stage) throw new Error(`unknown stage ${id}`);
	return stage;
}
