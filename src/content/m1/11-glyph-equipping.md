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

Your first glyph is fixed: an **Uncommon Glyph of Power** (rarity 20%) with a single effect, Antimatter Dimension power (+0.031 at level 1). Next to it sits the pink-heart **Companion Glyph**: "It does nothing but sit there and cutely smile at you…", and it records the EP you reached on your first Reality. It has no effect at all, and equipped it would take one of your three circles, so leave it in the inventory. Once a glyph exists, its attributes never change. <!-- vendor/ad-source/src/core/glyphs/glyph-generator.js (startingGlyph strength 1.5, companionGlyph); tooltips read in the emulator (Android 3.18.0, early-reality-first save) -->

<Screen
	src="early-reality/first-reality/reality-glyphs-1.webp"
	alt="The Glyphs subtab right after the first Reality: three empty circles, the hint Tap to view, hold and drag or double tap to equip Glyphs, two grey protected rows, and the Power glyph (Ω) and Companion (♥) in the first inventory row."
	caption="Right after the first Reality: three empty circles, and the Power glyph and Companion in the inventory. Equip the Power glyph only."
/>

## Equipping on Android

Open the **Reality** tab (rocket icon) and the **Glyphs** subtab. Your inventory is the grid at the bottom; your equipped glyphs are the circles above it; their combined effects list in the **Current Glyph effects** panel at the top.

<Screen
	src="early-reality/reality-glyphs-0.webp"
	alt="The Glyphs subtab a few Realities in: the Current Glyph effects panel showing Duplicated Power (Antimatter Dimension multipliers ^1.069, Replication speed ×12.7), the Reality study prompt, two Power glyphs and a Replication glyph in the circles, and the Start this Reality over button."
	caption="A few Realities in, with three glyphs equipped. The panel at the top adds up their effects."
/>

- **Equip:** tap a glyph and press **Equip** on its card, double-tap it, or hold and drag it onto an empty circle. It applies immediately.
- **Swap:** dragging a glyph onto an occupied circle replaces it but **restarts your current Reality** for no reward — only swap when you mean it.
- **Inspect:** tapping an equipped glyph shows its full stats.
- **Protected slots:** the top rows of your inventory are protected. New glyphs never land there, and Sort and Auto-clean skip them. Put glyphs you want to keep there.

You start with **3 active slots**, and every equipped glyph takes one, the Companion included. The Reality Upgrades Linguistically Expand and Synthetic Symbolism each add one more, for 5 total. <!-- vendor/ad-source/src/core/glyphs/glyph-core.js (activeSlotCount); emulator: Power + Companion equipped leave one empty circle -->

<Screen
	src="early-reality/reality-glyphs-3.webp"
	alt="The Glyphs UI options panel: Sort Glyphs, Protected Slots row controls, Auto Glyph Sort mode and Auto-collapse space."
	caption="Protected rows and auto-sort live in the options panel. New glyphs never land in protected rows — keep your worn set there."
/>

<Callout kind="android">

The app's own hint sits above the inventory: "Tap to view, hold and drag or double tap to equip Glyphs." Tapping is the most reliable on a phone: the glyph's card opens with an **Equip** button at the bottom.

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
