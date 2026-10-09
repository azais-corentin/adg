---
title: 'Farming Eternity Points and Dilated Time'
stage: late-eternity
order: 11
summary: 'The late-Eternity loop — alternating TP pushes and DT farming — plus settings and achievement clean-up that speed it up.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## The loop

Late Eternity is one repeating cycle, and every part of it feeds the next:

1. **Dilated TP push.** Dilate, push antimatter to a new record, exit via Eternity. Banked Tachyon Particles rise.
2. **DT farming.** Higher TP means faster passive DT income. Spend DT on the rebuyables — Tachyon gain first, DT gain alongside — and the one-time upgrades in cost order.
3. **Higher EP.** The upgrades (especially Antimatter Dimensions from DT, all three tree paths at once, and IP from DT) raise how far each Eternity climbs. More EP buys more pre-generator Theorems and pushes the max-EP record toward <Num value="1e4000" />.

<Screen
	src="late-eternity/eternity-dilation-0.webp"
	alt="The Time Dilation subtab at this stage: EP and IP gain boxes, 1.66e99 Tachyon Particles, 1.51e21 Dilated Time at 3.09e17 per hour, and 112 Tachyon Galaxies."
	caption="The Dilation loop at scale: banked TP drives hourly DT income, which funds the next push. When a push stops beating the TP record, farm DT a while first."
/>

## Settings that matter

- **Autobuyers.** Late Eternity runs buy a lot: keep Dimension, Tickspeed, Dimboost, Galaxy and Time Dimension autobuyers on with no cap, and the Eternity autobuyer set to a modest EP threshold so Eternities tick over while you watch DT. The Crunch autobuyer feeds IP between Eternities.
- **Max offline ticks.** In Options, raise this toward the top of its 1,000-to-1,000,000 range so time away earns DT and Theorem income at near-online fidelity. Coming back shows the "While you were away" popup — confirm it and spend the gains. <!-- device fact re-verified in docs/device/README.md -->
- **Study presets.** Keep at least two presets: your pushing tree (with TD5–8 once owned) and your best EC-farming tree if any completions remain. The Eternity Challenge planner lists the recommended order if ECs are still open. <!-- in-game preset behavior, see docs/device/EMULATOR.md if present -->

## Finishing the Eternity Challenges

Every EC at five completions is worth finishing before the final Reality push: each completion's reward is a permanent multiplier, and the full set feeds the EP growth that must reach <Num value="1e4000" />. The two achievement-relevant tallies are 50 total completions and all twelve at five — the latter is one of the hardest rows in the game, so treat it as background work across the whole stage, not a last-minute sprint. <!-- vendor/ad-source/src/core/secret-formula/challenges/eternity-challenges.js for EC data; checklist late-all-ec -->

<Callout kind="tip">

Stuck on a specific EC tier? The [Eternity Challenge planner](/tools/eternity-challenges) gives the study setup and resource target per completion — EC10 through EC12 at high completions are where most late-Eternity walls live.

</Callout>

## Achievement clean-up

The Reality study needs every pre-Reality achievement — rows 1 through 13, 104 achievements in total — unless a later perk skips the requirement, which you won't have on a first run. <!-- vendor/ad-source/src/core/achievements/normal-achievement.js, vendor/ad-source/src/core/secret-formula/eternity/time-studies/dilation-time-studies.js --> Start the hunt early:

- Open the Achievements tab and work row by row; dimmed icons are still locked.
- Two dilation achievements pay for themselves: dilating once, and reaching high antimatter quickly while dilated — their rewards multiply Tachyon and DT gain. <!-- generated achievements.json ids 136, 137; rewards in vendor/ad-source/src/core/secret-formula/achievements/normal-achievements.js -->
- Leave no one-achievement gaps: a single obscure locked achievement blocks the Reality study exactly as much as ten do, and the annoying ones (tight timers, odd constraints) are easier with late-Eternity multipliers than they were when you first skipped them.

## When to move on

You are done farming when all three Reality-study gates read green: TD8 owned, max EP at <Num value="1e4000" /> or above, achievements complete. The next article takes it from there.

## Further reading

- [The road to the first Reality](/guide/m1/road-to-first-reality): the triple gate and the Reality study.
- [How to prepare for the first Reality](/guide/m1/preparing-for-first-reality): what carries over and what to expect.
- The [checklists page](/checklists) tracks the late-Eternity milestones against your imported save.
