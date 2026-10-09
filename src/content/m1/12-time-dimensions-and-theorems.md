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

Time Shards give free Tickspeed upgrades as they accumulate, so Time Dimensions speed up everything below them. The first four cost 1, 5, 100 and 1,000 EP. Time Dimensions 5–8 stay locked until much later: their rows read "Unlock: 1e6 TT" and so on, because they unlock with very expensive studies on the road to Dilation. As the subtab says, tap a locked Dimension's button to see its cost.

<!-- src/core/dimensions/time-dimension.js: BASE_COSTS; Time subtab text from the emulator -->

<Screen
	src="early-eternity/dimensions-time-top.webp"
	alt="The Time subtab at 13 Eternities: Time Shards and Tickspeed at the top, Time Dimensions 1 to 4 with their EP costs, and the 5th Time Dimension showing its 1e6-TT unlock."
	caption="The Time subtab. Time Dimensions cost EP, and locked rows show what unlocks them."
/>

<Callout kind="tip">

**Max all** at the top of the Time subtab buys every Time Dimension you can afford. Buy the 5 EP Eternity Upgrade before sinking all your EP into Time Dimensions: it scales with your *unspent* EP.

</Callout>

## Time Theorems

**Time Theorems** (TT) are the currency you spend on Time Studies. You must own at least one Time Dimension before you can buy any. They are bought at the top of the **Eternity** tab (hourglass icon), **Studies** subtab: under "You have N Time Theorems. (Purchased M total)" sit a **Buy max Theorems** button and three **Buy Time Theorems** buttons, one per currency:

<!-- src/core/time-theorems.js: TimeTheoremPurchaseType.am/ip/ep (costBase, costIncrement), checkForBuying (needs a Time Dimension) -->

| Bought with | First one costs | Price growth | Notes |
| ----------- | --------------- | ------------ | ----- |
| Antimatter | <Num value="1e20000" /> | ×<Num value="1e20000" /> each (1e20,000, 1e40,000, …) | Cheap at first; the price explodes after a few. |
| Infinity Points | 1 IP | ×<Num value="1e100" /> each (1, 1e100, 1e200, …) | The workhorse early source. |
| Eternity Points | 1 EP | ×2 each (1, 2, 4, 8, … EP) | The long-term source once EP flows. |

Each purchase gives exactly 1 TT; **Buy max Theorems** buys as many of all three as you can afford. Early on, buy antimatter and IP theorems freely — the first studies cost 1–6 TT, and you will have dozens within a few Eternities. EP theorems take over once your EP per run passes a few hundred, since the IP row's ×<Num value="1e100" /> growth prices it out fast.

<Screen
	src="early-eternity/eternity-studies-0.webp"
	alt="The top of the Studies subtab at 13 Eternities: You have 0 Time Theorems (Purchased 14 total), Buy max Theorems, and three Buy Time Theorems buttons costing 1e120,000 antimatter, 1e600 IP and 8 EP, then Respec, Export tree, Import tree and the preset slots."
	caption="Time Theorems are bought on the Studies subtab of the Eternity tab. After 14 purchases the next ones cost 1e120,000 antimatter, 1e600 IP or 8 EP."
/>

## The early economy in practice

1. After each Eternity, buy Time Dimensions with your EP (**Max all**), then tap **Buy max Theorems**.
2. Spend new TT on the next studies down the tree ([Time Studies](/guide/m1/time-studies) explains the order).
3. More studies → faster runs → more IP and EP → more theorems. This loop carries you to the first Eternity Challenges ([Unlocking Eternity Challenges](/guide/m1/unlocking-eternity-challenges)) at around 130 TT.

## Further reading

- In-game How to Play: **Time Dimensions** and **Time Studies**.
- Plan trees against your own TT in the [Time Study planner](/tools/time-studies).
