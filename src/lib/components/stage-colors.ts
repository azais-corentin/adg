import type { StageId } from '#lib/stages.ts';

/**
 * Each stage borrows the colour the game uses for its layer or Celestial (upstream
 * `public/stylesheets` `--color-*`). app.css defines `--layer-<key>` for light and dark.
 */
const STAGE_LAYER: Record<StageId, string> = {
	'pre-infinity': 'antimatter',
	'early-infinity': 'infinity',
	'break-infinity': 'infinity',
	replicanti: 'infinity',
	'early-eternity': 'eternity',
	'eternity-challenges': 'eternity',
	'early-dilation': 'dilation',
	'late-eternity': 'dilation',
	'early-reality': 'reality',
	teresa: 'teresa',
	effarig: 'effarig',
	nameless: 'nameless',
	v: 'v',
	ra: 'ra',
	'imaginary-machines': 'imaginary',
	laitela: 'laitela',
	pelle: 'pelle'
};

/** Inline style setting `--layer` to the stage's colour. */
export function layerStyle(stage: StageId | null | undefined): string {
	return `--layer: var(--layer-${stage ? STAGE_LAYER[stage] : 'antimatter'})`;
}
