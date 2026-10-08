---
title: 'Continuum'
stage: laitela
order: 10
summary: 'What Continuum changes about buying Dimensions, and the one setting to know.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## What Continuum is

Buying Imaginary Upgrade 15 converts your Antimatter Dimensions and Tickspeed to **Continuum**: instead of buying Dimensions 10 at a time with antimatter, you get fractional purchases continuously and for free. Your multiplier is whatever your current antimatter could buy, updated smoothly as antimatter grows. The purchase buttons now show the equivalent buy count (for example, a Tickspeed Continuum value of 5.3 from <Num value="2e7" /> antimatter) rather than something to tap. <!-- vendor/ad-source/src/core/secret-formula/h2p.js:1693-1719 -->

Nothing is lost in the conversion: Continuum gives the same effect your purchases would have, then Dark Matter multiplies it further. It stays on for the rest of the game, including Doomed Reality.

## What changes on screen

- The Dimensions tab's Antimatter rows stop having useful buy buttons; amounts and multipliers climb on their own as antimatter rises.
- The Autobuyers tab hides the Antimatter Dimension and Tickspeed autobuyer settings while Continuum is active — they have nothing left to do. <!-- vendor/ad-source/src/core/secret-formula/h2p.js:1693-1719 -->
- The Lai'tela tab shows your Continuum bonus from Dark Matter (the "matter extra purchase" percentage), which is the number upgrade 20's task and upgrade 21's run care about.

<Screen
	src="laitela/dimensions-antimatter-0.webp"
	alt="The Antimatter Dimensions tab with Continuum active: fractional Continuum counts on every row and the Tickspeed Continuum line instead of buy buttons."
	caption="The Dimensions tab after Continuum. The Continuum values track antimatter automatically; there is nothing left to buy."
/>

## The one setting to know

On the **Autobuyers** tab there is a Continuum toggle. Leave it **on**. Some upgrades multiply the Continuum value directly, and they silently stop working if Continuum is disabled — production drops with no other warning. The only reason to turn it off is Imaginary Upgrade 21, whose task requires a full Reality with Continuum disabled; turn it back on right after. <!-- vendor/ad-source/src/core/secret-formula/h2p.js:1693-1719 -->

<Callout kind="tip">

After Continuum, "buy Max" and Dimension autobuyer tweaks are obsolete. Push antimatter itself: everything downstream — Continuum values, Dark Matter, Tickspeed — follows it.

</Callout>
