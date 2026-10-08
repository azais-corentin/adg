/**
 * Game data extracted from the pinned upstream source by `bun run extract`
 * (see scripts/extract/README.md). Plain JSON: no upstream code runs in the browser.
 *
 * The JSON files are produced by builders typed against `./generated/types`, so the assertions
 * below only narrow JSON's widened literals (e.g. `kind: string` → `'normal' | 'ec' | …`).
 */
import achievementsJson from './generated/achievements.json';
import automatorJson from './generated/automator.json';
import celestialsJson from './generated/celestials.json';
import challengesJson from './generated/challenges.json';
import dilationUpgradesJson from './generated/dilation-upgrades.json';
import eternityJson from './generated/eternity.json';
import glyphsJson from './generated/glyphs.json';
import h2pJson from './generated/h2p.json';
import infinityUpgradesJson from './generated/infinity-upgrades.json';
import perksJson from './generated/perks.json';
import progressStagesJson from './generated/progress-stages.json';
import realityUpgradesJson from './generated/reality-upgrades.json';
import timeStudiesJson from './generated/time-studies.json';
import type {
	AchievementsDataset,
	AutomatorDataset,
	CelestialsDataset,
	ChallengesDataset,
	DilationUpgradesDataset,
	EternityDataset,
	GlyphsDataset,
	H2PDataset,
	InfinityUpgradesDataset,
	PerksDataset,
	ProgressStagesDataset,
	RealityUpgradesDataset,
	TimeStudiesDataset
} from './generated/types';

export type * from './generated/types';

export const achievements = achievementsJson as AchievementsDataset;
export const automator = automatorJson as AutomatorDataset;
export const celestials = celestialsJson as CelestialsDataset;
export const challenges = challengesJson as ChallengesDataset;
export const dilationUpgrades = dilationUpgradesJson as DilationUpgradesDataset;
export const eternity = eternityJson as EternityDataset;
export const glyphs = glyphsJson as GlyphsDataset;
export const h2p = h2pJson as H2PDataset;
export const infinityUpgrades = infinityUpgradesJson as InfinityUpgradesDataset;
export const perks = perksJson as PerksDataset;
export const progressStages = progressStagesJson as ProgressStagesDataset;
export const realityUpgrades = realityUpgradesJson as RealityUpgradesDataset;
export const timeStudies = timeStudiesJson as TimeStudiesDataset;
