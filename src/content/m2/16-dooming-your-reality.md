---
title: 'Dooming your Reality'
stage: pelle
order: 10
summary: 'What Doomed Reality takes away, and how Remnants and Pelle Upgrades rebuild you.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## The Doom button

Buying Imaginary Upgrade 25 unlocks the Pelle tab under Celestials. It shows a **Doom Your Reality** button once two gates are met: all currently available achievement rows completed, and every Glyph Alchemy resource at its cap. Tapping it starts a **Doomed Reality**: almost the whole game resets back to pre-Reality, with no RM/iM reward for the progress you are giving up. <!-- vendor/ad-source/src/core/secret-formula/h2p.js:1755-1798 vendor/ad-source/src/components/tabs/celestial-pelle/PelleTab.vue:93-106 -->

What survives: everything under the General and Reality headers in Statistics, and your best challenge times. What stops working inside the Doomed Reality: most upgrades, Time Studies, Challenge and Celestial rewards, Perks, Black Hole, Alchemy, Continuum bonuses, Singularity effects, and most Imaginary Upgrade effects. Dooming unequips your Glyphs and adds five weak Doomed Glyphs, one of each basic type, so it needs five empty unprotected inventory slots; without them the game refuses to Doom. The Pelle tab's **Show effects in Doomed Reality** button lists exactly what still applies — check it whenever you wonder why something feels weak. <!-- vendor/ad-source/src/core/secret-formula/h2p.js:1755-1798 ("disabled or grant no reward"); celestials/pelle/pelle.js initializeRun (unequipAll, freeInventorySpace < 5, doomedGlyph per BASIC_GLYPH_TYPES) -->

<Callout kind="warning">

Finish Lai'tela first: complete every Singularity milestone, buy every Imaginary Upgrade you can, cap Alchemy resources. Nothing left behind can be recovered without undooming, and the Doom gate itself requires the achievements and capped Alchemy.

</Callout>

## Remnants and Armageddon

The Doomed prestige is **Armageddon**. The red box at the top of every tab, where the Reality box used to be, is its button. It reads like "Armageddon for 1.59e6 Remnants, Reality Shards 2.60e30/s ➜ 1.64e31/s": the Remnants you would gain, and your Reality Shard income now and after the reset. The round buttons above the tab bar stay the usual Eternity, B.Crunch, D.Boost, A.Galaxy, R.Galaxy and Max. Armageddon resets the current Doomed run and grants **Remnants**, based on the best antimatter, Infinity Points and Eternity Points you have ever held across Doomed Realities. It needs at least one pending Remnant. <!-- vendor/ad-source/src/core/celestials/pelle/pelle.js:151-167,282-306 (canArmageddon: remnantsGain >= 1; nextRealityShardGain); game.js:621 Pelle.gameLoop(realDiff); emulator 3.18.0 (Pelle save): box text as quoted -->

Remnants do nothing directly. They steadily generate **Reality Shards**, the currency spent on Pelle Upgrades: about 10 shards per second with your first Remnant, rising steeply as Remnants grow. Shard income ticks in real time and ignores game speed. <!-- vendor/ad-source/src/core/celestials/pelle/pelle.js:300-305: (10^(remnants^(1/7.5) × 4) − 1) / 1e3 per second -->

When to Armageddon: read the shard rates in the box. If the rate after the arrow is several times your current rate and you can re-climb to this point quickly, reset. Early on that means roughly doubling each time; later, push for bigger jumps before resetting. The Dilation strike (5th) multiplies future Remnant gain enormously, so runs after it out-earn everything before.

## Pelle Upgrades

Reality Shards buy **Pelle Upgrades** on the Pelle tab, in two groups: <!-- vendor/ad-source/src/core/secret-formula/h2p.js:1755-1798 vendor/ad-source/src/core/secret-formula/celestials/pelle-upgrades.js:20-60 -->

- **First row, repeatable (capped):** raw power — Antimatter Dimension multiplier, game speed, allowed glyph level, Infinity Power conversion, Galaxy power. Buy the Dimension multiplier and game speed first; they un-stall every run. Costs scale per level, so spread early levels across all five before maxing one.
- **Lower rows, one-time:** quality of life that survives Armageddon. They re-grant, in order, Dimension autobuyers 1–4, Dimboost autobuyer, keeping autobuyers through resets, Dimensions 5–8, Galaxy autobuyer, Tickspeed autobuyer, keeping Infinity upgrades, free Dimboosts, keeping Break upgrades, Infinity Dimension autobuyers, keeping Infinity Challenges, free Galaxies' Dimboosts, Replicanti autobuyers, and so on up through Eternity and Dilation persistence. Each costs 1e5 shards up to <Num value="1e50" />, and each removes one piece of rebuild busywork from every future Armageddon. <!-- vendor/ad-source/src/core/secret-formula/celestials/pelle-upgrades.js:61-199 -->

Buy one-time upgrades the moment you can afford them — unlike the repeatables, they never get cheaper to delay. Your first goals are the Dimension autobuyers and keeping what you buy, so runs stop needing manual rebuilding.

## The shape of a Doomed run

Each Armageddon cycle replays the early game at speed: Dimensions to first Infinity (Strike 1 hits), Break-style pushes (Strike 2 at the Galaxy-strength Break upgrade), Eternity (Strike 3), Time Studies toward Dilation (Strike 4 at 115 Time Theorems, Strike 5 at Dilation, which needs EC11 and EC12 ×5 again inside Doom). The next article, [Pelle Strikes](/guide/m2/pelle-strikes), walks through all five. Between cycles, spend shards, fill Rifts, and push Remnants higher.

<Screen
	src="pelle/celestials-nav-top.webp"
	alt="The Celestial Navigation map inside a Doomed Reality: the Pelle node lit alongside the earlier Celestials, with all eight subtabs along the bottom."
	caption="The map in Doom. Pelle sits apart from the rest; the lit path shows how far this Reality has climbed."
/>

<Callout kind="android">

Confirm the away-progress popup after any break: shard income accrues in real time, so short sessions still pay.

</Callout>
