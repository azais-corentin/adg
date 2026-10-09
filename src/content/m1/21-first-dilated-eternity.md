---
title: 'Your first Dilated Eternity'
stage: early-dilation
order: 11
summary: 'How dilated runs work, where Tachyon Particles and Dilated Time come from, and what to do in the first few dilations.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## Entering Dilation

Dilation lives in the **Dilation** subtab, the fourth of the Eternity tab after Studies, Upgrades and Milestones. Tap **Dilate time.** and confirm "You are about to enter Dilation" with **BEGIN**. Entering restarts your Eternity (you get its Eternity Points if you could Eternity right then), and the new run is dilated.

<Screen
	src="early-dilation/eternity-dilation-0.webp"
	alt="The Dilation subtab outside Dilation: Gain Eternity Points and Gain Infinity Points boxes, 3.37e3 Tachyon Particles, the Dilate time. button, 1.971e7 Dilated Time at +9.71e7/h, the next Tachyon Galaxy threshold, and the first Dilation upgrades."
	caption="The Dilation subtab: the Dilate time. button, your Tachyon Particles, Dilated Time with its hourly rate, and the next Tachyon Galaxy threshold."
/>

While you are dilated, the **exponent** of every Antimatter, Infinity and Time Dimension multiplier and of the tickspeed multiplier is raised to the power <Num value="0.75" />, so a ×1e100 multiplier shrinks to about ×4e31. That is the Dilation penalty, and a later upgrade softens it. <!-- vendor/ad-source/src/core/dilation.js (dilatedValueOf); secret-formula/h2p.js (Time Dilation) --> Ignore the smaller-looking numbers: what matters is that dilated runs earn the two new currencies, which buy upgrades that apply everywhere, dilated or not.

## Leaving Dilation

While you are dilated, the top-left box reads "Gain N Tachyon Particles" and the button in the Dilation subtab reads **Disable Dilation. Gain N Tachyon Particles.** Tapping it opens "You are about to exit Dilation" with "If you exit Dilation now, you will gain N TP". **CONFIRM** ends the run with an Eternity and adds that amount to your Tachyon Particles. It works at any time; the round **Eternity** button also exits, but only once you could Eternity anyway. You will see it work straight away: in one test, 3.37e3 TP plus a gain of 8.07e3 became 1.14e4, and the Dilated Time rate jumped from +9.71e7/h to +3.30e8/h.

<!-- dilation.js startDilatedEternityRequest (enter/exit modals), eternity.js eternity(): switchingDilation forces the reset when you can't Eternity, rewardTP bumps TP to the new total; emulator (Android 3.18.0, early-dilation save): "Dilate time." → "You are about to enter Dilation: Dilating time will start a new Eternity…" CANCEL/BEGIN; dilated: "You are currently in Time Dilation", top-left "Gain 55.6 Tachyon Particles", button "Disable Dilation. Gain 55.6 Tachyon Particles." → "You are about to exit Dilation / If you exit Dilation now, you will gain 110.5 TP." CANCEL/CONFIRM. Reviewer 3-8: TP 3.37e3 + 8.07e3 → 1.14e4, DT +9.71e7/h → +3.30e8/h -->

<Callout kind="warning">

Your first dilation is a one-way-feeling trip: progress inside it looks slow because of the penalty, and exiting early earns almost nothing. Stay dilated until the "Gain N Tachyon Particles" figure has clearly grown, then tap **Disable Dilation**.

</Callout>

## Tachyon Particles

Tachyon Particles (TP) come from your highest antimatter in the dilated run: the more antimatter you reach while dilated, the more TP you bank when you leave. Before multipliers, TP = (antimatter exponent ÷ 400) to the power 1.5, so 1e4,000 antimatter is worth about 32 TP and 1e8,000 about 89. <!-- vendor/ad-source/src/core/dilation.js (getBaseTP) --> In practical terms:

- TP only grows when you push to a **new antimatter record** inside Dilation.
- Short dilated runs that never beat your record earn nothing — push each dilation as far as it goes.
- Tachyon-gain multipliers (the rebuyable upgrade below, achievements, later Reality upgrades) multiply the banked amount.

Your very first goal inside Dilation is simply to reach enough antimatter for a meaningful TP payout, exit, and spend it.

## Dilated Time

Dilated Time (DT) is produced passively from the Tachyon Particles you hold: every second you gain DT proportional to your TP, so your DT income grows each time you bank more TP. <!-- vendor/ad-source/src/core/dilation.js (getDilationGainPerSecond) --> This is the core loop of the whole stage:

1. Dilate and push antimatter to bank TP.
2. Tap **Disable Dilation** and spend the TP-scaled DT on upgrades.
3. The upgrades make the next dilation push further, banking more TP, which produces DT faster.

Because DT flows continuously, leaving the game running — or returning after time away with a healthy Max offline ticks setting — keeps the income coming.

## Tachyon Galaxies

As Dilated Time accumulates it also awards Tachyon Galaxies, the dilated equivalent of Antimatter Galaxies: each one boosts Tickspeed. The first threshold starts at <Num value="1000" /> DT and each further Galaxy needs more than the last. <!-- vendor/ad-source/src/core/player.js (nextThreshold), vendor/ad-source/src/core/dilation.js (getTachyonGalaxyMult) --> The threshold-lowering upgrade (next article) makes each Galaxy cheaper, and a one-time upgrade doubles how many you get. Galaxies persist through Eternities within the Reality, so every dilated run adds to the same total.

## The first few runs

1. Tap **Dilate time.** in the Dilation subtab.
2. Play the run normally — studies, autobuyers, Eternity upgrades all still work — and push antimatter as high as it goes.
3. When progress stalls, tap **Disable Dilation** to exit and bank the TP.
4. Spend DT on the upgrades in the next article, in that order.
5. Repeat. Each cycle's TP record should beat the last; if it doesn't, farm more DT with your current TP before dilating again.

<Callout kind="tip">

Dilated runs use the same study tree as normal runs. A tree that pushes antimatter hardest — the same tree you used for late EC completions — is the right tree for banking TP.

</Callout>

## Further reading

- [Dilation upgrades in order](/guide/m1/dilation-upgrades-in-order): what to spend the first DT on.
- The in-game How to Play entry on Time Dilation, in the Info tab.
