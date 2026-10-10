---
title: "Ra's memories and pets"
stage: ra
order: 11
summary: 'The four memory pets, what feeds each one, and the unlock chain from Teresa to V.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## Chunks versus Memories

Each pet tracks two numbers. **Memory Chunks** are the raw drip: they generate only while Ra's Reality is running, at a rate set by a different in-Reality resource per pet. **Memories** are the spendable total: chunks convert into Memories continuously, and Memories buy the pet's levels and two upgrades. <!-- vendor/ad-source/src/core/celestials/ra/ra.js `memoryChunksPerSecond`, `memoryUpgradeCurrentMult`, `chunkUpgradeCurrentMult`, `tick` -->

Each pet's panel has a progress bar with three buttons, and all three open a box with a cost button: tap that button to buy. The large **↑** on the right is the next level: its box names it ("Level Teresa to 17", "Cost: 1.30e15 Memories") and, when the level unlocks something, says what ("Level Teresa to 18", "You can charge an additional Infinity Upgrade", "Cost: 3.35e15 Memories"). A full bar does not level the pet by itself, and tapping ↑ again only reopens the box. The two small icons on its left open the upgrades: the **brain** is Recollection ("Teresa's Recollection: Gain 30% more Memories") and the **cube** is Fragmentation ("Teresa's Fragmentation: Gain 50% more Memory Chunks"). Their boxes show the current multiplier, and the cost button also counts down the time until you can afford it ("Cost: 7.63e14 Memories in 08:03"). Both spend the same Memories as levels, so buy them when a pet's progress stalls: they compound with levels.

<!-- Emulator (Android 3.18.0), reviewer's ra save: Teresa panel, brain and cube icons left of the bar, ↑ on the right; popovers "Teresa's Recollection / Gain 30% more Memories / Currently: ×112.46 / Cost: 3.81e15 Memories in 01:56:18" and "Teresa's Fragmentation / Gain 50% more Memory Chunks / Currently: ×25.63 / Cost: 7.63e14 Memories in 08:03". Round 7 review (ra save, Teresa 16, full bar): ↑ opens "Level Teresa to 17 / Cost: 1.30e15 Memories", then "Level Teresa to 18 / You can charge an additional Infinity Upgrade / Cost: 3.35e15 Memories"; three ↑ taps did nothing until Cost was tapped. -->

Pets cap at level 25 each. <!-- vendor/ad-source/src/core/celestials/ra/ra.js `levelCap` --> Level-up costs grow steeply (roughly level^5.5 times a million, steeper past 15), so late levels are long farms. <!-- vendor/ad-source/src/core/celestials/ra/ra.js `requiredMemoriesForLevel` -->

## The four pets

Chunk income per pet, from the game's own definitions: <!-- vendor/ad-source/src/core/secret-formula/celestials/ra.js `pets` -->

| Pet | Chunk rate grows with | Memory rate grows with |
| --- | --- | --- |
| Teresa | Eternity Points inside Ra's Reality | Current Reality Machines (via the Teresa-5 unlock once bought) |
| Effarig | Relic Shards gained on Reality | Best Glyph level (via the Effarig-5 unlock once bought) |
| Nameless Ones | Time Shards | Total time played (via the Nameless-5 unlock once bought) |
| V | Infinity Power | Total pet levels (via the V-5 unlock once bought) |

In practice: push EP hard for Teresa chunks, push shard gain and Glyph level for Effarig, keep the Black Hole charged and the game running for Nameless, and hold as many Theorems as you can; V's memory multiplier scales with total pet levels.

<Screen
	src="ra/celestials-ra-3.webp"
	alt="Ra's lower memory panels: Effarig Level 9, the Nameless Ones Level 11 and V Level 7, each with chunk and memory counters and seven unlock icons."
	caption="Three of the four pets mid-leveling, each with its unlock row underneath."
/>

## The unlock chain

Later pets are locked behind earlier ones — each gate is one unlock icon on the previous pet's row: <!-- vendor/ad-source/src/core/secret-formula/celestials/ra.js `effarigUnlock`, `enslavedUnlock`, `vUnlock` -->

- **Teresa level 8** unlocks Effarig's memories.
- **Effarig level 8** unlocks the Nameless Ones' memories.
- **Nameless level 8** unlocks V's memories.
- **V level 6** unlocks hard V-Achievements and the first Triad study (see [Hard V](/guide/m2/hard-v)).

Before each gate, that pet's panels show locked. Do not spread Memories thin early: push Teresa straight to 8, then Effarig to 8, then Nameless to 8, so the whole roster starts earning as soon as possible.

## Key levels per pet

Every pet has unlocks at levels 1, 2, 5, 8 or 6, 10, 15 and 25. The ones that change how you play: <!-- vendor/ad-source/src/core/secret-formula/celestials/ra.js `unlocks` -->

**Teresa** — 1: instant Tachyon Particles in Dilation. 2: Charged Infinity Upgrades (one more slot every 2 Teresa levels, up to 12). 5: memories scale with RM. 8: Effarig's memories. 10: Altered Glyphs (new Glyph effects from sacrifice). 15: bigger Perk Shop caps. 25: free starting Tachyon Particles in normal Realities.

**Effarig** — 1: double Glyph choices, maxed shard rarity bonus. 2: **Glyph Alchemy** (see [Glyph Alchemy](/guide/m2/glyph-alchemy)). 5: memories scale with best Glyph level. 8: the Nameless Ones' memories. 10: Glyphs always have 4 effects (and Effarig Glyphs can roll up to 7). 15: Glyph level bonus from shards. 25: always max rarity, sacrifice boosts alchemy.

**Nameless** — 1: Black Hole power autobuyers. 2: amplified stored game time, more real-time storage per level. 5: memories scale with playtime. 8: V's memories. 10: near-free Black Hole charging plus auto-discharge. 15: Dilated Time from peak game speed. 25: every basic Glyph gains the Time Glyph's speed effect.

**V** — 1: auto-bought rebuyable Reality upgrades, instant auto-ECs. 2: free auto-Dilation in normal Realities. 5: memories scale with total pet levels. 6: hard V + triads, one per 6 V levels. 10: Time Theorems boost all continuous production (up to 10× at very high TT). 15: achievement multiplier on TT gain. 25: achievement multiplier raised to 1.5.

## Remembrance

At 20 total pet levels, Remembrance unlocks: pick one pet for ×5 chunk gain while the other three drop to ×0.5. <!-- vendor/ad-source/src/core/celestials/ra/ra.js `remembrance` --> Always keep it on whichever pet you are actively leveling, and move it the moment you switch focus.

## Recommended order

Teresa to 8 → Effarig to 8 → Nameless to 8 → V to 6 (hard V + first triad) → Teresa toward 15–25 for charges and alchemy synergy → Effarig toward 15+ for Glyph power → Nameless up for time storage → V last, since its chunk rate depends on Theorems you keep earning anyway. Move Remembrance along with your focus.

<Callout kind="tip">

The two ? buttons on each panel explain that pet's chunk and memory formulas in-game. When a pet stalls, read them: they name the exact resource you need to push inside the next Reality.

</Callout>

## Further reading

- [Community wiki](https://antimatterdimensions.wiki.gg/) — full Ra unlock table.
- [r/AntimatterDimensions: cel5 advice](https://www.reddit.com/r/AntimatterDimensions/comments/1igbn1r/cel5/) — leveling order discussion.
