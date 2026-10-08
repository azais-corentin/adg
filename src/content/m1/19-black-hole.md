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
	src="ra/reality-blackhole-0.webp"
	alt="The Black Hole subtab: interval, power and duration upgrades with costs and the cycle status."
	caption="The Black Hole. Interval, power and duration each upgrade separately with RM."
/>

Unlock costs <Num value="100" /> RM (achievement: Is this an Interstellar reference?) and also grants 10 Automator Points. <!-- vendor/ad-source/src/core/black-hole.js -->

## The three upgrades

| Upgrade | Starts | Each level | Cost scaling |
| ------- | ------ | ---------- | ------------ |
| Interval | 60 min off (3600 s) | ×0.8 downtime | ×3.5, from 15 RM |
| Power | ×5 speed | ×1.35 burst speed | ×2, from 20 RM |
| Duration | 10 s on | ×1.3 burst length | ×4, from 10 RM |

<!-- vendor/ad-source/src/core/black-hole.js: interval 3600s ×0.8 (cost 15 ×3.5), power ×5 ×1.35 (cost 20 ×2), duration 10s ×1.3 (cost 10 ×4); H2P confirms the 0.2/0.35/0.3 per-upgrade text. (The in-game effect readout divides power by 2 for display; the applied game-speed multiplier is the full ×5 base.) -->

Buy **power first, then duration, then interval**: a stronger burst helps every cycle, a longer burst stretches it, and a shorter interval only matters once bursts are worth having often. Power's gentle ×2 cost scaling means it stays affordable the longest; duration's ×4 scaling bites fast, so alternate once power leads by a few levels. Keep the hole running during pushes — toggle it off only for timing-sensitive unlocks like fastest-Reality runs, where you want the clock slow, not fast.

<Screen
	src="ra/reality-blackhole-1.webp"
	alt="Black Hole upgrades further down: higher levels, rising costs and the active/inactive status."
	caption="Power first, then duration, then interval. Costs scale per upgrade."
/>

## The second Black Hole

100 days of game time after the unlock, the Parity of Singularity upgrade (row 4, <Num value="1.5e3" /> RM) buys a **second Black Hole**. Its timer only advances while the first hole is active, so it bursts inside bursts — and the second hole's upgrades cost 1,000× as much. <!-- in-game How to Play, "Black Hole"; vendor/ad-source/src/core/black-hole.js (blackHoleCostMultipliers [1, 1000]) -->

Either hole becomes permanently active at 99.99% uptime (duty cycle ≥ 0.9999) — a long-term goal, not something to chase in early Reality. Offline, cycles advance normally and bursts apply fully, so overnight runs still benefit.

<Callout kind="tip">

A leveled Black Hole plus the one-Time-glyph setup in Which glyphs to wear is the mid-game engine: bursts multiply Tachyon Galaxy gain, galaxies raise RM and glyph level, and those raise the next burst's payoff.

</Callout>
