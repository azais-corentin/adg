---
title: 'How to prepare for the first Reality'
stage: late-eternity
order: 13
summary: 'What Reality resets and what it keeps, how many Reality Machines the first run earns, and the last checks before you go.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Checklist from '#lib/components/Checklist.svelte';
</script>

## What Reality does

Reality is a full-layer prestige: everything from the Eternity layer down resets — antimatter, Infinity and Eternity Points, Dimensions, studies, upgrades — and you start over with permanent additions. What actually survives (from `finishProcessReality`): <!-- vendor/ad-source/src/core/reality.js -->

- **Eternity Challenge *studies* reset, not completions.** Your EC study tree empties and the `unlockedEC` flags clear, but the `eternityChalls` completion counts stay — the stacked rewards apply from the start, and re-unlocking studies is the only replay needed. Post-Reality multipliers make that fast.
- **Dilation studies, dilation upgrades, Tachyon Particles and Dilated Time** reset. You will re-unlock Dilation in every Reality; later perks automate this.
- **Achievements are the one thing Reality takes away.** The 104 pre-Reality rows go dark (rewards and all) and must be re-earned — by hand or via the 30-minute auto-achievement timer. Everything else above (records, challenge times, General-tab statistics) stays.
- **Records** (best EP, best times) start a new Reality row; the this-Reality max EP that unlocked the study begins climbing again from zero.
- **What you gain:** Reality Machines from the run, Glyphs (the new equipment layer), and access to the Reality Upgrades, Perks, Automator and Black Hole tabs.

Nothing about the reset can strand you: with the study requirement behind you, re-climbing through Eternity takes a fraction of the first trip.

## How many Reality Machines to expect

Machines come from your max EP this Reality through a steep formula: at exactly <Num value="1e4000" /> EP the run earns a single machine, and the payout grows fast above that — pushing past the minimum before realiting multiplies the starting budget several times over. <!-- vendor/ad-source/src/core/machines.js (uncappedRM: 1000^((log10EP/4000) − 1)) --> The practical consequences:

- **Never Reality at exactly the minimum on purpose.** Every extra chunk of max EP above <Num value="1e4000" /> raises the machine count, and the climb from 4000 to a few hundred exponents higher is short compared to the road that got you here.
- **But don't grind forever either.** The first few machines buy upgrades that speed up the *next* Reality enormously, so two quick Realities beat one slow maximal one. Push somewhat past the minimum, Reality, and let the new upgrades compound.
- The very first Reality additionally grants starting Glyphs, whose effects dwarf a couple of extra machines.

A good rule: once progress clearly slows past <Num value="1e4000" />, do a final dilated TP push, spend all DT, buy the Reality study, and go.

## Last checks before you go

1. **Export your save** (Options → Save & Load → hold Share save → Export to web/steam). Keep the file — it is your Eternity-era souvenir and your rollback.
2. **Spend everything.** Unspent DT, TP-banked records, unbought Theorems — none of it crosses over in a useful form. Buy every dilation upgrade affordable and every Theorem available.
3. **Confirm the three gates** — TD8 owned, max EP ≥ <Num value="1e4000" />, rows 1–13 complete — and buy the 1-Theorem Reality study.
4. **Free Glyph space.** The first Reality grants your starting Power glyph plus a Companion; later ones offer choices. A full inventory deletes the overflow, so clear room if you have been collecting.

<Callout kind="android">

The Reality confirmation and the Glyph-choice screens are full-screen modals — read them where you can pause, not mid-commute. After Reality lands, the "While you were away" popup may summarize the reset; confirm it and check the new Reality tab.

</Callout>

## What comes after

Your first tasks on the other side: pick starting Glyphs, spend the first Reality Machines on Reality Upgrades, and choose the first Perks. Those belong to the early-Reality articles — but take a moment first. The Eternity era is the longest climb in the game so far, and you just finished it.

<Checklist stage="late-eternity" />

## Further reading

- The in-game How to Play entry on Reality, in the Info tab — it unlocks with the layer.
- [Saving and exporting](/guide/m1/saving-and-exporting) for the export steps.
