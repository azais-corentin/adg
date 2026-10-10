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

The last three V-Achievements stay hidden until V's memory in Ra reaches level 6. That unlock also opens one Triad study per 6 V-memory levels (V level 6 → first triad, 12 → second, 18 → third, 24 → fourth). <!-- vendor/ad-source/src/core/secret-formula/celestials/ra.js `unlockHardV`: level 6, effect floor(V level / 6) --> So hard V is a mid-Ra activity: level Ra's V memory first (see [Ra's memories](/guide/m2/ra-memories)), then come back to V's tab with new goals and new tools.

Each hard tier counts as **two** V-Achievements and awards **two** Space Theorems. Flip the tab between normal and hard with the Hide/Show Hard V button. <!-- vendor/ad-source/src/components/tabs/celestial-v/VTab.vue, vendor/ad-source/src/core/celestials/V.js `updateTotalRunUnlocks` -->

<Screen
	src="v/celestials-v-1.webp"
	alt="The lower V tab: more achievement rows with goal text and progress counters, and the Space Theorem reward ladder below them."
	caption="The achievement rows and the Theorem ladder. Flip to hard V from the buttons above the Reality hexagon."
/>

## The three hard achievements

### Requiem for a Glyph

The card reads "Unlock Reality with at most -1 Glyphs equipped for the entire Reality", and the five tiers ask for at most −1, −4, −7, −10 and −13 Glyphs. The count goes below zero through Cursed Glyphs: each equipped Glyph counts 1 (your Companion Glyph doesn't count), and each Cursed Glyph counts −3 instead. <!-- vendor/ad-source/src/core/secret-formula/celestials/v.js `runUnlocks[6]` values [1, 4, 7, 10, 13] (negated) and description; vendor/ad-source/src/core/glyphs/glyph-core.js:734-740 (length − 4 × cursed, activeWithoutCompanion); emulator card for tier 2: "Unlock Reality with at most -4 Glyphs equipped for the entire Reality." (round 4 review) --> The **Create a Cursed Glyph** button on the V tab makes them (up to five at once).

With five Glyph slots, each tier fits one more Cursed Glyph:

| Tier | At most | One setup that fits                |
| ---- | ------- | ---------------------------------- |
| 1    | −1      | 1 Cursed Glyph and 2 other Glyphs  |
| 2    | −4      | 2 Cursed Glyphs and 2 other Glyphs |
| 3    | −7      | 3 Cursed Glyphs and 2 other Glyphs |
| 4    | −10     | 4 Cursed Glyphs and 1 other Glyph  |
| 5    | −13     | 5 Cursed Glyphs                    |

The count is the highest it was at any moment of the Reality, so set the Glyphs up before you start V's Reality and don't add one mid-run. Cursed Glyphs are weak by design, so the late tiers are really Realities on one or no real Glyph: take them once the rest of your account carries V's Reality that way.

### Post-destination

Hold <Num value="400000" /> Time Theorems while your Black Hole is at ÷<Num value="1e100" /> or slower — and slower means more inverted — without discharging or entering EC12. Tiers raise the bar to ÷<Num value="1e150" />, ÷<Num value="1e200" />, ÷<Num value="1e250" />, ÷<Num value="1e300" /> (five tiers total: 100, 150, 200, 250, 300). <!-- vendor/ad-source/src/core/secret-formula/celestials/v.js `runUnlocks[7].values` -->

This one is about Black Hole control: invert the hole deep, accumulate 400,000 TT, and resist every urge to discharge. Plan a Reality where TT is the only goal.

### Shutter Glyph

Reach Glyph level 6,500 / 7,000 / 8,000 / 9,000 / 10,000 inside V's Reality (five tiers). <!-- vendor/ad-source/src/core/secret-formula/celestials/v.js `runUnlocks[8].values` --> This is the purest power check in V: your Glyph level must be enormous _despite_ the square-root weakening. High sacrifices, strong Reality Glyphs, and every Theorem in the tree all feed it. Take the early tiers when they come naturally during farming; the 9,000+ tiers wait for near-maxed setups.

Goal reduction applies to hard achievements too, at a steeper price. Use it — the top tiers assume you will.

## The four Triad studies

Triads sit at the bottom of the Time Study tree. Each costs 12 Space Theorems (10 after the Ra discount... precisely, the 36-Achievement reward cuts all Theorem costs by 2) and needs its three parent studies plus a V-memory level: <!-- vendor/ad-source/src/core/secret-formula/eternity/time-studies/normal-time-studies.js triad entries 301–304 -->

| Triad | Needs         | V memory | Effect                                                              |
| ----- | ------------- | -------- | ------------------------------------------------------------------- |
| 301   | 221, 222, 231 | 6        | Study 231 boosts study 221's effect.                                |
| 302   | 223, 224, 232 | 12       | Distant galaxy scaling starts 3,000 galaxies later.                 |
| 303   | 225, 226, 233 | 18       | Studies 225/226 grant half again as many extra Replicanti Galaxies. |
| 304   | 227, 228, 234 | 24       | Dimensional Sacrifice multiplier is squared.                        |

Buy them in order as they unlock: each one multiplies the system its parents cover, and 302 and 304 in particular break open galaxy and sacrifice scaling for everything downstream, including the remaining V tiers.

<Callout kind="tip">

Do not rush into hard tiers the moment they appear. Level Teresa and Effarig memories first for raw power, take triads as they come, and let the hard tiers fall in roughly this order: Requiem early tiers, Post-destination, Shutter, then the top tier of each.

</Callout>

## When to move on

Hard V has no separate ending: its tiers feed the same 36-and-beyond Theorem count, and full completion means 66 Space Theorems. <!-- vendor/ad-source/src/core/celestials/V.js `isFullyCompleted`: 66 --> By the time the last hard tiers fall, Ra's memories should be near their caps and Imaginary Machines on the horizon. The [Ra stage articles](/guide/m2/ra-memories) pick up the other half of this loop.

## Further reading

- [r/AntimatterDimensions: hard V](https://www.reddit.com/r/AntimatterDimensions/comments/17jy2lt/hard_v/) — order and setup advice.
- [Time Study planner](/tools/time-studies) — draft triad trees before buying.
