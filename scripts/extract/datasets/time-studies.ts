import { runInThisContext } from 'node:vm';
import type {
	DilationStudyKey,
	EternityChallengeSecondary,
	EternityChallengeStudy,
	TimeStudiesDataset,
	TimeStudyLayout,
	TimeStudyPath,
	TimeStudyRef,
	TimeStudyRequirementType
} from '../schema';
import { importUpstream, readUpstream, stubUpstreamModule } from '../env';
import {
	asArray,
	asRecord,
	decimalString,
	optionalNumber,
	rawField,
	records,
	requireNumber,
	requireString,
	source,
	sourceField,
	textField,
	textPair
} from '../serialize';

const NORMAL_FILE = 'core/secret-formula/eternity/time-studies/normal-time-studies.js';
const EC_FILE = 'core/secret-formula/eternity/time-studies/ec-time-studies.js';
const DILATION_FILE = 'core/secret-formula/eternity/time-studies/dilation-time-studies.js';
const PATHS_FILE = 'core/time-studies/normal-time-study.js';
const CONNECTIONS_FILE = 'core/time-studies/time-study-connections.js';
const LAYOUT_FILE = 'components/tabs/time-studies/time-study-tree-layout.js';

const DILATION_KEYS: Record<number, DilationStudyKey> = {
	1: 'dilation',
	2: 'td5',
	3: 'td6',
	4: 'td7',
	5: 'td8',
	6: 'reality'
};

/** Upstream enum key → kebab-case value, e.g. `ANTIMATTER_DIM` → `antimatter-dim`. */
function enumName(enumObject: unknown, value: unknown, what: string): string {
	const match = Object.entries(asRecord(enumObject, what)).find(([, v]) => v === value);
	if (match === undefined) throw new Error(`unknown ${what} value ${String(value)}`);
	return match[0].toLowerCase().replaceAll('_', '-');
}

function requirementType(value: unknown): TimeStudyRequirementType {
	return enumName(
		(globalThis as Record<string, unknown>).TS_REQUIREMENT_TYPE,
		value,
		'TS_REQUIREMENT_TYPE'
	) as TimeStudyRequirementType;
}

/** Splits an upstream `requirement` array into study ids and extra closure sources. */
function splitRequirement(config: Record<string, unknown>): {
	requires: number[];
	extraRequirementSources: string[];
} {
	const requires: number[] = [];
	const extraRequirementSources: string[] = [];
	for (const entry of asArray(rawField(config, 'requirement'), 'requirement')) {
		if (typeof entry === 'number') requires.push(entry);
		else if (typeof entry === 'function') extraRequirementSources.push(String(entry));
		else throw new Error(`unexpected time study requirement ${String(entry)}`);
	}
	return { requires, extraRequirementSources };
}

/** The study that unlocks an Eternity Challenge; also used by the challenges dataset. */
export function eternityChallengeStudies(): EternityChallengeStudy[] {
	const { ecTimeStudies } = importUpstream(EC_FILE);
	return records(ecTimeStudies, 'ecTimeStudies').map((config) => ({
		id: requireNumber(config, 'id'),
		cost: requireNumber(config, 'cost'),
		...splitRequirement(config),
		requirementType: requirementType(rawField(config, 'reqType')),
		secondary: ecSecondary(asRecord(rawField(config, 'secondary'), 'secondary'))
	}));
}

function ecSecondary(secondary: Record<string, unknown>): EternityChallengeSecondary {
	const required = rawField(secondary, 'required');
	if (typeof required === 'function') {
		return {
			kind: 'resource',
			resource: requireString(secondary, 'resource'),
			amounts: [0, 1, 2, 3, 4].map((completions) => decimalString(required(completions)))
		};
	}
	return {
		kind: 'path',
		path: requireString(secondary, 'path'),
		forbiddenStudies: asArray(rawField(secondary, 'forbiddenStudies'), 'forbiddenStudies').map(
			Number
		)
	};
}
interface StudyStub extends Record<string, unknown> {
	ref: TimeStudyRef;
}

/**
 * Stand-in for upstream's `TimeStudy` lookup: returns one stable object per study so the
 * upstream connection list and tree layout can be evaluated without game state.
 */
function createStudyLookup() {
	const cache: Record<string, StudyStub> = {};
	const get = (ref: TimeStudyRef): StudyStub => {
		const key = `${ref.kind}:${ref.id}`;
		cache[key] ??= { ref, isUnlocked: true };
		return cache[key];
	};
	return Object.assign((id: number) => get({ kind: 'normal', id }), {
		eternityChallenge: (id: number) => get({ kind: 'ec', id }),
		timeDimension: (tier: number) => get({ kind: 'dilation', id: tier - 3 }),
		dilation: get({ kind: 'dilation', id: 1 }),
		reality: get({ kind: 'dilation', id: 6 })
	});
}

/** Mirrors `TimeStudySetup` in TimeStudyButton.vue (position maths only). */
class TimeStudySetup {
	study: StudyStub;
	row: number;
	column: number;
	isSmall = false;
	top = 0;
	left = 0;
	width = 0;
	height = 0;

	constructor(props: { study: StudyStub; row: number; column: number }) {
		this.study = props.study;
		this.row = props.row;
		this.column = props.column;
	}

	setPosition(layout: {
		itemPosition(row: number): number;
		rows: {
			itemPosition(column: number, layout: unknown): number;
			layout: { itemWidth: number; itemHeight: number };
		}[];
	}): void {
		this.top = layout.itemPosition(this.row);
		const row = layout.rows[this.row];
		this.left = row.itemPosition(this.column, layout);
		this.width = row.layout.itemWidth;
		this.height = row.layout.itemHeight;
	}
}

/** Mirrors `TimeStudyConnectionSetup` in TimeStudyConnection.vue; positions are not needed. */
class TimeStudyConnectionSetup {
	constructor(readonly connection: unknown) {}
	setPosition(): void {}
}

/** Rounds layout maths (0.6 spacing) to stable decimals. */
function round(value: number): number {
	return Number(value.toFixed(4));
}

function buildLayouts(): Pick<
	TimeStudiesDataset,
	'layouts' | 'connections' | 'layoutSelectionSource'
> {
	const g = globalThis as Record<string, unknown>;
	const lookup = createStudyLookup();
	stubUpstreamModule(PATHS_FILE, { TimeStudy: lookup });
	stubUpstreamModule('components/tabs/time-studies/TimeStudyButton.vue', { TimeStudySetup });
	stubUpstreamModule('components/tabs/time-studies/TimeStudyConnection.vue', {
		TimeStudyConnectionSetup
	});
	const { TimeStudyConnection } = importUpstream(CONNECTIONS_FILE);
	g.TimeStudy = lookup;
	g.TimeStudyConnection = TimeStudyConnection;
	try {
		const { TimeStudyTreeLayout, STUDY_TREE_LAYOUT_TYPE } = importUpstream(LAYOUT_FILE) as {
			TimeStudyTreeLayout: new (
				type: number,
				scaling: number
			) => {
				width: number;
				height: number;
				studies: TimeStudySetup[];
			};
			STUDY_TREE_LAYOUT_TYPE: Record<string, unknown>;
		};
		const layoutTypes = Object.keys(STUDY_TREE_LAYOUT_TYPE).filter((key) => key !== 'current');
		const layouts: TimeStudyLayout[] = layoutTypes.map((type) => {
			const layout = new TimeStudyTreeLayout(requireNumber(STUDY_TREE_LAYOUT_TYPE, type), 1);
			return {
				type,
				width: round(layout.width),
				height: round(layout.height),
				cells: layout.studies.map((setup) => ({
					study: setup.study.ref,
					row: setup.row,
					column: setup.column,
					isSmall: setup.isSmall,
					x: round(setup.left),
					y: round(setup.top),
					width: round(setup.width),
					height: round(setup.height)
				}))
			};
		});
		const connections = asArray(
			(lookup as unknown as Record<string, unknown>).allConnections,
			'TimeStudy.allConnections'
		).map((connection) => {
			const c = asRecord(connection, 'connection');
			const override = c._override;
			return {
				from: (c._from as StudyStub).ref,
				to: (c._to as StudyStub).ref,
				overrideSource: typeof override === 'function' ? String(override) : null
			};
		});
		const current = Object.getOwnPropertyDescriptor(STUDY_TREE_LAYOUT_TYPE, 'current')?.get;
		if (current === undefined) throw new Error('STUDY_TREE_LAYOUT_TYPE.current getter missing');
		return { layouts, connections, layoutSelectionSource: String(current) };
	} finally {
		delete g.TimeStudy;
		delete g.TimeStudyConnection;
	}
}

/** `NormalTimeStudies.pathList` lives in game-logic code; evaluate just that array literal. */
function buildPaths(): TimeStudiesDataset['paths'] {
	const match = /NormalTimeStudies\.pathList = (\[[\s\S]*?\n\]);/.exec(readUpstream(PATHS_FILE));
	if (match === null) throw new Error(`NormalTimeStudies.pathList not found in ${PATHS_FILE}`);
	const pathEnum = (globalThis as Record<string, unknown>).TIME_STUDY_PATH;
	return records(runInThisContext(`(${match[1]})`), 'pathList').map((entry) => ({
		path: enumName(pathEnum, rawField(entry, 'path'), 'TIME_STUDY_PATH') as TimeStudyPath,
		name: requireString(entry, 'name'),
		studies: asArray(rawField(entry, 'studies'), 'studies').map(Number)
	}));
}

export function buildTimeStudies(): TimeStudiesDataset {
	const { normalTimeStudies } = importUpstream(NORMAL_FILE);
	const { dilationTimeStudies } = importUpstream(DILATION_FILE);
	const paths = buildPaths();
	const pathOf = (id: number) => paths.find((p) => p.studies.includes(id))?.path ?? null;
	return {
		source: source(NORMAL_FILE, EC_FILE, DILATION_FILE, PATHS_FILE, CONNECTIONS_FILE, LAYOUT_FILE),
		normal: records(normalTimeStudies, 'normalTimeStudies').map((config) => {
			const id = requireNumber(config, 'id');
			const requiresST = rawField(config, 'requiresST');
			return {
				id,
				cost: requireNumber(config, 'cost'),
				stCost: optionalNumber(config, 'STCost'),
				requiresST: requiresST === undefined ? [] : asArray(requiresST, 'requiresST').map(Number),
				...splitRequirement(config),
				requirementType: requirementType(rawField(config, 'reqType')),
				...textPair('description', textField(config, 'description')),
				path: pathOf(id),
				isTriad: id > 300,
				unlockedSource: sourceField(config, 'unlocked')
			};
		}),
		eternityChallenges: eternityChallengeStudies(),
		dilation: records(dilationTimeStudies, 'dilationTimeStudies').map((config) => {
			const id = requireNumber(config, 'id');
			const key = DILATION_KEYS[id];
			if (key === undefined) throw new Error(`unknown dilation study ${id}`);
			const requirementSource = sourceField(config, 'requirement');
			if (requirementSource === null) throw new Error(`dilation study ${id} has no requirement`);
			return {
				id,
				key,
				cost: requireNumber(config, 'cost'),
				...textPair('description', textField(config, 'description')),
				requirementSource
			};
		}),
		paths,
		...buildLayouts()
	};
}
