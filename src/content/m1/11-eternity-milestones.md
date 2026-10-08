---
title: 'Eternity milestones'
stage: early-eternity
order: 11
summary: 'What each Eternity-count milestone automates, and the fast farming loop that reaches them.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## How milestones work

The **Milestones** subtab of the Eternity tab lists rewards that unlock permanently once your total Eternity count reaches the number shown. They are the reason the first stretch of the game is a loop: Eternity often, watch the busywork disappear, Eternity faster.

<!-- secret-formula/eternity/eternity-milestones.js -->

<Screen
	src="early-eternity/eternity-milestones-0.webp"
	alt="The Milestones subtab at 13 Eternities: the 1-through-5 Eternity cards — IP multiplier autobuyer, start-with-challenges-and-broken-Infinity, Replicanti Galaxy autobuyer, start-with-all-Infinity-Upgrades."
	caption="The start of the milestone ladder. Each card unlocks permanently at the shown Eternity count."
/>

## The early milestones

| ETs | Reward | Why it matters |
| --- | ------ | -------------- |
| 1 | IP multiplier autobuyer | Your first new automation. |
| 2 | Start with Normal Challenges done, normal autobuyers, and Infinity broken | No more re-breaking Infinity every run. |
| 3 | Replicanti Galaxy autobuyer | One less thing to babysit. |
| 4 | Start with all Infinity Upgrades | The re-buy phase ends. |
| 5 | More Big Crunch autobuyer options | Lets you crunch hands-free. |
| 6 | Offline EP generation (25% of your best EP/min) | Progress while the app is closed; needs offline progress enabled in Options. |
| 7 | Infinity Challenges auto-complete on unlock; keep the Sacrifice autobuyer | One less checklist to manage. |
| 8 | Start with all Break Infinity Upgrades | The last piece of re-setup busywork. |
| 9 | Buy-max Antimatter Galaxies autobuyer mode | Galaxies stop needing taps. |
| 10 | Start with Replicanti unlocked | The Eternity run-up shortens a lot. |
| 11–18 | Infinity Dimension autobuyers, one per Eternity | Each dimension gets its own buyer. |
| 25 | Infinity Dimensions auto-unlock on reaching them | No more tapping each unlock. |
| 30 | Start with all Antimatter Dimensions buyable | The first minute of each run disappears. |
| 40 | Replicanti Galaxies stop resetting most things | Galaxies become nearly free. |

Beyond these, milestones at 50, 60 and 80 unlock the Replicanti upgrade autobuyers, 100 unlocks the Eternity autobuyer, and 200 and 1,000 add offline Eternity and Infinity generation.

<Screen
	src="early-eternity/eternity-milestones-1.webp"
	alt="Milestone cards for 5 through 12 Eternities: crunch options, offline EP, auto Infinity Challenges, start-with-Break-upgrades, buy-max Galaxies, start-with-Replicanti, and the first ID autobuyers."
	caption="Milestones 5 to 12 remove the rest of the per-run setup — offline EP, auto ICs, Break upgrades, Replicanti from the start."
/>

<Callout kind="android">

The offline milestones (6, 200, 1,000) only work if offline progress is enabled. Check Options → Max offline ticks: 100,000 or more keeps autobuyers faithful overnight.

</Callout>

## The farming loop

Early on, each Eternity earns little EP, so the goal is Eternity *count*, not EP per run:

1. Eternity, buy Time Dimension 1 and your studies (or respec to your farming tree).
2. Push antimatter → crunch → push IP as far as it goes quickly.
3. Eternity again as soon as EP gain slows — do not grind a stalled run.

Once the 8-Eternity milestone removes the Break Infinity re-buy, runs get much shorter, and by 25–30 Eternities an Eternity takes a couple of minutes of mostly idle play. Around 100 Eternities the Eternity autobuyer can run this loop for you.

## When to move on

Keep farming Eternities until progress stalls even with fresh studies — usually around a few hundred Eternities and a few hundred Time Theorems. That is the point to start [Eternity Challenges](/guide/m1/unlocking-eternity-challenges), whose first studies cost 30+ TT. The walls inside (EC4/EC9–EC12) get their own [walkthrough](/guide/m1/eternity-challenge-walls). Past 1,000 Eternities every milestone is unlocked.

## Further reading

- In-game How to Play: **Eternity Milestones**.
- The [checklists](/checklists) page tracks the 100- and 1,000-Eternity goals against your save.
