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
}

type Fields = { [key: string]: unknown };

/**
 * Reads persisted progress. Anything unreadable falls back to the empty state field by
 * field, so one corrupt entry never wipes the rest.
 */
export function parseProgress(raw: string | null): ProgressState {
	const empty: ProgressState = { stage: null, stageSource: null, checklist: {}, planner: {} };
	if (raw === null) return empty;
	let data: unknown;
	try {
		data = JSON.parse(raw);
	} catch {
		return empty;
	}
	if (typeof data !== 'object' || data === null || Array.isArray(data)) return empty;
	const { version, stage, stageSource, importedAt, checklist, planner } = data as Fields;
	if (version !== VERSION) return empty;

	const state = { ...empty };
	if (isStageId(stage) && (stageSource === 'import' || stageSource === 'manual')) {
		state.stage = stage;
		state.stageSource = stageSource;
		if (stageSource === 'import' && typeof importedAt === 'string') state.importedAt = importedAt;
	}
	if (typeof checklist === 'object' && checklist !== null && !Array.isArray(checklist)) {
		state.checklist = Object.fromEntries(
			Object.entries(checklist).filter((entry): entry is [string, boolean] => entry[1] === true)
		);
	}
	if (typeof planner === 'object' && planner !== null && !Array.isArray(planner)) {
		state.planner = { ...planner };
	}
	return state;
}

class Progress implements ProgressState {
	stage = $state<StageId | null>(null);
	stageSource = $state<StageSource | null>(null);
	importedAt = $state<string | undefined>(undefined);
	checklist = $state<Record<string, boolean>>({});
	planner = $state<Record<string, unknown>>({});
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
			planner: $state.snapshot(this.planner)
		};
		try {
			localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
		} catch {
			// Storage unavailable (private mode, quota): progress lasts for this visit only.
		}
	}
}

export const progress = new Progress();
