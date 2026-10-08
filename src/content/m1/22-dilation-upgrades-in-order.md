---
title: 'Dilation upgrades in order'
stage: early-dilation
order: 12
summary: 'Which Dilated Time upgrades to buy first — the three rebuyables, the one-time upgrades in cost order, and the traps to avoid.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
</script>

## The three rebuyables

Three upgrades can be bought any number of times, each doubling in effect per purchase while its cost multiplies up. They are your standing DT budget alongside the one-time upgrades: <!-- vendor/ad-source/src/core/secret-formula/eternity/dilation-upgrades.js -->

| Upgrade | First cost | Cost × | Effect per buy | Buy when |
| ------- | ---------- | ------ | -------------- | -------- |
| Doubled Dilated Time gain | <Num value="1e4" /> DT | <Num value="10" /> | DT income ×2 | Alongside the Tachyon upgrade; your default spend |
| Cheaper Tachyon Galaxies | <Num value="1e6" /> DT | <Num value="100" /> | Galaxy threshold ×0.8, up to 38 buys | Only right before a fresh TP push, never mid-push |
| Tripled Tachyon gain | <Num value="1e7" /> DT | <Num value="20" /> | TP gain ×3 | First priority — TP scales everything else |

Buy the Tachyon-gain upgrade first whenever its cost is within roughly one-and-a-half times the DT-gain upgrade's cost; otherwise take the DT-gain level and come back. The Galaxy-threshold upgrade is the odd one: buying it **resets your Dilated Time and Tachyon Galaxies to zero**, so only buy it when you are about to start a new dilated TP push, or when the lost DT regenerates in seconds. <!-- vendor/ad-source/src/core/dilation.js (buyDilationUpgrade) -->

## The one-time upgrades, in order

Buy these as each becomes affordable — each is a permanent multiplier, so none is ever wasted: <!-- vendor/ad-source/src/core/secret-formula/eternity/dilation-upgrades.js -->

1. **Double Tachyon Galaxies** — <Num value="5e6" /> DT. Doubles the Galaxies your DT has earned (up to 500 base). An immediate Tickspeed jump; buy the moment it is affordable.
2. **Antimatter Dimensions from Dilated Time** — <Num value="5e7" /> DT. Multiplies Antimatter Dimensions by DT to the power 308. This is what un-stalls your dilated pushes.
3. **Time Dimensions from Replicanti** — <Num value="1e9" /> DT. Time Dimensions scale with a slice of your Replicanti multiplier, softening at very high values.
5. **Weaker Dilation penalty** — <Num value="1e11" /> DT. Applies a ^1.05 power to the dilated 0.75 exponent (softening it toward 0.7875), so every number inside dilation gets bigger.
6. **Infinity Points from Dilated Time** — <Num value="2e12" /> DT. Multiplies IP gain by DT to the power 1000, which speeds up the whole Eternity climb inside each run.
7. **Free Time Theorems from Tachyon Particles** — <Num value="1e15" /> DT. Generates Theorems per second from your TP (TP divided by 20000). From here on you stop spending antimatter, IP and EP on Theorems, which is what funds the million-Theorem Time Dimension studies in the next article.

<Callout kind="tip">

The game's own stage tracker moves you into Late Eternity at <Num value="1e15" /> Dilated Time — exactly the Theorem generator price. If you can afford the generator, you have arrived. <!-- vendor/ad-source/src/core/secret-formula/progress-checker.js -->

</Callout>

## Common mistakes

- **Buying the Galaxy-threshold upgrade mid-push.** The DT reset wipes the income that was carrying your run. Set a rule: threshold buys happen only right after exiting Dilation, before starting the next push.
- **Saving up for a big one-time upgrade while the rebuyables sit idle.** A level or two of doubled DT gain now earns the big upgrade faster than sitting on unspent DT.
- **Chasing Galaxies instead of TP.** Galaxies help Tickspeed, but TP is what raises DT income and funds Theorems. If a choice buys TP gain, take it.

## Further reading

- [Time Dimensions 5 to 8](/guide/m1/time-dimensions-5-to-8): what the Theorem generator pays for.
- [Your first Dilated Eternity](/guide/m1/first-dilated-eternity) for the dilate–push–exit loop these upgrades feed.
