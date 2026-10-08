import type { RealityUpgradesDataset } from '../schema';
import { importUpstream } from '../env';
import {
	decimalString,
	optionalBoolean,
	optionalDecimal,
	optionalNumber,
	optionalString,
	optionalTextField,
	rawField,
	records,
	requireNumber,
	requireString,
	source,
	textField,
	textPair
} from '../serialize';

const FILE = 'core/secret-formula/reality/index.js';

/** Rebuyables carry `initialCost`/`costMult` and a computed `cost`; others a fixed `cost`. */
function costFields(config: Record<string, unknown>) {
	const rebuyable = rawField(config, 'initialCost') !== undefined;
	return {
		cost: rebuyable ? null : decimalString(rawField(config, 'cost')),
		initialCost: optionalDecimal(config, 'initialCost'),
		costMult: optionalNumber(config, 'costMult')
	};
}

export function buildRealityUpgrades(): RealityUpgradesDataset {
	const { reality } = importUpstream(FILE) as {
		reality: { upgrades: unknown; imaginaryUpgrades: unknown };
	};
	return {
		source: source(
			'core/secret-formula/reality/reality-upgrades.js',
			'core/secret-formula/reality/imaginary-upgrades.js'
		),
		upgrades: records(reality.upgrades, 'reality.upgrades').map((config) => ({
			id: requireNumber(config, 'id'),
			name: requireString(config, 'name'),
			...costFields(config),
			...textPair('description', textField(config, 'description')),
			textTemplate: optionalString(config, 'textTemplate'),
			...textPair('requirement', optionalTextField(config, 'requirement')),
			canLock: optionalBoolean(config, 'canLock'),
			automatorPoints: optionalNumber(config, 'automatorPoints')
		})),
		imaginaryUpgrades: records(reality.imaginaryUpgrades, 'reality.imaginaryUpgrades').map(
			(config) => ({
				id: requireNumber(config, 'id'),
				name: requireString(config, 'name'),
				...costFields(config),
				...textPair('description', textField(config, 'description')),
				...textPair('requirement', optionalTextField(config, 'requirement')),
				canLock: optionalBoolean(config, 'canLock'),
				isDisabledInDoomed: optionalBoolean(config, 'isDisabledInDoomed')
			})
		)
	};
}
