import type { GlyphsDataset } from '../schema';
import { importUpstream } from '../env';
import {
	asArray,
	entries,
	optionalBoolean,
	optionalNumber,
	optionalString,
	optionalTextField,
	requireNumber,
	requireString,
	source,
	sourceField,
	textPair
} from '../serialize';

const FILE = 'core/secret-formula/reality/index.js';

export function buildGlyphs(): GlyphsDataset {
	const { reality } = importUpstream(FILE) as {
		reality: { glyphTypes: unknown; glyphEffects: unknown };
	};
	return {
		source: source(
			'core/secret-formula/reality/glyph-types.js',
			'core/secret-formula/reality/glyph-effects.js'
		),
		types: entries(reality.glyphTypes, 'reality.glyphTypes').map(([, config]) => ({
			id: requireString(config, 'id'),
			symbol: requireString(config, 'symbol'),
			color: optionalString(config, 'color'),
			primaryEffect: optionalString(config, 'primaryEffect'),
			alchemyResource: optionalNumber(config, 'alchemyResource'),
			hasRarity: optionalBoolean(config, 'hasRarity'),
			isUnlockedSource: sourceField(config, 'isUnlocked')
		})),
		effects: entries(reality.glyphEffects, 'reality.glyphEffects').map(([, config]) => ({
			id: requireString(config, 'id'),
			bitmaskIndex: requireNumber(config, 'bitmaskIndex'),
			glyphTypes: asArray(config.glyphTypes, 'glyphTypes').map(String),
			isGenerated: optionalBoolean(config, 'isGenerated'),
			...textPair('singleDesc', optionalTextField(config, 'singleDesc')),
			...textPair('totalDesc', optionalTextField(config, 'totalDesc')),
			...textPair('genericDesc', optionalTextField(config, 'genericDesc')),
			...textPair('shortDesc', optionalTextField(config, 'shortDesc')),
			enabledInDoomed: optionalBoolean(config, 'enabledInDoomed'),
			alterationType: optionalNumber(config, 'alterationType')
		}))
	};
}
