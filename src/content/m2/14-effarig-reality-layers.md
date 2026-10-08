---
title: Effarig's Reality in three layers
stage: effarig
order: 14
summary: What each layer of Effarig's Reality restricts, which glyphs to bring, and how to finish all three.
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## The shape of the run

Effarig's Reality costs <Num value="5e11" /> Relic Shards and plays as **three runs in sequence**: Infinity, then Eternity, then Reality. You must finish each layer to reach the next, and the tab tracks which layer is current. The whole Reality shares one theme: every multiplier, game speed and tickspeed is heavily weakened, Dilation-style, and your Glyph levels are capped per layer — but **rarity is untouched**, so your rarest Glyphs matter more than their levels here.

<!-- vendor/ad-source/src/core/celestials/effarig.js: currentStage Infinity→Eternity→Reality; glyphLevelCap 100/1500/2000; nerfFactor/tickDilation/multDilation -->

<Screen
	src="ra/celestials-effarig-1.webp"
	alt="The Start Effarig's Reality panel with its penalty text, and the three layer reward lines for Infinity, Eternity and Reality below it."
	caption="The Reality panel states the penalties; the three lines below show what each layer pays."
/>

Infinity Power softens the production and game-speed penalties, and Time Shards soften the tickspeed penalty — both are worth pushing before you enter. <!-- src/core/celestials/effarig.js: tickDilation/multDilation; h2p Effarig entry -->

## Layer 1: Infinity (Glyph level cap 100)

Reach Infinity (<Num value="1.8e308" /> antimatter) and Crunch. With levels capped at 100, flat multipliers beat scaling exponents: equip Power Glyphs with Antimatter Dimension multipliers, plus one Dilation Glyph with Time Theorem generation if you need studies. High rarity carries the run, so bring your rarest set even though the levels get clamped.

<!-- src/core/celestials/effarig.js: glyphLevelCap INFINITY = 100 -->

Reward: Infinity Challenges complete automatically and Infinity Dimension limits loosen.

## Layer 2: Eternity (Glyph level cap 1500)

Reach <Num value="1.8e308" /> IP and Eternity. Two extra caps apply: base IP gain cannot exceed <Num value="1e200" />, and each IP multiplier cannot exceed <Num value="1e50" />. <!-- vendor/ad-source/src/core/secret-formula/celestials/effarig.js (infinity description) -->

Bring a mixed set: Power for Dimension multipliers, Infinity for its multipliers, Replication with Replicanti multiplier power (it scales Infinity Dimensions around the caps), and Dilation with Theorem generation for studies. Take the Infinity Dimension study path with the Idle path.

Reward: **the Nameless Ones unlock** — the next Celestial — plus the removal of the IP caps.

## Layer 3: Reality (Glyph level cap 2000)

Reach <Num value="1.8e308" /> EP and Reality. This layer is a wall the first time: the penalties make Eternity Challenge 10 nearly impossible, which cuts off the bottom of the study tree.

The intended solution uses the next Celestial. Visit the Nameless Ones tab, charge your Black Hole to store game time (see the Nameless article), then enter layer 3, start EC10 and **discharge the stored time** to blast through it in one tick. With EC10 done, the bottom studies unlock and the rest of the layer plays normally.

<Callout kind="warning">

Do not bang your head on layer 3 before unlocking stored time. If EC10 will not move at all, leave, play the Nameless Ones' charging mechanic first, and come back with a full time bank.

</Callout>

Reward: **Effarig Glyphs** — a new Glyph type with its own equipment slot (next article).

## Glyph notes for all three layers

- Rarity over level: levels clamp, rarity does not. Your 90%+ sets are the ones to wear.
- Keep one Dilation Glyph with Theorem generation in the set so studies stay affordable.
- Save a preset per layer once the filter shop's preset slots are bought — re-entering with the right set is one tap.

## Further reading

- [Fandom Effarig page](https://antimatter-dimensions.fandom.com/wiki/Effarig) — layer goals and cap reference
- [Fandom Guide](https://antimatter-dimensions.fandom.com/wiki/Guide) — community layer walkthroughs
