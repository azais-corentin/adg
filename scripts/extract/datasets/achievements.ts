import type { AchievementsDataset } from '../schema';
import { importUpstream } from '../env';
import {
	optionalTextField,
	records,
	requireNumber,
	requireString,
	source,
	textField,
	textPair
} from '../serialize';

const FILE = 'core/secret-formula/achievements/index.js';

function gridPosition(id: number): { row: number; column: number } {
	return { row: Math.floor(id / 10), column: id % 10 };
}

export function buildAchievements(): AchievementsDataset {
	const { achievements } = importUpstream(FILE) as {
		achievements: { normal: unknown; secret: unknown };
	};
	return {
		source: source(
			'core/secret-formula/achievements/normal-achievements.js',
			'core/secret-formula/achievements/secret-achievements.js'
		),
		normal: records(achievements.normal, 'achievements.normal').map((config) => {
			const id = requireNumber(config, 'id');
			return {
				id,
				...gridPosition(id),
				name: requireString(config, 'name'),
				...textPair('description', textField(config, 'description')),
				...textPair('reward', optionalTextField(config, 'reward'))
			};
		}),
		secret: records(achievements.secret, 'achievements.secret').map((config) => {
			const id = requireNumber(config, 'id');
			return {
				id,
				...gridPosition(id),
				name: requireString(config, 'name'),
				...textPair('description', textField(config, 'description'))
			};
		})
	};
}
