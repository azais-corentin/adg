---
title: 'Dimensional Sacrifice'
stage: pre-infinity
order: 12
summary: 'What Sacrifice resets, what it multiplies, and the ×2 rule for when to press it.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## What it does

<Screen
	src="pre-infinity/dimensions-antimatter-top.webp"
	alt="The top of the Antimatter subtab: the Sacrifice disabled banner reading requires 5 Dimboosts, with the buy-ten and Sacrifice multiplier readouts beside it."
	caption="Before five Boosts the Sacrifice row says so outright. Once unlocked, this same row previews the multiplier — press it at ×2 or more."
/>

It becomes usable once you have bought more than four Dimension Boosts — roughly when your 8th Dimension is established and actually worth multiplying. The button appears among the Dimension controls; before that point the game does not offer it at all.

<!-- canSacrifice: DimBoost.purchasedBoosts > 4 in vendor/ad-source/src/core/sacrifice.js -->

## When to press it

The button previews the multiplier you would get. The rule is simple: **Sacrifice when the preview reads ×2 or more**. Below that, the rebuild time costs more than the multiplier earns back; at ×2 and above, you recover in a couple of minutes and keep the permanent-feeling boost for the rest of the run.

As your 8th Dimension grows, the offered multiplier climbs. Early in a run it may sit below ×1.5 for a long while — that is normal. Keep boosting and buying, glance at the preview whenever you tap Max, and press it when it crosses ×2. Then rebuild with Max and continue the Boost/Galaxy loop.

<Callout kind="tip">

Sacrifice never touches your Boosts, Galaxies, achievements or autobuyers — only Dimensions 1–7 and their spent antimatter. It is always safe to press when the preview is good.

</Callout>

## The exception: Challenge 8

Inside Normal Challenge 8, Sacrifice behaves differently: Boosts give no multiplier and Galaxies are disabled, but Sacrifice resets antimatter and **all** Dimensions while giving a far stronger multiplier. There, Sacrifice is not a sometimes-button but the whole strategy — sacrifice often, at small multipliers, because it is your only growth engine. Details are in [the early challenges article](/guide/m1/normal-challenges-early).

## Common walls

- **The preview sits below ×2 for ages.** That means your 8th Dimension is still small relative to the lower tiers. Do not force it — buy Boosts, push for the next Galaxy, and check again after each rebuild. The multiplier grows with the 8th, so Galaxy-driven growth unclogs it.
- **Sacrifice barely moves the needle anymore.** Late pre-Infinity (and especially after Infinity upgrades), Boost and Galaxy multipliers dwarf the Sacrifice bonus. Keep pressing it at ×2+ out of habit, but stop waiting around for it — Galaxies are the growth engine now.
- **The button vanished or does nothing.** You need more than four Boosts (it appears from the fifth), a positive multiplier preview, and to be outside Challenge 8's special rules. Inside C8 it is always available and works differently — see below.
## Further reading

- In-game Info → How to play → "Sacrifice".
