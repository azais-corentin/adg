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
	import Screen from '#lib/components/Screen.svelte';
</script>

## The three rebuyables

<Screen
	src="early-dilation/eternity-dilation-1.webp"
	alt="The Dilation upgrades list: the Double Dilated Time, Cheaper Tachyon Galaxy and Tripled Tachyon rebuyables with costs, then the one-time upgrades below."
	caption="The Dilation upgrades. The three rebuyables on top are the standing DT budget; the one-time upgrades below are each bought once."
/>

| Upgrade                   | First cost             | Cost ×              | Effect per buy                                                                                   | Buy when                                          |
| ------------------------- | ---------------------- | ------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| Doubled Dilated Time gain | <Num value="1e4" /> DT | <Num value="10" />  | DT income ×2                                                                                     | Alongside the Tachyon upgrade; your default spend |
| Cheaper Tachyon Galaxies  | <Num value="1e6" /> DT | <Num value="100" /> | Lowers the galaxy threshold multiplier (×5.00, then ×4.27, ×3.69, … down to ×1.35 after 38 buys) | Only right before a fresh TP push, never mid-push |
| Tripled Tachyon gain      | <Num value="1e7" /> DT | <Num value="20" />  | TP gain ×3                                                                                       | First priority — TP scales everything else        |

The threshold multiplier is how much more Dilated Time each Tachyon Galaxy needs than the one before. The card shows it as "Currently: ×4.2700 ➜ Next: ×3.6860" after one buy: each buy multiplies the part above ×1.35 by 0.8 (×5.00 = 1.35 + 3.65, ×4.27 = 1.35 + 3.65 × 0.8). <!-- secret-formula/eternity/dilation-upgrades.js galaxyThreshold effect 0.8^bought, 0 from the 38th; dilation.js getTachyonGalaxyMult 1 + (3.65 × effect + 0.35); emulator card (early-dilation/eternity-dilation-1.webp) -->

Buy the Tachyon-gain upgrade first whenever its cost is within roughly one-and-a-half times the DT-gain upgrade's cost; otherwise take the DT-gain level and come back. The Galaxy-threshold upgrade is the odd one: buying it **resets your Dilated Time and Tachyon Galaxies to zero**, so only buy it when you are about to start a new dilated TP push, or when the lost DT regenerates in seconds. <!-- vendor/ad-source/src/core/dilation.js (buyDilationUpgrade) -->

## The one-time upgrades, in order

Buy these as each becomes affordable — each is permanent, so none is ever wasted. The names are the cards' own texts: <!-- vendor/ad-source/src/core/secret-formula/eternity/dilation-upgrades.js; card texts from early-dilation/eternity-dilation-1.webp (Android 3.18.0) -->

1. **"Gain twice as many Tachyon Galaxies, up to 500 base Galaxies"** — <Num value="5e6" /> DT. Doubles the Galaxies your DT has earned. An immediate Tickspeed jump; buy the moment it is affordable.
2. **"Antimatter Dimension multiplier based on Dilated Time, unaffected by Time Dilation"** — <Num value="5e7" /> DT. Multiplies Antimatter Dimensions by DT to the power 308. This is what un-stalls your dilated pushes.
3. **"Time Dimensions are affected by Replicanti multiplier ^0.100, reduced effect above ×1e9000"** — <Num value="1e9" /> DT.
4. **"You can buy all three Time Study paths from the Dimension split"** — <Num value="1e10" /> DT. The Antimatter, Infinity and Time Dimension paths (studies 71–103) stop excluding each other. After buying it, respec and import a tree that takes all three columns; the [Time Study planner](/tools/time-studies) plans such trees with its "Dilation upgrade: all three Dimension paths" switch.
5. **"Reduce the Dilation penalty (multiplier exponent^0.75 ➜ exponent^0.7875)"** — <Num value="1e11" /> DT. Every number inside Dilation gets bigger.
6. **"Gain a multiplier to Infinity Points based on Dilated Time"** — <Num value="2e12" /> DT. Multiplies IP gain by DT to the power 1000, which speeds up the whole Eternity climb inside each run.
7. **"Generate Time Theorems based on Tachyon Particles"** — <Num value="1e15" /> DT. Generates Theorems per second from your TP (TP divided by 20000). From here on you stop spending antimatter, IP and EP on Theorems, which is what funds the million-Theorem Time Dimension studies in the next article.

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
