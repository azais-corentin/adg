---
title: 'Unlocking V'
stage: v
order: 10
summary: 'The six simultaneous requirements that open V, the Celestial of Achievements.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## Who V is

V is the fourth Celestial, the Celestial of Achievements. Where Teresa, Effarig and the Nameless Ones each add a new currency or layer, V adds a new kind of goal: tiered achievements you complete inside a special, heavily weakened Reality. Finishing them earns Space Theorems, a second currency for the Time Study tree, and enough of them unlocks Ra.

You reach V through the Celestials tab, which shows a map of every Celestial. Tap V's hexagon once to see its requirements, twice to open its tab.

<Screen
	src="v/celestials-nav-0.webp"
	alt="The Celestial navigation map in the V stage: lit nodes for the unlocked Celestials with the tap-to-open hint below the map."
	caption="The Celestial map. Each node opens that Celestial's tab on a second tap."
/>

## The six requirements

V unlocks when you meet all six of these **at the same time**. The V tab shows a ladder tracking each one, and the unlock fires as soon as the last one fills. <!-- vendor/ad-source/src/core/secret-formula/celestials/v.js `v.mainUnlock`, `vAchievementUnlock.requirement` -->

| Requirement | Amount | Notes |
| --- | --- | --- |
| Realities | <Num value="10000" /> | Lifetime total. |
| Eternities | <Num value="1e70" /> | Current amount; a Reality resets it. |
| Infinities | <Num value="1e160" /> | Current amount, counting banked ones; a Reality resets both. |
| Dilated Time | <Num value="1e320" /> | Best this Reality, not lifetime. |
| Replicanti | <Num value="1e320000" /> | Best this Reality, not lifetime. |
| Reality Machines | <Num value="1e60" /> | Current amount. |

The split matters: only Realities accumulate for good. A Reality resets your Eternities and Infinities (banked ones too) along with the Dilated Time and Replicanti records, and Reality Machines count what you hold right now. So four of the six have to be reached **inside one Reality**: get to 10,000 Realities and an RM income that holds <Num value="1e60" />, then do one long Reality, with the Reality autobuyer off, in which Eternities, Infinities, Dilated Time and Replicanti all climb to their goals.

<!-- vendor/ad-source/src/core/reality.js:623-624 (Currency.infinities/infinitiesBanked.reset), 644 (Currency.eternities.reset unless Pelle's upgrade); v.js mainUnlock uses Currency.eternities, Currency.infinitiesTotal, records.thisReality.maxDT/maxReplicanti. Reviewer (Android 3.18.0): V's ladder fell from 4.38e63 to 1.97e63 Eternities and from 3.44e136 to 4.29e135 Infinities between 14,006 and 14,049 Realities. -->

<Screen
	src="nameless/celestials-v-top.webp"
	alt="The V subtab before unlocking: the six requirement rows with progress counters and the unlock reward line at the bottom."
	caption="V's tab tracks all six requirements. The unlock fires as soon as the last one fills."
/>

## How to push each one

- **Realities to 10,000.** Reality count grows fast once your RM income does. Amplify with stored time from the Nameless Ones if you have it banked, and keep Realities short while farming glyphs anyway.
- **Eternities to <Num value="1e70" /> and Infinities to <Num value="1e160" />.** Both start over every Reality and are rebuilt by Eternity and Infinity generation and the autobuyers during it, so a long Reality is what grows them. Watch V's ladder: if the numbers drop between Realities, your Realities are too short for them.
- **Dilated Time to <Num value="1e320" /> this Reality.** Run Dilation with a strong Tachyon setup, and stay in the Reality long enough for the DT record to build. Do not Reality again until the other five are also met.
- **Replicanti to <Num value="1e320000" /> this Reality.** Push Replicanti amount and galaxies in the same long Reality. Replicanti speed matters more than anything else here.
- **Reality Machines to <Num value="1e60" />.** This is usually the last gate. Keep farming RM with your best glyph set until the number holds.

<Callout kind="tip">

Because Eternities, Infinities, Dilated Time and Replicanti all reset on Reality, plan a single long "unlock Reality": turn the Reality autobuyer off, enter it once you have 10,000 Realities and solid RM, push everything, and only leave when the ladder shows six of six.

</Callout>

## When to move on

The moment all six are met, V unlocks with a short message ("Welcome to my Reality"). Do not expect a reward yet: unlocking V only opens the door. The real work is [V's Reality and V-Achievements](/guide/m2/v-achievements), where you earn the Space Theorems that make V worth reaching.

## Further reading

- [Fandom Guide](https://antimatter-dimensions.fandom.com/wiki/Guide) — long-form walkthrough, Celestials sections.
- [Community wiki](https://antimatterdimensions.wiki.gg/) — current mechanics reference.
