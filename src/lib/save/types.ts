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

/** Pelle's Rifts, named by their upstream keys. */
export type PelleRiftId = 'vacuum' | 'decay' | 'chaos' | 'recursion' | 'paradox';

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
	/** Infinity Dimensions unlocked, 0..8 (`dimensions.infinity[i].isUnlocked`; tiers unlock in order). */
	infinityDimensions: number;

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
	/**
	 * Time Theorems in total: unspent plus what the current tree and EC study cost, i.e. what
	 * you hold after a respec (upstream `timestudy.maxTheorem`).
	 */
	totalTimeTheorems: number;

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
	/** Most antimatter reached in a completed Teresa's Reality (`teresa.bestRunAM`); 1 until the first. */
	teresaBestAntimatter: BigNum;
	effarigRelicShards: BigNum;
	/** Completed tiers per V run (sum = number of V-Achievements). */
	vRunUnlocks: readonly number[];
	/** Sum of Ra's pet levels (each starts at 1). */
	raPetLevels: number;
	/** The Nameless Ones (upstream `enslaved`). */
	nameless: {
		/** Stored game time, ms. */
		storedTime: number;
		/** Bought unlock ids: 0 = Tickspeed softcap, 1 = their Reality (`ENSLAVED_UNLOCKS`). */
		unlocks: readonly number[];
		/** Their Reality has been completed. */
		completed: boolean;
	};
	laitelaDarkMatter: BigNum;
	/** Destabilizations of Lai'tela's Reality (0..8). */
	laitelaDifficultyTier: number;
	laitelaSingularities: number;
	pelleRemnants: number;
	/** Reality Shards, the Doomed currency Remnants generate (`celestials.pelle.realityShards`). */
	pelleRealityShards: BigNum;
	/** Encountered Pelle Strike ids (1..5, `celestials.pelle.progressBits`). */
	pelleStrikes: readonly number[];
	/** Bought one-time Pelle Upgrade ids (`celestials.pelle.upgrades`), ascending. */
	pelleUpgrades: readonly number[];
	/** Total filled per Rift, and the fill percentage spent from it (only Decay's is spent, by Chaos). */
	pelleRifts: Record<PelleRiftId, { fill: BigNum; spent: number }>;
	/** Base Imaginary Machine cap (`reality.iMCap`); `> 0` once iM are unlocked. */
	imaginaryMachineCap: number;
	/** Owned one-time Imaginary Upgrade ids (11..25), ascending. */
	imaginaryUpgrades: readonly number[];
	/** Levels bought across the ten repeatable Imaginary Upgrades. */
	imaginaryRebuyableLevels: number;
	pelleDoomed: boolean;

	records: {
		/** Game time played, ms; game speed scales it. */
		totalTimePlayed: number;
		/** Real time played, ms (`records.realTimePlayed`). */
		realTimePlayed: number;
		/** Fastest Infinity this Eternity (game time, ms); `999999999999` when none. */
		bestInfinityTime: number;
		/** Fastest Eternity this Reality (game time, ms); `999999999999` when none. */
		bestEternityTime: number;
		fullGameCompletions: number;
		/** Most Dilated Time this Reality (`records.thisReality.maxDT`), a V unlock requirement. */
		thisRealityMaxDilatedTime: BigNum;
		/** Most Replicanti this Reality (`records.thisReality.maxReplicanti`), a V unlock requirement. */
		thisRealityMaxReplicanti: BigNum;
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
	/** Done because the player ticked its checklist item by hand, not because the save shows it. */
	byHand?: true;
}
