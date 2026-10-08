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

The counter at the top of the Dimensions tab climbs toward <Num value="1.79e308" /> — the largest finite number the game engine holds, displayed as "Infinity" when you pass it. The moment your antimatter reaches it, the **B.Crunch** button lights up: that is the Big Crunch, the first prestige reset.

<!-- canCrunch: thisInfinity.maxAM >= NUMBER_MAX_VALUE outside challenges, vendor/ad-source/src/core/player.js -->

<Screen
	src="pre-infinity/dimensions-antimatter-top.webp"
	alt="The bottom of the Antimatter subtab: the Percentage to Infinity progress bar, with D.Boost, A.Galaxy and Max above the tab bar."
	caption="The Percentage to Infinity bar tracks the final push. It fills as antimatter climbs toward 1.79e308 — then B.Crunch lights up."
/>

<Callout kind="tip">

Before crunching, glance at the preview: the first Crunch always yields exactly <Num value="1" /> Infinity Point. Later Crunches give more based on how fast they were, so the first one is about unlocking the Infinity layer, not farming.

</Callout>

## The Crunch itself

Tapping B.Crunch shows an explanatory modal, then resets antimatter, Dimensions, Boosts and Galaxies — and opens the **Infinity** tab (∞ icon) with your first Infinity Point. Two things are new:

- **Infinity Points (IP)** buy permanent Infinity Upgrades (next articles).
- **Infinities** (the count of Crunches) are themselves a currency: several upgrades scale with them, and the count gates challenges.

Your achievements, autobuyers and their settings survive. The game now plays noticeably faster: with upgrades and challenge autobuyers coming online, the second Infinity takes a fraction of the first.

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
