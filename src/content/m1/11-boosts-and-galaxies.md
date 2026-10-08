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

## Dimension Boosts

A **Dimension Boost** resets your Dimensions and antimatter, and in return multiplies Dimension production. Each Boost is worth roughly ×2 to the lower tiers, and the effect stacks, so repeated Boosts are the main engine of the early game. The **D.Boost** round button above the tab bar buys one wherever you are.

The first Boost costs <Num value="20" /> 4th Dimensions. Each of your first four Boosts also unlocks a new Dimension (the 5th through the 8th), which is why the first few are mandatory rather than optional. After that the price keeps climbing — more Dimensions, from higher tiers — so each Boost takes a little longer to earn than the last.

<!-- first boost 20 4th dims; first four unlock dims 5-8: src/lib/checklists/items.ts citing dimboost.js; power base 2 in vendor/ad-source/src/core/dimboost.js -->

Rule of thumb: buy a Boost as soon as the requirement is met and production has clearly slowed. There is no benefit to waiting once you can afford one — the multiplier applies to everything you rebuild afterwards. Old advice about capping Boosts at four or tuning bulk increments is stale; the incremental bulk option was removed, and Boosts stay useful all the way to Infinity.

## Antimatter Galaxies

An **Antimatter Galaxy** is a bigger reset: it resets your Dimensions, Boosts and antimatter, and in return makes every Tickspeed upgrade stronger. Galaxies multiply with Boosts, so one Galaxy plus a fresh stack of Boosts produces far more than Boosts alone ever could.

<Screen
	src="pre-infinity/dimensions-antimatter-top.webp"
	alt="The Antimatter subtab on a new save: the Dimension Boost box reading Requires 20 4th D and the Antimatter Galaxies box reading Requires 200 8th D."
	caption="The Boost and Galaxy boxes on the Dimensions tab. Each names the Dimensions it needs — 20 4ths for the first Boost, 200 8ths for the later Galaxy."
/>

<!-- baseCost 80, costMult 60, requiredTier 8 in vendor/ad-source/src/core/galaxy.js -->

<Callout kind="warning">

Do not buy a Galaxy the instant you can afford it if a Boost is also available. Rebuild your Boosts first, then take the Galaxy — it resets them, so you want the Galaxy to multiply a healthy Boost stack, not an empty one.

</Callout>

## How they fit together

The loop for the whole pre-Infinity game is: buy Dimensions → Boost when stalled → rebuild → Galaxy when 8ths pile up → rebuild Boosts → repeat. Each Galaxy makes the next round of Boosts faster, and each stack of Boosts makes the next Galaxy cheaper in time.

For the **first Infinity, go for two Galaxies, not one**. Guides that say to crunch on one Galaxy to grab an achievement early are a known inefficiency: two Galaxies are drastically faster overall, and the achievement can be picked up later in seconds. This is one of the most-cited corrections veterans give to the short BubbaCow guide.

## Further reading

- In-game Info → How to play → "Dimboosts" and "Galaxies".
- [Tables61's stuck-post](https://www.reddit.com/r/AntimatterDimensions/comments/nt0udk/) — the checkpoints for this stretch if you stall.
