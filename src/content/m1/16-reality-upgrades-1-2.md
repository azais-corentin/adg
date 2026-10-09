---
title: 'Reality Upgrades: rows 1 and 2'
stage: early-reality
order: 28
summary: 'The five repeatable amplifiers and the first five one-time upgrades — costs, unlock conditions and buy order.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## Row 1: the five amplifiers

Row 1 holds five repeatable upgrades. Each level multiplies one currency's gain (×3 per level, ×5 for Infinities); costs start at 1–3 RM and scale ×30 per level (×50 for the Infinity one). Buy them as affordable, in roughly this priority: **Dilated Time, Tachyon Particles, Replicanti, Eternities, Infinities last** — Boundless Amplifier's steeper scaling prices it out early. <!-- vendor/ad-source/src/core/secret-formula/reality/reality-upgrades.js -->

| Upgrade                | Base cost            | Effect per level     |
| ---------------------- | -------------------- | -------------------- |
| Temporal Amplifier     | <Num value="1" /> RM | ×3 Dilated Time      |
| Replicative Amplifier  | <Num value="1" /> RM | ×3 Replicanti speed  |
| Eternal Amplifier      | <Num value="2" /> RM | ×3 Eternities        |
| Superluminal Amplifier | <Num value="2" /> RM | ×3 Tachyon Particles |
| Boundless Amplifier    | <Num value="3" /> RM | ×5 Infinities        |

<Screen
	src="early-reality/reality-upgrades-1.webp"
	alt="Row 1 of the Reality Upgrades list at 3 RM: the Temporal, Replicative and Eternal amplifiers with costs and levels."
	caption="Row 1: the five repeatable amplifiers. Buy Dilated Time and Tachyon first."
/>

What to buy with your first Reality's machines depends on how many you got (the first Reality pays 1 RM at <Num value="1e4000" /> EP and only a few more until well above that; see [Your first Reality](/guide/m1/first-reality)):

- **1 RM:** Temporal Amplifier.
- **2 RM:** Temporal and Replicative (1 RM each). Superluminal alone would take both.
- **3 RM:** Temporal and Superluminal.
- **4 RM:** Temporal, Replicative and Superluminal.

A second level of an amplifier costs 30 RM or more, so the rest waits. Do not chase hard Row 2 unlocks in Reality 2: instead keep going until you have bought every Row 1 upgrade once (9 RM in all).

<!-- reality-upgrades.js: initialCost 1, 1, 2, 2, 3, costMult 30 (Boundless 50); emulator (Android 3.18.0): at 3 RM after buying, the row reads Temporal 30, Replicative 900, Eternal 60, Superluminal 60, Boundless 150 (early-reality/reality-upgrades-1.webp); reviewer 3-10: right after a first Reality "You have 2 Reality Machines", Temporal 1, Replicative 1, Eternal 2 -->

## Row 2: unlock, then buy for 15 RM each

Row 2 (the app's "Group 2 - Cost: 15 Reality Machines") upgrades cost <Num value="15" /> RM each, but each must first be **unlocked by doing something specific in a run** — and several can be failed for that run if you do the wrong thing first. Start them in Reality 3–4, once two Power glyphs make the conditions easy. Recommended order: **Paradoxically Attain, Existentially Prolong, Cosmically Duplicate, Innumerably Construct, Linguistically Expand last.** <!-- vendor/ad-source/src/core/secret-formula/reality/reality-upgrades.js -->

| Upgrade               | Unlock condition                                                       | How to do it                                                                                                                                                                                                                                                                 |
| --------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Paradoxically Attain  | Eternity without any automatic Achievements this Reality               | Right after the Reality, before the 30-minute timer gives its first achievement, open the Achievements tab (trophy) and tap **Auto: ON** to turn it off (or turn on the card's Requirement lock). Earn the achievements you need by hand, Eternity, then switch Auto back on |
| Existentially Prolong | First manual Eternity of the Reality with <Num value="1e400" />+ IP    | Happens naturally on a long push run — do not combine with no-galaxy challenges                                                                                                                                                                                              |
| Cosmically Duplicate  | First manual Eternity of the Reality without using Replicanti Galaxies | Disable the Replicanti Galaxy autobuyer; glyph-boosted Dimensions carry you                                                                                                                                                                                                  |
| Innumerably Construct | First Infinity of the Reality with at most 1 Antimatter Galaxy         | Do your first Infinity inside Normal Challenge 8, or just avoid the second galaxy                                                                                                                                                                                            |
| Linguistically Expand | <Num value="1e4000" /> EP Eternity wearing exactly one glyph, level 3+ | Equip a single good glyph and push; lowest priority of the five                                                                                                                                                                                                              |

Existentially Prolong is the prize: start every Reality with 100 Eternities, which fires the EU1 perk's free Eternity Upgrades immediately. Linguistically Expand adds a glyph slot. The other three feed Infinity, Replicanti and Tachyon gain.

<Screen
	src="early-reality/reality-upgrades-2.webp"
	alt="Row 2 of the Reality Upgrades list at this stage: the named 15-RM upgrades with their unlock conditions and requirement locks."
	caption="Row 2: each upgrade shows its unlock condition. Attain and Prolong first."
/>

<Callout kind="tip">

A card turns **red** as soon as its requirement can no longer be met this Reality (one automatic achievement is enough for Paradoxically Attain), and yellow cards are still possible. Red cards reset on the next Reality. Each card has a **Requirement lock** button under it: switched on, the game stops you from doing anything this Reality that would fail it.

</Callout>

## Further reading

- In-game How to Play: Reality (Info tab → How to play).
- Tables61's [guide to Reality Upgrades](https://www.reddit.com/r/AntimatterDimensions/comments/15bfssk/) (summarized here in our own words).
- [Fandom: Reality Upgrades](https://antimatter-dimensions.fandom.com/wiki/Reality_Upgrades) — full table (CC BY-SA; reworded here).
