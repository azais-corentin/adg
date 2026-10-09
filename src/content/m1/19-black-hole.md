---
title: 'The Black Hole'
stage: early-reality
order: 34
summary: 'What the Black Hole cycle does, which of its three upgrades to buy, and when the second one arrives.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## What it does

The Black Hole cycles: the game runs at normal speed for a while (interval), then bursts to a multiple of normal speed for a short time (duration), then repeats. Game-speed bursts beat tickspeed because they speed up **everything equally** — Infinity and Time Dimensions, Dilated Time and Theorem generation, even idle-path multipliers that tickspeed barely touches. Only effects the game explicitly calls real time (like the auto-EC perks) ignore it; everything else counts game time. <!-- in-game How to Play, "Black Hole" -->

<Screen
	src="early-reality/reality-blackhole-0.webp"
	alt="The Black Hole subtab on an early Reality: Unpause BH and 🌀1: Paused, Auto-pause: Before activation, Black Hole State: Inactive (Activation in 5.00 seconds), Active time percent: 0.277%, and the three upgrades: Reduce Black Hole's inactive time by 20% (Currently 1.00h, Cost 15 RM), Make Black Hole 35% stronger (Currently ×180.00, Cost 20 RM), Extend Black Hole's duration by 30% (Currently 10.00s, Cost 10 RM)."
	caption="The Black Hole subtab. This save has the hole paused by Auto-pause, 5 seconds before its next burst."
/>

Unlock costs <Num value="100" /> RM (achievement: Is this an Interstellar reference?) and also grants 10 Automator Points. The unlock button sums it up: "Starts at ×180 faster for 10 seconds, once per hour." <!-- vendor/ad-source/src/core/black-hole.js -->

## Pause and Auto-pause

The top of the subtab holds two buttons, and the first also sits on the Dimensions tab next to the hole's status ("🌀1: ⏸ Paused"):

- **Unpause BH / Pause BH** stops or restarts the cycle. While the hole is paused it never bursts.
- **Auto-pause** switches between **Do not pause** and **Before activation**. "Before activation" pauses the hole 5 seconds before each burst, so you can save the burst for when you are watching. The hole then waits at "Activation in 5.00 seconds" until you tap Unpause BH.

To let the hole run by itself, set Auto-pause to **Do not pause** and tap **Unpause BH**. During a burst the status line reads "Game speed is altered" with the multiplier.

<!-- Emulator (Android 3.18.0, community early-reality save): Auto-pause cycles Before activation / Do not pause; after Unpause BH the hole went Active at ×180. black-hole.js:562-577 (pause 5 s before activation) -->

## The three upgrades

| Upgrade | Starts | Each level | Cost scaling |
| ------- | ------ | ---------- | ------------ |
| Interval ("Reduce Black Hole's inactive time by 20%") | 1.00h | ×0.8 inactive time | ×3.5, from 15 RM |
| Power ("Make Black Hole 35% stronger") | ×180 game speed | ×1.35 | ×2, from 20 RM |
| Duration ("Extend Black Hole's duration by 30%") | 10.00s | ×1.3 | ×4, from 10 RM |

<!-- vendor/ad-source/src/core/black-hole.js:66-102: interval 3600 s ×0.8 (cost 15 ×3.5), power 180 ×1.35 (cost 20 ×2), duration 10 s ×1.3 (cost 10 ×4); costs switch to a steeper scaling later (getHybridCostScaling). Starting values read in the emulator. -->

**Active time percent** under the state line is the share of time the hole is bursting: 0.277% at the start (10 s in every 3,610). Averaged over time, the hole speeds the game up by about 1 + 179 × 0.00277 ≈ ×1.5. From there one power level raises that average by about 12%, one duration level by about 10% and one interval level by about 8%.

So buy the **first duration level** (10 RM) right away, then mostly **power**: its price only doubles per level, while duration's quadruples and interval's grows ×3.5. Take a duration or interval level whenever it is the cheapest option. Keep the hole running during pushes. Pause it only for runs where you want less game time, such as the Reality in under 15 minutes of game time for Replicative Rapidity.

## The second Black Hole

100 days of game time after the unlock, the Parity of Singularity upgrade (row 4, <Num value="1.5e3" /> RM) buys a **second Black Hole**. Its timer only advances while the first hole is active, so it bursts inside bursts — and the second hole's upgrades cost 1,000× as much. <!-- in-game How to Play, "Black Hole"; vendor/ad-source/src/core/black-hole.js (blackHoleCostMultipliers [1, 1000]) -->

Either hole becomes permanently active at 99.99% uptime (duty cycle ≥ 0.9999) — a long-term goal, not something to chase in early Reality. Offline, cycles advance normally and bursts apply fully, so overnight runs still benefit.

<Callout kind="tip">

A leveled Black Hole plus the one-Time-glyph setup in Which glyphs to wear is the mid-game engine: bursts multiply Tachyon Galaxy gain, galaxies raise RM and glyph level, and those raise the next burst's payoff.

</Callout>
