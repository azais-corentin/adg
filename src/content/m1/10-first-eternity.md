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

Once your Infinity Points reach <Num value="1.80e308" /> (the same Infinity value that unlocks the first Big Crunch), the box at the top left of every tab turns purple and reads **"Other times await… I need to become Eternal"**. There is no round Eternity button yet: tap that box. The game asks "Are you sure you want to Eternity?" and explains that you will gain an Eternity Point; tap **PROCEED**.

Your first Eternity is worth just 1 EP, and waiting does not raise that by much: Eternity Points grow very slowly with your best IP this Eternity. So do not wait around pushing IP further — Eternity as soon as the box turns purple.

<!-- game.js:138-140 gainedEternityPoints; game.js:156-159 requiredIPForEP; player.js:949-951 canEternity; first-Eternity box and dialog from the emulator (Android 3.18.0) -->

<Screen
	src="replicanti/dimensions-antimatter-top.webp"
	alt="The Antimatter subtab just before the first Eternity: the purple top-left box reading Other times await… I need to become Eternal, the Gain 1.86e292 Infinity Points box beside it, 2.69e315 IP, Percentage to Eternity 100.00%, and B.Crunch, D.Boost, A.Galaxy, R.Galaxy and Max above the tab bar, with no Eternity button."
	caption="Ready for the first Eternity: the purple box at the top left is the Eternity button. The round Eternity button only joins the row after your first Eternity."
/>

After the first Eternity the round **Eternity** button joins the row above the tab bar, and the top of the Antimatter subtab shows what the next one would give: "Eternity for N EP" and the IP needed for the next EP.

<Screen
	src="early-eternity/dimensions-antimatter-top.webp"
	alt="The Antimatter subtab at 13 Eternities: the Eternity-for-5-EP and next-EP-at-3.10e558-IP box, the IP gain box, the Sacrifice ×2.00 row and the Dimension rows below."
	caption="Later Eternities: the top box shows what an Eternity would give you right now — here, 5 EP with the next EP at 3.10e558 IP."
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

1. Eternity as soon as the purple box at the top left turns on (later, use the round **Eternity** button).
2. Buy Time Dimension 1 for 1 EP.
3. Buy your first Time Theorems ([Time Dimensions and Time Theorems](/guide/m1/time-dimensions-and-theorems)) and your first Time Study — [Time Studies](/guide/m1/time-studies) walks through the tree.
4. Eternity again. The first dozen Eternities each take only minutes, and each one unlocks a [milestone](/guide/m1/eternity-milestones) that removes a piece of the re-setup busywork.


<Checklist stage="early-eternity" />

## Further reading

- In-game How to Play: the **Eternity** and **Eternity Milestones** entries (Info tab), which describe exactly what each reset keeps.
- Tables61's [places players get stuck](https://www.reddit.com/r/AntimatterDimensions/comments/nt0udk/) sticky — the Eternity section covers the slow first ~10 Eternities.
