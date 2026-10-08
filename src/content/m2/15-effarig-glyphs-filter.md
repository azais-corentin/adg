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

Set the filter (below) to keep Effarig Glyphs at a low rarity threshold with 3+ effects. Their effects are rare enough that strict filtering throws away upgrades.

</Callout>

<Screen
	src="effarig/reality-glyphs-1.webp"
	alt="The Glyphs tab: the upcoming Reality preview with glyph level, the equipped set, the inventory grid, and the Glyph level factors panel."
	caption="The Glyphs tab. The weights adjuster from the shard shop lives behind the Glyph level factors panel."
/>

## The Glyph filter

The filter (second shard-shop unlock, <Num value="2e8" /> shards) scores each new Glyph choice and either keeps the best one or sacrifices it. One mode applies to all types at once, and each mode keeps its own settings when you switch. The modes, simplest first:

- **Lowest total sacrifice:** keeps whichever type has the least sacrifice value. No threshold; always sacrifices. Good for balancing sacrifice totals early.
- **Number of effects:** score is the effect count, ties broken by rarity. Set a minimum count (3 or 4).
- **Rarity threshold:** score is the rarity percent, with a per-type minimum.
- **Specified effect:** rarity score with required effects; each missing required effect sinks the score, so unwanted Glyphs always fail. You can ban a whole type by demanding something impossible (e.g. 6 effects on a Power Glyph).
- **Effect score:** you weight rarity and every effect yourself; a Glyph is kept when rarity plus weights clear your threshold. Negative weights ban effects.

<!-- vendor/ad-source/src/core/secret-formula/h2p.js (Advanced Glyph Mechanics entry) -->

Unlocking the filter also gives the Automator a filter-score currency and an option to force an immediate Reality when no upcoming choice passes — handy for unattended farming once your rules are solid.

## Recommended setups

**General farming (Specified effect mode):** basic types at 70–85% minimum rarity and 3–4 minimum effects, with only the effects you always want required (Theorem generation on Dilation, speed/power on Replication). Effarig Glyphs at a low rarity minimum so odd rolls survive.

**Hunting a level-pushing Effarig Glyph (Effect score mode):** threshold out the basic types (an unreachable score), then weight instability delay, game speed and exponents high, filler effects low, and the RM multiplier strongly negative. Only a 3–4 favoured-effect Glyph clears the bar.

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
