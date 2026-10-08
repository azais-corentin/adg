---
title: 'Dark Matter Dimensions and Annihilation'
stage: laitela
order: 11
summary: 'Producing Dark Matter and Dark Energy, ascending intervals, and when to Annihilate.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## The two currencies

Lai'tela's tab holds four **Dark Matter Dimensions** (not eight — you start with only the 1st; upgrades 16–18 unlock the 2nd, 3rd and 4th). They cascade like normal Dimensions: each tier produces the tier below it, and the 1st produces **Dark Matter**. Every interval tick also yields **Dark Energy**, which does not depend on how many dimensions you own. <!-- vendor/ad-source/src/core/secret-formula/h2p.js:1644-1692 -->

- **Dark Matter (DM)** multiplies your Continuum purchases, based on the most DM you have ever held. More peak DM means every Antimatter Dimension and Tickspeed is effectively bought further.
- **Dark Energy (DE)** fills the Singularity condenser: at 200 DE (to start) you can condense it into Singularities. See [Singularities](/guide/m2/singularities).

When a higher Dark Matter Dimension unlocks you get 1 of it; the rest must be produced from the tier above. Spend DM on each tier's interval upgrades and power (×DM / ×DE) upgrades from the dimension rows. <!-- vendor/ad-source/src/core/secret-formula/h2p.js:1644-1692 -->

## Intervals and Ascension

Each tier's production interval can be upgraded down to a floor of 10 ms. At the floor, **Ascend** the tier: its interval resets to a much longer value (×1200 per Ascension) but its DM and DE production each jump by a permanent ×500. You can Ascend the same tier repeatedly — upgrade back to 10 ms, Ascend again. <!-- vendor/ad-source/src/core/secret-formula/h2p.js:1644-1692 vendor/ad-source/src/core/celestials/laitela/dark-matter-dimension.js -->

Practical order: keep all unlocked tiers' intervals falling, Ascend whichever tier sits at 10 ms, and buy power upgrades with whatever DM is left. Interval cuts beat power early because every tier multiplies the ones below it.

<Screen
	src="laitela/celestials-laitela-2.webp"
	alt="The Dark Matter Dimension rows: each tier with its interval, DM and DE production, cost buttons, and the Ascend control at the floor."
	caption="The Dimension rows. Upgrade intervals to the floor, Ascend, and spend leftover DM on the power buttons."
/>

## Annihilation

Imaginary Upgrade 19 unlocks **Annihilation**, which needs at least <Num value="1e60" /> Dark Matter. Annihilating resets your Dark Matter and all four Dimensions to zero but adds a permanent, stacking multiplier to all future Dark Matter gain. The additions stack additively, so there is no need to wait for a bigger pending number before each one — small Annihilations are not wasted. <!-- vendor/ad-source/src/core/secret-formula/h2p.js:1644-1692 vendor/ad-source/src/core/celestials/laitela/laitela.js:69-77 -->

- Early on, Annihilate by hand whenever the pending multiplier is a clear gain (a few times your current total) and your DM growth has stalled.
- Later, Singularity milestones automate both Annihilation and the Dark Matter Dimension autobuyers; set a sensible minimum multiplier and let them run.
- Upgrade 21 (Existential Elimination) makes the Annihilation multiplier grow with your iM, so it keeps scaling into the late stage.

<Callout kind="warning">

Annihilation resets Dimensions but never touches Singularities or their milestones. Do not confuse it with condensing: Annihilate for the DM multiplier, condense DE for Singularities. They are independent buttons.

</Callout>
