---
title: 'Pelle Strikes'
stage: pelle
order: 11
summary: 'All five Strikes, what each disables, and how its Rift buys the power back.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## How Strikes and Rifts work

Each Strike triggers automatically at a fixed progression point inside Doomed Reality and permanently nerfs one part of the game — while unlocking a **Rift** that earns the power back with interest. Rifts fill by draining 3% per second of their linked resource while set to Filling; at most **two** Rifts can fill at once. Each Rift pays its effect (scaling with total filled) plus three milestone bonuses at fixed fill percentages. <!-- vendor/ad-source/src/core/secret-formula/h2p.js:1799-1819 vendor/ad-source/src/core/celestials/pelle/pelle.js:312-315 -->

Toggle a Rift to Idle when you need its resource for something else (buying upgrades, pushing a prestige), then back to Filling afterwards. Rift names cycle synonyms (Vacuum/Hollow/Void and so on); the tab always shows the current one.

<Screen
	src="pelle/celestials-teresa-0.webp"
	alt="The Teresa subtab inside Doom: the Perk Point Shop rows with their capped multipliers and the poured-total unlock list below."
	caption="Teresa's tab in Doom. The shop caps carry over, so early Doomed Realities start stronger than they look."
/>

## The five Strikes

**Strike 1 — first Infinity.** Antimatter Dimensions are raised to the 0.5th power (square-rooted). Unlocks the **Vacuum** Rift, which drains Infinity Points and multiplies IP gain. Its first milestones re-allow one basic glyph (4% fill) and slash Replicanti unlock costs (6%), so push it early. Trigger: Crunch inside Doom. <!-- vendor/ad-source/src/core/secret-formula/celestials/strikes.js:5-12 vendor/ad-source/src/core/big-crunch.js:58 -->

**Strike 2 — the Galaxy-strength Break Infinity upgrade.** Infinity Dimensions are raised to the 0.5th power. Unlocks the **Decay** Rift, draining Replicanti and boosting Replicanti speed. Its milestones feed your 1st Infinity Dimension and add Replicanti Galaxies. Because Infinity Dimensions are halved, skip the Infinity-Dimension Time Study path in Doom — Antimatter or Time paths pull ahead. Trigger: buying that Break upgrade inside Doom. <!-- vendor/ad-source/src/core/secret-formula/celestials/strikes.js:13-19 vendor/ad-source/src/core/break-infinity-upgrades.js:11-17 -->

**Strike 3 — first Eternity.** Replicanti slows brutally past <Num value="1e2000" /> and Time Dimensions suffer. Unlocks the **Chaos** Rift, draining Eternity Points for a Time Dimension multiplier, plus passive EP income at full fill. Key synergy: with Decay at 10% and Chaos at 9%, Decay's effect stays maxed without active filling — set those two targets before anything else in the mid game. Chaos's second milestone also switches on Pelle-specific glyph effects, making your single glyph slot much stronger. Trigger: Eternity inside Doom. <!-- vendor/ad-source/src/core/secret-formula/celestials/strikes.js:20-26 vendor/ad-source/src/core/eternity.js:142 -->

**Strike 4 — 115 Time Theorems.** Eternity Challenge production is weakened (the Vacuum IP multiplier counts less inside ECs). Unlocks the **Recursion** Rift, draining Eternity Points with an EP-formula improvement and Dimension-boost scaling off EC completions. Its third milestone — 100% fill — unlocks the Galaxy Generator, the endgame engine covered in the next article. Filling it to full is the mid-Doom grind. Trigger: owning more than 114 Theorems. <!-- vendor/ad-source/src/core/secret-formula/celestials/strikes.js:27-35 vendor/ad-source/src/core/time-theorems.js:66 -->

**Strike 5 — Dilating Time.** Dilation stays permanently on. Unlocks the **Paradox** Rift, draining Dilated Time for an all-Dimensions power bonus, and — crucially — future Remnant gain is multiplied enormously (antimatter's contribution ×500, IP ×10, EP ×5), so every Armageddon after this one pays far more. It also resets your tracked Doom records to a fixed starting point, protecting the early-Dilation balance. Trigger: entering Dilation inside Doom. <!-- vendor/ad-source/src/core/secret-formula/celestials/strikes.js:36-44 vendor/ad-source/src/core/dilation.js:10,53 vendor/ad-source/src/core/celestials/pelle/pelle.js:262-298 -->

<Screen
	src="pelle/celestials-nameless-0.webp"
	alt="The Nameless subtab inside Doom: the charge and store buttons with their time banks, recorded against the Doomed Reality header."
	caption="The Nameless tab in Doom. Banked time still discharges in one tick, which is how late-Doom pushes close."
/>

## Rift priorities

1. Fill Vacuum first whenever IP is flowing; idle it to spend IP in bursts.
2. Then Decay to uncap Replicanti, aiming for the 10% mark.
3. Then Chaos to 9% to lock in Decay's max, then push Chaos to full for the glyph effects and passive EP.
4. Recursion to 100% for the Galaxy Generator — this is the longest fill, fed by late-Doom EP.
5. Paradox runs alongside everything once Dilated Time flows; its milestones cheapen Time Dimensions 5–8 and raise Tachyon gain to the 1.4th power.

<Callout kind="tip">

Only two Rifts fill at once, but milestones never un-earn: once Decay/Chaos hit their synergy marks, move both fill slots to the next Rift and never look back.

</Callout>
