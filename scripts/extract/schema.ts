/**
 * Types of the extracted game datasets. `bun run extract` copies this file verbatim to
 * `src/lib/data/generated/types.ts`; edit it here, never in the generated copy.
 *
 * Conventions:
 * - Decimal-valued numbers (anything that can exceed 1.8e308) are strings: plain decimal below
 *   1e21, otherwise `<mantissa>e<exponent>` (e.g. `"1e2000"`, `"1.5e45"`). Parse with
 *   break_infinity.js `new Decimal(s)` or `Number(s)` when small.
 * - Text fields hold the in-game text as rendered with the default notation (Mixed scientific),
 *   outside Doomed Reality and outside Celestial Realities. Text may contain inline HTML.
 *   When the text depends on live game state it is `null` and the matching `…Source` field holds
 *   the upstream closure source instead; otherwise `…Source` is `null`.
 * - `…Source` fields that stand alone (no text sibling) hold upstream closure source for logic
 *   (requirements, conditions) that only makes sense against a live save.
 */

import type { StageId } from '../../src/lib/stages';

export interface DatasetSource {
	/** Upstream GitHub repository (`owner/name`). */
	repo: string;
	/** Pinned upstream commit. */
	sha: string;
	/** Files the dataset was extracted from, relative to upstream `src/`. */
	files: string[];
}

export interface Dataset {
	source: DatasetSource;
}

/** Decimal serialized as a string, see the module conventions. */
export type DecimalString = string;

// ---------------------------------------------------------------------------------------------
// Achievements

export interface Achievement {
	/** Upstream id: `row * 10 + column`. */
	id: number;
	/** 1-based row in the achievement grid. */
	row: number;
	/** 1-based column in the achievement grid. */
	column: number;
	name: string;
	description: string | null;
	descriptionSource: string | null;
	/** `null` with `rewardSource === null` means the achievement has no reward. */
	reward: string | null;
	rewardSource: string | null;
}

export interface SecretAchievement {
	id: number;
	row: number;
	column: number;
	name: string;
	description: string | null;
	descriptionSource: string | null;
}

export interface AchievementsDataset extends Dataset {
	normal: Achievement[];
	secret: SecretAchievement[];
}

// ---------------------------------------------------------------------------------------------
// Challenges

export interface NormalChallenge {
	id: number;
	/** Id used by pre-Reality saves. */
	legacyId: number;
	name: string;
	description: string | null;
	descriptionSource: string | null;
	reward: string;
	/** Infinities needed before the challenge unlocks (`"0"` = available from the first Infinity). */
	lockedAt: DecimalString;
}

export interface InfinityChallenge {
	id: number;
	description: string | null;
	descriptionSource: string | null;
	goal: DecimalString;
	/** Antimatter amount that unlocks the challenge. */
	unlockAntimatter: DecimalString;
	reward: string | null;
	rewardSource: string | null;
}

export interface EternityChallenge {
	id: number;
	description: string | null;
	descriptionSource: string | null;
	/** Infinity Points goal for the first completion. */
	goal: DecimalString;
	/** Goal multiplier per completion. */
	goalIncrease: DecimalString;
	/** Goal for completions 0–4 (`goal × goalIncrease^completions`). */
	goals: DecimalString[];
	/** Goal inside Doomed Reality, when different. */
	pelleGoal: DecimalString | null;
	pelleGoalIncrease: DecimalString | null;
	/** Restriction shown for each completion count (EC4 / EC12), else `null`. */
	restrictions: string[] | null;
	reward: string | null;
	rewardSource: string | null;
	/** The Eternity Challenge's unlock study (see `TimeStudiesDataset.eternityChallenges`). */
	unlock: EternityChallengeStudy;
}

export interface ChallengesDataset extends Dataset {
	normal: NormalChallenge[];
	infinity: InfinityChallenge[];
	eternity: EternityChallenge[];
}

// ---------------------------------------------------------------------------------------------
// Infinity upgrades

export interface InfinityUpgrade {
	/** Upstream config key, e.g. `totalTimeMult`. */
	key: string;
	/** Save-file id, e.g. `timeMult`. */
	id: string;
	/** Infinity Point cost; `null` when computed (see `costSource`). */
	cost: number | null;
	costSource: string | null;
	description: string | null;
	descriptionSource: string | null;
	/** Key of the upgrade that must be bought first (previous one in its column), if any. */
	requires: string | null;
	/** Upstream `checkRequirement` closure, as source. */
	requirementSource: string | null;
	/** Charged (Teresa/Ra) variant text, when the upgrade can be charged. */
	charged: { description: string | null; descriptionSource: string | null } | null;
}

export interface BreakInfinityUpgrade {
	key: string;
	/** Save-file id (string for one-time upgrades, rebuyable index for rebuyables). */
	id: string | number;
	rebuyable: boolean;
	/** One-time cost, or `null` for rebuyables. */
	cost: number | null;
	/** Rebuyable cost of purchase n (index n), `null` for one-time upgrades. */
	costs: DecimalString[] | null;
	maxUpgrades: number | null;
	description: string | null;
	descriptionSource: string | null;
}

export interface InfinityUpgradesDataset extends Dataset {
	upgrades: InfinityUpgrade[];
	breakUpgrades: BreakInfinityUpgrade[];
}

// ---------------------------------------------------------------------------------------------
// Eternity upgrades and milestones

export interface EternityUpgrade {
	key: string;
	id: number;
	/** Eternity Point cost. */
	cost: number;
	description: string | null;
	descriptionSource: string | null;
}

export interface EternityMilestone {
	key: string;
	/** Eternities required. */
	eternities: number;
	reward: string | null;
	rewardSource: string | null;
	/** True when the milestone does nothing inside Doomed Reality. */
	pelleUseless: boolean;
}

export interface EternityDataset extends Dataset {
	upgrades: EternityUpgrade[];
	milestones: EternityMilestone[];
}

// ---------------------------------------------------------------------------------------------
// Time studies

export type TimeStudyPath =
	'antimatter-dim' | 'infinity-dim' | 'time-dim' | 'active' | 'passive' | 'idle' | 'light' | 'dark';

export type TimeStudyRequirementType = 'at-least-one' | 'all' | 'dimension-path';

export interface NormalTimeStudy {
	id: number;
	/** Time Theorem cost. */
	cost: number;
	/** Space Theorem cost, when the study can cost ST. */
	stCost: number | null;
	/** Buying any of these studies makes this one also cost Space Theorems. */
	requiresST: number[];
	/** Prerequisite study ids (normal studies, or EC unlock studies ids 1–12 never appear). */
	requires: number[];
	requirementType: TimeStudyRequirementType;
	/** Non-study requirement closures (perks, EC completions, Ra levels), as source. */
	extraRequirementSources: string[];
	description: string | null;
	descriptionSource: string | null;
	path: TimeStudyPath | null;
	/** Triad studies (301–304, unlocked via Ra/V). */
	isTriad: boolean;
	/** Visibility closure for studies hidden until unlocked (triads), as source. */
	unlockedSource: string | null;
}

/** Second requirement of an EC unlock study, on top of the prerequisite studies. */
export type EternityChallengeSecondary =
	| {
			kind: 'resource';
			/** e.g. "Eternities". */
			resource: string;
			/** Amount needed for completions 0–4 (index = completions so far). */
			amounts: DecimalString[];
	  }
	| {
			kind: 'path';
			/** Dimension path that must be the only one bought, e.g. "Antimatter Dimension". */
			path: string;
			forbiddenStudies: number[];
	  };

export interface EternityChallengeStudy {
	/** Eternity Challenge number (1–12). */
	id: number;
	/** Time Theorem cost. */
	cost: number;
	/** Prerequisite studies. */
	requires: number[];
	requirementType: TimeStudyRequirementType;
	/** Extra closures in the requirement (perks / EC completions), as source. */
	extraRequirementSources: string[];
	secondary: EternityChallengeSecondary;
}

export type DilationStudyKey = 'dilation' | 'td5' | 'td6' | 'td7' | 'td8' | 'reality';

export interface DilationTimeStudy {
	/** 1 = Time Dilation, 2–5 = Time Dimensions 5–8, 6 = Reality. */
	id: number;
	key: DilationStudyKey;
	cost: number;
	description: string | null;
	descriptionSource: string | null;
	requirementSource: string;
}

export type TimeStudyRef =
	{ kind: 'normal'; id: number } | { kind: 'ec'; id: number } | { kind: 'dilation'; id: number };

export interface TimeStudyPathInfo {
	path: TimeStudyPath;
	name: string;
	studies: number[];
}

export interface TimeStudyLayoutCell {
	study: TimeStudyRef;
	/** 0-based grid row and column inside the row, as in upstream `TimeStudyTreeLayout`. */
	row: number;
	column: number;
	/** Rows 221–228 use narrow buttons. */
	isSmall: boolean;
	/** Position/size in upstream layout units (`scaling = 1`), top-left origin. */
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface TimeStudyLayout {
	/** Upstream `STUDY_TREE_LAYOUT_TYPE` key, e.g. `NORMAL`, `ALTERNATIVE_62_181`. */
	type: string;
	/** Size of the whole tree in layout units. */
	width: number;
	height: number;
	cells: TimeStudyLayoutCell[];
}

export interface TimeStudyConnection {
	from: TimeStudyRef;
	to: TimeStudyRef;
	/** Hide-condition closure (perk-dependent EC lock bypasses), as source. */
	overrideSource: string | null;
}

export interface TimeStudiesDataset extends Dataset {
	normal: NormalTimeStudy[];
	eternityChallenges: EternityChallengeStudy[];
	dilation: DilationTimeStudy[];
	paths: TimeStudyPathInfo[];
	/** Source of `STUDY_TREE_LAYOUT_TYPE.current`, which picks the active layout. */
	layoutSelectionSource: string;
	layouts: TimeStudyLayout[];
	connections: TimeStudyConnection[];
}

// ---------------------------------------------------------------------------------------------
// Dilation upgrades

export interface DilationUpgrade {
	key: string;
	id: number;
	rebuyable: boolean;
	/** Dilated Time cost for one-time upgrades. */
	cost: DecimalString | null;
	/** Rebuyable: first cost, cost multiplier per purchase, purchase cap (`null` = uncapped). */
	initialCost: DecimalString | null;
	increment: DecimalString | null;
	purchaseCap: number | null;
	description: string | null;
	descriptionSource: string | null;
	/** Only available inside Doomed Reality. */
	pelleOnly: boolean;
}

export interface DilationUpgradesDataset extends Dataset {
	upgrades: DilationUpgrade[];
}

// ---------------------------------------------------------------------------------------------
// Reality and Imaginary upgrades

export interface RealityUpgrade {
	id: number;
	name: string;
	/** Reality Machine cost (one-time), else `null` for rebuyables. */
	cost: DecimalString | null;
	/** Rebuyable: first cost and cost multiplier per purchase. */
	initialCost: DecimalString | null;
	costMult: number | null;
	description: string | null;
	descriptionSource: string | null;
	/** Rebuyables: description template with a `{value}` placeholder. */
	textTemplate: string | null;
	/** Unlock requirement (one-time upgrades). */
	requirement: string | null;
	requirementSource: string | null;
	/** Can be locked to prevent failing the requirement. */
	canLock: boolean;
	/** Automator Points granted when bought. */
	automatorPoints: number | null;
}

export interface ImaginaryUpgrade {
	id: number;
	name: string;
	cost: DecimalString | null;
	initialCost: DecimalString | null;
	costMult: number | null;
	description: string | null;
	descriptionSource: string | null;
	requirement: string | null;
	requirementSource: string | null;
	canLock: boolean;
	isDisabledInDoomed: boolean;
}

export interface RealityUpgradesDataset extends Dataset {
	upgrades: RealityUpgrade[];
	imaginaryUpgrades: ImaginaryUpgrade[];
}

// ---------------------------------------------------------------------------------------------
// Perks

export type PerkFamily =
	'ANTIMATTER' | 'INFINITY' | 'ETERNITY' | 'DILATION' | 'REALITY' | 'AUTOMATION' | 'ACHIEVEMENT';

export interface PerkLayoutInfo {
	/** Index into `Perk.positions` and upstream `player.options.perkLayout`. */
	index: number;
	name: string;
	/** True when positions come from fixed data (all but "Random Positions"). */
	isFixed: boolean;
}

export interface PerkPosition {
	x: number;
	y: number;
}

export interface Perk {
	key: string;
	id: number;
	label: string;
	family: PerkFamily;
	description: string | null;
	descriptionSource: string | null;
	automatorPoints: number | null;
	/** Ids of adjacent perks; a perk is buyable once any neighbour is bought (START is the root). */
	connections: number[];
	/** Node position per layout index, in upstream vis.js coordinates; `null` for random layouts. */
	positions: (PerkPosition | null)[];
}

export interface PerksDataset extends Dataset {
	layouts: PerkLayoutInfo[];
	perks: Perk[];
	/** Undirected edges as `[lowerId, higherId]`, sorted. */
	edges: [number, number][];
}

// ---------------------------------------------------------------------------------------------
// Glyphs

export interface GlyphType {
	id: string;
	symbol: string;
	color: string | null;
	primaryEffect: string | null;
	/** Alchemy resource index (upstream `ALCHEMY_RESOURCE`), `null` if none. */
	alchemyResource: number | null;
	hasRarity: boolean;
	/** Generation condition for non-basic types, as source. */
	isUnlockedSource: string | null;
}

export interface GlyphEffect {
	id: string;
	/** Bit position in the glyph effect bitmask. */
	bitmaskIndex: number;
	glyphTypes: string[];
	/** Can appear on randomly generated glyphs. */
	isGenerated: boolean;
	/** Effect text templates; `{value}` (and `{value2}`) are replaced by formatted values. */
	singleDesc: string | null;
	singleDescSource: string | null;
	totalDesc: string | null;
	totalDescSource: string | null;
	genericDesc: string | null;
	genericDescSource: string | null;
	shortDesc: string | null;
	shortDescSource: string | null;
	enabledInDoomed: boolean;
	/** Ra alteration type (upstream `ALTERATION_TYPE`), `null` if the effect cannot be altered. */
	alterationType: number | null;
}

export interface GlyphsDataset extends Dataset {
	types: GlyphType[];
	effects: GlyphEffect[];
}

// ---------------------------------------------------------------------------------------------
// Celestials

export type CelestialId = 'teresa' | 'effarig' | 'nameless' | 'v' | 'ra' | 'laitela' | 'pelle';

export type CelestialUnlock =
	| { kind: 'achievement'; id: number }
	| { kind: 'teresa-unlock'; key: string }
	| { kind: 'effarig-unlock'; key: string }
	| { kind: 'v-unlock'; key: string }
	| { kind: 'imaginary-upgrade'; id: number };

export interface CelestialInfo {
	id: CelestialId;
	/** Upstream tab key (`enslaved` for The Nameless Ones). */
	tabKey: string;
	name: string;
	/** What makes the Celestial's tab appear, resolved from upstream unlock checks. */
	unlock: CelestialUnlock;
	unlockSource: string;
}

export interface TeresaUnlock {
	key: string;
	id: number;
	/** Reality Machines poured needed. */
	price: number;
	description: string;
	isDisabledInDoomed: boolean;
}

export interface EffarigUnlock {
	key: string;
	id: number;
	/** Relic Shard cost, `null` for the run-completion rewards. */
	cost: number | null;
	label: string | null;
	description: string | null;
	descriptionSource: string | null;
}

export interface VMainUnlockRequirement {
	key: string;
	id: number;
	name: string;
	requirement: DecimalString;
}

export interface VUnlock {
	key: string;
	id: number;
	reward: string | null;
	rewardSource: string | null;
	description: string | null;
	descriptionSource: string | null;
}

export interface VAchievement {
	id: number;
	name: string;
	/** Description per tier (index = tier). */
	descriptions: (string | null)[];
	descriptionSource: string | null;
	/** Raw tier values. */
	values: number[];
	isHard: boolean;
}

export interface RaPet {
	id: string;
	name: string;
	color: string;
	chunkGain: string;
	memoryGain: string;
}

export interface RaUnlock {
	key: string;
	id: number;
	pet: string;
	level: number;
	reward: string | null;
	rewardSource: string | null;
	disabledByPelle: boolean;
}

export interface PelleUpgrade {
	key: string;
	/** Save id: string for rebuyables, number for one-time upgrades. */
	id: string | number;
	rebuyable: boolean;
	description: string | null;
	descriptionSource: string | null;
	/** Reality Shard cost for one-time upgrades. */
	cost: DecimalString | null;
	/** Purchase cap for rebuyables. */
	cap: number | null;
}

export interface PelleStrike {
	key: string;
	id: number;
	requirement: string | null;
	requirementSource: string | null;
	penalty: string | null;
	penaltySource: string | null;
	reward: string | null;
	rewardSource: string | null;
	/** Key of the Rift this Strike unlocks. */
	rift: string;
}

export interface PelleRiftMilestone {
	/** Fill fraction (0–1) at which the milestone applies. */
	requirement: number;
	description: string | null;
	descriptionSource: string | null;
}

export interface PelleRift {
	key: string;
	id: number;
	/** In-game the name cycles through these words; the first is the canonical name. */
	names: string[];
	/** Resource the rift drains (canonical name when it cycles). */
	drainResource: string;
	milestones: PelleRiftMilestone[];
}

export interface CelestialsDataset extends Dataset {
	celestials: CelestialInfo[];
	teresa: { unlocks: TeresaUnlock[] };
	effarig: { unlocks: EffarigUnlock[] };
	v: {
		mainUnlock: VMainUnlockRequirement[];
		unlocks: VUnlock[];
		achievements: VAchievement[];
	};
	ra: { pets: RaPet[]; unlocks: RaUnlock[] };
	pelle: { upgrades: PelleUpgrade[]; strikes: PelleStrike[]; rifts: PelleRift[] };
}

// ---------------------------------------------------------------------------------------------
// How to Play

export interface H2PArticle {
	id: number;
	name: string;
	alias: string;
	/** Game tab the article is linked to (`""` = none). */
	tab: string;
	tags: string[];
	/** Article HTML. */
	info: string | null;
	infoSource: string | null;
	isUnlockedSource: string;
}

export interface H2PDataset extends Dataset {
	articles: H2PArticle[];
}

// ---------------------------------------------------------------------------------------------
// Automator

export interface AutomatorCommandSection {
	name: string;
	items: { header: string; description: string | null; descriptionSource: string | null }[];
}

export interface AutomatorCommand {
	id: number;
	keyword: string;
	category: number;
	categoryName: string;
	/** Syntax line (HTML). */
	syntax: string;
	description: string | null;
	descriptionSource: string | null;
	examples: string[];
	sections: AutomatorCommandSection[];
	isUnlockedSource: string;
}

export interface AutomatorTemplate {
	name: string;
	description: string;
}

export interface AutomatorDataset extends Dataset {
	categories: string[];
	commands: AutomatorCommand[];
	templates: AutomatorTemplate[];
}

// ---------------------------------------------------------------------------------------------
// Progress stages

export interface ProgressStage {
	/** Upstream `PROGRESS_STAGE` value. */
	id: number;
	/** Upstream `PROGRESS_STAGE` key, e.g. `EARLY_INFINITY`. */
	key: string;
	/** Matching id in `src/lib/stages.ts`. */
	stageId: StageId;
	name: string;
	suggestedResource: string | null;
	suggestedResourceSource: string | null;
	/** Check run against a raw save object, as source. */
	hasReachedSource: string;
}

export interface ProgressStagesDataset extends Dataset {
	stages: ProgressStage[];
}
