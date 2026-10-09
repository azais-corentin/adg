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

The Infinity tab's **Upgrades** subtab holds sixteen Infinity Upgrades in four columns, labelled **Column 1** to **Column 4** in the game: Columns 1 and 2 side by side at the top, Columns 3 and 4 below them. The rule is printed above them: "Within each column, the upgrades must be purchased from top to bottom." Your first few Crunches each yield a single IP, so the opening is a quick sequence of crunch → buy → crunch faster.

| Column | Upgrades, top to bottom |
| ------ | ----------------------- |
| 1 | Multiplier from time played; 1st and 8th Dimensions from Infinities; 3rd and 6th from Infinities; "Decrease the number of Dimensions needed for Dimension Boosts and Antimatter Galaxies by 9". <Num value="1" /> IP each. |
| 2 | Buy-10 multiplier ×2 → ×2.2; 2nd and 7th Dimensions from Infinities; 4th and 5th from Infinities (<Num value="1" /> IP each); "Galaxies are twice as effective" (<Num value="2" /> IP). |
| 3 | Multiplier from time in this Infinity (<Num value="3" /> IP); unspent IP boosts the 1st Dimension (<Num value="5" /> IP); Dimension Boost multiplier ×2 → ×2.5 (<Num value="7" /> IP); passive IP generation (<Num value="10" /> IP). |
| 4 | Start every reset with 1, 2, 3 or 4 Dimension Boosts, the last one also with a Galaxy: <Num value="20" />, <Num value="40" />, <Num value="80" /> and <Num value="300" /> IP. |

<!-- infinity-upgrades.js: 1-IP chain totalTimeMult→18→36→resetBoost, buy10Mult→27→45→galaxyBoost; src/lib/data/generated/infinity-upgrades.json; labels from early-infinity/infinity-upgrades-0/1.webp -->

Buy in this order:

1. The top of Column 1 (time-played multiplier) or Column 2 (buy-10 multiplier) — both cost <Num value="1" /> IP with no requirement.
2. Work **down the column you started**: each next upgrade costs <Num value="1" /> IP and needs the one above it.
3. Start the other column the same way, then alternate as IP allows.

The pair that matters most early is the time-played multiplier and the buy-10 multiplier: both feed every Dimension on every run. The last 1-IP upgrade in Column 1 is a big one too: every Boost and Galaxy needs 9 fewer Dimensions (the first Boost drops from 20 4ths to 11). The Infinities-scaling pairs (1st+8th, 2nd+7th, 3rd+6th, 4th+5th) grow automatically as you crunch, so do not delay crunches to "save up" — more Infinities make the upgrades you already own stronger.

## The slightly bigger buys

Once Columns 1 and 2 are done (about ten Infinities in), the next targets cost real IP. All but the first are in Column 3:

| Cost | Upgrade | Why |
| ---- | ------- | --- |
| <Num value="2" /> IP | Galaxies twice as strong | Needs the 4th+5th Infinities upgrade first; multiplies your whole Galaxy engine |
| <Num value="3" /> IP | Multiplier from this-Infinity time | Rewards fast crunches; pairs with the total-time one |
| <Num value="5" /> IP | 1st Dimension multiplier from unspent IP | Keep a small IP reserve once bought |
| <Num value="7" /> IP | Dimension Boost multiplier | Needs the 5-IP one; strengthens every Boost |
| <Num value="10" /> IP | Passively generate IP | 10× slower than your fastest run; first real idle income |

<Screen
	src="early-infinity/infinity-upgrades-0.webp"
	alt="The Upgrades subtab of the Infinity tab at 0 IP: the top-to-bottom rule, Column 1 and Column 2 with their 1-IP upgrades and the 2-IP Galaxy upgrade, and the start of Columns 3 and 4 below."
	caption="The Infinity Upgrades on your first visit. Each column unlocks top to bottom — spend that first IP at the top of Column 1 or 2."
/>

Column 4 holds the start-with-Boosts/Galaxy upgrades (<Num value="20" />–<Num value="300" /> IP) that skip the opening minutes of every run. They are quality of life first and speed second: buy them when runs feel slow to start, not before the multipliers above.

## What not to do

- Do not hoard IP "for later". Unspent IP does nothing until you own the upgrade that scales with it — spend everything, every Crunch, until that 5-IP upgrade is yours.
- Do not rush the <Num value="1e3" />-IP offline upgrade once it appears. In the game it reads "Only while offline, gain 50% of your best IP/min run where you haven't used Max bottom button": only Infinities in which you never tapped the round **Max** button count, so its value depends on runs your autobuyers did alone. It also needs offline progress on in Options. Excellent later, but at this stage <Num value="1e3" /> IP is days of progress; spend it on the cheap multipliers instead.

<Callout kind="tip">

Once you own all sixteen upgrades (achievement "No DLC required"), a new row appears above the columns: a rebuyable "Multiply Infinity Points from all sources by 2" and the <Num value="1e3" />-IP offline upgrade. The rebuyable starts at 10 IP and rises tenfold per purchase, steepening above <Num value="1e3000000" /> IP and capping at <Num value="1e6000000" /> IP — it matters in the hundreds-of-IP era.

<!-- bottomRowUnlocked = Achievement(41) (16 Infinity Upgrades) in vendor/ad-source/src/components/tabs/infinity-upgrades/InfinityUpgradesTab.vue; on Android the row sits above Column 1/2 (break-infinity/infinity-upgrades-0.webp) -->

</Callout>

## Further reading

- In-game Info → How to play → "Infinity".
- Next: pushing the crunch autobuyer to its floor in [Upgrading autobuyers and the road to Break Infinity](/guide/m1/maxing-crunch-autobuyer).
