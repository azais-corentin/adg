---
title: 'Your first Infinity'
stage: pre-infinity
order: 13
summary: 'Reaching 1.79e308 antimatter, what the first Big Crunch gives you, and what to do in the first minutes after it.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Checklist from '#lib/components/Checklist.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## Reaching Infinity

The counter at the top of the Dimensions tab climbs toward <Num value="1.79e308" /> — the largest finite number the game engine holds, displayed as "Infinity" when you pass it. The Percentage to Infinity bar below the Boost and Galaxy boxes tracks the final push.

The moment your antimatter reaches it, the game stops: the tab's content is replaced by "The world has collapsed due to excess of antimatter." and a large **Big Crunch** button. That is the Big Crunch, the first prestige reset. There is nothing else to do until you press it.

<!-- canCrunch: thisInfinity.maxAM >= NUMBER_MAX_VALUE outside challenges, vendor/ad-source/src/core/player.js; BigCrunchButton.vue shouldDisplay = !player.break && Player.canCrunch -->

<Screen
	src="pre-infinity/at-infinity/dimensions-antimatter-top.webp"
	alt="The Antimatter subtab at Infinity before the first Big Crunch: an empty tab with the text The world has collapsed due to excess of antimatter and a large Big Crunch button at the top, with D.Boost, A.Galaxy and Max above the tab bar."
	caption="At 1.79e308 antimatter the tab collapses to a single Big Crunch button."
/>

<Callout kind="tip">

The first Crunch always yields exactly <Num value="1" /> Infinity Point. Later Crunches give more based on how fast they were, so the first one is about unlocking the Infinity layer, not farming.

</Callout>

## The Crunch itself

Tapping **Big Crunch** resets antimatter, Dimensions, Boosts and Galaxies at once, with no confirmation, and opens the **Infinity** tab (∞ icon) on its Upgrades subtab with your first Infinity Point. Two things are new:

- **Infinity Points (IP)** buy permanent Infinity Upgrades (next articles).
- **Infinities** (the count of Crunches) are themselves a currency: several upgrades scale with them, and the count gates challenges.

Your achievements, autobuyers and their settings survive. The game now plays noticeably faster: with upgrades and challenge autobuyers coming online, the second Infinity takes a fraction of the first.

<Callout kind="android">

Right after the first Crunch the app shows "You have unlocked sticky buttons". Holding one of the round buttons above the tab bar for half a second makes it keep repeating its action after you let go, until you tap it again or sticky another button. A circle marks the stickied button. A **B.Crunch** button also joins that row from now on.

</Callout>

## First minutes after

1. Open the Infinity tab and buy what <Num value="1" /> IP gets you (see [spending your first IP](/guide/m1/first-infinity-upgrades)).
2. Open the Challenges tab (triangle icon): Normal Challenges 1–9 are available immediately, and each completion unlocks upgrading one autobuyer. Start with C1.
3. Crunch again as soon as you can beat your best time — early Infinities come in minutes now, and each one feeds the Infinities-scaling upgrades.

## Common walls

- **The second Infinity feels as slow as the first.** It should not: with the first upgrades bought, runs accelerate fast. If it drags, check that you are re-buying Boosts and Galaxies each run (the start-with-Boosts upgrades later remove this chore) and that Dimension autobuyers are on.
- **"Should I push further past Infinity before crunching?"** Early on, no. Fast crunches raise your Infinities count, which powers the Infinities-scaling upgrades and unlocks C10–12 at 16. Push for big IP hauls only once the cheap upgrades are all bought.

<Checklist stage="pre-infinity" />

## Further reading

- In-game Info → How to play → "Infinity".
