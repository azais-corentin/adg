---
title: 'The Automator'
stage: early-reality
order: 32
summary: 'How Automator Points unlock the Automator, how block and text mode work, and your first scripts.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## Unlocking it: 100 Automator Points

The Automator unlocks at **100 total Automator Points** (achievement: How does this work?). Points come from several places: <!-- vendor/ad-source/src/core/automator/automator-points.js; vendor/ad-source/src/core/secret-formula/reality/automator.js; reality-upgrades.js; perks.js -->

- **Realities:** 2 per Reality, up to 50 Realities (100 max, but you will unlock long before that).
- **Perks:** the ones whose label on the Perks subtab ends in an AP amount, like "ACH1 (+5 AP)": 5, 10 or 15 each (ECB gives 15).
- **Reality Upgrades:** Existentially Prolong (15), Boundless Flow (5), Telemechanical Process (10), Eternal Flow (5), Parity of Singularity (10), Effortless Existence (100).
- **Black Hole:** unlocking it gives 10.

In practice the Automator arrives in the first dozen Realities: Realities plus a few AP perks and early upgrades cross 100 without grinding. Until then, the Automator subtab reads "You have N / 100 Automator Points" and lists these sources with what each has given you; the Next goals of an [imported save](/import) show the same count.

## Block mode vs text mode

The Automator lives in the **Automation** tab (gears icon), **Automator** subtab — the tab is called Autobuyers only before Reality unlocks. It runs scripts — lists of commands like `eternity`, `studies purchase`, `wait`, `unlock dilation` — that play the game for you.

<Screen
	src="early-reality/autobuyers-automator-0.webp"
	alt="The Automator subtab on an early Reality: the script list, transport buttons, editor pane and documentation panels."
	caption="The Automator. Buttons across the top run, pause and stop; the editor is in the middle."
/>

- **Block mode** is the default: pick command blocks from the right-hand panel and drag them into order. Best for learning — you cannot misspell a command.
- **Text mode** (the pencil/code button) lets you type commands directly, one per line, with `if`, `until` and `while` blocks in braces. Switching modes auto-translates, but a script with errors may lose lines — get it running in one mode first.

The transport row: play runs the script, pause freezes it, stop ends it, circular arrows repeat it from the top, and the curved arrow re-runs it after every Reality. The green line shows what is running and where.

## Your first scripts

Start from the built-in templates (Climb EP, Grind Eternities, Grind Infinities, Complete Eternity Challenge, Unlock Dilation) or adg's verified library on the [Automator scripts](/tools/automator) page. A minimal early loop looks like: buy studies, wait for EP to beat its record, Eternity, reload studies, repeat. Keep scripts short — each is capped at 10,000 characters, 20 scripts and 30 constants total, with names capped at 15 characters. <!-- in-game How to Play, "Automator Technical Details"; vendor/ad-source/src/core/automator/automator-backend.js -->

<Screen
	src="early-reality/autobuyers-automator-1.webp"
	alt="An Automator text-mode script on an early Reality: studies, wait and eternity commands with the Script Constants panel below."
	caption="A text-mode script. if/until blocks and constants keep longer runs tidy."
/>

<Callout kind="android">

Pasting on Android: create a new script, tap the editor, long-press and choose Paste (or tap the clipboard suggestion above the keyboard), then tap back to close the keyboard. Rename with the pencil button — names hold 15 characters. Full steps with screenshots are on the [Automator scripts](/tools/automator) page.

</Callout>

<Callout kind="tip">

Turn on repeat plus run-after-Reality for farming scripts, and add a `notify` line before each prestige so a green banner tells you what it just did. If a script misbehaves, stop it, fix one block, and re-run — never let a broken script grind overnight.

</Callout>
