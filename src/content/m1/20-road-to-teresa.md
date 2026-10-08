---
title: 'The road to Teresa'
stage: early-reality
order: 39
summary: 'Finishing all Reality Upgrades, earning Master of Reality, and what waits in the Celestials tab.'
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

## The goal: all 25 upgrades

Teresa, the first Celestial, unlocks through achievement **Master of Reality (147)**: own all Reality Upgrades. That means the 5 repeatable amplifiers plus all 20 one-time upgrades from rows 2–5. <!-- vendor/ad-source/src/core/secret-formula/achievements/normal-achievements.js; vendor/ad-source/src/core/celestials/teresa.js -->

The realistic order from here:

1. **Finish rows 2–3** (15 and 50 RM). These are cheap relative to your income by now; the unlock runs are the work, not the costs.
2. **Rush Scour to Empower** in row 4, then fill the row. Sacrifice income compounds from the moment it unlocks.
3. **Push to row 5** (<Num value="1e5" /> RM each). This is the long grind: fast sub-minute Realities with the RM setup (Power/Infinity mix), alternating with glyph-level farming when levels stall.
4. **Synthetic Symbolism's glyphless Reality** and **Effortless Existence's <Num value="1e11111" /> EP best** are the two awkward unlocks — do the glyphless run at 5,000 RM with sacrifice bonuses carrying you, and treat e11111 EP as your final pre-Teresa push goal.

The Automator with run-after-Reality plus the Reality autobuyer (from Effortless Existence) automates the whole loop: studies, Eternity, Dilation, Reality, repeat.

## What changes at Teresa

The moment the last upgrade buys, a **Celestials** tab appears next to Reality, with a navigation map and Teresa's panel: pour RM into her container (up to <Num value="1e24" /> RM) to unlock the Eternity-Upgrades start at <Num value="1e6" />, glyph Undo at <Num value="1e10" />, her Reality at <Num value="1e14" />, passive EP generation at <Num value="1e18" />, the Perk Point Shop at <Num value="1e21" /> and Effarig at <Num value="1e24" />. Pouring is one-way — poured RM is gone — but each threshold is permanent. <!-- vendor/ad-source/src/core/secret-formula/celestials/teresa.js -->

<Screen
	src="ra/celestials-teresa-1.webp"
	alt="Teresa's panel in the Celestials tab: the pour bar, her Reality button and the unlock ladder from Eternity-Upgrades start up to Effarig."
	caption="Teresa's panel. Pour RM for permanent unlocks; her Reality multiplies sacrifice — but finish the last upgrades before pouring."
/>

Her Reality's reward multiplies all glyph sacrifice values by your best antimatter in the run (scaling as (log10(AM)/1.5e8)^12) — the sacrifice stockpile from Scour to Empower pays off a second time.

<Callout kind="tip">

Do not pour your first RM the instant Teresa unlocks. Spend everything on the last upgrades first (pouring does not count as spending), keep a farming buffer, then pour the surplus.

</Callout>

<Checklist stage="early-reality" />

## Further reading

- In-game How to Play: Celestials; Teresa, Celestial of Reality (Info tab → How to play).
