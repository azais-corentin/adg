import type { DilationUpgradesDataset, EternityDataset } from '../schema';
import { importUpstream } from '../env';
import {
	entries,
	numericOrSource,
	optionalBoolean,
	optionalDecimal,
	optionalNumber,
	requireNumber,
	source,
	textField,
	textPair
} from '../serialize';

const FILE = 'core/secret-formula/eternity/index.js';

function eternityDatabase(): { upgrades: unknown; milestones: unknown; dilation: unknown } {
	return importUpstream(FILE).eternity as {
		upgrades: unknown;
		milestones: unknown;
		dilation: unknown;
	};
}

export function buildEternity(): EternityDataset {
	const eternity = eternityDatabase();
	return {
		source: source(
			'core/secret-formula/eternity/eternity-upgrades.js',
			'core/secret-formula/eternity/eternity-milestones.js'
		),
		upgrades: entries(eternity.upgrades, 'eternity.upgrades').map(([key, config]) => ({
			key,
			id: requireNumber(config, 'id'),
			cost: requireNumber(config, 'cost'),
			...textPair('description', textField(config, 'description'))
		})),
		milestones: entries(eternity.milestones, 'eternity.milestones').map(([key, config]) => ({
			key,
			eternities: requireNumber(config, 'eternities'),
			...textPair('reward', textField(config, 'reward')),
			pelleUseless: optionalBoolean(config, 'pelleUseless')
		}))
	};
}

export function buildDilationUpgrades(): DilationUpgradesDataset {
	const eternity = eternityDatabase();
	return {
		source: source('core/secret-formula/eternity/dilation-upgrades.js'),
		upgrades: entries(eternity.dilation, 'eternity.dilation').map(([key, config]) => {
			const rebuyable = optionalBoolean(config, 'rebuyable');
			const purchaseCap = optionalNumber(config, 'purchaseCap');
			return {
				key,
				id: requireNumber(config, 'id'),
				rebuyable,
				cost: rebuyable ? null : numericOrSource(config, 'cost').value,
				initialCost: optionalDecimal(config, 'initialCost'),
				increment: optionalDecimal(config, 'increment'),
				// Upstream marks "uncapped" with Number.MAX_VALUE.
				purchaseCap: purchaseCap === Number.MAX_VALUE ? null : purchaseCap,
				...textPair('description', textField(config, 'description')),
				pelleOnly: optionalBoolean(config, 'pelleOnly')
			};
		})
	};
}
