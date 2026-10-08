---
title: 'The Celestials'
stage: teresa
order: 10
summary: 'What the seven Celestials are, where to find their tab, and how Celestial Realities work.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## What the Celestials are

The Celestials are seven powerful beings, one per endgame stage: Teresa, Effarig, the Nameless Ones, V, Ra, Lai'tela and Pelle. Each one adds its own mechanic and upgrades, and beating all seven is how you finish the game. Unlocking or beating each Celestial works differently, and this guide covers each one in turn.

<!-- vendor/ad-source/src/core/secret-formula/h2p.js (Celestials entry) -->

The first Celestial, Teresa, unlocks when you own all 25 Reality Upgrades (achievement 147). From there the chain leads on: pouring enough Reality Machines for Teresa unlocks Effarig, finishing Effarig's Eternity layer unlocks the Nameless Ones, and so on.

<!-- src/core/celestials/teresa.js: isUnlocked = Achievement(147); src/core/celestials/enslaved.js: isUnlocked = EffarigUnlock.eternity -->

<Callout kind="note">

Celestials are timeless: unless a description says otherwise, their new mechanics run on real time and ignore game-speed multipliers. Charging a Black Hole, storing real time and pouring RM all tick in real seconds.

<!-- vendor/ad-source/src/core/secret-formula/h2p.js (Celestials entry: "Celestials are timeless entities... instead refer specifically to real time instead of game time") -->

</Callout>

## The Celestials tab

When Teresa unlocks, a new tab appears next to the Reality tab. On Android it is the starfield icon in the tab bar, and inside it the subtabs run along the bottom: Nav, Teresa, Effarig, Nameless, V, Ra. Tabs for Celestials you have not reached yet stay hidden, so you will only see Nav and Teresa at first.

<Screen
	src="ra/celestials-nav-0.webp"
	alt="The Celestials tab on the Nav subtab: a star map with nodes for Teresa's Reality, Effarig's Reality, V's Reality and the Nameless Ones' Reality."
	caption="The Nav subtab: the Celestial Navigation map. Only the part near your progress is lit up."
/>

The first subtab, Nav, shows the Celestial Navigation map. It fills in as you progress, with a marker showing roughly what to aim for next. Tap a node to show its details, then tap it again to open that Celestial's tab. You can pinch to zoom and drag to pan around the map.

<Screen
	src="ra/celestials-nav-1.webp"
	alt="A zoomed part of the Celestial Navigation map showing connected nodes for several Celestial Realities, with the hint text about tapping nodes below it."
	caption="Zoom into the map to read the small nodes. The text below it explains the tap-tap navigation."
/>

## How Celestial Realities work

Every Celestial has its own Reality, started from a panel on that Celestial's tab: a **Start** button with the run's restrictions written underneath. Read that panel before entering. Typical restrictions include weakened multipliers, capped Glyph levels, disabled automation and missing mechanics, and each Celestial's article in this guide lists them in full.

A few rules apply to all of them:

- You can only be inside one Celestial Reality at a time; starting one leaves any other. <!-- src/core/celestials/teresa.js + effarig.js: initializeRun() calls clearCelestialRuns() -->
- Progress inside is real: the antimatter, EP and Reality you earn count normally, and finishing means performing the usual prestige at the end (a Reality, or the Infinity/Eternity/Reality layers for Effarig).
- The reward is permanent and shown on the tab afterwards. Teresa's reward even grows if you repeat the run with a higher score.
- If a run goes badly, leave it and come back stronger. Nothing in a Celestial Reality can damage your save; the only cost is the time spent.

## Before you start

The usual routine does not stop. Keep doing fast Realities for Reality Machines, Glyphs and Perk Points while you work through each Celestial's unlocks, and only attempt a Celestial Reality when your normal runs feel comfortable. The stages ahead assume your Reality routine from early Reality is automated or at least quick on touch.

## Further reading

- [Fandom Guide](https://antimatter-dimensions.fandom.com/wiki/Guide) — long-form walkthrough, Celestial sections (community-maintained; check dates)
- [Community wiki](https://antimatterdimensions.wiki.gg/) — current mechanics reference
