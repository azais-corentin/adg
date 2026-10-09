/**
 * Per-stage milestone checklists: the goals and unlocks to reach before moving on.
 *
 * Thresholds come from the extracted game data (`#lib/data`) where it holds them, otherwise
 * from the upstream source at the pinned SHA; files named in comments are under `src/core/`.
 *
 * `auto` reads an imported save. A predicate may also return true once the save is past a
 * layer the item is required for (see `reached*`), because later resets clear the direct
 * evidence: Eternity resets Infinity Challenges, Reality resets Eternity Challenges and
 * re-locks achievements.
 */
import {
	achievements,
	celestials,
	challenges,
	dilationUpgrades,
	realityUpgrades,
	timeStudies
} from '#lib/data/index.ts';
import {
	BIG_ZERO,
	bigNum,
	formatBigNum,
	gt,
	gte,
	parseBigNum,
	toNumber
} from '#lib/save/bignum.ts';
import type { NormalizedSave } from '#lib/save/types.ts';
import type { StageId } from '#lib/stages.ts';

export interface ChecklistItem {
	/** Stable key into `progress.checklist`; never rename. */
	id: string;
	stage: StageId;
	text: string;
	detail?: string;
	/** True when an imported save shows the item is done. */
	auto?: (save: NormalizedSave) => boolean;
}

/**
 * Formats a threshold: counts below 1e6 in full with separators, larger values in scientific
 * with only the decimals they have (`1.6e15`, `1e140`).
 */
function fmt(value: string | number): string {
	const parsed = parseBigNum(value) ?? BIG_ZERO;
	if (parsed.exponent < 6) return toNumber(parsed).toLocaleString('en-US');
	const places = [0, 1, 2].find((p) => Number.isInteger(parsed.mantissa * 10 ** p)) ?? 2;
	return formatBigNum(parsed, places);
}

function find<T>(list: readonly T[], match: (item: T) => boolean, what: string): T {
	const found = list.find(match);
	if (found === undefined) throw new Error(`checklists: game data has no ${what}`);
	return found;
}

const achievementName = (id: number) =>
	find(achievements.normal, (a) => a.id === id, `achievement ${id}`).name;

const has = (s: NormalizedSave, achievement: number) => s.achievements.includes(achievement);
const bit = (bits: number | undefined, id: number) => ((bits ?? 0) & (1 << id)) !== 0;
const ec = (s: NormalizedSave, id: number) => s.eternityChallenges[id - 1] ?? 0;

// Layers the save has reached. Each one needs everything before it. `reachedReality` also
// stands in for pre-Reality goals that are not strict requirements but that every player
// clears on the way (all Normal and Infinity Challenges, the Eternity milestones, the first
// Eternity Challenge tiers): Reality resets or re-locks the evidence for them.
const reachedReality = (s: NormalizedSave) => s.realities > 0 || has(s, 141);
const reachedDilation = (s: NormalizedSave) =>
	s.dilation.unlocked || has(s, 136) || reachedReality(s);
const reachedEternity = (s: NormalizedSave) =>
	gt(s.eternities, 0) || has(s, 96) || reachedReality(s);
const reachedInfinity = (s: NormalizedSave) =>
	gt(s.infinities, 0) || gt(s.bankedInfinities, 0) || has(s, 21) || reachedEternity(s);

/** dimboost.js: four Boosts unlock the 8th; achievement 18 is buying one; a Galaxy costs 8ths. */
const eighthDimensionUnlocked = (s: NormalizedSave) =>
	s.dimensionBoosts >= 4 || has(s, 18) || s.galaxies >= 1 || reachedInfinity(s);

/** `Decimal.NUMBER_MAX_VALUE` as the game prints it (Scientific, 2 places). */
const INFINITY = '1.80e308';

const ic = (id: number) =>
	find(challenges.infinity, (c) => c.id === id, `Infinity Challenge ${id}`);
const ec1Unlock = find(challenges.eternity, (c) => c.id === 1, 'EC1').unlock;
const ec1Eternities =
	ec1Unlock.secondary.kind === 'resource' ? ec1Unlock.secondary.amounts[0] : undefined;
const dilationStudy = (key: string) =>
	find(timeStudies.dilation, (s) => s.key === key, `dilation study ${key}`);
const vUnlock = (key: string) =>
	find(celestials.v.unlocks, (u) => u.key === key, `V unlock ${key}`);
const effarigUnlock = (key: string) =>
	find(celestials.effarig.unlocks, (u) => u.key === key, `Effarig unlock ${key}`);
const imaginaryUpgrade = (id: number) =>
	find(realityUpgrades.imaginaryUpgrades, (u) => u.id === id, `Imaginary Upgrade ${id}`);
const pelleStrike3 = find(celestials.pelle.strikes, (s) => s.id === 3, 'Pelle Strike 3');
const galaxyThreshold = find(
	dilationUpgrades.upgrades,
	(u) => u.key === 'galaxyThreshold',
	'dilation upgrade galaxyThreshold'
);
const ttGenerator = find(
	dilationUpgrades.upgrades,
	(u) => u.key === 'ttGenerator',
	'dilation upgrade ttGenerator'
);

const teresaItem = (key: string, text: string, detail?: string): ChecklistItem => {
	const unlock = find(celestials.teresa.unlocks, (u) => u.key === key, `Teresa unlock ${key}`);
	return {
		id: `teresa-${key}`,
		stage: 'teresa',
		text: `${text} (pour ${fmt(unlock.price)} RM)`,
		detail,
		auto: (s) =>
			bit(s.celestials.teresa.unlockBits, unlock.id) || s.teresaPouredAmount >= unlock.price
	};
};

const effarigLayer = (key: string, text: string, detail: string): ChecklistItem => {
	const unlock = effarigUnlock(key);
	return {
		id: `effarig-${key}`,
		stage: 'effarig',
		text,
		detail,
		auto: (s) => bit(s.celestials.effarig.unlockBits, unlock.id)
	};
};

const raItem = (key: string, text: string): ChecklistItem => {
	const unlock = find(celestials.ra.unlocks, (u) => u.key === key, `Ra unlock ${key}`);
	const pet = find(celestials.ra.pets, (p) => p.id === unlock.pet, `Ra pet ${unlock.pet}`);
	return {
		id: `ra-${key}`,
		stage: 'ra',
		text: `${text} (${pet.name} memory level ${unlock.level})`,
		auto: (s) => bit(s.celestials.ra.unlockBits, unlock.id)
	};
};

const vRequirements = celestials.v.mainUnlock
	.map((r) => `${fmt(r.requirement)} ${r.name}`)
	.join(', ');
const vReward = (key: string, count: number, text: string): ChecklistItem => {
	const unlock = vUnlock(key);
	return {
		id: `v-${count}`,
		stage: 'v',
		text: `Earn ${count} V-Achievements: ${text}`,
		auto: (s) =>
			s.vRunUnlocks.reduce((sum, n) => sum + n, 0) >= count ||
			bit(s.celestials.v.unlockBits, unlock.id)
	};
};

const laitelaUpgrade = imaginaryUpgrade(15);
const pelleUpgrade = imaginaryUpgrade(25);
/** Rebuyable Reality Upgrades have no fixed `cost`. */
const ONE_TIME_REALITY_UPGRADES = realityUpgrades.upgrades.filter((u) => u.cost !== null).length;

export const CHECKLIST: readonly ChecklistItem[] = [
	// Pre-Infinity. dimboost.js: the first boost costs 20 4th Dimensions, and each of the first
	// four unlocks one more Dimension. galaxy.js: the first Galaxy costs 80 8th Dimensions, so a
	// Galaxy (which resets Boosts) proves the 8th was unlocked.
	{
		id: 'pre-inf-first-boost',
		stage: 'pre-infinity',
		text: 'Buy your first Dimension Boost',
		detail: 'It costs 20 4th Antimatter Dimensions and unlocks the 5th Dimension.',
		auto: (s) => s.dimensionBoosts >= 1 || has(s, 15) || eighthDimensionUnlocked(s)
	},
	{
		id: 'pre-inf-8th-dimension',
		stage: 'pre-infinity',
		text: 'Unlock the 8th Antimatter Dimension',
		detail: 'Each of your first four Dimension Boosts unlocks one more Dimension.',
		auto: eighthDimensionUnlocked
	},
	{
		// sacrifice.js: visible with achievement 18, usable after more than 4 Dimension Boosts.
		// `player.sacrificed` resets on every Boost, so the evidence is achievement 32 (×600 from
		// Sacrifice) or Normal Challenge 8, which is won with Sacrifice.
		id: 'pre-inf-sacrifice',
		stage: 'pre-infinity',
		text: 'Use Dimensional Sacrifice',
		detail:
			'It works from your 5th Dimension Boost on: it resets your 1st–7th Dimensions and multiplies the 8th.',
		auto: (s) =>
			has(s, 32) || s.normalChallenges.includes(8) || has(s, 48) || reachedEternity(s)
	},
	{
		id: 'pre-inf-first-galaxy',
		stage: 'pre-infinity',
		text: 'Buy your first Antimatter Galaxy',
		detail: 'It costs 80 8th Antimatter Dimensions and makes every Tickspeed upgrade stronger.',
		auto: (s) => s.galaxies >= 1 || has(s, 26) || reachedEternity(s)
	},
	{
		id: 'pre-inf-infinity',
		stage: 'pre-infinity',
		text: `Reach ${INFINITY} antimatter and Big Crunch`,
		detail: 'Your first Infinity gives 1 Infinity Point and opens the Infinity tab.',
		auto: reachedInfinity
	},

	// Infinity. normal-challenges.js: NC10–12 unlock at 16 Infinities; big-crunch-autobuyer.js:
	// NC12 unlocks the Big Crunch autobuyer; break-infinity needs its interval at 100 ms.
	{
		id: 'inf-upgrades',
		stage: 'early-infinity',
		text: 'Buy all 16 Infinity Upgrades',
		detail: `Achievement “${achievementName(41)}”.`,
		auto: (s) => has(s, 41) || reachedReality(s)
	},
	{
		id: 'inf-nc-1-9',
		stage: 'early-infinity',
		text: 'Complete Normal Challenges 1–9',
		detail: 'Each completion unlocks or upgrades an autobuyer.',
		auto: (s) =>
			[1, 2, 3, 4, 5, 6, 7, 8, 9].every((id) => s.normalChallenges.includes(id)) ||
			has(s, 48) ||
			reachedEternity(s)
	},
	{
		id: 'inf-16-infinities',
		stage: 'early-infinity',
		text: 'Reach 16 Infinities',
		detail: 'This unlocks Normal Challenges 10–12.',
		auto: (s) => gte(s.infinities, 16) || has(s, 48) || s.breakInfinity || reachedEternity(s)
	},
	{
		id: 'inf-all-nc',
		stage: 'early-infinity',
		text: 'Complete all 12 Normal Challenges',
		detail: 'Normal Challenge 12 unlocks the Big Crunch autobuyer.',
		auto: (s) => s.normalChallenges.length === 12 || has(s, 48) || reachedReality(s)
	},
	{
		id: 'inf-crunch-autobuyer',
		stage: 'early-infinity',
		text: 'Max the Big Crunch autobuyer interval (100 ms)',
		detail: 'Upgrade its interval with Infinity Points in the Autobuyers tab.',
		auto: (s) => s.crunchAutobuyerInterval <= 100 || s.breakInfinity || reachedEternity(s)
	},
	{
		id: 'inf-break',
		stage: 'early-infinity',
		text: 'Break Infinity',
		detail: `Antimatter can then pass ${INFINITY}, and Big Crunches give more Infinity Points.`,
		auto: (s) => s.breakInfinity || has(s, 51) || reachedEternity(s)
	},

	// Broken Infinity. infinity-dimension.js: the 1st Infinity Dimension needs 1e1100 antimatter.
	// replicanti.js: `Replicanti.unlock` costs 1e140 IP.
	{
		id: 'break-first-id',
		stage: 'break-infinity',
		text: 'Unlock the 1st Infinity Dimension',
		detail: 'It needs 1e1100 antimatter.',
		auto: (s) => has(s, 63) || reachedEternity(s)
	},
	{
		id: 'break-ic1',
		stage: 'break-infinity',
		text: 'Complete Infinity Challenge 1',
		detail: `It unlocks at ${fmt(ic(1).unlockAntimatter)} antimatter; its goal is ${fmt(ic(1).goal)}.`,
		auto: (s) => s.infinityChallenges.includes(1) || has(s, 67) || reachedReality(s)
	},
	{
		id: 'break-id4',
		stage: 'break-infinity',
		text: 'Unlock the 4th Infinity Dimension',
		auto: (s) => has(s, 75) || reachedEternity(s)
	},
	{
		id: 'break-replicanti',
		stage: 'break-infinity',
		text: 'Unlock Replicanti for 1e140 Infinity Points',
		detail: 'Replicanti is a subtab of the Infinity tab.',
		auto: (s) => s.replicanti.unlocked || reachedEternity(s)
	},

	// Replicanti.
	{
		id: 'rep-galaxy',
		stage: 'replicanti',
		text: 'Get your first Replicanti Galaxy',
		detail: `Buy a Max Replicanti Galaxies upgrade, then let Replicanti reach ${INFINITY}.`,
		auto: (s) => s.replicanti.galaxies > 0 || reachedEternity(s)
	},
	{
		id: 'rep-all-ic',
		stage: 'replicanti',
		text: 'Complete all 8 Infinity Challenges',
		detail: `IC8 unlocks at ${fmt(ic(8).unlockAntimatter)} antimatter.`,
		auto: (s) => s.infinityChallenges.length === 8 || has(s, 82) || reachedReality(s)
	},
	{
		id: 'rep-id8',
		stage: 'replicanti',
		text: 'Unlock the 8th Infinity Dimension',
		auto: (s) => has(s, 98) || reachedReality(s)
	},
	{
		id: 'rep-eternity',
		stage: 'replicanti',
		text: `Reach ${INFINITY} Infinity Points and Eternity`,
		detail: 'Your first Eternity resets everything from Infinity down and gives Eternity Points.',
		auto: reachedEternity
	},

	// Eternity. secret-formula/eternity/eternity-milestones.js: the Eternity autobuyer at 100
	// Eternities, the last milestone at 1,000.
	{
		id: 'et-first-study',
		stage: 'early-eternity',
		text: 'Buy your first Time Study',
		detail: 'Buy Time Theorems with antimatter, Infinity Points or Eternity Points.',
		auto: (s) => s.timeStudies.length > 0 || reachedDilation(s)
	},
	{
		id: 'et-100-eternities',
		stage: 'early-eternity',
		text: 'Reach 100 Eternities',
		detail: 'This milestone unlocks the Eternity autobuyer.',
		auto: (s) => toNumber(s.eternities) >= 100 || has(s, 102) || reachedDilation(s)
	},
	{
		id: 'et-all-milestones',
		stage: 'early-eternity',
		text: 'Reach 1,000 Eternities for every Eternity milestone',
		detail: `Achievement “${achievementName(102)}”.`,
		auto: (s) => toNumber(s.eternities) >= 1000 || has(s, 102) || reachedReality(s)
	},
	{
		id: 'et-ec1',
		stage: 'early-eternity',
		text: 'Complete Eternity Challenge 1',
		detail: `Its study needs Time Study ${ec1Unlock.requires.join(' or ')}, ${fmt(ec1Eternities ?? 0)} Eternities and ${ec1Unlock.cost} Time Theorems.`,
		auto: (s) => ec(s, 1) >= 1 || reachedReality(s)
	},

	// Eternity Challenges. dilation-time-studies.js: Dilation needs EC11 and EC12 at 5
	// completions, a row-23 study, and enough total Time Theorems.
	{
		id: 'ec-1-10-once',
		stage: 'eternity-challenges',
		text: 'Complete EC1–EC10 at least once each',
		auto: (s) => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].every((id) => ec(s, id) >= 1) || reachedReality(s)
	},
	{
		id: 'ec-50-tiers',
		stage: 'eternity-challenges',
		text: 'Reach 50 Eternity Challenge completions in total',
		detail: `Achievement “${achievementName(123)}”.`,
		auto: (s) =>
			s.eternityChallenges.reduce((sum, n) => sum + n, 0) >= 50 || has(s, 123) || reachedReality(s)
	},
	{
		id: 'ec-11-12',
		stage: 'eternity-challenges',
		text: 'Complete EC11 and EC12 five times each',
		auto: (s) => (ec(s, 11) >= 5 && ec(s, 12) >= 5) || reachedDilation(s)
	},
	{
		id: 'ec-unlock-dilation',
		stage: 'eternity-challenges',
		text: 'Unlock Time Dilation',
		detail: `Own a row-23 Time Study (231–234) and buy the Dilation study for ${fmt(dilationStudy('dilation').cost)} Time Theorems.`,
		auto: reachedDilation
	},

	// Time Dilation. progress-checker.js: Late Eternity starts above 1e15 Dilated Time.
	{
		id: 'dil-first',
		stage: 'early-dilation',
		text: 'Dilate time and earn Tachyon Particles',
		detail: `Achievement “${achievementName(136)}”.`,
		auto: (s) => gt(s.dilation.tachyonParticles, 0) || has(s, 136) || reachedReality(s)
	},
	{
		id: 'dil-galaxy-threshold',
		stage: 'early-dilation',
		text: `Buy the first Tachyon Galaxy threshold upgrade (${fmt(galaxyThreshold.initialCost ?? 0)} Dilated Time)`,
		detail: 'Tachyon Galaxies come from Dilated Time; this makes the next ones cheaper.'
	},
	{
		id: 'dil-tt-generator',
		stage: 'early-dilation',
		text: `Buy the Time Theorem generator (${fmt(ttGenerator.cost ?? 0)} Dilated Time)`
	},
	{
		id: 'dil-dt-1e15',
		stage: 'early-dilation',
		text: 'Reach 1e15 Dilated Time',
		auto: (s) => gt(s.dilation.dilatedTime, bigNum(1, 15)) || reachedReality(s)
	},

	// Late Eternity. dilation-time-studies.js: the TD5–8 studies, and the Reality study needs
	// 1e4000 EP. achievements/normal-achievement.js: pre-Reality achievements are rows 1–13.
	{
		id: 'late-td5-8',
		stage: 'late-eternity',
		text: 'Unlock Time Dimensions 5–8',
		detail: `The four studies cost ${['td5', 'td6', 'td7', 'td8'].map((key) => fmt(dilationStudy(key).cost)).join(', ')} Time Theorems.`,
		auto: (s) => [2, 3, 4, 5].every((id) => s.dilation.studies.includes(id)) || reachedReality(s)
	},
	{
		id: 'late-all-ec',
		stage: 'late-eternity',
		text: 'Complete every Eternity Challenge five times',
		// Achievement 163 needs every EC at five completions.
		auto: (s) => s.eternityChallenges.every((n) => n >= 5) || has(s, 163)
	},
	{
		id: 'late-ep-e4000',
		stage: 'late-eternity',
		text: 'Reach 1e4000 Eternity Points',
		detail: 'The Reality study needs it.',
		auto: (s) => gte(s.eternityPoints, bigNum(1, 4000)) || reachedReality(s)
	},
	{
		id: 'late-achievements',
		stage: 'late-eternity',
		text: 'Unlock all 104 achievements in rows 1–13',
		auto: (s) => s.achievements.filter((id) => id < 140).length === 104
	},
	{
		id: 'late-first-reality',
		stage: 'late-eternity',
		text: 'Buy the Reality study and make your first Reality',
		auto: reachedReality
	},

	// Reality. celestials/teresa.js: Teresa unlocks with achievement 147 (all Reality Upgrades).
	{
		id: 'real-automator',
		stage: 'early-reality',
		text: 'Unlock the Automator',
		detail: `Achievement “${achievementName(142)}”.`,
		auto: (s) => has(s, 142)
	},
	{
		id: 'real-black-hole',
		stage: 'early-reality',
		text: 'Unlock the Black Hole',
		auto: (s) => has(s, 144)
	},
	{
		id: 'real-perks',
		stage: 'early-reality',
		text: 'Buy every Perk',
		detail: `Achievement “${achievementName(146)}”.`,
		auto: (s) => has(s, 146)
	},
	{
		id: 'real-upgrades',
		stage: 'early-reality',
		text: `Buy all ${ONE_TIME_REALITY_UPGRADES} one-time Reality Upgrades`,
		detail: 'This unlocks Teresa.',
		auto: (s) => s.realityUpgrades.length >= ONE_TIME_REALITY_UPGRADES || has(s, 147)
	},

	// Teresa. secret-formula/celestials/teresa.js unlock prices.
	teresaItem('run', "Unlock Teresa's Reality"),
	{
		id: 'teresa-complete',
		stage: 'teresa',
		text: "Complete Teresa's Reality",
		detail: 'Its reward grows with the most antimatter you reach in it.'
	},
	teresaItem('epGen', 'Unlock passive Eternity Point generation'),
	teresaItem('shop', "Unlock Teresa's Perk Point Shop"),
	teresaItem('effarig', 'Unlock Effarig'),

	// Effarig. secret-formula/celestials/effarig.js: Relic Shard costs and run layers.
	{
		id: 'effarig-glyph-filter',
		stage: 'effarig',
		text: `Buy Glyph Filtering (${fmt(effarigUnlock('glyphFilter').cost ?? 0)} Relic Shards)`,
		auto: (s) => bit(s.celestials.effarig.unlockBits, effarigUnlock('glyphFilter').id)
	},
	{
		id: 'effarig-run',
		stage: 'effarig',
		text: `Unlock Effarig's Reality (${fmt(effarigUnlock('run').cost ?? 0)} Relic Shards)`,
		auto: (s) => bit(s.celestials.effarig.unlockBits, effarigUnlock('run').id)
	},
	effarigLayer(
		'infinity',
		"Clear the Infinity layer of Effarig's Reality",
		'Rewards: a bigger Replicanti cap and more max Replicanti Galaxies.'
	),
	effarigLayer(
		'eternity',
		"Clear the Eternity layer of Effarig's Reality",
		'This unlocks The Nameless Ones.'
	),
	effarigLayer(
		'reality',
		"Clear the Reality layer of Effarig's Reality",
		'This unlocks Effarig Glyphs.'
	),

	// The Nameless Ones. celestials/enslaved.js `ENSLAVED_UNLOCKS`: prices in stored game time.
	// secret-formula/tabs.js: V's tab needs achievement 151.
	{
		id: 'nameless-store-time',
		stage: 'nameless',
		text: 'Store game time by charging the Black Hole',
		detail:
			'Stored game time buys their unlocks: 1e35 years raises the Tickspeed softcap from Time Dimensions.'
	},
	{
		id: 'nameless-unlock-run',
		stage: 'nameless',
		text: "Unlock The Nameless Ones' Reality (1e40 years of stored game time)",
		detail: 'You also need a level 5,000 Glyph and a Glyph of 100% rarity.'
	},
	{
		id: 'nameless-complete',
		stage: 'nameless',
		text: "Complete The Nameless Ones' Reality"
	},
	{
		id: 'nameless-ach151',
		stage: 'nameless',
		text: 'Get 800 Antimatter Galaxies without buying 8th Dimensions in one Infinity',
		detail: `Achievement “${achievementName(151)}” opens V's tab.`,
		auto: (s) => has(s, 151)
	},

	// V. secret-formula/celestials/v.js `mainUnlock` and V-Achievement rewards.
	{
		id: 'v-unlock',
		stage: 'v',
		text: 'Unlock V',
		detail: `Have all of these at once: ${vRequirements}.`,
		auto: (s) => bit(s.celestials.v.unlockBits, vUnlock('vAchievementUnlock').id)
	},
	vReward('adPow', 5, 'Antimatter Dimension power from Space Theorems'),
	vReward('autoAutoClean', 16, 'automatic Glyph purge on Reality'),
	vReward('raUnlock', 36, 'unlock Ra'),

	// Ra. secret-formula/celestials/ra.js unlocks by memory level.
	raItem('effarigUnlock', "Unlock Effarig's memories"),
	raItem('unlockGlyphAlchemy', 'Unlock Glyph Alchemy'),
	raItem('enslavedUnlock', "Unlock The Nameless Ones' memories"),
	raItem('vUnlock', "Unlock V's memories"),
	raItem('unlockHardV', "Unlock V's hard achievements"),
	{
		// machines.js: Imaginary Machines unlock at the 1e1000 Reality Machine cap.
		id: 'ra-imaginary-machines',
		stage: 'ra',
		text: 'Reach 1e1000 Reality Machines to unlock Imaginary Machines',
		auto: (s) => s.imaginaryMachineCap > 0
	},

	// Imaginary Machines. secret-formula/reality/imaginary-upgrades.js.
	{
		id: 'im-first-upgrades',
		stage: 'imaginary-machines',
		text: 'Buy the repeatable Imaginary Upgrades',
		detail: 'They raise the Imaginary Machine cap and boost the earlier layers.'
	},
	{
		id: 'im-upgrade-11',
		stage: 'imaginary-machines',
		text: `Buy “${imaginaryUpgrade(11).name}” (${fmt(imaginaryUpgrade(11).cost ?? 0)} iM)`,
		detail: 'The first one-time Imaginary Upgrade; it needs 1e90 total Relic Shards.'
	},
	{
		id: 'im-laitela',
		stage: 'imaginary-machines',
		text: `Buy “${laitelaUpgrade.name}” (${fmt(laitelaUpgrade.cost ?? 0)} iM) to unlock Lai'tela`,
		detail: laitelaUpgrade.requirement ?? undefined,
		auto: (s) => s.celestials.laitela.quoteBits > 0 || gt(s.laitelaDarkMatter, 0) || s.pelleDoomed
	},

	// Lai'tela. Achievements 174, 176, 177; Pelle unlocks with Imaginary Upgrade 25.
	{
		id: 'laitela-singularity',
		stage: 'laitela',
		text: 'Condense your first Singularity',
		detail: `Achievement “${achievementName(174)}”.`,
		auto: (s) => has(s, 174)
	},
	{
		id: 'laitela-annihilate',
		stage: 'laitela',
		text: 'Annihilate your Dark Matter Dimensions',
		auto: (s) => has(s, 176)
	},
	{
		id: 'laitela-milestones',
		stage: 'laitela',
		text: 'Complete every Singularity milestone once',
		auto: (s) => has(s, 177)
	},
	{
		id: 'laitela-destabilize',
		stage: 'laitela',
		text: "Fully destabilize Lai'tela's Reality",
		detail: 'Each destabilization disables one more Dimension tier inside it.'
	},
	{
		id: 'laitela-doom',
		stage: 'laitela',
		text: `Buy “${pelleUpgrade.name}” (${fmt(pelleUpgrade.cost ?? 0)} iM) and Doom your Reality`,
		detail: pelleUpgrade.requirement ?? undefined,
		auto: (s) => s.pelleDoomed || has(s, 181)
	},

	// Pelle. secret-formula/celestials/strikes.js; achievements 182–188.
	{
		id: 'pelle-remnants',
		stage: 'pelle',
		text: 'Armageddon for your first Remnants',
		auto: (s) => s.pelleRemnants > 0 || has(s, 188)
	},
	{
		id: 'pelle-ad-autobuyers',
		stage: 'pelle',
		text: 'Permanently regain every Antimatter Dimension autobuyer',
		auto: (s) => has(s, 182)
	},
	{
		id: 'pelle-strike-3',
		stage: 'pelle',
		text: `Encounter the third Pelle Strike: ${pelleStrike3.requirement ?? 'Reach Eternity'}`,
		auto: (s) => has(s, 184)
	},
	{
		id: 'pelle-dilation',
		stage: 'pelle',
		text: 'Unlock Time Dilation while Doomed',
		auto: (s) => has(s, 187)
	},
	{
		id: 'pelle-end',
		stage: 'pelle',
		text: 'Beat the game',
		auto: (s) => has(s, 188) || s.records.fullGameCompletions > 0
	}
];

/** The stage's items, in checklist order. */
export function stageItems(stage: StageId): ChecklistItem[] {
	return CHECKLIST.filter((item) => item.stage === stage);
}
