---
title: 'Finishing V'
stage: v
order: 14
summary: 'The road to 36 Space Theorems, the Ra unlock, and a checklist for the whole V stage.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Checklist from '#lib/components/Checklist.svelte';
	import StageGate from '#lib/components/StageGate.svelte';
</script>

## The 36-Theorem route

V's stage goal is 36 Space Theorems: that count unlocks Ra and discounts every Theorem purchase in the tree by 2. <!-- vendor/ad-source/src/core/secret-formula/celestials/v.js `unlocks.raUnlock` --> Six achievements times six tiers is exactly 36, but nobody clears every tier linearly. The practical route interleaves easy tiers, tree spending, and farming:

1. **Glyph Knight 1–4 plus the easy first tiers** (AntiStellar 1–2, Matterception 1–3, one Se7en tier). Reach about 10 Theorems and buy active + passive together.
2. **Farm with the stronger tree.** Push RM and Glyph level; better Glyphs make every remaining tier cheaper.
3. **Second wave to ~20 Theorems.** Eternal Sunshine 1–2, more Se7en and AntiStellar tiers, Glyph Knight 5, first Young Boy tiers.
4. **Breakthrough with Black Hole discharges.** A Time-Glyph-boosted discharge inside V's Reality pushes the late EP, IP and antimatter goals over the line.
5. **Finish the last normal tiers**, then start Ra and let its memories carry hard V.

Use Perk-Point goal reduction aggressively in steps 3–5. A few reductions on a stuck goal beat days of farming the same tier.

<Callout kind="warning">

Do not hoard Theorems waiting for a perfect tree. Count-based rewards (AD power at 5, auto-EC speed at 10, auto-purge at 16, Black Hole power at 30) fire on Theorems *earned*, but their value only materializes when you spend. Earn, spend, push, repeat.

</Callout>

## Entering Ra

At 36 Theorems the Ra node on the Celestial map lights up. <!-- vendor/ad-source/src/core/celestials/ra/ra.js `isUnlocked`: Space Theorems ≥ 36 --> Tapping it shows Ra's tab: four memory panels, a Remembrance section, and the Start Ra's Reality button. You do not stop doing V runs — Ra's V memory *needs* Space Theorems to grow — but Ra becomes the new home base. [Unlocking Ra](/guide/m2/unlocking-ra) walks through the first steps.

<StageGate until="ra" mode="highlight">

Still below 36? Stay in the loop: V runs for easy tiers, farm Realities for Glyphs and RM in between, reduce stuck goals, and re-check the ladder after every run.

</StageGate>

## Checklist

<Checklist stage="v" />

## Further reading

- [Fandom Guide](https://antimatter-dimensions.fandom.com/wiki/Guide) — Celestials walkthrough.
- [Community wiki](https://antimatterdimensions.wiki.gg/) — V and Ra mechanics reference.
