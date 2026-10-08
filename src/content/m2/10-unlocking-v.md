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
| Eternities | <Num value="1e70" /> | Lifetime total. |
| Infinities | <Num value="1e160" /> | Lifetime total, counting banked ones (total, not current). |
| Dilated Time | <Num value="1e320" /> | Best this Reality, not lifetime. |
| Replicanti | <Num value="1e320000" /> | Best this Reality, not lifetime. |
| Reality Machines | <Num value="1e60" /> | Current amount. |

The split matters: Infinities, Eternities and Realities accumulate forever, but Dilated Time and Replicanti are judged on your **current Reality's records**, and Reality Machines on what you hold right now. So the practical route is to grind the lifetime totals first, then do one long Reality where you push Dilated Time and Replicanti to their records while holding <Num value="1e60" /> RM.

<Screen
	src="nameless/celestials-v-top.webp"
	alt="The V subtab before unlocking: the six requirement rows with progress counters and the unlock reward line at the bottom."
	caption="V's tab tracks all six requirements. The unlock fires as soon as the last one fills."
/>

## How to push each one

- **Realities to 10,000.** Reality count grows fast once your RM income does. Amplify with stored time from the Nameless Ones if you have it banked, and keep Realities short while farming glyphs anyway.
- **Eternities to <Num value="1e70" /> and Infinities to <Num value="1e160" />.** These come from Eternity and Infinity autobuyers running constantly. They look absurd until Eternity and Infinity generation scale up, then they tick over on their own during active play. Check the Statistics tab if you want to watch the exponents climb.
- **Dilated Time to <Num value="1e320" /> this Reality.** Run Dilation with a strong Tachyon setup, and stay in the Reality long enough for the DT record to build. Do not Reality again until the other five are also met.
- **Replicanti to <Num value="1e320000" /> this Reality.** Push Replicanti amount and galaxies in the same long Reality. Replicanti speed matters more than anything else here.
- **Reality Machines to <Num value="1e60" />.** This is usually the last gate. Keep farming RM with your best glyph set until the number holds.

<Callout kind="tip">

Because DT and Replicanti use this-Reality records, plan a single long "unlock Reality": enter it once the lifetime totals are close, push everything, and only leave when the ladder shows six of six.

</Callout>

## When to move on

The moment all six are met, V unlocks with a short message ("Welcome to my Reality"). Do not expect a reward yet: unlocking V only opens the door. The real work is [V's Reality and V-Achievements](/guide/m2/v-achievements), where you earn the Space Theorems that make V worth reaching.

## Further reading

- [Fandom Guide](https://antimatter-dimensions.fandom.com/wiki/Guide) — long-form walkthrough, Celestials sections.
- [Community wiki](https://antimatterdimensions.wiki.gg/) — current mechanics reference.
