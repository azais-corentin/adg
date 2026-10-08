---
title: 'Breaking Infinity'
stage: break-infinity
order: 10
summary: 'How to break Infinity, what changes afterwards, and which Break Infinity upgrades to buy first.'
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

## When to break

The Break Infinity button lives in the **Infinity tab** (the ∞ icon), on the **Break** subtab. It stays greyed out until your Big Crunch autobuyer's interval is fully upgraded to its minimum. In practice that means: keep spending Infinity Points on the crunch autobuyer interval in the Autobuyers tab until it cannot go lower, then come back and tap the button.

<!-- src/game.js:75-76 (`breakInfinity` returns early unless the crunch autobuyer has its maxed interval) -->

<Callout kind="tip">

If you are sitting on a pile of IP with nothing left to buy and the button still does nothing, the crunch interval is almost always the reason. One or two more interval upgrades fix it.

</Callout>

Breaking is a toggle, not a reset. Your antimatter, Dimensions and upgrades stay. What changes is the ceiling: antimatter is allowed past <Num value="1.79e308" />, and Big Crunches start paying out far more IP the further past it you get.

## What breaking changes

Two things happen the moment you break:

- **Antimatter keeps climbing.** Your run no longer ends at <Num value="1.79e308" />. Production continues into the thousands and beyond, which feeds everything below.
- **IP gains scale with your peak antimatter.** After the break, each crunch pays roughly 10 raised to (your best antimatter's digit count divided by 308, minus a bit), times your IP multipliers. Before the break every crunch paid a flat trickle; now pushing your peak higher is the whole game. <!-- src/game.js:88-101 (`gainedInfinityPoints`) -->

There is a side benefit that saves you a fortune: breaking instantly drops **every autobuyer interval to its minimum, for free**. The IP you would otherwise spend grinding intervals down to 0.1 seconds stays in your pocket for upgrades. <!-- src/game.js:78-80 (maxIntervalForFree on break) -->

<Screen
	src="early-eternity/infinity-break-0.webp"
	alt="The Break subtab of the Infinity tab: the Eternity and IP gain boxes at the top, then the first rows of Break Infinity upgrades with their costs."
	caption="The Break subtab. The top boxes show what an Eternity or a crunch would pay right now."
/>

## The Break Infinity upgrades

The Break subtab holds twelve upgrades: six one-time purchases and two rebuyable rows plus the IP generator. They are all bought with IP and they never reset. Sensible order after the Reality rebalancing is simply **cheapest first**, with two exceptions called out below:

| Upgrade | Cost | What it does |
| --- | --- | --- |
| Total antimatter multiplier | <Num value="1e4" /> IP | Dimensions scale with all antimatter you have ever made |
| Current antimatter multiplier | <Num value="5e4" /> IP | Dimensions scale with the antimatter you hold now |
| Infinities multiplier | <Num value="1e5" /> IP | Dimensions scale with your total Infinities |
| Achievement multiplier | <Num value="1e6" /> IP | Dimensions scale with achievements finished |
| Slowest-challenge multiplier | <Num value="1e7" /> IP | Dimensions scale with your slowest challenge time (capped) |
| Passive Infinities | <Num value="2e7" /> IP | Earns Infinities on its own, from your fastest run |
| Buy-max Dimboost mode | <Num value="5e9" /> IP | Autobuyer learns to buy max Dimboosts — a real pacing unlock |
| Galaxies 50% stronger | <Num value="5e11" /> IP | Every galaxy counts half again as much — the biggest spike here |
| Challenge autobuyers ×2 speed | <Num value="1e15" /> IP | Autobuyers earned from Normal Challenges tick twice as fast |
| Tickspeed-cost rebuyable (×8) | from <Num value="1e6" /> IP | Each level softens post-Infinity tickspeed cost growth |
| Dimension-cost rebuyable (×7) | from <Num value="1e7" /> IP | Each level softens post-Infinity Dimension cost growth |
| Passive IP generator (×10) | from <Num value="1e7" /> IP | Each level adds 5% of your best IP/min from the last 10 Infinities |

<!-- Costs and order from src/core/secret-formula/infinity/break-infinity-upgrades.js -->

The two things worth planning around are the **buy-max Dimboost mode** and the **galaxy strength** upgrade. The first removes a whole category of manual tapping; the second is such a large multiplier that the game's first Infinity Challenge becomes comfortable shortly after you afford it. Older guides that tell you to buy the columns top-to-bottom in order date from before the cost rebalancing — now anything affordable is worth taking.

## The repeatable IP multiplier

Below the Break subtab, back on the **Upgrades** subtab, sits the repeatable ×2 IP upgrade. Each purchase doubles all IP gains, and you can buy it over and over: the price starts at 10 IP and rises tenfold per purchase for a long stretch before steepening. It unlocks once you own the earlier Infinity Upgrades (the achievement for completing that set). <!-- src/core/infinity-upgrades.js:132-175 (geometric 10× then 1e10× cost, hard cap) -->

<Callout kind="tip">

Buy this upgrade freely between pushes. Because post-break crunch payouts grow with your peak antimatter, doubling the payout and then pushing 20% further multiply together — alternate between the two all the way to Replicanti.

</Callout>

<Callout kind="android">

Everything here is bought with taps on the Break subtab, and the floating **Max** button above the tab bar buys whatever you can afford. After long offline stretches, check Options → Max offline ticks: a generous setting lets the away simulation actually play through these pushes instead of stalling. (On the way back in you will get the usual "While you were away" popup — Confirm it.)

</Callout>

## When to move on

Break Infinity is done when the upgrades above are all bought and your crunches are paying <Num value="1e8" /> IP or more. At that point antimatter in the low thousands unlocks the **Infinity Dimensions** — a new production layer that turns this whole phase from a grind into an avalanche. That is the next article: [Infinity Dimensions and Infinity Power](/guide/m1/infinity-dimensions).

Further reading:

- In-game How to Play → Break Infinity (matches your installed build exactly)
- Tables61, "Common places players get stuck" (r/AntimatterDimensions sticky) — the Break Infinity section

<Checklist stage="break-infinity" />
