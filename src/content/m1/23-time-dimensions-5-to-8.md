---
title: 'Time Dimensions 5 to 8'
stage: late-eternity
order: 10
summary: 'The four million-plus-Theorem studies that unlock the remaining Time Dimensions, and why the Theorem generator comes first.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## What they are

Below the Dilation study, the tree holds four more studies that each unlock one further Time Dimension. Each requires the previous one, and each costs two orders of magnitude more than the last: <!-- vendor/ad-source/src/core/secret-formula/eternity/time-studies/dilation-time-studies.js -->

| Study | Unlocks | Cost | Requires |
| ----- | ------- | ---- | -------- |
| TD5 | 5th Time Dimension | <Num value="1e6" /> TT | Dilation unlocked |
| TD6 | 6th Time Dimension | <Num value="1e7" /> TT | TD5 |
| TD7 | 7th Time Dimension | <Num value="1e8" /> TT | TD6 |
| TD8 | 8th Time Dimension | <Num value="1e9" /> TT | TD7 |

Together they cost just over <Num value="1.111e9" /> Theorems. That number is only sane because of the Theorem generator: at <Num value="1e15" /> Dilated Time it mints Theorems per second from your Tachyon Particles, replacing the buy-buttons entirely. <!-- vendor/ad-source/src/core/secret-formula/eternity/dilation-upgrades.js --> Do not attempt these studies on bought Theorems — buy the generator first, let it fill the tank, then purchase the four studies in one respec.

<Screen
	src="early-eternity/dimensions-time-top.webp"
	alt="The Time subtab of the Dimensions tab: Time Shard count and rate, a Max all button, Time Dimensions 1 to 4 with EP costs, and the 5th Time Dimension showing its Theorem unlock."
	caption="The Time Dimensions list. Locked rows name the study that unlocks them — here the 5th is still waiting on its study."
/>

## Order of work

1. Push DT to <Num value="1e15" /> and buy the Theorem generator (see the upgrades article).
2. Keep a pushing tree equipped and let Theorems accumulate — check the Studies subtab total rather than the clock.
3. When the balance covers all four studies with room for your tree's normal cost, **Respec Time Studies on next Eternity**, then buy the tree plus TD5 through TD8 in one go.
4. Each new Time Dimension multiplies the ones below it in effect, so re-buy **Max all** on the Time subtab right after — the screenshot above shows where locked rows display their unlock.

<Callout kind="tip">

The [Time Study planner](/tools/time-studies) totals any tree including these four, so you can confirm the full price — studies plus your normal tree — before you respec.

</Callout>

## Why TD8 matters most

TD8 is not just another multiplier: owning the 8th Time Dimension's study is a hard requirement of the Reality study. The road to the first Reality is TD8, plus <Num value="1e4000" /> EP, plus the pre-Reality achievements — the next article covers all three. <!-- vendor/ad-source/src/core/secret-formula/eternity/time-studies/dilation-time-studies.js -->

## Further reading

- [Dilation upgrades in order](/guide/m1/dilation-upgrades-in-order) for the generator itself.
- [The road to the first Reality](/guide/m1/road-to-first-reality) for what TD8 unlocks.
