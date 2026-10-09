---
title: 'Eternity Upgrades and Replicanti'
stage: early-eternity
order: 14
summary: 'The six Eternity Upgrades in buy order, and how Replicanti and Replicanti Galaxies work once Eternity is routine.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## The six upgrades

The **Upgrades** subtab of the Eternity tab holds six one-time upgrades plus the rebuyable EP multiplier. Buy them in cost order — each one pays for the next:

<!-- secret-formula/eternity/eternity-upgrades.js -->

<Screen
	src="early-eternity/eternity-upgrades-top.webp"
	alt="The Upgrades subtab at 10 EP: the ×5 EP multiplier at 500 EP on top, then the 5-EP unspent-EP upgrade and the challenge-times upgrade below."
	caption="The Eternity Upgrades subtab. Costs run from 5 EP to 1e50 EP — the multiplier on top first."
/>

| Cost | Effect |
| ---- | ------ |
| 5 EP | Infinity Dimensions scale with your unspent EP. |
| 10 EP | Infinity Dimensions scale with your Eternity count. |
| 50,000 EP | Infinity Dimensions scale with your total Infinity Challenge completion times. |
| <Num value="1e16" /> EP | Your achievement bonus applies to Time Dimensions too. |
| <Num value="1e40" /> EP | Time Dimensions scale with your unspent Time Theorems. |
| <Num value="1e50" /> EP | Time Dimensions scale with days played. |

The first two are cheap and strong — buy them on your first day of Eternity. The 50,000 EP one rewards finishing Infinity Challenges quickly, which the 7-Eternity milestone automates. The last three are long-term goals that become affordable during the Eternity Challenge era.

Above them all sits the **EP multiplier**: ×5 EP gain per purchase, starting at 500 EP. The **Max EP mult** button above it buys as many levels as you can afford. The tab warns: "The cost for the EP multiplier jumps at 1e100, 1.8e308, and 1e1300 EP. The cost increases super-exponentially after 1e4000 Eternity Points." Until those jumps it stays cheap for what it gives, so whenever you can afford a level, buy it before the one-time upgrades at a similar price. <!-- vendor/ad-source/src/components/tabs/eternity-upgrades/EternityUpgradesTab.vue:50-53; emulator 3.18.0: text as quoted -->

## Replicanti in Eternity

Replicanti survive into Eternity play and stay important: their multiplier boosts Infinity Dimensions, and Replicanti Galaxies are the main galaxy source each run. Two things change from the pre-Eternity game:

- From **10 Eternities**, every run starts with Replicanti already unlocked — the slow unlock phase disappears.
- From **40 Eternities**, Replicanti Galaxies no longer reset antimatter, Dimensions, Tickspeed, Sacrifice or Boosts, so grabbing them mid-run is nearly free.

<Screen
	src="early-eternity/infinity-replicanti-top.webp"
	alt="The Replicanti subtab in early Eternity: Replicanti amount and growth, the Chance, Interval and Max Galaxies upgrade buttons, and the galaxy button with auto-galaxy."
	caption="Replicanti mid-Eternity: Chance, Interval and Max Galaxies across the top, the galaxy button below — keep auto-galaxy on."
/>

Keep the **auto-galaxy** toggle on and feed chance, interval and max-galaxy upgrades from the Infinity tab. Study 62 triples Replicanti speed for 3 TT, but it stays locked until you complete Eternity Challenge 5 once, so it is a reward to pick up after your first EC5 run; the pace-split studies behind 121/122/123 add galaxy bonuses later.

Replicanti chance now climbs toward its cap of 100%, and the interval toward its 50 ms floor (study 22 lowers the floor to 1 ms). Max Galaxies has no cap, but each level costs more than the last. You stop buying them by hand at 50, 60 and 80 Eternities, when milestones unlock the Chance, Interval and Max Galaxies autobuyers.

<!-- normal-time-studies.js:135-140 (62: requirement 42 and EternityChallenge(5).completions > 0) -->

## Common wall: EP gain stalls

If EP per run stops growing, the fix is almost always more Time Theorems, not longer runs:

1. Check the top of the Eternity tab's Studies subtab — unspent IP or EP that could buy theorems.
2. Respec studies toward your actual run shape (Active pace for short runs).
3. Buy the next EP multiplier level.
4. If all of those are done and runs still stall around a few hundred TT, you are ready for [Eternity Challenges](/guide/m1/unlocking-eternity-challenges) — their rewards are the next multiplier tier.

<Callout kind="warning">

Do not hoard EP for the "unspent EP" upgrades past what those upgrades need. EP sitting unspent earns nothing from the EP multiplier track — spending it on Time Dimensions and multiplier levels grows future gains faster.

</Callout>

## Further reading

- In-game How to Play: **Eternity** (Upgrades section) and **Replicanti**.
