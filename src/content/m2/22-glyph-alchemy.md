---
title: 'Glyph Alchemy'
stage: ra
order: 12
summary: 'Refining Glyphs into alchemy resources, how reactions chain upward, and which resources to chase.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## Unlocking alchemy

Glyph Alchemy unlocks at **Effarig memory level 2**, adding an Alchemy subtab under Reality. <!-- vendor/ad-source/src/core/secret-formula/celestials/ra.js `unlockGlyphAlchemy`: pet effarig, level 2 --> More resources within it unlock as Effarig levels rise — check each locked resource's label, which names the Effarig level it needs.

<Screen
	src="ra/reality-alchemy-0.webp"
	alt="The Alchemy tab: five base resources Power, Infinity, Time, Replication and Dilation with amounts and effects, Refinement progress, and reaction listings below."
	caption="The Alchemy tab: base resources on top, reactions combining them below."
/>

## Refining Glyphs

Sacrificing a Glyph normally feeds Glyph Sacrifice. With alchemy unlocked, qualifying Glyphs can instead be **refined** into their type's alchemical resource: Power, Infinity, Time, Replication and Dilation Glyphs feed the matching base resource, and the Effarig resource comes from Effarig Glyphs. Each refined Glyph grants a slice of its level's value — higher-level, higher-rarity Glyphs give far more. <!-- vendor/ad-source/src/core/glyphs/glyph-purge-handler.js `glyphRawRefinementGain`, `glyphRefinementEfficiency` -->

The catch is the cap: each resource's cap equals the best refinement you have ever done for it, up to a hard cap of <Num value="25000" />. <!-- vendor/ad-source/src/core/glyphs/glyph-purge-handler.js `glyphEffectiveCap`; vendor/ad-source/src/core/celestials/ra/ra.js `alchemyResourceCap` --> Early refinements barely move the cap, so refine your *best* spare Glyphs, not junk: one great Glyph raises the ceiling for everything after it.

## The resource ladder

Base resources combine through reactions into higher tiers. Each reaction consumes fixed amounts of its reagents and produces the next resource up: <!-- vendor/ad-source/src/core/secret-formula/celestials/alchemy.js -->

- **Base (tier 1):** Power (AD power), Infinity (ID power), Time (TD power), Replication (replication speed), Dilation (DT gain), Effarig (shard gain). Unlocked across Effarig levels 2–7 (Effarig itself at 7).
- **Tier 2:** Cardinality (softer Replicanti cap), Eternity (Eternity generation power), Dimensionality (all-Dimensions multiplier), Inflation (huge multipliers get extra power), Alternation (stronger Tachyon Galaxies). Unlocked across Effarig levels 8–12.
- **Tier 3:** Synergism (better reaction yields), Momentum (all-Dimensions power that grows hourly in real time), Decoherence (refining also feeds every other base resource). Unlocked at Effarig levels 13 (Synergism), 14 (Decoherence) and 15 (Momentum).
- **Tier 4:** Multiversal (each Reality simulates extras), Force (ADs from RM), Exponential (IP from Replicanti), Uncountability (passive Realities and Perk Points), Boundless (stronger Tesseracts), Unpredictability (reactions can fire twice). Unlocked across Effarig levels 16–21.
- **Tier 5:** Reality itself — consume one of each tier-4 resource to forge a Reality Glyph whose level equals the amount consumed. Unlocked at Effarig level 25.

<Screen
	src="ra/reality-alchemy-1.webp"
	alt="Lower Alchemy tab: advanced resources including Dimensionality, Eternity and Alternation with reagent costs and effects."
	caption="Higher alchemy tiers: each reaction lists its reagents and amounts."
/>

## What to chase

1. **Base resources first.** Power, Infinity and Time are flat powers on all your Dimensions — the cheapest account-wide multipliers in this stage.
2. **Decoherence as soon as it appears.** Feeding every base resource on each refine multiplies all future refining. It makes the whole ladder faster.
3. **Synergism and Momentum.** Better yields plus a power that grows while you sleep stack with everything.
4. **Exponential… except in V.** Its IP effect is disabled inside V's Reality, so do not judge it on V runs. <!-- vendor/ad-source/src/core/celestials/ra/alchemy.js:79 -->
5. **The Reality resource last.** Forging Reality Glyphs is the endgame of the ladder: bank tier-4 amounts until the forged level beats your farmed Glyphs.

Reactions run automatically each tick in priority order, so there is no manual crafting loop — your job is keeping the base resources fed with strong refinements.

<Callout kind="tip">

Refine deliberately: the confirmation popup shows exactly how much a Glyph gives and the current cap. Farm a great Glyph set first, equip the best, and refine the strong spares — never your equipped set.

</Callout>

## Further reading

- [Community wiki: Glyph Alchemy](https://antimatterdimensions.wiki.gg/) — full resource and reaction table.
