---
title: 'Hard V and Triad studies'
stage: v
order: 13
summary: 'Unlocking hard V-Achievements through Ra, what each one asks, and the four Triad studies.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## Unlocking hard V

The last three V-Achievements stay hidden until V's memory in Ra reaches level 6. That unlock also opens one Triad study per 6 V-memory levels. <!-- vendor/ad-source/src/core/secret-formula/celestials/ra.js `unlockHardV`: level 6, effect one triad per 6 V levels --> So hard V is a mid-Ra activity: level Ra's V memory first (see [Ra's memories](/guide/m2/ra-memories)), then come back to V's tab with new goals and new tools.

Each hard tier counts as **two** V-Achievements and awards **two** Space Theorems. Flip the tab between normal and hard with the Hide/Show Hard V button. <!-- vendor/ad-source/src/components/tabs/celestial-v/VTab.vue, vendor/ad-source/src/core/celestials/V.js `updateTotalRunUnlocks` -->

<Screen
	src="ra/celestials-v-0.webp"
	alt="The V tab with Hide Hard V and Create a Cursed Glyph buttons above the Start V's Reality hexagon."
	caption="Hard V controls sit above the Reality hexagon: toggle the list, and create Cursed Glyphs for Requiem."
/>

## The three hard achievements

### Requiem for a Glyph

Reality with at most −1, −4, −7, −10, −13 "Glyphs" — negative counts reached with Cursed Glyphs, each of which counts as −3 toward the total. <!-- vendor/ad-source/src/core/secret-formula/celestials/v.js `runUnlocks[6].values`; vendor/ad-source/src/core/glyphs/glyph-core.js:736-740 --> The **Create a Cursed Glyph** button on the V tab makes them (up to five at once).

Cursed Glyphs are weak by design, so this is really a low-Glyph-count Reality with extra steps: equip the cursed ones plus as few real Glyphs as possible, keep the whole Reality equipped that way, and Reality when the tracker confirms the count. Start with the −1 tier (one cursed Glyph plus minimal real ones) and work down.

### Post-destination

Hold <Num value="400000" /> Time Theorems while your Black Hole is at ÷<Num value="1e100" /> or slower — and slower means more inverted — without discharging or entering EC12. Tiers raise the bar to ÷<Num value="1e150" />, ÷<Num value="1e200" />, ÷<Num value="1e250" />, ÷<Num value="1e300" />. <!-- vendor/ad-source/src/core/secret-formula/celestials/v.js `runUnlocks[7].values` -->

This one is about Black Hole control: invert the hole deep, accumulate 400,000 TT, and resist every urge to discharge. Plan a Reality where TT is the only goal.

### Shutter Glyph

Reach Glyph level 6,500 / 7,000 / 8,000 / 9,000 / 10,000 inside V's Reality. <!-- vendor/ad-source/src/core/secret-formula/celestials/v.js `runUnlocks[8].values` --> This is the purest power check in V: your Glyph level must be enormous *despite* the square-root weakening. High sacrifices, strong Reality Glyphs, and every Theorem in the tree all feed it. Take the early tiers when they come naturally during farming; the 9,000+ tiers wait for near-maxed setups.

Goal reduction applies to hard achievements too, at a steeper price. Use it — the top tiers assume you will.

## The four Triad studies

Triads sit at the bottom of the Time Study tree. Each costs 12 Space Theorems (10 after the Ra discount... precisely, the 36-Achievement reward cuts all Theorem costs by 2) and needs its three parent studies plus a V-memory level: <!-- vendor/ad-source/src/core/secret-formula/eternity/time-studies/normal-time-studies.js triad entries 301–304 -->

| Triad | Needs | V memory | Effect |
| --- | --- | --- | --- |
| 301 | 221, 222, 231 | 6 | Study 231 boosts study 221's effect. |
| 302 | 223, 224, 232 | 12 | Distant galaxy scaling starts 3,000 galaxies later. |
| 303 | 225, 226, 233 | 18 | Studies 225/226 grant half again as many extra Replicanti Galaxies. |
| 304 | 227, 228, 234 | 24 | Dimensional Sacrifice multiplier is squared. |

Buy them in order as they unlock: each one multiplies the system its parents cover, and 302 and 304 in particular break open galaxy and sacrifice scaling for everything downstream, including the remaining V tiers.

<Callout kind="tip">

Do not rush into hard tiers the moment they appear. Level Teresa and Effarig memories first for raw power, take triads as they come, and let the hard tiers fall in roughly this order: Requiem early tiers, Post-destination, Shutter, then the top tier of each.

</Callout>

## When to move on

Hard V has no separate ending: its tiers feed the same 36-and-beyond Theorem count, and full completion means 66 Space Theorems. <!-- vendor/ad-source/src/core/celestials/V.js `isFullyCompleted`: 66 --> By the time the last hard tiers fall, Ra's memories should be near their caps and Imaginary Machines on the horizon. The [Ra stage articles](/guide/m2/ra-memories) pick up the other half of this loop.

## Further reading

- [r/AntimatterDimensions: hard V](https://www.reddit.com/r/AntimatterDimensions/comments/17jy2lt/hard_v/) — order and setup advice.
- [Time Study planner](/tools/time-studies) — draft triad trees before buying.
