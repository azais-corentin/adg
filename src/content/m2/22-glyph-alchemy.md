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

Sacrificing a Glyph normally feeds Glyph Sacrifice. With alchemy unlocked, a Glyph can instead be **refined** into its type's alchemy resource: Power, Infinity, Time, Replication and Dilation Glyphs feed the matching base resource, and the Effarig resource comes from Effarig Glyphs. The Alchemy tab says where: "Glyphs can now be refined using your Glyph filter in the Glyphs tab."

On the Glyphs tab, open **Sacrifice Type** below the inventory. "Behavior for deleted and filtered Glyphs:" offers **Always sacrifice** (the default, no refining), **Always refine**, and **Refine to cap, then sacrifice**. The last is the one to leave on: every Glyph your filter rejects or you remove refines while its resource has room and is sacrificed once the resource is full. Tap a Glyph to see what it is worth: its card reads "Sacrifice: 2.38e36 | Refine: 241.68" with "(Actual value due to cap: …)" under it, and with refining on its button changes from "Sacrifice for …" to "Refine for …". <!-- vendor/ad-source/src/core/glyphs/auto-glyph-processor.js AUTO_GLYPH_REJECT labels; GlyphComponent.vue; emulator (Android 3.18.0, ra save): Glyphs tab → Sacrifice Type, Effarig Glyph card in Always refine mode -->

<Screen
	src="ra/refine/reality-glyphs-2.webp"
	alt="The Glyphs tab with a level 7,848 Effarig Glyph's card open: Sacrifice: 2.38e36, Refine: 241.68, Actual value due to cap: 0.00, and a Refine for 0.00 button; below, the Sacrifice Type panel with Always sacrifice, Always refine (selected) and Refine to cap, then sacrifice."
	caption="Sacrifice Type decides whether removed and filtered Glyphs are sacrificed or refined. A Glyph's card shows its refinement and what the cap still lets it give."
/>

How much a Glyph gives depends on its level (cubed: a level 10,000 Glyph has a refinement value of 10,000) and its rarity; refining it gives 5% of that value, the "Refine:" number on its card. The catch is the cap. The Alchemy tab puts it as "it will only give you resources up to a cap of ×20 its highest refinement value": each resource tops out at 20 times the "Refine:" value of the best Glyph of its type you have ever refined, and never above <Num value="25000" />. The Alchemy tab shows each resource as amount/cap ("Currently: 4,082.7/5,529.8"). So refine your _best_ spare Glyphs, not junk: one high-level Glyph raises the ceiling, and about twenty of that level fill it. <!-- vendor/ad-source/src/core/glyphs/glyph-purge-handler.js `glyphRefinementEfficiency` 0.05, `highestRefinementValue` = raw gain / 0.05, `glyphEffectiveCap`; celestials/ra/alchemy.js `cap` = min(25000, highestRefinementValue); h2p "Glyph Alchemy Resources"; emulator Alchemy tab text and Power "Currently: 4,082.7/5,529.8" -->

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

Reactions are not continuous: the Alchemy tab says "Reactions trigger once every time you Reality, unaffected by amplification from stored real time." Each Reality runs every active reaction once, in a fixed priority order, and it yields more the more of each reagent you have above the product's amount; an amplified Reality still counts as one. Tap a resource's circle to see its reaction ("Reaction: 10Ω + 5∞ ➜ 1.50ρ") and its **Reaction: ON** switch; **Disable all reactions** stops them all. Your job is keeping the base resources fed with strong refinements. <!-- h2p "Glyph Alchemy Reactions"; AlchemyTab.vue:229; ra.js applyAlchemyReactions (sorted, combineReagents once per Reality); emulator (ra save): Dimensionality panel "Reaction: 10Ω + 5∞ ➜ 1.50ρ", "Reaction: ON", "Disable all reactions" -->

<Callout kind="tip">

Refine deliberately: a Glyph's card shows what it would give and what the cap leaves of it. Farm a great Glyph set first, equip the best, and refine the strong spares — never your equipped set.

</Callout>

## Further reading

- [Community wiki: Glyph Alchemy](https://antimatterdimensions.wiki.gg/) — full resource and reaction table.
