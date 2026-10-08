---
title: 'Which glyphs to wear'
stage: early-reality
order: 18
summary: 'Effect priorities per glyph type and the setups to run from your second Reality to Teresa.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';

## How to read an effect

Each glyph type draws from its own effect pool. The short version per type:

| Type | Look for | Avoid early |
| ---- | -------- | ----------- |
| Power (Ω) | Antimatter Dimension power; later Dimension Boost and buy-10 multipliers | Antimatter multiplier (falls off after Eternity) |
| Time (Δ) | EP multiplier; Time Dimension power as filler | Game speed (numbers too small pre-Celestial) |
| Infinity (∞) | Infinity Dimension power, Infinity Power conversion; IP multiplier only for early unlock runs | — |
| Replication (Ξ) | Replication speed; later replication multiplier and DT multiplier | — |
| Dilation (Ψ) | DT multiplier; Tachyon Galaxy threshold and TT per hour as support | AD power while Dilated (one of the weakest effects) |

Level matters as much as the name: a high-level glyph with a second-choice effect usually beats a level-1 glyph with the perfect one. Rarity works the same way — treat the percentage as a quality rating.

## Second Reality: pick speed

Your fixed first glyph is Power with AD power. For the second Reality's choice:

1. **Time with EP multiplier.** It cuts hours off the Eternity and early-challenge stretch of every run.
2. **Power with AD power** if no EP-multiplier Time shows. Two Power glyphs carry the early Infinities comfortably.
3. **Infinity with an IP effect** is a fine third: it smooths the Row 2 upgrade unlocks that need strong Infinity runs.

## Mid game: one Time plus Dilation and Replication

Once you have 3–4 slots and a leveled Black Hole, runs live or die on Tachyon Galaxies. The standard shape is **one Time glyph (EP multiplier) plus Dilation and Replication**: TDDD, TDDR or TDRR depending on your best rolls.

- Dilation wants the **DT multiplier** first, then Tachyon Galaxy threshold.
- Replication wants **replication speed** first, then replication DT multiplier.
- Keep the Time glyph until runs take minutes rather than hours — it keeps Eternity gain fast while the others push galaxies.

## Late pre-Teresa: split into two sets

With 5 slots and fast runs, Dilation stops helping RM pushes. Set up two saved sets (the Glyph Presets button stores them) and swap per goal: an **RM push set** (Power/Infinity mix with the best raw multipliers) for beating your max-EP record, and a **glyph-level farming set** (Time plus Dilation/Replication with Tachyon Galaxy threshold) for raising future glyph levels. Tables61's guide works through the exact effect picks per set — use its reasoning, not a fixed list, since your best rolls decide.

Do not chase perfect rolls — a full set of good-enough glyphs at high level beats two perfect ones at low level. Level comes from pushing EP, Replicanti and Dilated Time each Reality, which the Black Hole and Reality Upgrades accelerate.

<Screen
	src="early-reality/statistics-glyphsets-top.webp"
	alt="The Statistics tab Glyph Sets subtab: saved glyph records including Transient and Duplicated Power sets, best glyph level, and fastest Reality."
	caption="Saved glyph sets in Statistics. Store the RM push set and the glyph-level farming set here and swap per goal."
/>

<Callout kind="tip">

Save both sets as presets as soon as the button is available. Swapping by hand every Reality is the most common mid-game time sink.

</Callout>

## Further reading

- Tables61's [guide to Glyphs pre-Celestial 1](https://www.reddit.com/r/AntimatterDimensions/comments/101lby4/) — full reasoning behind these setups (summarized here in our own words).
- [Fandom: Glyphs](https://antimatter-dimensions.fandom.com/wiki/Glyphs) — per-effect numbers (CC BY-SA; reworded here).
