---
title: 'Dimension Boosts and Antimatter Galaxies'
stage: pre-infinity
order: 11
summary: 'When to reset for a Boost or a Galaxy, what each costs, and why two Galaxies beat one for the first Infinity.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## Dimension Boosts

A **Dimension Boost** resets your Dimensions, Tickspeed and antimatter, and in return multiplies your Dimensions. The Dimension Boost box says what the next one does; on a fresh start it reads "Reset your Dimensions to unlock the 5th Dimension and give a ×2.0 multiplier to the 1st Dimension". Each Boost adds ×2 to every Dimension from the 1st up to one tier past your Boost count ("to Dimensions 1–7" with six Boosts), so the lowest tiers gain the most and the effect stacks. The **D.Boost** round button above the tab bar buys one wherever you are.

Your first four Boosts cost 20 4th, 5th, 6th and 7th Dimensions, and each unlocks one more Dimension (the 5th through the 8th), which is why they are mandatory rather than optional. From the fifth on, a Boost costs 8th Dimensions: 20 for the fifth, then 15 more each time (35, 50, 65, …).

<!-- dimboost.js: bulkRequirement (tier min(boosts+3, 8), amount 20, +15 per Boost from the 5th), multiplierToNDTier (power^(boosts+1-tier)), unlockedByBoost text, softReset (Dimensions, Tickspeed, antimatter); box text from pre-infinity/dimensions-antimatter-top.webp; emulator (Android 3.18.0) with 6 Boosts: "Dimension Boost (6) Requires: 50 8th D", "Reset your Dimensions to give a ×2.0 multiplier to Dimensions 1–7" -->

Buy a Boost as soon as you meet its requirement: the multiplier applies to everything you rebuild afterwards. Old advice about capping Boosts at four or tuning bulk increments is stale; the incremental bulk option was removed, and Boosts stay useful all the way to Infinity.

## Antimatter Galaxies

An **Antimatter Galaxy** is a bigger reset. Its box says so: "Reset your Dimensions and Dimension Boosts to increase the power of Tickspeed upgrades". It resets your Dimensions, Tickspeed and antimatter like a Boost, sets your Boosts back to 0, and in return makes every Tickspeed upgrade stronger. Galaxies multiply with Boosts, so one Galaxy plus a fresh stack of Boosts produces far more than Boosts alone ever could.

The first Galaxy costs <Num value="80" /> 8th Dimensions, and each Galaxy after it costs 60 more: 140 for the second, 200 for the third.

<!-- baseCost 80, costMult 60, requiredTier 8 in vendor/ad-source/src/core/galaxy.js -->

<Screen
	src="pre-infinity/dimensions-antimatter-top.webp"
	alt="The Antimatter subtab in a pre-Infinity game with 2 Galaxies and 0 Boosts: the Dimension Boost box reading Requires 20 4th D and the Antimatter Galaxies (2) box reading Requires 200 8th D."
	caption="The Boost and Galaxy boxes with 2 Galaxies. Boosts start over at 20 4ths after each Galaxy; the third Galaxy needs 200 8ths."
/>

<Callout kind="tip">

Take a Galaxy as soon as you have the 8th Dimensions for it. A Boost bought first would reset those 8ths, and the Galaxy sets your Boosts back to 0 anyway, so it only delays the Galaxy. After the Galaxy, rebuild your Boosts from 20 4th Dimensions.

</Callout>

<!-- galaxy.js galaxyReset: player.dimensionBoosts = 0 (unless Achievement 143), then softReset(0) -->

## How they fit together

The loop for the whole pre-Infinity game is: buy Dimensions → Boost whenever you can → rebuild → Galaxy as soon as you have the 8ths → rebuild Boosts → repeat. Each Galaxy makes the next round of Boosts faster, and each stack of Boosts makes the next Galaxy cheaper in time.

For the **first Infinity, go for two Galaxies, not one**. Guides that say to crunch on one Galaxy to grab an achievement early are a known inefficiency: two Galaxies are drastically faster overall, and the achievement can be picked up later in seconds. This is one of the most-cited corrections veterans give to the short BubbaCow guide.

## Further reading

- In-game Info → How to play → "Dimboosts" and "Galaxies".
- [Tables61's stuck-post](https://www.reddit.com/r/AntimatterDimensions/comments/nt0udk/) — the checkpoints for this stretch if you stall.
