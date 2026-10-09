---
title: "V's Reality and V-Achievements"
stage: v
order: 11
summary: 'The six V-Achievements, their goals per tier, and what the weakened V Reality does to you.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## Starting V's Reality

The V tab's big hexagon starts V's Reality. Inside it, almost everything is weakened: all Dimension multipliers, EP gain, IP gain and Dilated Time gain are square-rooted, the Replicanti interval is squared, and the Exponential alchemy effect is switched off. The tab states this up front, so read it before your first run. <!-- vendor/ad-source/src/core/dimensions/antimatter-dimension.js:79-81, infinity-dimension.js:172-174, time-dimension.js:229-231, src/core/dilation.js:141, src/core/replicanti.js:118-121, src/core/celestials/ra/alchemy.js:79 -->

<Screen
	src="v/celestials-v-0.webp"
	alt="The top of the V tab: the Start V's Reality weakening text, and the first achievement rows with their goal text and progress counters."
	caption="V's tab. The text under the hexagon lists every weakening; the rows below track each achievement."
/>

V-Achievements can only be completed inside V's Reality, but progress is permanent: leaving and re-entering keeps your best records and earned tiers. <!-- vendor/ad-source/src/components/tabs/celestial-v/VTab.vue:299-300 --> So treat each run as a focused attempt at one or two goals, not as a place to live.

## The six V-Achievements

Each has six tiers. Completing a tier earns one Space Theorem (hard achievements earn two; see [Hard V](/guide/m2/hard-v)). <!-- vendor/ad-source/src/core/secret-formula/celestials/v.js `runUnlocks`; vendor/ad-source/src/core/celestials/V.js `updateTotalRunUnlocks` -->

### Glyph Knight

Reality with at most 5, 4, 3, 2, 1, then 0 Glyphs equipped. Earlier tiers are nearly free: just unequip Glyphs before you Reality. The final tier means a whole Reality with bare hands, so save it for when your non-Glyph multipliers can carry a Reality alone.

Glyph Knight is the best first target because it needs no setup beyond remembering to unequip.

### AntiStellar

Hold 4,000 / 4,300 / 4,600 / 4,900 / 5,200 / 5,500 total Galaxies of all types at once. <!-- vendor/ad-source/src/core/secret-formula/celestials/v.js `runUnlocks[1].values` --> Every Antimatter, Replicanti and Tachyon Galaxy counts. This is a grind goal: push galaxies in every system, and use goal-reduction (below) once tiers get expensive.

### Se7en deadly matters

Inside Eternity Challenge 7, reach <Num value="1e600000" /> / <Num value="1e720000" /> / <Num value="1e840000" /> / <Num value="1e960000" /> / <Num value="1e1080000" /> / <Num value="1e1200000" /> IP. The hexagon reads "Get 1e600,000 IP in EC7." EC7 already restricts you, and V squares the pain, so this one waits until your glyph levels make EC7 comfortable.

### Young Boy

Inside Eternity Challenge 12, without unlocking Time Dilation, reach <Num value="1e400000000" /> / <Num value="1e450000000" /> / <Num value="1e500000000" /> / <Num value="1e600000000" /> / <Num value="1e700000000" /> / <Num value="1e800000000" /> antimatter ("Get 1e400,000,000 AM in EC12 without unlocking Dilation."). The no-Dilation condition bites: plan an EC12 run that never touches the Dilation study, and push antimatter with raw Dimensions and galaxies.

### Eternal Sunshine

Reach <Num value="1e7000" /> / <Num value="1e7600" /> / <Num value="1e8200" /> / <Num value="1e8800" /> / <Num value="1e9400" /> / <Num value="1e10000" /> Eternity Points ("Get 1e7000 Eternity Points."). Straightforward EP pushing inside V's Reality; strong Time Glyphs and a good Eternity setup carry it.

### Matterception

While Dilated and inside Eternity Challenge 5, buy 51 / 52 / 53 / 54 / 55 / 56 Dimension Boosts. This is the fiddliest one: you must be Dilated *and* in EC5 at once, then afford that many Boosts under V's square-rooted multipliers. Extra Boost sources and cost reduction help; attempt it when your Dilated EC5 runs feel comfortable.

## Goal reduction with Perk Points

Once you hold 2 V-Achievements, you can spend Perk Points to lower the goals of further tiers. Normal reductions cost a flat 1,000 PP per step; hard ones start at 1,000 PP and grow 15% per step. <!-- vendor/ad-source/src/core/celestials/V.js `nextNormalReductionCost`, `nextHardReductionCost` -->

Reduction is how the late tiers stay reachable. When a goal looks impossible, check the reduction cost before giving up: a few steps often move a tier from absurd to merely hard.

<Callout kind="tip">

Push the cheap early tiers of every achievement first. Each one is a Space Theorem, and the first batch of Theorems unlocks tree options (next article) that make the harder tiers easier.

</Callout>

## When to move on

Keep alternating: earn a few tiers, spend the Theorems, push further with the stronger tree. The V stage ends at 36 Space Theorems, which unlocks Ra — but the last tiers are the hardest in the game, so expect to interleave V runs with farming for a long while. [Space Theorems and the Time Study tree](/guide/m2/space-theorems) explains what each Theorem buys.

## Further reading

- [Fandom Guide](https://antimatter-dimensions.fandom.com/wiki/Guide) — V-Achievement order discussion.
- [r/AntimatterDimensions: struggling with V](https://www.reddit.com/r/AntimatterDimensions/comments/17ixjq6/struggling_with_v/) — player advice on tier order.
