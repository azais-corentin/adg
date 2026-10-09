import { BIG_ZERO, fromNumber, parseBigNum, toNumber } from './bignum.ts';
import type { DecodedSave } from './decode.ts';
import type { BigNum, CelestialState, NormalizedSave, PelleRiftId } from './types.ts';

/**
 * Maps either save schema onto `NormalizedSave`. The web schema is upstream's `player`
 * (`src/core/player.js`); the Android-native mapping is documented key by key in
 * `NATIVE_SCHEMA.md`. Missing fields fall back to upstream's fresh-game values.
 */

type Path = readonly (string | number)[];

/** Reads a nested own property of untyped JSON, or `undefined` when any step is missing. */
function at(root: unknown, path: Path): unknown {
	let current = root;
	for (const key of path) {
		if (typeof current !== 'object' || current === null || !Object.hasOwn(current, key)) {
			return undefined;
		}
		current = Reflect.get(current, key);
	}
	return current;
}

/** Plain numbers, or Decimal-like values collapsed to a number (native stores some counters as Decimals). */
function num(root: unknown, path: Path, fallback: number): number {
	const value = at(root, path);
	if (typeof value === 'number') return value;
	const big = parseBigNum(value);
	return big ? toNumber(big) : fallback;
}

function big(root: unknown, path: Path, fallback: BigNum = BIG_ZERO): BigNum {
	return parseBigNum(at(root, path)) ?? fallback;
}

function bool(root: unknown, path: Path): boolean {
	return at(root, path) === true;
}

function numbers(root: unknown, path: Path): number[] {
	const value = at(root, path);
	return Array.isArray(value) ? value.filter((v): v is number => typeof v === 'number') : [];
}

/** Ids of set bits in `bits`, where id `n` is stored at `1 << n` (upstream `BitPurchasableMechanicState`). */
function bitIds(bits: number, ids: Iterable<number>): number[] {
	const set: number[] = [];
	for (const id of ids) if (Math.floor(bits / 2 ** id) % 2 === 1) set.push(id);
	return set;
}

function range(from: number, to: number): number[] {
	return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

/**
 * Achievement ids from upstream's per-row bitmasks: row `r` is `bits[r - 1]`, column `c` is
 * bit `c - 1`, id is `r * 10 + c` (`src/core/achievements/normal-achievement.js`).
 */
function achievementIds(rows: readonly number[]): number[] {
	return rows.flatMap((bits, row) =>
		bitIds(bits, range(0, 7)).map((bit) => (row + 1) * 10 + bit + 1)
	);
}

/** Fallback for "no best time yet" (upstream initial `Number.MAX_VALUE`). */
const NO_TIME = Number.MAX_VALUE;

export function normalizeSave({ format, transport, player: p }: DecodedSave): NormalizedSave {
	const native = format === 'android-native';
	const version = at(p, ['version']);
	const versionCode = native && typeof version === 'number' ? version : undefined;

	/** `upstreamKey` is the `player.celestials` key (upstream `enslaved` is our `nameless`). */
	const celestial = (upstreamKey: string): CelestialState => {
		const unlockBits = at(p, ['celestials', upstreamKey, 'unlockBits']);
		return {
			quoteBits: num(p, ['celestials', upstreamKey, 'quoteBits'], 0),
			unlockBits: typeof unlockBits === 'number' ? unlockBits : undefined
		};
	};

	// Chaos stores its fill as a plain number in web saves and as a Decimal in native ones.
	const rift = (key: PelleRiftId) => ({
		fill: big(p, ['celestials', 'pelle', 'rifts', key, 'fill']),
		spent: num(p, ['celestials', 'pelle', 'rifts', key, 'percentageSpent'], 0)
	});

	const pets = at(p, ['celestials', 'ra', 'pets']);
	const raPetLevels =
		typeof pets === 'object' && pets !== null
			? Object.keys(pets).reduce((sum, pet) => sum + num(pets, [pet, 'level'], 0), 0)
			: 0;
	// Web saves key the ten levels by id (`{1: …, 10: …}`); native saves use an array.
	const imaginaryRebuyables = at(p, ['reality', 'imaginaryRebuyables']);
	const imaginaryRebuyableLevels =
		typeof imaginaryRebuyables === 'object' && imaginaryRebuyables !== null
			? Object.values(imaginaryRebuyables).reduce<number>(
					(sum, level) => sum + (typeof level === 'number' ? level : 0),
					0
				)
			: 0;

	const dilationStudies = numbers(p, ['dilation', 'studies']);
	const ecRaw = native ? numbers(p, ['challenge', 'eternity', 'completions']) : [];

	return {
		source: { format, transport },
		version: {
			save: !native && typeof version === 'number' ? version : undefined,
			appVersionCode: versionCode,
			// [INFERENCE] versionCode layout M·10⁷ + m·10⁴ + p·10² (30180000 → 3.18.0).
			app:
				versionCode === undefined
					? undefined
					: `${Math.floor(versionCode / 1e7)}.${Math.floor(versionCode / 1e4) % 1000}.${Math.floor(versionCode / 100) % 100}`
		},
		lastUpdate: num(p, ['lastUpdate'], 0),

		antimatter: big(p, ['antimatter'], fromNumber(10)),
		infinities: big(p, ['infinities']),
		bankedInfinities: big(p, [native ? 'bankedInfinities' : 'infinitiesBanked']),
		eternities: big(p, ['eternities']),
		realities: num(p, ['realities'], 0),
		infinityPoints: big(p, ['infinityPoints']),
		eternityPoints: big(p, ['eternityPoints']),
		realityMachines: big(p, ['reality', 'realityMachines']),
		galaxies: num(p, ['galaxies'], 0),
		dimensionBoosts: num(p, ['dimensionBoosts'], 0),
		infinityDimensions: range(0, 7).filter((i) =>
			bool(p, ['dimensions', 'infinity', i, 'isUnlocked'])
		).length,

		replicanti: {
			unlocked: bool(p, ['replicanti', 'unl']),
			galaxies: num(p, ['replicanti', 'galaxies'], 0)
		},
		breakInfinity: bool(p, [native ? 'brake' : 'break']),
		crunchAutobuyerInterval: num(p, ['auto', 'bigCrunch', 'interval'], 150000),

		achievements: achievementIds(numbers(p, [native ? 'achievements' : 'achievementBits'])),
		secretAchievements: achievementIds(
			numbers(p, [native ? 'secretAchievements' : 'secretAchievementBits'])
		),
		normalChallenges: bitIds(num(p, ['challenge', 'normal', 'completedBits'], 0), range(1, 12)),
		infinityChallenges: bitIds(num(p, ['challenge', 'infinity', 'completedBits'], 0), range(1, 8)),
		eternityChallenges: range(1, 12).map((id) =>
			native ? (ecRaw[id - 1] ?? 0) : num(p, ['eternityChalls', `eterc${id}`], 0)
		),
		timeStudies: numbers(p, ['timestudy', 'studies']),
		totalTimeTheorems: num(p, ['timestudy', 'maxTheorem'], 0),

		dilation: {
			unlocked: dilationStudies.includes(1),
			studies: dilationStudies,
			dilatedTime: big(p, ['dilation', 'dilatedTime']),
			tachyonParticles: big(p, ['dilation', 'tachyonParticles'])
		},

		realityUpgrades: bitIds(num(p, ['reality', 'upgradeBits'], 0), range(6, 25)),
		perks: numbers(p, ['reality', 'perks']).sort((a, b) => a - b),
		celestials: {
			teresa: celestial('teresa'),
			effarig: celestial('effarig'),
			nameless: celestial('enslaved'),
			v: celestial('v'),
			ra: celestial('ra'),
			laitela: celestial('laitela'),
			pelle: celestial('pelle')
		},
		teresaPouredAmount: num(p, ['celestials', 'teresa', 'pouredAmount'], 0),
		teresaBestAntimatter: big(p, ['celestials', 'teresa', 'bestRunAM'], fromNumber(1)),
		effarigRelicShards: big(p, ['celestials', 'effarig', 'relicShards']),
		vRunUnlocks: numbers(p, ['celestials', 'v', 'runUnlocks']),
		raPetLevels,
		nameless: {
			storedTime: num(p, ['celestials', 'enslaved', 'stored'], 0),
			unlocks: numbers(p, ['celestials', 'enslaved', 'unlocks']),
			completed: bool(p, ['celestials', 'enslaved', 'completed'])
		},
		laitelaDarkMatter: big(p, ['celestials', 'laitela', 'darkMatter']),
		laitelaDifficultyTier: num(p, ['celestials', 'laitela', 'difficultyTier'], 0),
		laitelaSingularities: num(p, ['celestials', 'laitela', 'singularities'], 0),
		pelleRemnants: num(p, ['celestials', 'pelle', 'remnants'], 0),
		pelleRealityShards: big(p, ['celestials', 'pelle', 'realityShards']),
		pelleStrikes: bitIds(num(p, ['celestials', 'pelle', 'progressBits'], 0), range(1, 5)),
		pelleUpgrades: numbers(p, ['celestials', 'pelle', 'upgrades']).sort((a, b) => a - b),
		pelleRifts: {
			vacuum: rift('vacuum'),
			decay: rift('decay'),
			chaos: rift('chaos'),
			recursion: rift('recursion'),
			paradox: rift('paradox')
		},
		imaginaryMachineCap: num(p, ['reality', 'iMCap'], 0),
		imaginaryUpgrades: bitIds(num(p, ['reality', 'imaginaryUpgradeBits'], 0), range(11, 25)),
		imaginaryRebuyableLevels,
		pelleDoomed: bool(p, ['celestials', 'pelle', 'doomed']),

		records: {
			totalTimePlayed: num(p, ['records', 'totalTimePlayed'], 0),
			realTimePlayed: num(p, ['records', 'realTimePlayed'], 0),
			bestInfinityTime: num(
				p,
				native
					? ['records', 'thisEternity', 'bestInfinityTime']
					: ['records', 'bestInfinity', 'time'],
				NO_TIME
			),
			bestEternityTime: num(
				p,
				native
					? ['records', 'thisReality', 'bestEternityTime']
					: ['records', 'bestEternity', 'time'],
				NO_TIME
			),
			fullGameCompletions: num(p, ['records', 'fullGameCompletions'], 0),
			thisRealityMaxDilatedTime: big(p, ['records', 'thisReality', 'maxDT']),
			thisRealityMaxReplicanti: big(p, ['records', 'thisReality', 'maxReplicanti'])
		}
	};
}
