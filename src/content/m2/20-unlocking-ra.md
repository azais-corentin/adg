---
title: 'Unlocking Ra'
stage: ra
order: 10
summary: "What 36 Space Theorems opens, and your first steps in the Celestial of the Forgotten's tab."
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## The unlock

Ra, Celestial of the Forgotten, unlocks at 36 Space Theorems. <!-- vendor/ad-source/src/core/celestials/ra/ra.js:337-339 `get isUnlocked` --> At the same moment, every Space Theorem cost in the Time Study tree drops by 2. The unlock is checked through V's reward ladder, so if your count is right but Ra looks locked, Reality once to let the game re-check.

On the Celestial map, Ra's node sits apart from the rest. Tap it once for details, again to open the tab. The greeting is confused — Ra is the Celestial of Memories and can barely remember its own name — but the mechanics underneath are the deepest farm in the game so far.

## Ra's tab at first sight

The tab has three parts, top to bottom:

1. **Start Ra's Reality** with its restriction text: you keep only 4 Dimension Boosts, gain no more inside, and the tickspeed purchase multiplier sticks at ×1.125. <!-- screenshots + vendor/ad-source/src/core/dimboost.js:56-60, tickspeed.js:24 -->
2. **Remembrance**, locked until your four pets total level 20. One Celestial holds it at a time: ×5 Memory Chunk gain for that one, ×0.5 for the other three. <!-- vendor/ad-source/src/core/celestials/ra/ra.js `remembrance`: multiplier 5, nerf 0.5, requiredLevels 20 -->
3. **One panel per pet** — Teresa, Effarig, the Nameless Ones, V — each with a level bar (cap 25), Memory Chunk and Memories counters, upgrade arrows, and its unlock icons underneath. Level-ups and unlocks are bought with Memories by tapping the arrows and icons.

<Screen
	src="ra/celestials-ra-1.webp"
	alt="The top of Ra's tab: Start Ra's Reality with the 4-Boost and tickspeed restriction, the Remembrance panel, and the Teresa Level 16 memory panel with its progress bars."
	caption="Ra's tab: the Reality button, Remembrance, and the first memory panel."
/>

## Your first Ra Reality

Memories only grow inside Ra's Reality: each pet generates Memory Chunks from a different in-Reality resource, and chunks steadily convert into Memories. <!-- vendor/ad-source/src/core/celestials/ra/ra.js `canGetMemoryChunks`: unlocked pet while Ra is running --> Outside the Reality, chunks sit still (Memories from existing chunks still trickle in even while storing real time).

For the very first run, do this:

1. Enter with your best all-round Glyph set — Teresa chunks scale with EP, so raw pushing power is what matters first.
2. Stay a while. Chunks need time to accumulate and convert; leaving early earns almost nothing.
3. Spend the first Memories on Teresa levels. Teresa 8 unlocks Effarig's memories, which opens the whole chain.

Expect the first few runs to feel slow. Chunk rates scale with how far you push *inside* the Reality, so every bit of account power (Theorems, triads, alchemy later) feeds back into faster memories.

<Callout kind="tip">

Ra's Reality locks Dimension Boosts at 4 total — bank any free or purchasable Boosts before entering, since you cannot buy more inside. Tickspeed is fixed too, so lean on galaxies and glyphs for scaling.

</Callout>

## What comes next

Ra unfolds as a chain: Teresa levels open Effarig, Effarig opens the Nameless Ones, those open V, and each pet's levels unlock permanent account upgrades along the way. [Ra's memories](/guide/m2/ra-memories) maps the full chain and the recommended leveling order.

## Further reading

- [Community wiki](https://antimatterdimensions.wiki.gg/) — Ra mechanics reference.
- [r/AntimatterDimensions: Ra's Reality](https://www.reddit.com/r/AntimatterDimensions/comments/1hslerd/ras_reality/) — player setup advice.
