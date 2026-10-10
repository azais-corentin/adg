---
title: 'Effarig Glyphs and the Glyph filter'
stage: effarig
order: 15
summary: 'What Effarig Glyphs do, which effects to hunt, and how to set up the Glyph filter.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Checklist from '#lib/components/Checklist.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## Effarig Glyphs

Finishing all three layers of Effarig's Reality unlocks the Effarig Glyph type (symbol Ϙ). You may equip **at most one** at a time, in its own slot beside the five normal Glyphs.

<!-- vendor/ad-source/src/core/secret-formula/celestials/effarig.js (reality description) -->

An Effarig Glyph can roll up to 4 effects from its pool of 7:

| Effect | What it does |
| --- | --- |
| RM multiplier | Multiplies Reality Machine gain |
| Instability delay | Raises the Glyph level where instability kicks in |
| Game speed | Raises game speed to a power |
| Achievement multiplier | Raises the achievement multiplier to a power |
| Buy-10 multiplier | Raises the buy-10 bonus to a power (plus Dimboost power once altered) |
| All-Dimension power | Raises all Dimension multipliers to a power |
| Antimatter exponent | Raises antimatter production's exponent |

<!-- vendor/ad-source/src/core/secret-formula/reality/glyph-effects.js: effarigrm/effarigglyph/effarigblackhole/effarigachievement/effarigforgotten/effarigdimensions/effarigantimatter -->

One restriction: the RM multiplier and the instability delay **cannot appear on the same Glyph** until Ra's Effarig level 10 lifts it (then Glyphs always have 4 effects and Effarig Glyphs can roll up to all 7). So hunt two Glyphs, not one perfect one:

- **Level pushing:** instability delay + game speed + buy-10 or all-Dimension power.
- **RM farming:** RM multiplier + game speed + buy-10 or all-Dimension power.

<Callout kind="tip">

Set the filter (below) to keep Effarig Glyphs at a low minimum rarity with 3+ effects. Their effects are rare enough that strict filtering throws away upgrades.

</Callout>

<Screen
	src="effarig/reality-glyphs-1.webp"
	alt="The Glyphs tab: the upcoming Reality preview with glyph level, the equipped set, the inventory grid, and the Glyph level factors panel."
	caption="The Glyphs tab. The weights adjuster from the shard shop lives behind the Glyph level factors panel."
/>

## The Glyph filter

The filter (second shard-shop unlock, <Num value="2e8" /> shards) scores each new Glyph choice and either keeps the best one or sacrifices it. Open it from the **Glyph Filter** tab under the inventory on the Glyphs subtab. "Current Filter Mode:" names the active mode above a row of icon buttons; one mode applies to all types at once, and each keeps its own settings when you switch. From left to right:

- **Drop icon, Lowest Total Glyph Sacrifice:** "the type you have the least total Glyph Sacrifice value of is given the highest score. (this mode never keeps Glyphs)". Good for evening out sacrifice totals.
- **Bulleted list, Basic:** "Selected Glyphs must have at least [N] effects total, with a minimum rarity of [N] %. Rarer Glyphs are preferred in ties." The same two numbers for every type.
- **Checklist, Specified Effect:** pick a type from the row of type symbols, then set its minimum rarity on the slider, its minimum number of effects, and the effects a kept Glyph "must include". Each missing effect sinks a Glyph's score by 200, so it fails. You can ban a whole type by demanding something impossible (e.g. 6 effects on a Power Glyph).
- **Numbered list, Effect Score:** per type, a "Threshold score" box ("rarity % + Σ effects") and a number box beside each effect. A Glyph is kept when its rarity plus the numbers of the effects it has reach the threshold. Negative numbers ban effects.

Once Glyph Alchemy is unlocked (Ra's Effarig memory level 2), two more buttons follow, an atom and a flask, for refining; [Glyph Alchemy](/guide/m2/glyph-alchemy#filter-modes-for-alchemy) covers them.

<Screen
	src="effarig/filter/reality-glyphs-3.webp"
	alt="The Glyph Filter tab under the Glyph inventory: Current Filter Mode: Basic, four icon buttons (drop, bulleted list highlighted, checklist, numbered list), and the line Selected Glyphs must have at least 0 effects total, with a minimum rarity of 0 %. Rarer Glyphs are preferred in ties."
	caption="The Glyph Filter in Basic mode. The four icon buttons are, from left: Lowest Total Glyph Sacrifice, Basic, Specified Effect and Effect Score."
/>

<!-- Emulator (Android 3.18.0), effarig save and reviewer saves: four mode buttons, six with alchemy; mode names and texts as quoted. Upstream (src/components/tabs/glyphs/sidebar/GlyphFilterPanel.vue) has separate Number of Effects and Rarity Threshold modes; the app merges them into Basic. Scores: src/core/glyphs/auto-glyph-processor.js filterValue (Specified Effect: rarity − 200 per missing effect; Effect Score: rarity + effect scores). Alchemy modes unlock with Ra.unlocks.unlockGlyphAlchemy (Effarig level 2, secret-formula/celestials/ra.js). -->

Unlocking the filter also gives the Automator a filter-score currency and an option to force an immediate Reality when no upcoming choice passes — handy for unattended farming once your rules are solid.

## Recommended setups

**General farming (Specified Effect mode):** basic types at 70–85% minimum rarity and 3–4 minimum effects, with only the effects you always want required (Theorem generation on Dilation, speed/power on Replication). Effarig Glyphs at a low rarity minimum so odd rolls survive. **Basic** is the quick version: one effect count and one rarity for every type.

**Hunting a level-pushing Effarig Glyph (Effect Score mode):** threshold out the basic types (an unreachable score), then give instability delay, game speed and exponents high numbers, filler effects low ones, and the RM multiplier a strongly negative one. Only a 3–4 favoured-effect Glyph clears the bar.

**Auto-recycle:** leave automatic sacrifice on so rejected Glyphs feed your sacrifice totals instead of clogging the inventory.

<Screen
	src="effarig/reality-glyphs-3.webp"
	alt="The Glyph Presets panel: saved set slots with Save, Load and Delete buttons and the match-attribute toggles above them."
	caption="Glyph Presets. Save one slot per layer or farming set and switching sets becomes one tap."
/>

<Checklist stage="effarig" />

## Further reading

- [Tables61 glyph guide](https://www.reddit.com/r/AntimatterDimensions/comments/101lby4/) — pre-Celestial glyph canon that still applies
- [Fandom Glyphs page](https://antimatter-dimensions.fandom.com/wiki/Glyphs) — effect and rarity reference
