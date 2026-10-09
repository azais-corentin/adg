import { detectStage } from '#lib/save/stage.ts';
import type { NormalizedSave } from '#lib/save/types.ts';
import { stageIndex, type StageId } from '#lib/stages.ts';
import { stageItems, type ChecklistItem } from './items.ts';

/**
 * `auto`: the imported save shows the item done; `implied`: the save is past the item's stage,
 * so the item counts as done even when later resets (Reality clears Dilation upgrades, ECs and
 * achievements) removed the evidence. Both are locked on. `manual`: ticked by hand.
 */
export type ItemStatus = 'auto' | 'implied' | 'manual' | 'open';

export function itemStatus(
	item: ChecklistItem,
	save: NormalizedSave | null,
	ticks: Readonly<Record<string, boolean>>
): ItemStatus {
	if (save !== null) {
		if (item.auto?.(save)) return 'auto';
		if (stageIndex(detectStage(save).stage) > stageIndex(item.stage)) return 'implied';
	}
	return ticks[item.id] ? 'manual' : 'open';
}

export interface StageProgress {
	done: number;
	total: number;
}

export function stageProgress(
	stage: StageId,
	save: NormalizedSave | null,
	ticks: Readonly<Record<string, boolean>>
): StageProgress {
	const items = stageItems(stage);
	const done = items.filter((item) => itemStatus(item, save, ticks) !== 'open').length;
	return { done, total: items.length };
}
