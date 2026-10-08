import type { InfinityUpgradesDataset } from '../schema';
import { evaluateWith, importUpstream } from '../env';
import {
	asRecord,
	decimalString,
	entries,
	numericOrSource,
	optionalBoolean,
	optionalNumber,
	rawField,
	sourceField,
	source,
	textField,
	textPair
} from '../serialize';

const FILE = 'core/secret-formula/infinity/index.js';

function saveId(config: Record<string, unknown>): string | number {
	const id = rawField(config, 'id');
	if (typeof id !== 'string' && typeof id !== 'number')
		throw new Error('upgrade id must be string or number');
	return id;
}

export function buildInfinityUpgrades(): InfinityUpgradesDataset {
	const { infinity } = importUpstream(FILE) as {
		infinity: { upgrades: unknown; breakUpgrades: unknown };
	};
	return {
		source: source(
			'core/secret-formula/infinity/infinity-upgrades.js',
			'core/secret-formula/infinity/break-infinity-upgrades.js'
		),
		upgrades: entries(infinity.upgrades, 'infinity.upgrades').map(([key, config]) => {
			const cost = numericOrSource(config, 'cost');
			const requirementSource = sourceField(config, 'checkRequirement');
			const charged = rawField(config, 'charged');
			return {
				key,
				id: String(saveId(config)),
				cost: cost.value === null ? null : Number(cost.value),
				costSource: cost.source,
				...textPair('description', textField(config, 'description')),
				requires:
					/^\(\) => InfinityUpgrade\.(\w+)\.isBought$/.exec(requirementSource ?? '')?.[1] ?? null,
				requirementSource,
				charged:
					charged === undefined
						? null
						: textPair('description', textField(asRecord(charged, `${key}.charged`), 'description'))
			};
		}),
		breakUpgrades: entries(infinity.breakUpgrades, 'infinity.breakUpgrades').map(
			([key, config]) => {
				const id = saveId(config);
				const rebuyable = optionalBoolean(config, 'rebuyable');
				const maxUpgrades = optionalNumber(config, 'maxUpgrades');
				const cost = rawField(config, 'cost');
				let costs: string[] | null = null;
				if (rebuyable) {
					if (typeof cost !== 'function' || maxUpgrades === null) {
						throw new Error(`rebuyable ${key} needs a cost closure and maxUpgrades`);
					}
					costs = Array.from({ length: maxUpgrades }, (_, bought) =>
						decimalString(
							evaluateWith({ player: { infinityRebuyables: [bought, bought, bought] } }, () =>
								cost()
							)
						)
					);
				}
				return {
					key,
					id,
					rebuyable,
					cost: rebuyable ? null : Number(numericOrSource(config, 'cost').value),
					costs,
					maxUpgrades,
					...textPair('description', textField(config, 'description'))
				};
			}
		)
	};
}
