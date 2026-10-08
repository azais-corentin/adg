---
title: 'The road to the first Reality'
stage: late-eternity
order: 12
summary: 'The triple gate for the Reality study — TD8, 1e4000 max EP, all pre-Reality achievements — and how to clear each one.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## The triple gate

The Reality study sits at the very bottom of the tree, costs a single Theorem, and requires all three of the following at once. Quoting only the EP number strands players — check all three: <!-- vendor/ad-source/src/core/secret-formula/eternity/time-studies/dilation-time-studies.js -->

1. **Time Study TD8 owned** — the <Num value="1e9" />-Theorem study at the end of the TD5–8 chain.
2. **This Reality's max EP at <Num value="1e4000" /> or higher** — the exponent of your best EP total this Reality must read 4000+. Note *this Reality*: it is a record of the current run, so it can only be pushed forward, never lost.
3. **Every pre-Reality achievement unlocked** — all 104 achievements in rows 1–13. <!-- vendor/ad-source/src/core/achievements/normal-achievement.js -->

Once the study is bought, Reality itself becomes available — the game enables it when max EP is at <Num value="1e4000" /> *and* the study is owned. <!-- vendor/ad-source/src/core/reality.js (isRealityAvailable) -->

## Gate 1: TD8

Covered in [Time Dimensions 5 to 8](/guide/m1/time-dimensions-5-to-8): buy the <Num value="1e15" />-DT Theorem generator, accumulate, and purchase TD5 through TD8 in one respec. If you own TD8, this gate is done — it never un-completes within the Reality.

## Gate 2: 1e4000 EP

This is the long push. The route that gets most players there:

- Finish the dilation upgrade set — every upgrade in [Dilation upgrades in order](/guide/m1/dilation-upgrades-in-order) raises the EP ceiling of a normal Eternity.
- Complete remaining ECs five times each; their stacked rewards are permanent EP multipliers.
- Run the dilate–push–exit cycle from [Farming EP and DT](/guide/m1/farming-ep-and-dt): each TP record raises DT income, which funds the next round of upgrades, which raises the next EP record.
- Watch the exponent, not the mantissa: the Studies subtab and the top-of-screen EP readout show max EP — the number that must cross <Num value="1e4000" />.

<Callout kind="tip">

Progress feels exponential in reverse: the jump from <Num value="1e3000" /> to <Num value="1e3500" /> takes longer than everything before it, and <Num value="1e3500" /> to <Num value="1e4000" /> longer still. That is normal — it means the multipliers are compounding. Keep cycling rather than waiting for one big run.

</Callout>

## Gate 3: all 104 achievements

Open the Achievements tab and hunt row by row through row 13. Advice that saves real time:

- Do the awkward ones with your end-stage multipliers — tight-timer and constraint achievements that were miserable at Eternity 20 are trivial with full dilation upgrades.
- Check the secret achievements too where they sit in pre-Reality rows; the counter counts rows, not tabs.

<Screen
	src="late-eternity/achievements-normal-0.webp"
	alt="The Achievements tab Normal subtab at this stage: completed rows with the ×393 achievement multiplier, and Normal and Secret subtabs below."
	caption="Gate 3 is rows 1 through 13 complete — dimmed icons are still locked. The multiplier at the top grows with every row."
/>

<Callout kind="warning">

Do not buy the Reality study the moment one gate turns green. It needs all three at once, and the 1-Theorem cost is beside the point — the cost is the trip to the bottom of the tree. Time the purchase for when TD8, EP and achievements are all done, in a single respec.

</Callout>

## Buying the study and pressing the button

1. Respec into a tree that reaches the bottom: through TD8 down to the Reality study.
2. Buy the study for <Num value="1" /> Theorem.
3. The Reality option activates (the game checks max EP plus the study). Take a breath, export your save — this is the last state of the Eternity era — and go.

What happens next — what survives, what resets, and how many Reality Machines to expect — is the next article.

## Further reading

- [How to prepare for the first Reality](preparing-for-first-reality): resets, keeps, and machine expectations.
- The [checklists page](/checklists) shows the three gates as ticks against your imported save.
