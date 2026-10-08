import Decimal from 'break_infinity.js';
import type { ChallengesDataset } from '../schema';
import { importUpstream } from '../env';
import {
	asRecord,
	decimalString,
	isDecimal,
	optionalDecimal,
	rawField,
	records,
	requireNumber,
	requireString,
	resolveText,
	source,
	textField,
	textPair
} from '../serialize';
import { eternityChallengeStudies } from './time-studies';

const FILE = 'core/secret-formula/challenges/index.js';

function requireDecimal(config: Record<string, unknown>, key: string): Decimal {
	const value = rawField(config, key);
	if (!isDecimal(value)) throw new Error(`expected Decimal at ${key}`);
	return value;
}

/** EC4/EC12 restriction text per completion count (`formatRestriction(restriction(n))`). */
function restrictions(config: Record<string, unknown>): string[] | null {
	const restriction = rawField(config, 'restriction');
	const formatRestriction = rawField(config, 'formatRestriction');
	if (restriction === undefined) return null;
	if (typeof restriction !== 'function' || typeof formatRestriction !== 'function') {
		throw new Error('EC restriction/formatRestriction must be closures');
	}
	return [0, 1, 2, 3, 4].map((completions) => {
		const text = resolveText(formatRestriction, restriction(completions)).text;
		if (text === null) throw new Error('EC restriction text depends on game state');
		return text;
	});
}

export function buildChallenges(): ChallengesDataset {
	const { challenges } = importUpstream(FILE) as {
		challenges: { normal: unknown; infinity: unknown; eternity: unknown };
	};
	const ecStudies = eternityChallengeStudies();
	return {
		source: source(
			'core/secret-formula/challenges/normal-challenges.js',
			'core/secret-formula/challenges/infinity-challenges.js',
			'core/secret-formula/challenges/eternity-challenges.js',
			'core/secret-formula/eternity/time-studies/ec-time-studies.js'
		),
		normal: records(challenges.normal, 'challenges.normal').map((config) => ({
			id: requireNumber(config, 'id'),
			legacyId: requireNumber(config, 'legacyId'),
			name: requireString(config, 'name'),
			...textPair('description', textField(config, 'description')),
			reward: requireString(config, 'reward'),
			lockedAt: decimalString(requireDecimal(config, 'lockedAt'))
		})),
		infinity: records(challenges.infinity, 'challenges.infinity').map((config) => ({
			id: requireNumber(config, 'id'),
			...textPair('description', textField(config, 'description')),
			goal: decimalString(requireDecimal(config, 'goal')),
			unlockAntimatter: decimalString(requireDecimal(config, 'unlockAM')),
			...textPair(
				'reward',
				textField(asRecord(rawField(config, 'reward'), 'reward'), 'description')
			)
		})),
		eternity: records(challenges.eternity, 'challenges.eternity').map((config) => {
			const id = requireNumber(config, 'id');
			const goal = requireDecimal(config, 'goal');
			const goalIncrease = requireDecimal(config, 'goalIncrease');
			const unlock = ecStudies.find((study) => study.id === id);
			if (unlock === undefined) throw new Error(`no unlock study for EC${id}`);
			return {
				id,
				...textPair('description', textField(config, 'description')),
				goal: decimalString(goal),
				goalIncrease: decimalString(goalIncrease),
				// Same formula as upstream EternityChallengeState.goalAtCompletions.
				goals: [0, 1, 2, 3, 4].map((n) => decimalString(goal.times(Decimal.pow(goalIncrease, n)))),
				pelleGoal: optionalDecimal(config, 'pelleGoal'),
				pelleGoalIncrease: optionalDecimal(config, 'pelleGoalIncrease'),
				restrictions: restrictions(config),
				...textPair(
					'reward',
					textField(asRecord(rawField(config, 'reward'), 'reward'), 'description')
				),
				unlock
			};
		})
	};
}
