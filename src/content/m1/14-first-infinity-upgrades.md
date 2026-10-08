---
title: 'Spending your first Infinity Points'
stage: early-infinity
order: 10
summary: 'Which Infinity Upgrades to buy first, and the route through the 1-IP columns.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## The upgrade grid

The Infinity tab's **Upgrades** subtab holds the Infinity Upgrades in two columns. Within each column you must buy from top to bottom — each upgrade unlocks the one below it — and most cost just <Num value="1" /> IP. Your first few Crunches each yield a single IP, so the opening is a quick sequence of crunch → buy → crunch faster.

<!-- infinity-upgrades.js: 1-IP chain totalTimeMult→18→36→resetBoost, buy10Mult→27→45; src/lib/data/generated/infinity-upgrades.json -->

Buy in this order:

1. The top of either column (time multiplier or buy-10 multiplier) — both cost <Num value="1" /> IP with no requirement.
2. Work **down the column you started**: each next upgrade costs <Num value="1" /> IP and needs the one above it.
3. Start the second column the same way, then alternate as IP allows.

The pair that matters most early is the time-played multiplier and the buy-10 multiplier: both feed every Dimension on every run. The Infinities-scaling pairs (1st+8th, 2nd+7th, 3rd+6th, 4th+5th) grow automatically as you crunch, so do not delay crunches to "save up" — more Infinities make the upgrades you already own stronger.

## The slightly bigger buys

Once the 1-IP rows are done (about ten Infinities in), the next targets cost real IP:

| Cost | Upgrade | Why |
| ---- | ------- | --- |
| <Num value="2" /> IP | Galaxies twice as strong | Needs the 4th+5th Infinities upgrade first; multiplies your whole Galaxy engine |
| <Num value="3" /> IP | Multiplier from this-Infinity time | Rewards fast crunches; pairs with the total-time one |
| <Num value="5" /> IP | 1st Dimension multiplier from unspent IP | Keep a small IP reserve once bought |
| <Num value="7" /> IP | Dimension Boost multiplier | Needs the 5-IP one; strengthens every Boost |
| <Num value="10" /> IP | Passively generate IP | 10× slower than your fastest run; first real idle income |

<Screen
	src="early-infinity/infinity-upgrades-0.webp"
	alt="The Upgrades subtab of the Infinity tab at 0 IP: the two 1-IP columns with their top-to-bottom unlock rule stated at the top."
	caption="The Infinity Upgrades grid on your first visit. Each column unlocks top to bottom — spend that first IP at the top of either column."
/>

Further up the right side sit the start-with-Boosts/Galaxy upgrades (<Num value="20" />–<Num value="300" /> IP) that skip the opening minutes of every run. They are quality of life first and speed second: buy them when runs feel slow to start, not before the multipliers above.

## What not to do

- Do not hoard IP "for later". Unspent IP does nothing until you own the upgrade that scales with it — spend everything, every Crunch, until that 5-IP upgrade is yours.
- Do not buy the <Num value="1000" />-IP offline upgrade early. It pays half your best IP/min while offline (and needs offline progress on in Options) — excellent later, but at this stage <Num value="1000" /> IP is days of progress; spend it on the cheap multipliers instead.

<Callout kind="tip">

The greyed-out upgrade at the top ("Multiply Infinity Points ×2") is a rebuyable IP multiplier. It starts at 10 IP and rises tenfold per purchase, steepening above <Num value="1e3000000" /> IP and capping at <Num value="1e6000000" /> IP — ignore it for now; it matters in the hundreds-of-IP era.

</Callout>

## Further reading

- In-game Info → How to play → "Infinity".
- Next: pushing the crunch autobuyer to its floor in [Upgrading autobuyers and the road to Break Infinity](/guide/m1/maxing-crunch-autobuyer).
