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

Each Strike triggers automatically at a fixed progression point inside Doomed Reality and permanently nerfs one part of the game, while unlocking a **Rift** that earns the power back with interest. The Pelle tab explains the controls: "Rifts can be activated by clicking on their bars. You cannot activate more than two Rifts at once. When active, Rifts consume 3% of another resource per second. Rift effects apply even when their Rifts are not activated, and are based on the total amount filled." Tap a Rift's bar to switch it between **Filling** and **Idle**. Each Rift pays its effect plus three milestone bonuses at fixed fill percentages, shown in the three boxes under its bar. <!-- vendor/ad-source/src/core/secret-formula/h2p.js:1799-1819 vendor/ad-source/src/core/celestials/pelle/pelle.js:312-315; emulator 3.18.0 (Pelle save): tab text as quoted -->

Set a Rift to Idle when you need its resource for something else (buying upgrades, pushing a prestige), then back to Filling afterwards. Rift names cycle synonyms (Vacuum/Hollow/Void, Decay/Collapse/Disarray and so on); the tab always shows the current one.

<Screen
	src="pelle/celestials-teresa-0.webp"
	alt="The Teresa subtab inside Doom: the Perk Point Shop rows with their capped multipliers and the poured-total unlock list below."
	caption="Teresa's tab in Doom. The shop caps carry over, so early Doomed Realities start stronger than they look."
/>

## The five Strikes

**Strike 1 — Reach Infinity.** "Penalty: Antimatter Dimensions are raised to ^0.5". Unlocks the **Vacuum** Rift, which drains Infinity Points and multiplies IP gain, plus a permanent Infinity autobuyer. Its milestones: at 4% you can equip a single basic Glyph with decreased level and rarity; at 6% Replicanti are uncapped and their unlock and upgrades become ×1e130 cheaper; at 40% Vacuum also multiplies EP gain. Push it to 6% early, because uncapped Replicanti are what make the next Rift worth filling. <!-- vendor/ad-source/src/core/secret-formula/celestials/strikes.js:5-12, rifts.js vacuum milestones 0.04/0.06/0.4; vendor/ad-source/src/core/big-crunch.js:58 -->

**Strike 2 — Power-up Galaxies** (buying the Galaxy-strength Break Infinity upgrade). "Penalty: Infinity Dimensions are raised to ^0.5". Unlocks the **Decay** Rift, draining Replicanti for a Replicanti speed multiplier. Its milestones: at 20% (<Num value="1e400" /> Replicanti filled) the first repeatable Pelle Upgrade also boosts the 1st Infinity Dimension; at 60% (<Num value="1e1200" />) all Galaxies are 10% stronger while Replicanti exceed <Num value="1e1300" />; at 100% (<Num value="1e2000" />) you get more max Replicanti Galaxies, based on your total Rift milestones. Decay keeps filling past 100%, and the extra matters for the next Rift. Because Infinity Dimensions are halved, skip the Infinity-Dimension Time Study path in Doom; Antimatter or Time paths pull ahead. <!-- vendor/ad-source/src/core/secret-formula/celestials/strikes.js:13-19, rifts.js decay: percentage = log10(fill + 1) × 0.05%, milestones 0.2/0.6/1; vendor/ad-source/src/core/break-infinity-upgrades.js:11-17 -->

**Strike 3 — Reach Eternity.** "Penalty: Replicanti speed scales harsher after 1e2000". Unlocks the **Chaos** Rift. Chaos does not drain a currency: it drains Decay's fill percentage ("Drains Decay to fill") and multiplies Time Dimensions. Its milestones: at 9%, which costs 90% of Decay's fill, "Decay effect is always maxed and milestones always active"; at 15% (150% of Decay) Glyphs gain a new Pelle-specific effect, which makes your single Glyph much stronger; at 100% (1,000% of Decay) you gain 1% of the EP an Eternity would give you, every second. <!-- vendor/ad-source/src/core/secret-formula/celestials/strikes.js:20-26; rifts.js chaos: currency is Decay's percentage, percentage = fill / 10, milestones 0.09/0.15/1; RiftMilestoneState.isUnlocked: Decay milestones always on once Chaos 9%. Emulator 3.18.0: "Drains Collapse to fill · Time Dimensions ×6.01e95", "9% (90% Collapse) …". -->

**Strike 4 — Reach 115 TT.** "Penalty: IP multiplier is reduced in Eternity Challenges" (Vacuum's IP multiplier counts only 30% inside them, capped at 15% of the goal). Unlocks the **Recursion** Rift, draining Eternity Points for a better EP formula, Dimension Boost power and an Infinity Dimension multiplier, with milestones that scale off EC completions. Its third milestone — 100% fill — unlocks the Galaxy Generator, the endgame engine covered in the next article. Filling it to full is the mid-Doom grind. <!-- vendor/ad-source/src/core/secret-formula/celestials/strikes.js:27-35 vendor/ad-source/src/core/time-theorems.js:66 -->

**Strike 5 — Dilating Time.** Dilation stays permanently on. Unlocks the **Paradox** Rift, draining Dilated Time for an all-Dimensions power bonus, and — crucially — future Remnant gain is multiplied enormously (antimatter's contribution ×500, IP ×10, EP ×5), so every Armageddon after this one pays far more. It also resets your tracked Doom records to a fixed starting point, protecting the early-Dilation balance. Trigger: entering Dilation inside Doom. <!-- vendor/ad-source/src/core/secret-formula/celestials/strikes.js:36-44 vendor/ad-source/src/core/dilation.js:10,53 vendor/ad-source/src/core/celestials/pelle/pelle.js:262-298 -->

Dilation has to be unlocked again inside Doom first, and the DILR Perk does nothing there. The Dilation study reads "Requirement: 5 EC11 and EC12 completions and 1,750/12,900 total Time Theorems" (your own totals), costs 5,000 Time Theorems and still needs a row-23 study. So Strike 5 means redoing the Eternity Challenges up to EC11 and EC12 ×5 at their Doomed goals. The [Eternity Challenge planner](/tools/eternity-challenges) reads a Doomed save and shows those goals; the import's Next goals count EC11, EC12 and your total Time Theorems. <!-- dilation-time-studies.js id 1 (Ra autoUnlockDilation skips Doom; Perk.bypassECDilation = perk 53, in Pelle.uselessPerks); round 7 review, emulator (pelle save): "Unlock Time Dilation / Requirement: 5 EC11 and EC12 completions and 1,750/12,900 total Time Theorems / Cost: 5,000 Time Theorems" -->

<Screen
	src="pelle/celestials-nameless-0.webp"
	alt="The Nameless subtab inside Doom: the charge and store buttons with their time banks, recorded against the Doomed Reality header."
	caption="The Nameless tab in Doom. Banked time still discharges in one tick, which is how late-Doom pushes close."
/>

## Rift priorities

1. Fill Vacuum first whenever IP is flowing, at least to 6% for uncapped Replicanti; idle it to spend IP in bursts.
2. Then fill Decay as far as Replicanti allow. Its own milestones sit at 20%, 60% and 100%, and every percent above that is fuel for Chaos.
3. Then fill Chaos to 9%. That eats 90% of Decay's fill, but from then on Decay's effect is maxed and all its milestones stay active whatever its fill. Keep feeding Decay so Chaos can go on to 15% for the Glyph effect and 100% for passive EP.
4. Recursion to 100% for the Galaxy Generator — this is the longest fill, fed by late-Doom EP.
5. Paradox runs alongside everything once Dilated Time flows; its milestones cheapen Time Dimensions 5–8 and raise Tachyon gain to the 1.4th power.

<Callout kind="tip">

Only two Rifts fill at once. Fill totals never go down, so milestones stay earned, with one exception: Chaos spends Decay's fill, so Decay's milestones would switch off until Chaos reaches 9%. Once it does, move the fill slots on to the next Rift.

</Callout>
