---
title: 'Effarig and Relic Shards'
stage: effarig
order: 13
summary: 'How Effarig unlocks, how Relic Shards are earned, and which shop unlocks to buy first.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## How Effarig unlocks

Effarig, Celestial of Ancient Relics, unlocks when your poured total in Teresa's container reaches <Num value="1e24" /> — the full container. A new Effarig subtab appears in the Celestials tab.

<!-- vendor/ad-source/src/core/secret-formula/celestials/teresa.js: effarig price 1e24; src/core/celestials/enslaved.js chain via EffarigUnlock.eternity -->

<Screen
	src="effarig/celestials-effarig-0.webp"
	alt="The Effarig subtab: the shard count and rarity bonus, the next-Reality shard preview, and the four shard-cost buttons for weights, filter, presets and the Reality."
	caption="The Effarig tab. The four red buttons are the shard shop; the Reality button unlocks last."
/>

## Relic Shards

Relic Shards are Effarig's currency, earned from **every Reality from now on** — not just inside Effarig's Reality. Two things decide how many you get:

1. **Distinct Glyph effects equipped** — the dominant factor. The game takes the EP exponent, divides by 7,500 and raises that to the power of your distinct effect count (counting generated-type and non-generated-type effects separately), so a set with many different effects earns far more than a set with a few strong ones.
2. **Eternity Points** — a much smaller factor. More EP helps, but never makes up for a narrow set.

<!-- vendor/ad-source/src/core/celestials/effarig.js: shardsGained = floor((EP.exponent/7500)^glyphEffectAmount) × alchemy Effarig effect; vendor/ad-source/src/core/secret-formula/h2p.js (Effarig entry) -->

The tab previews what the next Reality would give, including a per-minute rate. Use that rate to tune your runs: Reality when the rate peaks instead of dragging runs out.

Shards also passively raise the rarity of new Glyphs (about +5% per order of magnitude of shards). <!-- src/core/celestials/effarig.js: maxRarityBoost = 5 * log10(log10(shards + 10)) -->

<Callout kind="tip">

Farm shards with a **variety set**: one of each basic type (Power, Infinity, Replication, Time, Dilation) with as little effect overlap as possible. Fifteen or more distinct effects is a good target. This is the opposite of your pushing set, so keep both equipped-set habits side by side.

</Callout>

## The shard shop

Spend shards on four unlocks, in this order:

| Cost | Unlock |
| --- | --- |
| <Num value="1e7" /> shards | Adjustable Glyph level weights — choose how much EP, Dilated Time, Replicanti and Eternities contribute to new Glyph levels |
| <Num value="2e8" /> shards | Glyph Filtering — automatic keep-or-sacrifice rules for new Glyphs (next article) |
| <Num value="3e9" /> shards | Glyph Presets — 7 save slots for equipped sets |
| <Num value="5e11" /> shards | Effarig's Reality |

<!-- vendor/ad-source/src/core/secret-formula/celestials/effarig.js -->

The weights and the filter both pay off while farming the shards for the later ones, so buy each as soon as you can afford it. Presets are worth it the moment you juggle two or more sets (a pushing set, a shard-farming variety set, a level-farming set): saving each once beats re-equipping by hand every run.

## What to aim for

1. Equip a variety set and Reality on the shard-rate peak.
2. Buy weights, then the filter, then presets.
3. Push to <Num value="5e11" /> shards for Effarig's Reality.
4. After the Reality layers, come back here for Effarig Glyphs and the filter deep-dive.

## Further reading

- [Fandom Effarig page](https://antimatter-dimensions.fandom.com/wiki/Effarig) — shard formula and unlock reference
