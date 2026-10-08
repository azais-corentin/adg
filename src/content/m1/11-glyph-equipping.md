---
title: 'Glyphs: equipping and choosing'
stage: early-reality
order: 14
summary: 'What glyph type, level, rarity and effects mean, and how to equip and pick glyphs on Android.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## The four attributes

Every glyph has four attributes. Type decides which effects it can roll; level and rarity decide how strong those effects are. <!-- in-game How to Play, "Glyphs"; vendor/ad-source/src/core/glyphs/glyph-generator.js -->

- **Type** — Power (Ω), Infinity (∞), Replication (Ξ), Time (Δ) or Dilation (Ψ) before any Celestial (later Effarig, Reality and Cursed types join). Each type boosts its own corner of the game: Power helps Antimatter Dimensions, Infinity helps Infinity Dimensions, Replication speeds up Replicanti, Time helps Time Dimensions and Eternity gain, Dilation helps Dilated Time and Tachyon Galaxies.
- **Level** — grows with the EP, Replicanti and Dilated Time you reached in the Reality that produced it, plus a share of your Eternity count once you buy Measure of Forever. Higher level means stronger effects and usually more of them. <!-- vendor/ad-source/src/core/glyphs/auto-glyph-processor.js (getGlyphLevelInputs); reality-upgrades.js (Measure of Forever) -->
- **Rarity** — a strength value shown as a percentage. Higher is better: it raises effect strength and the chance of extra effects. Named bands run Common, Uncommon, Rare, Epic, Legendary, Mythical, Transcendent, Celestial (top-down, not bottom-up). <!-- vendor/ad-source/src/core/constants.js (GlyphRarities, descending minStrength) -->
- **Effects** — the actual bonuses, up to four per glyph on basic types. Same-type effects on several equipped glyphs combine: "+" effects add, "×" effects multiply. <!-- in-game How to Play, "Glyphs" -->

Your first glyph is fixed: a Power glyph with Antimatter Dimension power at slightly above-average strength. The Companion heart rides along free and records the EP you Realitied with (its rarity encodes log10(EP)/1e6). Once a glyph exists, its attributes never change. <!-- vendor/ad-source/src/core/glyphs/glyph-generator.js (startingGlyph strength 1.5, companionGlyph) -->

## Equipping on Android

Open the **Reality** tab (rocket icon) and the **Glyphs** subtab. Your inventory is the grid; your equipped glyphs are the circles in the middle; their combined effects list on the right.

<Screen
	src="early-reality/reality-glyphs-0.webp"
	alt="The Glyphs subtab after the first Reality: the Current Glyph effects panel showing Duplicated Power, the Reality study prompt, and equipped circles with the restart button."
	caption="The Glyphs subtab on your first Reality. Circles in the middle are equipped; combined effects list above them."
/>

- **Equip:** drag a glyph from the inventory into an empty circle, or tap it for the equip option. It applies immediately.
- **Swap:** dragging a glyph onto an occupied circle replaces it but **restarts your current Reality** for no reward — only swap when you mean it.
- **Inspect:** tapping an equipped glyph shows its full stats.
- **Protected slots:** the top rows of your inventory are protected. New glyphs never land there, and Sort and Auto-clean skip them. Put glyphs you want to keep there.

You start with **3 active slots** (plus the Companion, which rides along free). The Reality Upgrades Linguistically Expand and Synthetic Symbolism each add one more, for 5 total. <!-- vendor/ad-source/src/core/glyphs/glyph-core.js (activeSlotCount) -->

<Screen
	src="early-reality/reality-glyphs-3.webp"
	alt="The Glyphs UI options panel: Sort Glyphs, Protected Slots row controls, Auto Glyph Sort mode and Auto-collapse space."
	caption="Protected rows and auto-sort live in the options panel. New glyphs never land in protected rows — keep your worn set there."
/>

<Callout kind="android">

On touch, drag the glyph icon and drop it on the circle. If your fingers keep missing, use the tap-to-select then tap-the-slot flow instead.

</Callout>

## Choosing your glyph each Reality

After the first Reality (and with the START perk), each Reality offers a choice of glyphs; without START you get one glyph picked from four at random. <!-- vendor/ad-source/src/core/reality.js (GlyphSelection) -->

Early on, keep it simple:

1. **Take Time glyphs with EP multiplier first.** Nothing else speeds up the early Reality loop as much.
2. **Otherwise take Power glyphs with AD power.** Strong immediately, even at level 1.
3. **Skip Dilation and Replication at level 1–2** unless nothing better shows. Their best effects scale with glyph level and are weak before it grows.

Per-type priorities and the mid-game setups (one Time plus Dilation/Replication, later Power/Infinity mixes) are in the next article, Which glyphs to wear.

## Full inventory? Sacrifice, don't delete

If no inventory space is left, new glyphs are deleted — or auto-sacrificed once unlocked. Never delete glyphs for space before the **Scour to Empower** upgrade: deleting gives nothing, while sacrificing feeds permanent bonuses. <!-- in-game How to Play, "Glyphs" -->

Once that upgrade is bought, the Reality button offers to sacrifice the new glyph instead of keeping it. The Glyph sacrifice article covers what each type pays.

## Further reading

- In-game How to Play: Glyphs (Info tab → How to play).
- Tables61's [guide to Glyphs pre-Celestial 1](https://www.reddit.com/r/AntimatterDimensions/comments/101lby4/) — the community reference these priorities follow (summarized here in our own words).
- [Fandom: Glyphs](https://antimatter-dimensions.fandom.com/wiki/Glyphs) — effect list and formulas (CC BY-SA; reworded here).
