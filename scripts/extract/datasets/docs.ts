import { STAGES } from '../../../src/lib/stages';
import type { AutomatorDataset, H2PDataset, ProgressStagesDataset } from '../schema';
import { importUpstream } from '../env';
import {
	asArray,
	asRecord,
	cleanText,
	optionalTextField,
	rawField,
	records,
	requireNumber,
	requireString,
	source,
	sourceField,
	textField,
	textPair
} from '../serialize';

const H2P_FILE = 'core/secret-formula/h2p.js';
const AUTOMATOR_FILE = 'core/secret-formula/reality/automator.js';
const PROGRESS_FILE = 'core/secret-formula/progress-checker.js';
const CONSTANTS_FILE = 'core/constants.js';

function requireSource(config: Record<string, unknown>, key: string): string {
	const value = sourceField(config, key);
	if (value === null) throw new Error(`missing closure ${key}`);
	return value;
}

export function buildH2P(): H2PDataset {
	const { h2p } = importUpstream(H2P_FILE) as { h2p: { tabs: unknown } };
	return {
		source: source(H2P_FILE),
		articles: records(h2p.tabs, 'h2p.tabs').map((config) => ({
			id: requireNumber(config, 'id'),
			name: requireString(config, 'name'),
			alias: requireString(config, 'alias'),
			tab: requireString(config, 'tab'),
			tags: asArray(config.tags, 'tags').map(String),
			...textPair('info', textField(config, 'info')),
			isUnlockedSource: requireSource(config, 'isUnlocked')
		}))
	};
}

export function buildAutomator(): AutomatorDataset {
	const { automator } = importUpstream(AUTOMATOR_FILE) as {
		automator: { categoryNames: unknown; commands: unknown; templates: unknown };
	};
	const categories = asArray(automator.categoryNames, 'categoryNames').map(String);
	const templates = asRecord(automator.templates, 'templates');
	return {
		source: source(AUTOMATOR_FILE, 'core/secret-formula/script-templates.js'),
		categories,
		commands: records(automator.commands, 'automator.commands').map((config) => {
			const category = requireNumber(config, 'category');
			const categoryName = categories[category];
			if (categoryName === undefined) throw new Error(`unknown automator category ${category}`);
			const sections = rawField(config, 'sections');
			return {
				id: requireNumber(config, 'id'),
				keyword: requireString(config, 'keyword'),
				category,
				categoryName,
				syntax: cleanText(requireString(config, 'syntax')),
				...textPair('description', textField(config, 'description')),
				examples: asArray(rawField(config, 'examples') ?? [], 'examples').map(String),
				sections: (sections === undefined ? [] : records(sections, 'sections')).map((section) => ({
					name: requireString(section, 'name'),
					items: records(section.items, 'section.items').map((item) => ({
						header: requireString(item, 'header'),
						...textPair('description', optionalTextField(item, 'description'))
					}))
				})),
				isUnlockedSource: requireSource(config, 'isUnlocked')
			};
		}),
		templates: records(templates.scripts, 'templates.scripts').map((config) => ({
			name: requireString(config, 'name'),
			description: cleanText(requireString(config, 'description'))
		}))
	};
}

export function buildProgressStages(): ProgressStagesDataset {
	const { progressStages } = importUpstream(PROGRESS_FILE);
	const progressEnum = asRecord(
		(globalThis as Record<string, unknown>).PROGRESS_STAGE,
		'PROGRESS_STAGE'
	);
	const stages = records(progressStages, 'progressStages');
	if (stages.length !== STAGES.length) {
		throw new Error(
			`upstream has ${stages.length} progress stages, src/lib/stages.ts has ${STAGES.length}`
		);
	}
	return {
		source: source(PROGRESS_FILE, CONSTANTS_FILE),
		stages: stages.map((config, index) => {
			const id = requireNumber(config, 'id');
			const key = Object.entries(progressEnum).find(([, value]) => value === id)?.[0];
			if (key === undefined) throw new Error(`progress stage ${id} not in PROGRESS_STAGE`);
			const name = requireString(config, 'name');
			const stage = STAGES[index];
			if (stage.name !== name) {
				throw new Error(
					`stage ${index} is "${name}" upstream but "${stage.name}" in src/lib/stages.ts`
				);
			}
			return {
				id,
				key,
				stageId: stage.id,
				name,
				...textPair('suggestedResource', textField(config, 'suggestedResource')),
				hasReachedSource: requireSource(config, 'hasReached')
			};
		})
	};
}
