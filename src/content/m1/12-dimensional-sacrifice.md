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

**Dimensional Sacrifice** sets your 1st to 7th Dimensions back to zero and, in return, multiplies your 8th Dimension. The multiplier grows with how many 1st Dimensions you sacrifice.

<!-- sacrificeReset: resetAmountUpToTier(7); AD8 multiplier times Sacrifice.totalBoost in vendor/ad-source/src/core/sacrifice.js, dimensions/antimatter-dimension.js -->

On a new game there is no Sacrifice control at all. It appears at the top of the Antimatter subtab once you have bought your first 8th Dimension, as a disabled button reading "Sacrifice disabled (requires 5 Dimboosts)", with a "Sacrifice multiplier" readout next to the buy-ten multiplier. It becomes usable from your fifth Dimension Boost, roughly when your 8th Dimension is established and actually worth multiplying.

<Screen
	src="pre-infinity/dimensions-antimatter-top.webp"
	alt="The top of the Antimatter subtab in a pre-Infinity game with 2 Galaxies and 0 Boosts: the Sacrifice disabled (requires 5 Dimboosts) button, with Buy ten multiplier ×2.00 and Sacrifice multiplier ×1.00 below it."
	caption="Before five Boosts the Sacrifice button says what it is waiting for. Once unlocked, the same button previews the multiplier — press it at ×2 or more."
/>

<!-- Sacrifice.isVisible: Achievement(18) "Buy an 8th Antimatter Dimension"; canSacrifice: DimBoost.purchasedBoosts > 4 in vendor/ad-source/src/core/sacrifice.js -->

## When to press it

The button previews the multiplier you would get. The rule is simple: **Sacrifice when the preview reads ×2 or more**. Below that, the rebuild time costs more than the multiplier earns back; at ×2 and above, you recover in a couple of minutes and keep the permanent-feeling boost for the rest of the run.

As your 8th Dimension grows, the offered multiplier climbs. Early in a run it may sit below ×1.5 for a long while — that is normal. Keep boosting and buying, glance at the preview whenever you tap Max, and press it when it crosses ×2. Then rebuild with Max and continue the Boost/Galaxy loop.

<Callout kind="tip">

Sacrifice never touches your Boosts, Galaxies, achievements or autobuyers. It only empties Dimensions 1–7: your antimatter stays, and so do the purchase counts and buy-ten multipliers of those rows, so they refill quickly. It is always safe to press when the preview is good.

</Callout>

## The exception: Challenge 8

Inside Normal Challenge 8, Sacrifice behaves differently: Boosts give no multiplier and Galaxies are disabled, but Sacrifice resets antimatter and **all** Dimensions while giving a far stronger multiplier. There, Sacrifice is not a sometimes-button but the whole strategy — sacrifice often, at small multipliers, because it is your only growth engine. Details are in [the early challenges article](/guide/m1/normal-challenges-early).

## Common walls

- **The preview sits below ×2 for ages.** That means your 8th Dimension is still small relative to the lower tiers. Do not force it — buy Boosts, push for the next Galaxy, and check again after each rebuild. The multiplier grows with the 8th, so Galaxy-driven growth unclogs it.
- **Sacrifice barely moves the needle anymore.** Late pre-Infinity (and especially after Infinity upgrades), Boost and Galaxy multipliers dwarf the Sacrifice bonus. Keep pressing it at ×2+ out of habit, but stop waiting around for it — Galaxies are the growth engine now.
- **The button is greyed out or does nothing.** You need at least five Boosts, an 8th Dimension, and a preview above ×1; the button's text names the condition you are missing. Inside C8 the same five-Boost rule applies, but Sacrifice works differently there — see above.

## Further reading

- In-game Info → How to play → "Sacrifice".
