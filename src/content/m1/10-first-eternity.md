---
title: 'Your first Eternity'
stage: early-eternity
order: 10
summary: 'What the Eternity reset wipes and keeps, how Eternity Points are earned, and which Eternity Upgrades to buy first.'
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

## When you can Eternity

Once your best Infinity Points this Eternity reach about <Num value="1.79e308" /> (the same Infinity value that unlocks the first Big Crunch), the round **Eternity** button above the tab bar lights up. The box at the top of the Dimensions tab tells you exactly what you would get: "Eternity for N EP" and the IP needed for the next EP.

Eternity Points grow with your best IP this Eternity, but slowly: roughly, each big jump in max IP is worth a few more EP. Your first Eternity is usually worth just 1 EP, so do not wait around pushing IP further — Eternity as soon as the button lights up.

<!-- game.js:138-140 gainedEternityPoints; game.js:156-159 requiredIPForEP; player.js:949-951 canEternity -->

<Screen
	src="early-eternity/dimensions-antimatter-top.webp"
	alt="The Antimatter subtab of the Dimensions tab: the Eternity and Infinity Point boxes at the top, and the prestige buttons above the tab bar."
	caption="The top of the Dimensions tab shows what an Eternity would give you right now."
/>

## What resets and what stays

Eternity wipes almost everything below it, like a Big Crunch plus one more layer:

- **Reset:** antimatter, Antimatter Dimensions, Dimension Boosts, Antimatter Galaxies, Tickspeed, Dimensional Sacrifice, Infinity Points, Infinity Dimensions, Replicanti, and Normal/Infinity Challenge completions.
- **Kept:** achievements, Eternity Points, your Eternity count, Eternity Upgrades, and your Time Studies (you can respec them on Eternity).

Two things feel bad on the first few Eternities and get fixed by milestones within the first day: Infinity is un-broken again (kept from 2 Eternities) and your Infinity Upgrades are gone (kept from 4 Eternities). Until then, each Eternity starts with a quick re-buy of the early Infinity upgrades. [Eternity milestones](/guide/m1/eternity-milestones) lists the whole ladder.

<!-- src/core/eternity.js: initializeResourcesAfterEternity; eternity-milestones.js -->

<Callout kind="tip">

After your first Eternity, a new **Time** subtab appears in the Dimensions tab, and the Eternity tab (hourglass icon) gains its **Studies**, **Upgrades** and **Milestones** subtabs. That is where the rest of this stage happens.

</Callout>

## Eternity Points and the EP multiplier

EP is spent on Time Dimensions and Eternity Upgrades. The most important upgrade is the rebuyable **EP multiplier** at the top of the Upgrades subtab: each purchase multiplies all future EP gains by 5, starting at 500 EP and getting more expensive each time. Buy it whenever you can afford it — it speeds up everything else.

<!-- src/core/eternity.js:272-349 EPMultiplierState -->

With your first handful of EP, buy in this order:

1. The 5 EP upgrade (Infinity Dimensions scale with your unspent EP).
2. The 10 EP upgrade (Infinity Dimensions scale with your Eternity count).
3. Your first Time Dimension (1 EP) — this unlocks buying Time Theorems, covered in [Time Dimensions and Time Theorems](/guide/m1/time-dimensions-and-theorems).
4. The EP multiplier (500 EP), then the remaining upgrades as they become affordable.

The full upgrade list, with the late ones that cost up to <Num value="1e50" /> EP, is in [Eternity Upgrades and Replicanti](/guide/m1/eternity-upgrades-and-replicanti).

<!-- secret-formula/eternity/eternity-upgrades.js -->

## What to do first

1. Eternity as soon as the button lights up.
2. Buy Time Dimension 1 for 1 EP.
3. Buy your first Time Theorems and your first Time Study — [Time Studies](/guide/m1/time-studies) walks through the tree.
4. Eternity again. The first dozen Eternities each take only minutes, and each one unlocks a milestone that removes a piece of the re-setup busywork.


<Checklist stage="early-eternity" />

## Further reading

- In-game How to Play: the **Eternity** and **Eternity Milestones** entries (Info tab), which describe exactly what each reset keeps.
- Tables61's [places players get stuck](https://www.reddit.com/r/AntimatterDimensions/comments/nt0udk/) sticky — the Eternity section covers the slow first ~10 Eternities.
