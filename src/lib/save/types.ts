import type { StageId } from '#lib/stages.ts';

/**
 * A break_infinity-style number: `mantissa × 10^exponent`, with `1 ≤ |mantissa| < 10` (or
 * `mantissa === 0`). `exponent` is `Infinity` for infinite values.
 */
export interface BigNum {
	mantissa: number;
	exponent: number;
}

/** Which export produced the save: Android "Export to mobile" or "Export to web/steam". */
export type SourceFormat = 'android-native' | 'web';

/** Celestial ids, named like `STAGES` (upstream `enslaved` is `nameless`). */
export type CelestialId = 'teresa' | 'effarig' | 'nameless' | 'v' | 'ra' | 'laitela' | 'pelle';

export interface CelestialState {
	/** Bitmask of the celestial's quotes already shown; `> 0` once its tab has been opened. */
	quoteBits: number;
	/** Bitmask of the celestial's own unlocks (absent upstream for Lai'tela and Pelle). */
	unlockBits: number | undefined;
}

/**
 * One save, independent of the export format. Field semantics follow the upstream `player`
 * object (`src/core/player.js` at the pinned SHA). A field typed `| undefined` is one that
 * the Android-native schema does not provide with confidence (see `NATIVE_SCHEMA.md`).
 */
export interface NormalizedSave {
	source: {
		format: SourceFormat;
		/** Transport version from the envelope (`AAA`, `AAB`). */
		transport: string;
	};
	version: {
		/** Upstream player-data version (`player.version`, 25 at the pin); web exports only. */
		save: number | undefined;
		/** Android app versionCode (e.g. 30180000); native exports only. */
		appVersionCode: number | undefined;
		/** App version derived from `appVersionCode` (e.g. `3.18.0`); native exports only. */
		app: string | undefined;
	};
	/** Epoch milliseconds of the last game tick before export. */
	lastUpdate: number;

	antimatter: BigNum;
	infinities: BigNum;
	bankedInfinities: BigNum;
	eternities: BigNum;
	realities: number;
	infinityPoints: BigNum;
	eternityPoints: BigNum;
	realityMachines: BigNum;
	galaxies: number;
	dimensionBoosts: number;

	replicanti: { unlocked: boolean; galaxies: number };
	breakInfinity: boolean;
	/** Big Crunch autobuyer interval in ms (150000 at start, maxed at 100). */
	crunchAutobuyerInterval: number;

	/** Unlocked achievement ids (`row * 10 + column`, 11..188), ascending. */
	achievements: readonly number[];
	/** Unlocked secret achievement ids (`row * 10 + column`), ascending. */
	secretAchievements: readonly number[];
	/** Completed Normal Challenge ids (1..12), ascending. */
	normalChallenges: readonly number[];
	/** Completed Infinity Challenge ids (1..8), ascending. */
	infinityChallenges: readonly number[];
	/** Completions (0..5) per Eternity Challenge; index 0 is EC1, length 12. */
	eternityChallenges: readonly number[];
	/** Owned Time Study ids (upstream ids, e.g. 11, 171, 231), as stored. */
	timeStudies: readonly number[];

	dilation: {
		/** True once the "Unlock Time Dilation" study (dilation study 1) is bought. */
		unlocked: boolean;
		/** Owned dilation study ids (1 = Dilation, 2..5 = TD5..TD8, 6 = Reality). */
		studies: readonly number[];
		dilatedTime: BigNum;
		tachyonParticles: BigNum;
	};

	/** Owned one-time Reality Upgrade ids (6..25), ascending. */
	realityUpgrades: readonly number[];
	/** Owned Perk ids, ascending. */
	perks: readonly number[];
	celestials: Record<CelestialId, CelestialState>;
	/** RM poured into Teresa. */
	teresaPouredAmount: number;
	effarigRelicShards: BigNum;
	/** Completed tiers per V run (sum = number of V-Achievements). */
	vRunUnlocks: readonly number[];
	/** Sum of Ra's pet levels (each starts at 1). */
	raPetLevels: number;
	laitelaDarkMatter: BigNum;
	pelleRemnants: number;
	/** Base Imaginary Machine cap (`reality.iMCap`); `> 0` once iM are unlocked. */
	imaginaryMachineCap: number;
	pelleDoomed: boolean;

	records: {
		/** Game time played, ms. */
		totalTimePlayed: number;
		/** Fastest Infinity this Eternity (game time, ms); `999999999999` when none. */
		bestInfinityTime: number;
		/** Fastest Eternity this Reality (game time, ms); `999999999999` when none. */
		bestEternityTime: number;
		fullGameCompletions: number;
	};
}

export interface StageDetection {
	stage: StageId;
	/** Rough progress within the stage, clamped to [0, 1] (upstream `subProgressValue`). */
	subProgress: number;
}

export interface Goal {
	id: string;
	text: string;
	done: boolean;
}
