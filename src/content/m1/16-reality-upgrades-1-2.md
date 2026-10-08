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

| Upgrade | Base cost | Effect per level |
| ------- | --------- | ---------------- |
| Temporal Amplifier | <Num value="1" /> RM | ×3 Dilated Time |
| Replicative Amplifier | <Num value="1" /> RM | ×3 Replicanti speed |
| Eternal Amplifier | <Num value="2" /> RM | ×3 Eternities |
| Superluminal Amplifier | <Num value="2" /> RM | ×3 Tachyon Particles |
| Boundless Amplifier | <Num value="3" /> RM | ×5 Infinities |

<Screen
	src="ra/reality-upgrades-1.webp"
	alt="Row 1 of the Reality Upgrades list: the five amplifiers with their costs and levels."
	caption="Row 1: the five repeatable amplifiers. Buy Dilated Time and Tachyon first."
/>

With 3 first-Reality RM, buy Temporal plus Superluminal (idle play) or Replicative plus Superluminal (active play). Do not chase hard Row 2 unlocks in Reality 2 — instead push to 5–6 RM so you own every Row 1 upgrade at least once.

## Row 2: unlock, then buy for 15 RM each

Row 2 upgrades cost <Num value="15" /> RM each, but each must first be **unlocked by doing something specific in a run** — and several can be permanently locked for that run if you do the wrong thing first. Start them in Reality 3–4, once two Power glyphs make the conditions easy. Recommended order: **Paradoxically Attain, Existentially Prolong, Cosmically Duplicate, Innumerably Construct, Linguistically Expand last.** <!-- vendor/ad-source/src/core/secret-formula/reality/reality-upgrades.js -->

| Upgrade | Unlock condition | How to do it |
| ------- | ---------------- | ------------ |
| Paradoxically Attain | Eternity with no automatic achievements | Turn off auto-achievements before the Eternity; grab any needed challenge achievements by hand; turn it back on after |
| Existentially Prolong | First Eternity with <Num value="1e400" /> IP | Happens naturally on a long push run — do not combine with no-galaxy challenges |
| Cosmically Duplicate | First Eternity with no Replicanti Galaxies | Disable the Replicanti Galaxy autobuyer; glyph-boosted Dimensions carry you |
| Innumerably Construct | First Infinity with at most 1 Antimatter Galaxy | Do your first Infinity inside Normal Challenge 8, or just avoid the second galaxy |
| Linguistically Expand | <Num value="1e4000" /> EP Eternity wearing exactly one glyph, level 3+ | Equip a single good glyph and push; lowest priority of the five |

Existentially Prolong is the prize: start every Reality with 100 Eternities, which fires the EU1 perk's free Eternity Upgrades immediately. Linguistically Expand adds a glyph slot. The other three feed Infinity, Replicanti and Tachyon gain.

<Screen
	src="ra/reality-upgrades-2.webp"
	alt="Row 2 of the Reality Upgrades list: the five named upgrades with their unlock conditions."
	caption="Row 2: each upgrade shows its unlock condition. Attain and Prolong first."
/>

<Callout kind="tip">

Locked an unlock by accident (bought the galaxy, gained the achievement)? It re-arms next Reality — the lock is per-run, not permanent. Check the upgrade text: it names what locked it.

</Callout>

## Further reading

- In-game How to Play: Reality (Info tab → How to play).
- Tables61's [guide to Reality Upgrades](https://www.reddit.com/r/AntimatterDimensions/comments/15bfssk/) (summarized here in our own words).
- [Fandom: Reality Upgrades](https://antimatter-dimensions.fandom.com/wiki/Reality_Upgrades) — full table (CC BY-SA; reworded here).
