---
title: 'Unlocking Time Dilation'
stage: early-dilation
order: 10
summary: 'The four requirements for the Dilation study (EC11/EC12 at five completions, a row-23 study, 12900 lifetime Time Theorems) and how to meet them.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
	import Checklist from '#lib/components/Checklist.svelte';
</script>

## What Dilation is

Time Dilation is the last big mechanic of the Eternity layer. Once unlocked, you can run Dilated Eternities: production is weakened while dilated, but you earn two new currencies — Tachyon Particles and Dilated Time — which buy upgrades far stronger than the penalty. Everything from here to your first Reality runs on those upgrades.

You unlock it by buying a study at the bottom of the Time Study tree. The study itself costs <Num value="5000" /> Time Theorems, but the game only lets you buy it once four requirements are all met. <!-- vendor/ad-source/src/core/secret-formula/eternity/time-studies/dilation-time-studies.js -->

## The four requirements

1. **Eternity Challenge 11 completed five times.** EC11 disables nearly all Dimension multipliers except Infinity Power and Dimension Boosts. Its goal starts at <Num value="1e450" /> antimatter and rises by <Num value="1e200" /> per completion. <!-- vendor/ad-source/src/core/secret-formula/challenges/eternity-challenges.js -->
2. **Eternity Challenge 12 completed five times.** EC12 runs the whole game <Num value="1000" /> times slower and must be finished within a tight in-game time limit that shrinks with each completion. Its goal starts at <Num value="1e110000" /> antimatter and rises by <Num value="1e12000" /> per completion. <!-- vendor/ad-source/src/core/secret-formula/challenges/eternity-challenges.js -->
3. **One row-23 study owned.** Own any of studies 231, 232, 233 or 234 — the ends of the Light/Dark branches at the bottom of the tree.
4. **12900 lifetime Time Theorems.** This counts every Theorem you have ever earned, so spending Theorems never sets it back. <!-- vendor/ad-source/src/core/secret-formula/eternity/time-studies/dilation-time-studies.js, totalTimeTheoremRequirement in vendor/ad-source/src/core/time-studies/dilation-time-study.js -->

Note the order this implies: EC11 and EC12 are each unlocked by their own 1-Theorem studies (EC11 needs 231 or 232, EC12 needs 233 or 234), so by the time both are at five completions you already own a row-23 study. <!-- vendor/ad-source/src/core/secret-formula/eternity/time-studies/ec-time-studies.js --> In practice the checklist is: finish EC11 and EC12 five times each, accumulate 12900 total Theorems, then buy the 5000-Theorem Dilation study.

<Callout kind="tip">

EC11 and EC12 are the two hardest Eternity Challenges, and the recommended completion order interleaves them with the other challenges rather than doing each five times in a row. The [Eternity Challenge planner](/tools/eternity-challenges) walks through the order one completion at a time.

</Callout>

## Earning the Theorems

Theorems are bought, not earned over time: the top of the Studies subtab has **Buy Time Theorems** buttons that spend antimatter, Infinity Points and EP, plus **Buy max Theorems** which buys all three at once. Costs rise with each purchase, so the routine is to push your EP higher, buy Theorems, respec or extend your tree, and push further.

<Screen
	src="early-eternity/eternity-studies-0.webp"
	alt="The top of the Studies subtab: Buy max Theorems, the three Buy Time Theorems buttons, Respec, study presets 1 to 6, and the start of the study tree."
	caption="The Studies subtab. Buy max Theorems first, then spend them on the tree below."
/>

Two things make this grind shorter than it looks:

- **Respec freely.** The **Respec Time Studies on next Eternity** button refunds the whole tree on your next Eternity, so you can run one setup for EC completions and another for Theorem farming. Leaving an Eternity Challenge refunds your pre-challenge tree automatically.
- **Plan the tree, don't tap blindly.** The [Time Study planner](/tools/time-studies) checks costs and connections for any tree, and the in-game **Export tree** / **Import tree** buttons move trees as text.

<Callout kind="android">

On the phone the tree is panned with the zoom slider and horizontal arrows. Tapping a study buys it; holding a study buys everything up to it along the cheapest route. The six numbered boxes are presets — tap to load, hold to save the current tree into one. Keep one preset for your pushing tree and one for each EC setup.

</Callout>

## Buying the study

When everything is met, the Dilation study appears at the bottom of the tree and costs <Num value="5000" /> Theorems on top of the 12900-lifetime requirement — have both covered before you respec into your buying tree. Buying it unlocks a new **Time Dilation** subtab (marked Ψ) inside the Eternity tab. The game itself considers you to be in the Dilation stage once you hold any Dilated Time at all, and in Late Eternity once you pass <Num value="1e15" /> of it. <!-- vendor/ad-source/src/core/secret-formula/progress-checker.js -->

<Checklist stage="early-dilation" />

## Further reading

- The in-game How to Play entry on Eternity Challenges, in the Info tab — it always matches your installed build.
- The [Eternity Challenge planner](/tools/eternity-challenges) for the EC11/EC12 completion order.
- The [Time Study planner](/tools/time-studies) for fitting the row-23 studies and the Dilation study into your tree.
