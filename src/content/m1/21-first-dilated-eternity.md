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
</script>

## Entering Dilation

Open the Eternity tab's **Time Dilation** subtab (marked Ψ) and tap **Dilate time**. This starts a Dilated Eternity: your run resets like a normal Eternity, and a marker shows you are dilated until you Eternity again. Dilating or undilating this way always passes through an Eternity reset. <!-- vendor/ad-source/src/components/tabs/time-dilation/DilationButton.vue, vendor/ad-source/src/core/dilation.js -->

While you are dilated, every value produced inside the run is raised to the power <Num value="0.75" /> — that is the Dilation penalty, and a later upgrade softens it. <!-- vendor/ad-source/src/core/dilation.js (dilatedValueOf) --> Ignore the smaller-looking numbers: what matters is that dilated runs earn the two new currencies, which buy upgrades that apply everywhere, dilated or not.

<Callout kind="warning">

Your first dilation is a one-way-feeling trip: progress inside it looks slow because of the penalty, and exiting early earns almost nothing. Stay dilated until your Tachyon Particle gain has clearly grown past what you already banked — the tab shows the pending gain — then Eternity out.

</Callout>

## Tachyon Particles

Tachyon Particles (TP) come from your highest antimatter in the dilated run: the more antimatter you reach while dilated, the more TP you bank when you leave, following roughly the log of your antimatter to the power 1.5. <!-- vendor/ad-source/src/core/dilation.js (getBaseTP) --> In practical terms:

- TP only grows when you push to a **new antimatter record** inside Dilation.
- Short dilated runs that never beat your record earn nothing — push each dilation as far as it goes.
- Tachyon-gain multipliers (the rebuyable upgrade below, achievements, later Reality upgrades) multiply the banked amount.

Your very first goal inside Dilation is simply to reach enough antimatter for a meaningful TP payout, exit, and spend it.

## Dilated Time

Dilated Time (DT) is produced passively from the Tachyon Particles you hold: every second you gain DT proportional to your TP, so your DT income grows each time you bank more TP. <!-- vendor/ad-source/src/core/dilation.js (getDilationGainPerSecond) --> This is the core loop of the whole stage:

1. Dilate and push antimatter to bank TP.
2. Undilate (Eternity) and spend the TP-scaled DT on upgrades.
3. The upgrades make the next dilation push further, banking more TP, which produces DT faster.

Because DT flows continuously, leaving the game running — or returning after time away with a healthy Max offline ticks setting — keeps the income coming.

## Tachyon Galaxies

As Dilated Time accumulates it also awards Tachyon Galaxies, the dilated equivalent of Antimatter Galaxies: each one boosts Tickspeed. The first threshold starts at <Num value="1000" /> DT and each further Galaxy needs more than the last. <!-- vendor/ad-source/src/core/player.js (nextThreshold), vendor/ad-source/src/core/dilation.js (getTachyonGalaxyMult) --> The threshold-lowering upgrade (next article) makes each Galaxy cheaper, and a one-time upgrade doubles how many you get. Galaxies persist through Eternities within the Reality, so every dilated run adds to the same total.

## The first few runs

1. **Dilate** from the Time Dilation subtab.
2. Play the run normally — studies, autobuyers, Eternity upgrades all still work — and push antimatter as high as it goes.
3. When progress stalls, **Eternity** to exit and bank the TP.
4. Spend DT on the upgrades in the next article, in that order.
5. Repeat. Each cycle's TP record should beat the last; if it doesn't, farm more DT with your current TP before dilating again.

<Callout kind="tip">

Dilated runs use the same study tree as normal runs. A tree that pushes antimatter hardest — the same tree you used for late EC completions — is the right tree for banking TP.

</Callout>

## Further reading

- [Dilation upgrades in order](/guide/m1/dilation-upgrades-in-order): what to spend the first DT on.
- The in-game How to Play entry on Time Dilation, in the Info tab.
