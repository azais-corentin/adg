import { decodeSave } from './decode.ts';
import { normalizeSave } from './normalize.ts';
import type { NormalizedSave } from './types.ts';

export * from './bignum.ts';
export { decodeSave, MAX_SAVE_LENGTH, SaveDecodeError, type DecodedSave } from './decode.ts';
export type { SaveDecodeErrorCode } from './decode.ts';
export { normalizeSave } from './normalize.ts';
export { detectStage } from './stage.ts';
export { nextGoals } from './nextGoals.ts';
export type * from './types.ts';

/** Decodes a pasted export string (either Android envelope) into a `NormalizedSave`. */
export async function importSave(input: string): Promise<NormalizedSave> {
	return normalizeSave(await decodeSave(input));
}
