---
title: 'Space Theorems and the Time Study tree'
stage: v
order: 12
summary: 'What Space Theorems buy in the Time Study tree, tier by tier, and which purchases matter most.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
</script>
## How Space Theorems work

Each V-Achievement tier earns Space Theorems: one per normal tier, two per hard tier once those unlock. <!-- vendor/ad-source/src/core/celestials/V.js `updateTotalRunUnlocks`: normal tiers count once, hard tiers twice --> Theorems are a second currency for the Time Study tree. When two studies are normally exclusive (active vs passive vs idle, or the light/dark and split pairs), owning both costs Space Theorems on top of the Time Theorem price. Buying such a study spends Theorems for the rest of the Reality; a respec refunds them. <!-- vendor/ad-source/src/core/time-studies/normal-time-study.js `costsST`, `checkSetRequirement`, `purchase` -->

Long-press a study to buy the shortest route to it. On Android this is the fastest way to rebuild trees between V attempts, since you will respec constantly.

<Callout kind="android">

Time Studies are under the Eternity tab (hourglass icon), Studies subtab. The bottom prestige buttons include Eternity, so you can Eternity without leaving the tree. Use the [Time Study planner](/tools/time-studies) to draft trees before buying them in-game.

</Callout>

## What each Theorem count unlocks

Intermediate V rewards also fire at fixed counts, independently of how you spend the Theorems: <!-- vendor/ad-source/src/core/secret-formula/celestials/v.js `unlocks` -->

| V-Achievements | Reward | What it does |
| --- | --- | --- |
| 2 | Goal reduction | Spend Perk Points to lower V-Achievement goals. |
| 5 | Antimatter Dimension power | AD power grows with total Space Theorems. |
| 10 | Faster auto-EC | Achievement multiplier shortens automatic EC completion time. |
| 16 | Glyph auto-purge | Automatically purge weak Glyphs on Reality. |
| 30 | Black Hole power | Achievement multiplier boosts Black Hole power. |
| 36 | Study discount + Ra | Space Theorem costs in the tree drop by 2, and Ra unlocks. |

## Where the Theorems go in the tree

The tree charges Theorems only when you hold studies from both sides of an exclusive split. The key pairs, with their per-study Theorem prices before the 36-Achievement discount: <!-- vendor/ad-source/src/core/secret-formula/eternity/time-studies/normal-time-studies.js `STCost` fields; discount in src/core/time-studies/time-study-tree.js:254-257 -->

- **Active / Passive / Idle (121 / 122 / 123): 2 each.** The first and cheapest double-up. Active plus Passive together is the standard pushing combo.
- **The 13x row splits (131 / 132 / 133): 8 each.** Expensive, but holding two replicanti paths at once transforms galaxy gain.
- **The 14x row splits (141 / 142 / 143): 2 each.** Cheap enough to double up early.
- **The 22x row pairs (221/222 through 227/228): 4 each.** Each pair covers one lategame system: Dim Boosts, distant galaxies, Replicanti Galaxies, sacrifice.
- **The 23x row pairs (231/232, 233/234): 5 each.** Galaxy strength, Dim Boost strength, Replicanti Galaxy cost.
- **Triad studies (301–304): 12 each.** These need Ra progress; see [Hard V](/guide/m2/hard-v).

Because the discount at 36 Achievements lowers every price by 2, the cheap pairs become nearly free. Before that, spend where the multiplier is biggest for your current wall: the 121+122 combo first, then the 14x pairs, then one 22x pair at a time.

## Suggested spending order

1. **First Theorems: active + passive (121 + 122).** The classic push: active's speed-based EP with passive's flat EP. This alone makes early V tiers dramatically easier.
2. **Next: double up the 14x row (141 + 142 or 143).** Infinity Point multipliers stack hard inside V's weakened Reality.
3. **Then: one 22x pair for your current goal.** Pushing galaxies? Take 223 + 224. Pushing EP? Take 221 + 222.
4. **Save a buffer.** Theorems spent on the tree are Theorems not earning the count-based rewards above. Push each count threshold (5, 10, 16, 30, 36) before splurging on convenience pairs.
5. **After Ra: triads.** Once V's memory levels open Triad studies, those outscale every normal pair.

## When to move on

There is no finishing the tree: you keep re-spending the same Theorems every Reality. The stage goal is purely the count — reach 36, unlock Ra, then keep earning while Ra's memories make the remaining tiers possible. [Hard V](/guide/m2/hard-v) covers the second half of the achievement list.

## Further reading

- [r/AntimatterDimensions: hard V discussion](https://www.reddit.com/r/AntimatterDimensions/comments/17jy2lt/hard_v/) — tier order and tree advice.
- [Time Study planner](/tools/time-studies) — plan trees with in-game import strings.
