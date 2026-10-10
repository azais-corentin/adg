---
title: 'Time Studies'
stage: early-eternity
order: 13
summary: 'The Studies subtab, the dimension and pace splits, what to buy first, importing trees, and planning one for your Time Theorems.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## The Studies subtab

The **Studies** subtab of the Eternity tab holds everything about Time Studies. From the top:

- Your Time Theorems and the buttons that buy them (see [Time Dimensions and Theorems](/guide/m1/time-dimensions-and-theorems)).
- **Respec Time Studies on next Eternity**: tap it before you Eternity and that Eternity refunds every study, so you can rebuild for a different goal. Completing an Eternity Challenge respecs your tree too. <!-- vendor/ad-source/src/core/eternity.js (respecTimeStudies on EC completion and when player.respec) -->
- **Always buy all Studies up to clicked Study: OFF**: turned on, a tap does what holding does (below).
- **Export tree**, **Select preferred paths** and **Import tree**. Preferred paths tells the game which branch to take at the two splits when it buys several studies for you.
- Six numbered buttons: **your own** preset slots. "Tap to load Time Study presets, hold to edit them." They start empty; hold one to save a tree into it.
- A **Zoom** slider, then the tree itself.

<Screen
	src="early-eternity/eternity-studies-0.webp"
	alt="The top of the Studies subtab: Time Theorems, Buy max Theorems, three Buy Time Theorems buttons, Respec Time Studies on next Eternity, Always buy all Studies up to clicked Study: OFF, Export tree, Select preferred paths, Import tree, preset buttons 1 to 6, the Zoom slider and study 11."
	caption="The top of the Studies subtab, then the tree starting at study 11."
/>

## The tree

The tree is rows of numbered boxes connected by lines. Each box shows what the study does, its current effect where it has one, and its cost in Time Theorems; you can only buy a study connected to one you already own. Tap a box to buy it.

<Screen
	src="early-eternity/eternity-studies-1.webp"
	alt="The study tree: numbered study rows from 11 down through the 60s, EC study boxes on the right edge, and the prestige buttons above the tab bar."
	caption="Each box lists its effect and cost; bought studies are filled in."
/>

<Callout kind="android">

**Hold a study to buy every study up to it**, as the line above the tree says. On a phone this is the quickest way to fill in a tree: hold the deepest study you want instead of tapping each box. At a split the game follows your preferred paths.

</Callout>

## The two splits

Two rows of the tree force a choice between exclusive branches.

**The Dimension split (studies 71/72/73).** Each makes Dimensional Sacrifice boost a different tier: 71 the other Antimatter Dimensions, 72 the 4th Infinity Dimension, 73 the 3rd Time Dimension. Below each one runs its path of four studies (71→81→91→101 for Antimatter, 72→…→102 for Infinity, 73→…→103 for Time), and study 111 needs the end of one path. You can only walk one path at a time (study 201 much later allows a second). Before Eternity Challenges, the Antimatter path is the cheapest (16 TT against 23); each challenge then favours its own path, which the [Eternity Challenge planner](/tools/eternity-challenges) lists per step.

<!-- secret-formula/eternity/time-studies/normal-time-studies.js: 71/72/73 and their paths -->

**The pace split (studies 121/122/123).** Each boosts Eternity Points for a different play style:

- **121 Active**: "You gain more EP based on how fast your last 10 Eternities were", up to ×50 when they average 5 seconds or less.
- **122 Passive**: a flat "You gain ×35 more EP".
- **123 Idle**: "You gain more EP based on time spent this Eternity". It passes Passive's ×35 after about 15 minutes in one Eternity, so it is the one that rewards long runs.

<!-- normal-time-studies.js: 121 clamp(250 / average real time per Eternity, 1, 50); 122 ×35; 123 sqrt(1.39 × seconds this Eternity), 35² / 1.39 ≈ 881 s -->

**Active is the default for pushing and for most Eternity Challenges**: once Eternities are fast it is worth ×50. Inside an Eternity Challenge, 121 itself does nothing for the goal, because it boosts EP and a challenge asks for IP; the Active row earns its place there through 141's IP multiplier, which is largest when Infinities are short. EC5 runs better on Passive: its Antimatter Galaxies get expensive at once, so 132's stronger Replicanti Galaxies matter most. Passive needs no timing. Idle is for overnight runs and a few challenges. The rows behind each pace study continue the same choice (131/132/133, 141/142/143), so switching pace means respeccing that whole column. Active's 131 reads "Automatic Replicanti Galaxies are disabled while offline, but you can get 50% more of them": with it, no Replicanti Galaxies come while the app is closed ([Replicanti in Eternity](/guide/m1/eternity-upgrades-and-replicanti#replicanti-in-eternity)). The [Eternity Challenge planner](/tools/eternity-challenges) gives each step with 131 a second tree for runs left going with the app closed.

<!-- EC5 on Passive: emulator measurement in src/lib/tools/eternity-challenges/order.ts (EC5_PASSIVE). 141: 1e45 / thisInfinityMult(seconds this Infinity), 142: ×1e25; 132: Replicanti Galaxies 40% stronger (normal-time-studies.js). -->

## What to buy first

A new tree starts at study 11 (1 TT) and grows downward. The backbone 11 → 22 → 32 → 42 → 51 → 61 costs 17 TT (the 21 → 31 → 41 side costs the same), and the rest of the top (21, 31, 33, 41) is cheap and worth adding. Then:

- A dimension path, then study 111 (12 TT), which improves the whole IP formula: a big early jump.
- A pace row (121/122/123 and the two below it).
- 151 (8 TT) multiplies all Time Dimensions by ×1e4.
- 161 and 162 (7 TT each) are flat ×1e616 Antimatter and ×1e11 Infinity Dimension multipliers.
- 171 (15 TT), in the middle under 161/162: "Time Shard requirement for the next Tickspeed upgrade goes up slower ×1.33 ➜ ×1.25", so Time Dimensions give free Tickspeed upgrades faster. The first three EC studies hang below it.

<!-- normal-time-studies.js: 151, 161, 162, 171 (requirement 161 or 162) -->

Study 181 (200 TT) gives you 1% of your Infinity Points gained on crunch every second, and marks the transition into the Eternity Challenge era.

## Import and export

**Export tree** copies your tree as a study string: the study numbers in buying order, separated by commas, then `|` and the Eternity Challenge number (`|0` for none), for example `11,22,32,42,51,61|0`.

To load a string, **copy it first, then tap Import tree**: the box fills itself from your clipboard ("Antimatter Dimensions pasted from your clipboard"). If your clipboard holds something else, such as a save, the dialog says "Not a valid tree". Before you confirm, it previews the result:

- "Importing with your current Tree will purchase: …" (or "will not purchase any new Time Studies") with the cost in TT.
- "Importing into an empty Tree will purchase: …", what you would get after a respec.
- "Tree status after loading", the dimension and pace paths.

Tap **IMPORT** to buy, **CANCEL** to leave. The game buys left to right and skips any study you can't afford, along with everything that needs it, so the order of a string matters. The Eternity Challenge study comes last and is only bought if you have met its unlock requirement (or met it before). To switch to a whole different tree, tap **Respec Time Studies on next Eternity**, Eternity, then import.

<!-- src/core/time-studies/time-study-tree.js: exportString, attemptBuyArray, hasRequirements (EC entry goal and TT); commitToGameState buys in order -->

## Plan your tree

Don't copy a fixed tree from an old guide: the right tree depends on how many Time Theorems you have and what you're about to do.

- The **[Time Study planner](/tools/time-studies)** shows the whole tree. Build a tree by tapping studies, load one of adg's starting points or your own studies from an imported save, and copy the string into the game. Enter **Your Time Theorems** (an imported save fills it in) and it tells you whether the tree fits, or exactly what the game would leave out.
- The **[Eternity Challenge planner](/tools/eternity-challenges)** gives a study tree for every step of the completion order, built from the step's path, pace and Time Theorems. Copy it, or open it in the Time Study planner to check it against your TT.

## Further reading

- In-game How to Play: **Time Studies** and **Eternity Challenges**.
- [Unlocking Eternity Challenges](/guide/m1/unlocking-eternity-challenges).
