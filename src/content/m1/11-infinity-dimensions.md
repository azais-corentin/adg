---
title: 'Infinity Dimensions and Infinity Power'
stage: break-infinity
order: 11
summary: 'What Infinity Dimensions cost, how Infinity Power boosts everything, and the push order to all eight.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## A second set of dimensions

Once you have broken Infinity and reach <Num value="1e1100" /> antimatter and <Num value="1e8" /> Infinity Points, the box at the top left of every tab turns into a button: **Unlock a new Infinity Dimension**. Tap it and the **Dimensions tab** (cube icon) gains a second subtab: **Infinity**. It holds eight Infinity Dimensions (ID1–ID8), which work like the familiar ones turned upside down: the 8th produces the 7th, the 7th the 6th, and the 1st produces **Infinity Power** instead of antimatter. Infinity Power converts directly into a multiplier on all your Antimatter Dimensions, so every point of it echoes back down the whole chain.

Each further tier has its own antimatter threshold, and **reaching it does not unlock the tier by itself**. Until then the top-left box reads "Reach 1e10,500 antimatter to unlock a new Infinity Dimension" (with the next threshold); once your antimatter gets there, it turns into a button, **Unlock a new Infinity Dimension**, and the tier's row shows **Unlock**. Tap either one, or **Max all** on the Infinity subtab (below), then buy the new Dimension with Infinity Points. The threshold counts the most antimatter you reached this Eternity, so a Big Crunch doesn't take it away. From 25 Eternities a milestone unlocks them for you.

<!-- src/components/ui-modes/prestige-header/UnlockInfinityDimButton.vue (ID1 also needs 1e8 IP before the first Eternity), infinity-dimension.js canUnlock (records.thisEternity.maxAM), eternity-milestones.js autoUnlockID (25). Emulator (Android 3.18.0): with no ID unlocked, 8.39e9029 AM and 3.18e40 IP, the box read "Unlock a new Infinity Dimension", the Antimatter subtab's bar "Percentage to unlock a new type of Dimension: 100.00%" and there was no Infinity subtab yet. At 1e45,001 antimatter with 5 IDs the box read "Unlock a new Infinity Dimension" and the 6th row "Unlock"; tapping it unlocked ID6 (Cost: 1e200 IP) and the box moved on to "Reach 1e54,000 antimatter to unlock a new Infinity Dimension". Same state, 2.10e197 IP: Max all alone unlocked ID6 (row "Cost: 1e200 IP", 7th row "Reach 1e54,000 AM"). -->

<Screen
	src="break-infinity/id-unlock/dimensions-infinity-top.webp"
	alt="The Infinity Dimensions subtab with the top-left box reading Unlock a new Infinity Dimension, five Infinity Dimensions with IP costs, and the 6th Infinity Dimension row with an Unlock button."
	caption="Threshold reached: the top-left box and the 6th row both say Unlock. Nothing happens until you tap one of them."
/>

| Dimension | Unlocks at                 | First purchase           |
| --------- | -------------------------- | ------------------------ |
| ID1       | <Num value="1e1100" /> AM  | <Num value="1e8" /> IP   |
| ID2       | <Num value="1e1900" /> AM  | <Num value="1e9" /> IP   |
| ID3       | <Num value="1e2400" /> AM  | <Num value="1e10" /> IP  |
| ID4       | <Num value="1e10500" /> AM | <Num value="1e20" /> IP  |
| ID5       | <Num value="1e30000" /> AM | <Num value="1e140" /> IP |
| ID6       | <Num value="1e45000" /> AM | <Num value="1e200" /> IP |
| ID7       | <Num value="1e54000" /> AM | <Num value="1e250" /> IP |
| ID8       | <Num value="1e60000" /> AM | <Num value="1e280" /> IP |

<!-- Unlock thresholds (UNLOCK_REQUIREMENTS) and base costs (BASE_COSTS) from src/core/dimensions/infinity-dimension.js:41-57. ID1's unlock is also the checklist's break-first-id gate. -->

<Screen
	src="break-infinity/dimensions-infinity-top.webp"
	alt="The Infinity subtab of the Dimensions tab at this stage: the Infinity Power total and rate, the ID purchase cap note, Max all, and the first Infinity Dimension rows with IP costs."
	caption="The Infinity Dimensions subtab. Each tier feeds the one above it; ID1 feeds Infinity Power at the top."
/>

Under the Infinity Power lines the subtab notes "All IDs except the 8th are limited to a maximum of 2.00e6 purchases. Tap on locked Dimension buttons to see their cost." Then comes **Max all**: one tap unlocks every tier whose threshold you have reached and buys as many of each Infinity Dimension as your IP pays for, starting with ID1. That makes it the one button to press after every crunch. The purchase cap only matters much later, when [Tesseracts](/guide/m2/tesseracts-after) raise it.

<!-- src/core/dimensions/infinity-dimension.js InfinityDimensions.buyMax ("Called from Max All": unlock(), then buyMax from the lowest tier), HARDCAP_PURCHASES 2000000; secret-formula/h2p.js (Tesseracts raise the cap). Note text from the emulator. -->

Notice the gap: ID4 wants <Num value="1e20" /> IP but ID5 wants <Num value="1e140" />. That gap is the whole middle of this stage — you cross it with Infinity Challenges, which is why the Challenges tab starts glowing.

## How Infinity Power works

Infinity Power sits at the top of the subtab as a running total. Your Antimatter Dimension multiplier from it is roughly your Infinity Power raised to 7, plus small bonuses from later sources — so doubling your power multiplies your Dimensions by 128. In practice the number looks absurd within a day: the screenshot above shows power already at 3.80e37 and climbing at 5.88e35 per second.

A few details worth knowing:

- **It never resets within a run.** Power accumulates all the way to your crunch. Crunching converts nothing — power simply starts over, and your next run rebuilds it faster because your Dimensions are stronger.
- **Each ID purchase buys 10 at once and multiplies that Dimension.** The multiplier per purchase falls with the tier (×50 for ID1, ×30 for ID2, ×10 for ID3, ×5 for ID4–ID8), while the cost grows faster per purchase on higher tiers. <!-- src/core/dimensions/infinity-dimension.js:53-57 (COST_MULTS, POWER_MULTS) -->
- **Replicanti helps later.** The total Replicanti you hold multiplies all Infinity Dimensions. Early on the bonus is tiny; by the Replicanti stage it is one of your largest. <!-- src/core/replicanti.js:266-272 (`replicantiMult`: log-squared of amount) -->

## The push order

The rhythm from here to Replicanti is: push antimatter to the next ID threshold, tap **Unlock**, buy the new tier, watch IP payouts jump, spend IP on Break upgrades and the repeatable ×2, push further. Concretely:

1. **ID1–ID2.** Reachable on Break upgrades alone. The galaxy-strength upgrade at <Num value="5e11" /> IP makes ID2 comfortable.
2. **ID3.** Around <Num value="1e2400" /> AM. If you stall here, finish the first Infinity Challenge: its reward is ×1.3 on all Infinity Dimensions for each Infinity Challenge you have completed, so every later one adds to it. <!-- src/core/secret-formula/challenges/infinity-challenges.js:8-15 (IC1 reward) -->
3. **ID4.** The wall at <Num value="1e10500" /> AM and <Num value="1e20" /> IP. Several early ICs are meant to be done around now; see the Infinity Challenges article.
4. **ID5–ID8.** Each needs the late IC completions behind it. ID8's <Num value="1e280" /> IP price tag looks impossible until Replicanti Galaxies start multiplying everything.

<Callout kind="tip">

Leaving a reached tier locked, or an unlocked one unbought, is the most common stall. The top-left box says **Unlock a new Infinity Dimension** until you tap it, and the Antimatter subtab's bar reads "Percentage to new Infinity Dimension: 100.00%". Make the Infinity subtab part of every crunch: tap **Max all** (it unlocks and buys in one go), then crunch. With a save imported, [Next goals](/import) lists the Infinity Dimensions your IP already pays for.

</Callout>

## Common walls

**Stuck below ID1 (<Num value="1e1100" /> AM)?** You broke too early or skipped Break upgrades. Buy the cheap multipliers first; each one compounds with the others.

**ID3 will not unlock?** If the top-left box says **Unlock a new Infinity Dimension**, tap it. Otherwise you need more antimatter: the most you reached this Eternity counts, so it doesn't have to be in the current Infinity. Turn off anything that crunches early, push with galaxies, and remember the Max button buys Dimensions mid-push.

**ID4+ feels impossibly far?** That is normal — it is tuned around IC rewards. Do the challenges in the recommended order in the next article rather than grinding antimatter against the wall.

## When to move on

There is no point where Infinity Dimensions are "finished" — all eight stay useful into Eternity. Move on to the Infinity Challenges as soon as ID1–ID2 are running: the ×1.3-per-completion reward is the fastest way to unlock the rest.

Further reading:

- In-game How to Play → Infinity Dimensions (matches your installed build exactly)
- The Fandom Guide's post-Reality Infinity sections (ed. 2026-08-12) — useful numbers, but ignore any pre-Reality autobuyer advice there
