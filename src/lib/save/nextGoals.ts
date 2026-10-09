import { stageItems } from '#lib/checklists/items.ts';
import type { StageId } from '#lib/stages.ts';
import { bigNum, formatBigNum, formatCount, gt, gte, toNumber } from './bignum.ts';
import { detectStage } from './stage.ts';
import type { BigNum, Goal, NormalizedSave } from './types.ts';

/**
 * Concrete next goals per stage. Every threshold below is taken from upstream source at the
 * pinned SHA; the file named in each comment is under `src/core/`.
 */

/** `Decimal.NUMBER_MAX_VALUE`, the Infinity threshold for antimatter and IP. */
const INFINITY_THRESHOLD = bigNum(1.7976931348623157, 308);

/** Thresholds are shown like the game shows costs (`format(x)`, 0 places); player values with 2. */
const fmtGoal = (value: BigNum) => formatBigNum(value, 0);
const fmt = (value: BigNum) => formatBigNum(value, 2);
const fmtInt = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 0 });

/** `autobuyers/autobuyer.js`: interval starts at 150000 ms, ×0.6 per upgrade, floor 100 ms; cost 1 IP, ×2. */
const CRUNCH_BASE_INTERVAL = 150000;
const CRUNCH_UPGRADES_TO_MAX = Math.ceil(Math.log(CRUNCH_BASE_INTERVAL / 100) / Math.log(1 / 0.6));

/**
 * Infinity Challenge unlock exponents, IC1..IC8, as Android 3.18.0 shows them ("Next Infinity
 * Challenge unlocks at …"). Upstream `secret-formula/challenges/infinity-challenges.js` `unlockAM`
 * at the pin has IC2 at 1e11000; the app unlocks it at 1e10500. The rest match.
 */
const IC_UNLOCK_AM_EXPONENT = [2000, 10500, 12000, 14000, 18000, 22500, 23000, 28000];

/** `secret-formula/challenges/eternity-challenges.js` `[goal, goalIncrease]` IP exponents, EC1..EC12. */
const EC_GOAL_EXPONENT: readonly (readonly [number, number])[] = [
	[1800, 200],
	[975, 175],
	[600, 75],
	[2750, 550],
	[750, 400],
	[850, 250],
	[2000, 530],
	[1300, 900],
	[1750, 250],
	[3000, 300],
	[450, 200],
	[110000, 12000]
];

/**
 * `secret-formula/eternity/eternity-milestones.js`, condensed, as Android 3.18.0 lists them: the
 * app folds upstream's 200-Eternity offline Eternities into the 100 milestone.
 */
const ETERNITY_MILESTONES: readonly (readonly [number, string])[] = [
	[1, 'unlocks the Infinity Point multiplier autobuyer'],
	[2, 'Eternities start with all Normal Challenges, autobuyers and Infinity broken'],
	[3, 'unlocks the Replicanti Galaxy autobuyer'],
	[4, 'Eternities keep all Infinity Upgrades'],
	[5, 'unlocks more Big Crunch autobuyer modes'],
	[6, 'gain Eternity Points while offline'],
	[7, 'Infinity Challenges complete as soon as they unlock'],
	[8, 'Eternities keep all Break Infinity Upgrades'],
	[9, 'unlocks buy-max mode for the Antimatter Galaxy autobuyer'],
	[10, 'start with Replicanti unlocked'],
	[11, 'unlocks the 1st Infinity Dimension autobuyer'],
	[12, 'unlocks the 2nd Infinity Dimension autobuyer'],
	[13, 'unlocks the 3rd Infinity Dimension autobuyer'],
	[14, 'unlocks the 4th Infinity Dimension autobuyer'],
	[15, 'unlocks the 5th Infinity Dimension autobuyer'],
	[16, 'unlocks the 6th Infinity Dimension autobuyer'],
	[17, 'unlocks the 7th Infinity Dimension autobuyer'],
	[18, 'unlocks the 8th Infinity Dimension autobuyer'],
	[25, 'Infinity Dimensions unlock automatically'],
	[30, 'start with all Antimatter Dimensions available'],
	[40, 'Replicanti Galaxies no longer reset antimatter and Dimensions'],
	[50, 'unlocks the Replicanti Chance autobuyer'],
	[60, 'unlocks the Replicanti Interval autobuyer'],
	[80, 'unlocks the Max Replicanti Galaxy autobuyer'],
	[100, 'unlocks the Eternity autobuyer and gain Eternities while offline'],
	[1000, 'gain Infinities while offline']
];

function infinityChallengeGoal(s: NormalizedSave): Goal {
	const done = s.infinityChallenges.length;
	const next = [1, 2, 3, 4, 5, 6, 7, 8].find((id) => !s.infinityChallenges.includes(id));
	return {
		id: 'infinity-challenges',
		text:
			next === undefined
				? 'Complete all 8 Infinity Challenges'
				: `Complete Infinity Challenge ${next} (unlocks at ${fmtGoal(bigNum(1, IC_UNLOCK_AM_EXPONENT[next - 1] ?? 0))} antimatter; ${done}/8 done)`,
		done: next === undefined
	};
}

function crunchIntervalGoal(s: NormalizedSave): Goal {
	const interval = s.crunchAutobuyerInterval;
	const bought = Math.min(
		CRUNCH_UPGRADES_TO_MAX,
		Math.max(0, Math.round(Math.log(CRUNCH_BASE_INTERVAL / interval) / Math.log(1 / 0.6)))
	);
	const left = CRUNCH_UPGRADES_TO_MAX - bought;
	// Upgrade k costs 2^k IP, so the remaining ones cost 2^max − 2^bought.
	const cost = 2 ** CRUNCH_UPGRADES_TO_MAX - 2 ** bought;
	return {
		id: 'crunch-interval',
		text: `Max the Big Crunch autobuyer interval (now ${fmtInt(interval)} ms, max 100 ms; ${left} upgrades for ${fmtInt(cost)} IP) to unlock Break Infinity`,
		done: interval <= 100
	};
}

function ecGoal(s: NormalizedSave, id: number): Goal {
	const completions = s.eternityChallenges[id - 1] ?? 0;
	const [goal, increase] = EC_GOAL_EXPONENT[id - 1] ?? [0, 0];
	return {
		id: `ec${id}`,
		text:
			completions >= 5
				? `Complete Eternity Challenge ${id} five times`
				: `Complete Eternity Challenge ${id} (${completions}/5; next goal ${fmtGoal(bigNum(1, goal + increase * completions))} IP)`,
		done: completions >= 5
	};
}

const GOALS: Record<StageId, (s: NormalizedSave) => Goal[]> = {
	'pre-infinity': (s) => {
		// The stage checklist's items and save evidence, so both views agree; plus live progress.
		const progress: Record<string, string> = {
			'pre-inf-8th-dimension': `${Math.min(s.dimensionBoosts, 4)}/4 Dimension Boosts`,
			'pre-inf-infinity': `now ${fmt(s.antimatter)}`
		};
		return stageItems('pre-infinity').map((item) => {
			const done = item.auto?.(s) ?? false;
			const extra = done ? undefined : progress[item.id];
			return { id: item.id, text: extra ? `${item.text} (${extra})` : item.text, done };
		});
	},
	'early-infinity': (s) => [
		{
			id: 'normal-challenges-1-9',
			text: `Complete Normal Challenges 1–9 (${s.normalChallenges.filter((id) => id <= 9).length}/9)`,
			done: [1, 2, 3, 4, 5, 6, 7, 8, 9].every((id) => s.normalChallenges.includes(id))
		},
		{
			// normal-challenges.js: NC10–12 `lockedAt: DC.D16`.
			id: 'infinities-16',
			text: `Reach 16 Infinities to unlock Normal Challenges 10–12 (have ${formatCount(s.infinities)})`,
			done: gte(s.infinities, 16)
		},
		{
			// autobuyers/big-crunch-autobuyer.js: unlocked by completing NC12.
			id: 'nc12',
			text: 'Complete Normal Challenge 12 to unlock the Big Crunch autobuyer',
			done: s.normalChallenges.includes(12)
		},
		crunchIntervalGoal(s),
		{ id: 'break-infinity', text: 'Break Infinity', done: s.breakInfinity }
	],
	'break-infinity': (s) => [
		{ id: 'break-infinity', text: 'Break Infinity', done: s.breakInfinity },
		infinityChallengeGoal(s),
		{
			// replicanti.js: `Replicanti.unlock` costs DC.E140 IP.
			id: 'replicanti',
			text: `Unlock Replicanti for 1e140 Infinity Points (have ${fmt(s.infinityPoints)})`,
			done: s.replicanti.unlocked
		}
	],
	replicanti: (s) => [
		infinityChallengeGoal(s),
		{
			id: 'replicanti-galaxy',
			text: `Get a Replicanti Galaxy: buy a Max Replicanti Galaxies upgrade and let Replicanti reach ${fmt(INFINITY_THRESHOLD)}`,
			done: s.replicanti.galaxies > 0
		},
		{
			id: 'eternity',
			text: `Reach ${fmt(INFINITY_THRESHOLD)} Infinity Points and Eternity (have ${fmt(s.infinityPoints)})`,
			done: gt(s.eternities, 0)
		}
	],
	'early-eternity': (s) => {
		const eternities = toNumber(s.eternities);
		const milestone = ETERNITY_MILESTONES.find(([count]) => eternities < count);
		const goals: Goal[] = milestone
			? [
					{
						id: `eternity-milestone-${milestone[0]}`,
						text: `Reach ${fmtInt(milestone[0])} Eternities: ${milestone[1]} (have ${fmtInt(eternities)})`,
						done: false
					}
				]
			: [];
		return [
			...goals,
			{
				// secret-formula/eternity/time-studies/ec-time-studies.js: EC1 study needs TS171.
				id: 'ts171',
				text: 'Buy Time Study 171',
				done: s.timeStudies.includes(171)
			},
			{
				// ec-time-studies.js: EC1 study costs 30 TT and needs 20,000 Eternities.
				id: 'ec1-unlock',
				text: `Reach 20,000 Eternities (have ${fmtInt(eternities)}), then unlock EC1 for 30 Time Theorems`,
				done: eternities >= 20000 || (s.eternityChallenges[0] ?? 0) > 0
			},
			ecGoal(s, 1)
		];
	},
	'eternity-challenges': (s) => {
		const open = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
			.filter((id) => (s.eternityChallenges[id - 1] ?? 0) < 5)
			.slice(0, 3);
		const ec11 = s.eternityChallenges[10] ?? 0;
		const ec12 = s.eternityChallenges[11] ?? 0;
		return [
			...open.map((id) => ecGoal(s, id)),
			{
				// secret-formula/eternity/time-studies/dilation-time-studies.js (study 1 requirement).
				id: 'ec11-ec12',
				text: `Complete EC11 and EC12 five times each (EC11 ${ec11}/5, EC12 ${ec12}/5)`,
				done: ec11 >= 5 && ec12 >= 5
			},
			{
				// dilation-time-studies.js + time-studies/dilation-time-study.js: 12,900 total TT, 5,000 TT cost.
				id: 'unlock-dilation',
				text: 'Unlock Time Dilation: own a row-23 Time Study (231–234), reach 12,900 total Time Theorems, and buy the Dilation study (5,000 TT)',
				done: s.dilation.unlocked
			}
		];
	},
	'early-dilation': (s) => [
		{
			id: 'tachyon-particles',
			text: `Dilate an Eternity to earn Tachyon Particles (have ${fmt(s.dilation.tachyonParticles)})`,
			done: gt(s.dilation.tachyonParticles, 0)
		},
		{
			// progress-checker.js: Late Eternity starts above 1e15 Dilated Time.
			id: 'dilated-time-1e15',
			text: `Reach 1e15 Dilated Time (have ${fmt(s.dilation.dilatedTime)})`,
			done: gt(s.dilation.dilatedTime, 1e15)
		}
	],
	'late-eternity': (s) => {
		const tdStudies = [2, 3, 4, 5].filter((id) => s.dilation.studies.includes(id)).length;
		const preReality = s.achievements.filter((id) => id < 140).length;
		return [
			{
				// dilation-time-studies.js: studies 2–5 cost 1e6, 1e7, 1e8, 1e9 TT.
				id: 'td5-8',
				text: `Unlock Time Dimensions 5–8 with the dilation studies (1e6, 1e7, 1e8, 1e9 TT; ${tdStudies}/4)`,
				done: tdStudies === 4
			},
			{
				// dilation-time-studies.js: the Reality study needs 1e4000 max EP this Reality.
				id: 'ep-e4000',
				text: `Reach 1e4000 Eternity Points (have ${fmt(s.eternityPoints)})`,
				done: gte(s.eternityPoints, bigNum(1, 4000))
			},
			{
				// achievements/normal-achievement.js: pre-Reality achievements are rows 1–13.
				id: 'pre-reality-achievements',
				text: `Unlock all 104 achievements in rows 1–13 (${preReality}/104)`,
				done: preReality === 104
			},
			{
				id: 'first-reality',
				text: 'Buy the Reality study and complete your first Reality',
				done: s.realities > 0
			}
		];
	},
	'early-reality': (s) => [
		{
			// reality-upgrades.js `allBought` → achievement 147 "Master of Reality" unlocks Teresa.
			id: 'reality-upgrades',
			text: `Buy all 20 one-time Reality Upgrades to unlock Teresa (${s.realityUpgrades.length}/20)`,
			done: s.realityUpgrades.length === 20 || s.achievements.includes(147)
		},
		{
			id: 'teresa',
			text: 'Open Teresa in the Celestials tab',
			done: s.celestials.teresa.quoteBits > 0
		}
	],
	teresa: (s) => [
		{
			// secret-formula/celestials/teresa.js: Effarig unlock price 1e24.
			id: 'effarig',
			text: `Pour 1e24 Reality Machines into Teresa to unlock Effarig (poured ${fmt(bigNum(s.teresaPouredAmount, 0))})`,
			done: s.teresaPouredAmount >= 1e24 || s.celestials.effarig.quoteBits > 0
		}
	],
	effarig: (s) => [
		{
			// celestials/enslaved.js: `isUnlocked` is `EffarigUnlock.eternity`.
			id: 'nameless',
			text: "Complete the Eternity layer of Effarig's Reality to unlock The Nameless Ones",
			done: s.celestials.nameless.quoteBits > 0
		}
	],
	nameless: (s) => [
		{
			// secret-formula/tabs.js: V's tab needs achievement 151.
			id: 'v',
			text: 'Get 800 Antimatter Galaxies without buying 8th Antimatter Dimensions in one Infinity (achievement 151) to unlock V',
			done: s.achievements.includes(151)
		}
	],
	v: (s) => {
		const vAchievements = s.vRunUnlocks.reduce((sum, n) => sum + n, 0);
		return [
			{
				// secret-formula/celestials/v.js `raUnlock`: 36 V-Achievements.
				id: 'ra',
				text: `Earn 36 V-Achievements to unlock Ra (have ${vAchievements})`,
				done: vAchievements >= 36
			}
		];
	},
	ra: (s) => [
		{
			// machines.js: iM unlock at the 1e1000 RM cap.
			id: 'imaginary-machines',
			text: `Reach the 1e1000 Reality Machine cap to unlock Imaginary Machines (have ${fmt(s.realityMachines)})`,
			done: s.imaginaryMachineCap > 0
		}
	],
	'imaginary-machines': (s) => [
		{
			// secret-formula/reality/imaginary-upgrades.js id 15; celestials/laitela/laitela.js.
			id: 'laitela',
			text: `Reach ${fmtGoal(bigNum(1, 1.5e12))} antimatter without any 1st Infinity Dimensions in a Reality, then buy Imaginary Upgrade 15 (1e9 iM) to unlock Lai'tela`,
			done: s.celestials.laitela.quoteBits > 0
		}
	],
	laitela: (s) => [
		{
			// imaginary-upgrades.js id 25: 1.6e15 iM, Reality in Lai'tela's Reality with all Dimensions disabled.
			id: 'pelle',
			text: "Reach Reality in Lai'tela's Reality with all Dimensions disabled, buy Imaginary Upgrade 25 (1.6e15 iM), then Doom your Reality",
			done: s.pelleDoomed
		}
	],
	pelle: (s) => [
		{
			id: 'game-end',
			text: 'Reach the end of the game',
			done: s.records.fullGameCompletions > 0
		}
	]
};

/** Ordered next goals for `stage` (defaults to the save's detected stage). */
export function nextGoals(save: NormalizedSave, stage: StageId = detectStage(save).stage): Goal[] {
	return GOALS[stage](save);
}
