---
title: "Destabilizing Lai'tela's Reality"
stage: laitela
order: 13
summary: 'How Entropy works, the 30-second destabilizations, and the final push to Pelle.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## Entering the Reality

The Lai'tela tab has a **Start Lai'tela's Reality** button. Inside, the normal Reality goal is replaced: your antimatter generates **Entropy**, and at 100% Entropy the Reality destabilizes and ends on its own. Do not press the Reality button, just let it fill. The faster you get there, the bigger the reward. <!-- vendor/ad-source/src/core/secret-formula/h2p.js:1644-1692; vendor/ad-source/src/game.js:724-745 laitelaRealityTick: entropy += realDiff × entropyGainPerSecond, at 1 clearCelestialRuns() -->

<Screen
	src="laitela/celestials-laitela-4.webp"
	alt="The Start Lai'tela's Reality panel: its restriction text, the fastest-completion and highest-dimension records, and the equipped glyph set."
	caption="The Reality panel. The records above the Glyph set show your reward and how far the destabilization has gone."
/>

The panel lists the rules. On Android 3.18.0 it reads:

> Infinity Point and Eternity Point gain are Dilated. Game speed is reduced to 1 and gradually comes back over 10 minutes. Black Hole storing, discharging, pulsing, and inversion are all disabled. Production from 5th and higher Dimensions is disabled.
>
> Antimatter generates entropy inside of this Reality. At 100% entropy, the Reality becomes destabilized and you gain a reward based on how quickly you reached 100%. Destabilizing the Reality in less than 30 seconds makes it become significantly more difficult, in exchange for giving a much stronger reward.

The "Production from … is disabled" line follows your destabilizations; it is missing until the first one. Above the rules, three readouts track your progress:

- **"All Dark Matter multipliers are ×… higher."** The reward. It grows ×100 per destabilization and with the square of how fast your best completion was.
- **"Fastest Completion"**, in real time. It resets to 05:00 after each destabilization.
- **"Highest active dimension"**: 8 at first, one lower per destabilization.

<!-- vendor/ad-source/src/core/celestials/celestials.js:73-110 (Lai'tela effects/description); laitela.js realityReward = 100^difficultyTier × (360 / fastestCompletion)^2; game.js:742-744 (difficultyTier++, fastestCompletion = 300). Emulator 3.18.0 (Lai'tela save, tier 4): "All Dark Matter multipliers are ×1.44e8 higher.", "Fastest Completion: 05:00", "Highest active dimension: 4", rules as quoted. -->

Entropy fills at a speed set only by your antimatter, and the clock is real time. Since game speed starts at 1 and the Black Hole is off, a fast run needs antimatter production that is huge on its own. <!-- laitela.js entropyGainPerSecond = clamp((log10(AM + 1) / 1e11)^2, 0, 100) / 200 -->

## The 30-second destabilizations

Destabilize the Reality in under 30 seconds of real time and your highest still-enabled Dimension tier is **permanently disabled inside future attempts**: 8th, then 7th, and so on. Each tier disabled multiplies the Dark Matter reward by 100, so fast runs make everything else faster. Disable all 8 tiers this way and you also gain a ×8 Dark Energy multiplier; the run button then reports the Reality fully destabilized and its reward maxed. <!-- vendor/ad-source/src/core/secret-formula/h2p.js:1644-1692 vendor/ad-source/src/core/celestials/laitela/laitela.js:28-33 -->

How to go fast:

- Equip a Dilation-heavy set (four Dilation glyphs plus a Reality glyph is the standard) with high Dilation power and Tickspeed effects.
- Push antimatter as hard as you can from the first second. Black Hole pulsing and stored time do not work inside, and a run past 30 seconds still completes but disables nothing.
- The first two sub-30-second runs are easy and fund upgrade 16; later tiers need bigger Dark Matter multipliers and higher glyph levels, so interleave destabilizations with normal farming.

## The road to Pelle

Rough order for the back half of the stage:

1. Destabilize twice (fast), buy upgrade 16 for the 2nd Dark Matter Dimension.
2. Farm iM through bigger RM pushes; buy upgrades 17–19 for the remaining Dimensions and Annihilation.
3. Push Singularity milestones toward automation; keep destabilizing as your multipliers allow.
4. Fully destabilize all 8 tiers, finish the remaining milestones, and buy upgrades 20–24.
5. For **upgrade 25**: with all tiers disabled, enter Lai'tela's Reality wearing at most one non-companion glyph, meet the Reality study's normal conditions inside, and press Reality. That purchases Pelle. <!-- vendor/ad-source/src/core/secret-formula/reality/imaginary-upgrades.js:307-323 -->

<Callout kind="warning">

Do not buy upgrade 25 the moment you can afford it if your Singularity milestones are half-done: Dooming (the next stage) resets nearly everything, and Lai'tela farming never comes back. Finish the milestones first.

</Callout>

## Further reading

- Fandom Guide, Lai'tela section — https://antimatter-dimensions.fandom.com/wiki/Guide
- r/AntimatterDimensions destabilization threads (2024–2025) — https://www.reddit.com/r/AntimatterDimensions/
