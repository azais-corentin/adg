---
title: "Ra's Reality strategy"
stage: ra
order: 13
summary: 'Glyph setups, Black Hole play, and run structure for fast Memory Chunks.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
</script>

## What a Ra run looks like

A Ra Reality has two phases. First, **push**: climb with only 4 Dimension Boosts and fixed tickspeed, reaching the highest EP, shards, or game-time total you can. Then **sit**: stay in the run while chunks convert to Memories, since chunk *rate* depends on those peak resources and conversion needs time. Leaving early wastes the push; leaving late wastes time that could start the next push. When the Memories counter slows to a crawl, Reality and go again.

Storing real time pauses chunk generation (Memories from banked chunks still convert), so do your Nameless time-storing outside Ra runs. <!-- screenshot text: "Storing real time prevents Memory Chunk generation, but Memories will still be gained normally." -->

## Glyph setups per pet

Match the set to the pet you are feeding (Power, Infinity, Time, Replication, Dilation, Effarig and Reality Glyphs each boost their own resource):

- **Teresa (EP chunks):** Eternity-heavy sets that maximize EP and IP gain. Raw pushing power matters most.
- **Effarig (shard chunks):** shard-gain and Glyph-level sets — Effarig Glyphs plus level and rarity effects. Higher best-Glyph-level also feeds Effarig's memory rate.
- **Nameless (Time Shard chunks):** Replication and Time sets that charge stored game time fastest, so the Black Hole banks time quicker.
- **V (Infinity Power chunks):** Replicanti-heavy sets, since Infinity Power climbs with Replicanti. Hold as many Theorems as you can; V's rate scales with them.

Keep one all-round push set for the climb, then swap to the target pet's farming set once progress plateaus. The Glyph presets (7 slots) make this one tap.

## Black Hole play

The Black Hole is your burst button. Charge it outside or early in the run with a speed-leaning set, then discharge for a surge of game time that spikes EP, shards and Time Shards at once — which spikes every pet's chunk rate simultaneously.

Two unlocks change the play: Nameless 10 makes charging cost almost nothing and auto-discharges a trickle, and Teresa 10's Altered Glyphs plus Effarig 10's guaranteed 4-effect Glyphs raise the ceiling of every set. Once those land, discharges become routine instead of special occasions.

## Charged Infinity Upgrades

Teresa 2 opens Charged Infinity Upgrades: pick a limited set of Infinity Upgrades to supercharge (more slots every 2 Teresa levels, up to 12). <!-- vendor/ad-source/src/core/secret-formula/celestials/ra.js `chargedInfinityUpgrades` --> Choose charges for the run ahead — production charges for pushing, utility charges (like the Ra-relevant ones) for farming — and re-pick when you switch pets. The Ra tab shows slots and picks; charges persist until changed.

## Structuring the farm

1. **One pet at a time.** Remembrance gives ×5 to the focused pet; move it with your focus.
2. **Short runs early, long runs late.** Early on, each push raises peaks a lot — Reality often. Later, peaks barely move and conversion dominates — stay longer.
3. **Feed alchemy between runs.** Refine strong spares so base resources and Decoherence keep up; their multipliers raise the next run's peaks.
4. **Loop back to V.** V's chunk rate wants Theorems, and hard tiers want triads — alternate Ra farming with V pushes whenever either stalls.

<Callout kind="warning">

Ra's Reality allows zero Dimension Boosts inside. If a run's climb stalls at the same spot repeatedly, the answer is account power (Glyphs, alchemy, triads, charges) — not longer runs.

</Callout>

## Further reading

- [r/AntimatterDimensions: Ra's Reality](https://www.reddit.com/r/AntimatterDimensions/comments/1hslerd/ras_reality/) — setups and discharge timing.
- [Glyph Alchemy](/guide/m2/glyph-alchemy) — keeping refinement ahead of demand.
