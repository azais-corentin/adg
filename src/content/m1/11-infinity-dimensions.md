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

Once your antimatter passes about <Num value="1e1100" />, the **Dimensions tab** (cube icon) gains a second subtab: **Infinity**. It holds eight Infinity Dimensions (ID1–ID8), which work like the familiar ones turned upside down: the 8th produces the 7th, the 7th the 6th, and the 1st produces **Infinity Power** instead of antimatter. Infinity Power converts directly into a multiplier on all your Antimatter Dimensions, so every point of it echoes back down the whole chain.

Each tier unlocks at a fixed antimatter threshold and is bought with Infinity Points:

| Dimension | Unlocks at | First purchase |
| --- | --- | --- |
| ID1 | <Num value="1e1100" /> AM | <Num value="1e8" /> IP |
| ID2 | <Num value="1e1900" /> AM | <Num value="1e9" /> IP |
| ID3 | <Num value="1e2400" /> AM | <Num value="1e10" /> IP |
| ID4 | <Num value="1e10500" /> AM | <Num value="1e20" /> IP |
| ID5 | <Num value="1e30000" /> AM | <Num value="1e140" /> IP |
| ID6 | <Num value="1e45000" /> AM | <Num value="1e200" /> IP |
| ID7 | <Num value="1e54000" /> AM | <Num value="1e250" /> IP |
| ID8 | <Num value="1e60000" /> AM | <Num value="1e280" /> IP |

<!-- Unlock thresholds (UNLOCK_REQUIREMENTS) and base costs (BASE_COSTS) from src/core/dimensions/infinity-dimension.js:41-57. ID1's unlock is also the checklist's break-first-id gate. -->

<Screen
	src="early-eternity/dimensions-infinity-top.webp"
	alt="The Infinity subtab of the Dimensions tab: the eight Infinity Dimensions with amounts, multipliers and costs, and the Infinity Power total."
	caption="The Infinity Dimensions subtab. Each tier feeds the one above it; ID1 feeds Infinity Power."
/>

Notice the gap: ID4 wants <Num value="1e20" /> IP but ID5 wants <Num value="1e140" />. That gap is the whole middle of this stage — you cross it with Infinity Challenges, which is why the Challenges tab starts glowing.

## How Infinity Power works

Infinity Power sits at the top of the subtab as a running total. Your Antimatter Dimension multiplier from it is roughly your Infinity Power raised to 7, plus small bonuses from later sources — so doubling your power multiplies your Dimensions by 128. In practice the number looks absurd within a day: the screenshot above shows power already at <Num value="1e20007" />.

A few details worth knowing:

- **It never resets within a run.** Power accumulates all the way to your crunch. Crunching converts nothing — power simply starts over, and your next run rebuilds it faster because your Dimensions are stronger.
- **Each ID purchase gives 10 dimensions.** Like normal Dimensions, they get cheaper in effect as their multiplier grows — the purchase multiplier per 10 rises with the tier (×50 for ID1 down to ×5 for the top tiers). <!-- src/core/dimensions/infinity-dimension.js:53-57 (COST_MULTS, POWER_MULTS) -->
- **Replicanti helps later.** The total Replicanti you hold multiplies all Infinity Dimensions. Early on the bonus is tiny; by the Replicanti stage it is one of your largest. <!-- src/core/replicanti.js:266-272 (`replicantiMult`: log-squared of amount) -->

## The push order

The rhythm from here to Replicanti is: push antimatter to the next ID threshold, buy the new tier, watch IP payouts jump, spend IP on Break upgrades and the repeatable ×2, push further. Concretely:

1. **ID1–ID2.** Reachable on Break upgrades alone. The galaxy-strength upgrade at <Num value="5e11" /> IP makes ID2 comfortable.
2. **ID3.** Around <Num value="1e2400" /> AM. If you stall here, finish the first Infinity Challenge — each completion adds a stacking ×1.3 to all Infinity Dimensions, permanently. <!-- src/core/secret-formula/challenges/infinity-challenges.js:8-15 (IC1 reward) -->
3. **ID4.** The wall at <Num value="1e10500" /> AM and <Num value="1e20" /> IP. Several early ICs are meant to be done around now; see the Infinity Challenges article.
4. **ID5–ID8.** Each needs the late IC completions behind it. ID8's <Num value="1e280" /> IP price tag looks impossible until Replicanti Galaxies start multiplying everything.

<Callout kind="tip">

Leaving an ID tier unbought is the most common stall. The Infinity subtab does not flash the way the Antimatter one does — make checking it part of every crunch: open the subtab, buy what you can, then crunch.

</Callout>

## Common walls

**Stuck below ID1 (<Num value="1e1100" /> AM)?** You broke too early or skipped Break upgrades. Buy the cheap multipliers first; each one compounds with the others.

**ID3 will not unlock?** Your peak antimatter is what counts, and it must be reached in a single run. Turn off anything that crunches early, push with galaxies, and remember the Max button buys Dimensions mid-push.

**ID4+ feels impossibly far?** That is normal — it is tuned around IC rewards. Do the challenges in the recommended order in the next article rather than grinding antimatter against the wall.

## When to move on

There is no point where Infinity Dimensions are "finished" — all eight stay useful into Eternity. Move on to the Infinity Challenges as soon as ID1–ID2 are running: the ×1.3-per-completion reward is the fastest way to unlock the rest.

Further reading:

- In-game How to Play → Infinity Dimensions (matches your installed build exactly)
- The Fandom Guide's post-Reality Infinity sections (ed. 2026-08-12) — useful numbers, but ignore any pre-Reality autobuyer advice there
