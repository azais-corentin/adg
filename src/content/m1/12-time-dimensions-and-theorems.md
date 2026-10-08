---
title: 'Time Dimensions and Time Theorems'
stage: early-eternity
order: 12
summary: 'How Time Dimensions produce Time Shards, and how to buy Time Theorems with antimatter, Infinity Points and Eternity Points.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## Time Dimensions

The **Time** subtab of the Dimensions tab holds 8 Time Dimensions. They work like the other dimension tiers — each one produces the one below it — but they cost **Eternity Points** instead of antimatter, and the 1st Time Dimension produces **Time Shards** rather than a lower dimension.

Time Shards give free Tickspeed upgrades as they accumulate, so Time Dimensions speed up everything below them. The first four cost 1, 5, 100 and 1,000 EP; the later ones cost far more, and Time Dimensions 5–8 stay locked until much later (they unlock with very expensive studies on the road to Dilation).

<!-- src/core/dimensions/time-dimension.js: BASE_COSTS -->

<Screen
	src="early-eternity/dimensions-time-top.webp"
	alt="The Time subtab of the Dimensions tab: Time Shards and Tickspeed at the top, Time Dimensions 1 to 4 with EP costs, the Time Theorems button, and the Buy max Time Dimensions toggle."
	caption="The Time subtab. Time Dimensions cost EP, and the Time Theorems button sits near the top."
/>

<Callout kind="tip">

Buy max Time Dimensions is on by default — leave it on. EP spent on Time Dimensions still counts toward the upgrades that scale with *unspent* EP only while it is actually unspent, so buy the 5 EP upgrade before sinking everything into dimensions.

</Callout>

## Time Theorems

**Time Theorems** (TT) are the currency you spend on Time Studies. You must own at least one Time Dimension before you can buy any. There are three kinds, bought with three different currencies — tap the **Time Theorems** button at the top of the Time subtab:

<!-- src/core/time-theorems.js: TimeTheoremPurchaseType.am/ip/ep -->

| Bought with | First one costs | Price growth | Notes |
| ----------- | --------------- | ------------ | ----- |
| Antimatter | <Num value="1e20000" /> | ×<Num value="1e20000" /> each | Cheap at first; the price explodes after a few. |
| Infinity Points | 1 IP | ×100 each | The workhorse early source. |
| Eternity Points | 1 EP | marginal price doubles each time (1, 2, 4, 8, … EP) | The long-term source once EP flows. |

Each purchase gives exactly 1 TT, and there is a buy-max toggle per row. Early on, buy antimatter and IP theorems freely — the first studies cost 1–6 TT, and you will have dozens within a few Eternities. EP theorems take over once your EP per run passes a few hundred, since the IP row's ×100 geometric growth prices it out fast.

## The early economy in practice

2. Spend new TT on the next studies down the tree ([Time Studies](/guide/m1/time-studies) explains the order).
3. More studies → faster runs → more IP and EP → more theorems. This loop carries you to the first Eternity Challenges ([Unlocking Eternity Challenges](/guide/m1/unlocking-eternity-challenges)) at around 130 TT.

## Further reading

- In-game How to Play: **Time Dimensions** and **Time Studies**.
- Plan trees against your own TT count in the [Time Study planner](/tools/time-studies).
