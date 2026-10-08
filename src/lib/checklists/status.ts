import type { NormalizedSave } from '#lib/save/types.ts';
import type { StageId } from '#lib/stages.ts';
import { stageItems, type ChecklistItem } from './items.ts';

/** `auto`: the imported save shows it done (locked on); `manual`: ticked by hand. */
export type ItemStatus = 'auto' | 'manual' | 'open';

export function itemStatus(
	item: ChecklistItem,
	save: NormalizedSave | null,
	ticks: Readonly<Record<string, boolean>>
): ItemStatus {
	if (save !== null && item.auto?.(save)) return 'auto';
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
