import { detectStage } from '#lib/save/stage.ts';
import type { NormalizedSave } from '#lib/save/types.ts';
import { isStageId, type StageId } from '#lib/stages.ts';

export const PROGRESS_KEY = 'adg:progress:v1';
const VERSION = 1;

export type StageSource = 'import' | 'manual';

export interface ProgressState {
	stage: StageId | null;
	stageSource: StageSource | null;
	/** ISO time of the save import that set `stage`. */
	importedAt?: string;
	checklist: Record<string, boolean>;
	/** Opaque per-tool state, keyed by tool id. */
	planner: Record<string, unknown>;
	/** The last imported save, kept for tools to read. Survives manual stage changes. */
	save: NormalizedSave | null;
}

type Fields = { [key: string]: unknown };
type Check = (value: unknown) => boolean;

const isObject = (value: unknown): value is Fields =>
	typeof value === 'object' && value !== null && !Array.isArray(value);
const isNumber: Check = (value) => typeof value === 'number';
const isBoolean: Check = (value) => typeof value === 'boolean';
const isNumbers: Check = (value) => Array.isArray(value) && value.every(isNumber);
const optional =
	(check: Check): Check =>
	(value) =>
		value === undefined || check(value);
function shape<T>(spec: { [K in keyof T]-?: Check }): Check {
	const checks: [string, Check][] = Object.entries(spec);
	return (value) => isObject(value) && checks.every(([key, check]) => check(value[key]));
}
const isBigNum = shape<NormalizedSave['antimatter']>({ mantissa: isNumber, exponent: isNumber });
const isCelestial = shape<NormalizedSave['celestials']['teresa']>({
	quoteBits: isNumber,
	unlockBits: optional(isNumber)
});

/**
 * Exhaustive over `NormalizedSave`, so a field added there fails to compile here until it
 * is checked; a stored save from before such a change is then dropped instead of handing
 * tools a save with a missing field.
 */
const isNormalizedSave = shape<NormalizedSave>({
	source: shape<NormalizedSave['source']>({
		format: (value) => value === 'android-native' || value === 'web',
		transport: (value) => typeof value === 'string'
	}),
	version: shape<NormalizedSave['version']>({
		save: optional(isNumber),
		appVersionCode: optional(isNumber),
		app: optional((value) => typeof value === 'string')
	}),
	lastUpdate: isNumber,
	antimatter: isBigNum,
	infinities: isBigNum,
	bankedInfinities: isBigNum,
	eternities: isBigNum,
	realities: isNumber,
	infinityPoints: isBigNum,
	eternityPoints: isBigNum,
	realityMachines: isBigNum,
	galaxies: isNumber,
	dimensionBoosts: isNumber,
	replicanti: shape<NormalizedSave['replicanti']>({ unlocked: isBoolean, galaxies: isNumber }),
	breakInfinity: isBoolean,
	crunchAutobuyerInterval: isNumber,
	achievements: isNumbers,
	secretAchievements: isNumbers,
	normalChallenges: isNumbers,
	infinityChallenges: isNumbers,
	eternityChallenges: isNumbers,
	timeStudies: isNumbers,
	totalTimeTheorems: isNumber,
	dilation: shape<NormalizedSave['dilation']>({
		unlocked: isBoolean,
		studies: isNumbers,
		dilatedTime: isBigNum,
		tachyonParticles: isBigNum
	}),
	realityUpgrades: isNumbers,
	perks: isNumbers,
	celestials: shape<NormalizedSave['celestials']>({
		teresa: isCelestial,
		effarig: isCelestial,
		nameless: isCelestial,
		v: isCelestial,
		ra: isCelestial,
		laitela: isCelestial,
		pelle: isCelestial
	}),
	teresaPouredAmount: isNumber,
	teresaBestAntimatter: isBigNum,
	effarigRelicShards: isBigNum,
	vRunUnlocks: isNumbers,
	raPetLevels: isNumber,
	nameless: shape<NormalizedSave['nameless']>({
		storedTime: isNumber,
		unlocks: isNumbers,
		completed: isBoolean
	}),
	laitelaDarkMatter: isBigNum,
	laitelaDifficultyTier: isNumber,
	pelleRemnants: isNumber,
	pelleRealityShards: isBigNum,
	imaginaryMachineCap: isNumber,
	imaginaryUpgrades: isNumbers,
	imaginaryRebuyableLevels: isNumber,
	pelleDoomed: isBoolean,
	records: shape<NormalizedSave['records']>({
		totalTimePlayed: isNumber,
		realTimePlayed: isNumber,
		bestInfinityTime: isNumber,
		bestEternityTime: isNumber,
		fullGameCompletions: isNumber,
		thisRealityMaxDilatedTime: isBigNum,
		thisRealityMaxReplicanti: isBigNum
	})
}) as (value: unknown) => value is NormalizedSave;

// A save is stored as its own JSON string so its non-finite numbers (an infinite BigNum has
// `exponent: Infinity`) can round-trip as strings without touching other fields.
const NON_FINITE: Record<string, number> = { Infinity, '-Infinity': -Infinity, NaN };

function encodeSave(save: NormalizedSave): string {
	return JSON.stringify(save, (_key, value: unknown) =>
		typeof value === 'number' && !Number.isFinite(value) ? String(value) : value
	);
}

function decodeSave(raw: unknown): NormalizedSave | null {
	if (typeof raw !== 'string') return null;
	try {
		const save: unknown = JSON.parse(raw, (_key, value: unknown) =>
			typeof value === 'string' && Object.hasOwn(NON_FINITE, value) ? NON_FINITE[value] : value
		);
		return isNormalizedSave(save) ? save : null;
	} catch {
		return null;
	}
}

/**
 * Reads persisted progress. Anything unreadable falls back to the empty state field by
 * field, so one corrupt entry never wipes the rest.
 */
export function parseProgress(raw: string | null): ProgressState {
	const empty: ProgressState = {
		stage: null,
		stageSource: null,
		checklist: {},
		planner: {},
		save: null
	};
	if (raw === null) return empty;
	let data: unknown;
	try {
		data = JSON.parse(raw);
	} catch {
		return empty;
	}
	if (!isObject(data)) return empty;
	const { version, stage, stageSource, importedAt, checklist, planner, save } = data;
	if (version !== VERSION) return empty;

	const state = { ...empty };
	if (isStageId(stage) && (stageSource === 'import' || stageSource === 'manual')) {
		state.stage = stage;
		state.stageSource = stageSource;
		if (stageSource === 'import' && typeof importedAt === 'string') state.importedAt = importedAt;
	}
	if (isObject(checklist)) {
		state.checklist = Object.fromEntries(
			Object.entries(checklist).filter((entry): entry is [string, boolean] => entry[1] === true)
		);
	}
	if (isObject(planner)) state.planner = { ...planner };
	state.save = decodeSave(save);
	return state;
}

class Progress implements ProgressState {
	stage = $state<StageId | null>(null);
	stageSource = $state<StageSource | null>(null);
	importedAt = $state<string | undefined>(undefined);
	checklist = $state<Record<string, boolean>>({});
	planner = $state<Record<string, unknown>>({});
	save = $state.raw<NormalizedSave | null>(null);
	/**
	 * False during SSR/prerender and hydration. Stage-dependent markup should render its
	 * neutral state until this flips, so the prerendered HTML hydrates cleanly.
	 */
	ready = $state(false);

	/**
	 * Loads persisted state and follows other tabs. Idempotent; the root layout calls it
	 * on mount, and code reading progress in its own `onMount`/`$effect` may call it first
	 * (child effects run before the layout's). Never call it during render.
	 */
	init(): void {
		if (this.ready || typeof localStorage === 'undefined') return;
		this.#apply(parseProgress(this.#read()));
		window.addEventListener('storage', (event) => {
			if (event.key === PROGRESS_KEY) this.#apply(parseProgress(event.newValue));
		});
		this.ready = true;
	}

	setStage(stage: StageId | null, source: StageSource): void {
		this.init();
		this.stage = stage;
		this.stageSource = stage === null ? null : source;
		this.importedAt = stage !== null && source === 'import' ? new Date().toISOString() : undefined;
		this.#save();
	}

	/** Keeps `save` for tools and sets the stage it reaches, with source `import`. */
	setImported(save: NormalizedSave): void {
		this.init();
		this.save = save;
		this.stage = detectStage(save).stage;
		this.stageSource = 'import';
		this.importedAt = new Date().toISOString();
		this.#save();
	}

	/** Drops the imported save, and the stage too if the import set it. */
	forgetSave(): void {
		this.init();
		this.save = null;
		if (this.stageSource === 'import') {
			this.stage = null;
			this.stageSource = null;
			this.importedAt = undefined;
		}
		this.#save();
	}

	toggleCheck(id: string): void {
		this.init();
		if (this.checklist[id]) delete this.checklist[id];
		else this.checklist[id] = true;
		this.#save();
	}

	setPlannerState(tool: string, value: unknown): void {
		this.init();
		this.planner[tool] = value;
		this.#save();
	}

	reset(): void {
		this.init();
		this.#apply(parseProgress(null));
		try {
			localStorage.removeItem(PROGRESS_KEY);
		} catch {
			// Storage unavailable (private mode, quota): in-memory state is still reset.
		}
	}

	#apply(state: ProgressState): void {
		this.stage = state.stage;
		this.stageSource = state.stageSource;
		this.importedAt = state.importedAt;
		this.checklist = state.checklist;
		this.planner = state.planner;
		this.save = state.save;
	}

	#read(): string | null {
		try {
			return localStorage.getItem(PROGRESS_KEY);
		} catch {
			return null;
		}
	}

	#save(): void {
		const data = {
			version: VERSION,
			stage: this.stage,
			stageSource: this.stageSource,
			importedAt: this.importedAt,
			checklist: $state.snapshot(this.checklist),
			planner: $state.snapshot(this.planner),
			save: this.save && encodeSave(this.save)
		};
		try {
			localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
		} catch {
			// Storage unavailable (private mode, quota): progress lasts for this visit only.
		}
	}
}

export const progress = new Progress();
