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

| ETs                               | Reward                                                                    | Why it matters                                                               |
| --------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 1                                 | IP multiplier autobuyer                                                   | Your first new automation.                                                   |
| 2                                 | Start with Normal Challenges done, normal autobuyers, and Infinity broken | No more re-breaking Infinity every run.                                      |
| 3                                 | Replicanti Galaxy autobuyer                                               | One less thing to babysit.                                                   |
| 4                                 | Start with all Infinity Upgrades                                          | The re-buy phase ends.                                                       |
| 5                                 | More Big Crunch autobuyer options                                         | Lets you crunch hands-free.                                                  |
| 6                                 | Offline EP generation (25% of your best EP/min)                           | Progress while the app is closed; needs offline progress enabled in Options. |
| 7                                 | Infinity Challenges complete as soon as you unlock them                   | One less checklist to manage.                                                |
| 8                                 | Start with all Break Infinity Upgrades                                    | The last piece of re-setup busywork.                                         |
| 9                                 | Buy-max Antimatter Galaxies autobuyer mode                                | Galaxies stop needing taps.                                                  |
| 10                                | Start with Replicanti unlocked                                            | The Eternity run-up shortens a lot.                                          |
| <span class="nowrap">11–18</span> | Infinity Dimension autobuyers, one per Eternity                           | Each dimension gets its own buyer.                                           |
| 25                                | Infinity Dimensions auto-unlock on reaching them                          | No more tapping each unlock.                                                 |
| 30                                | Start with all Antimatter Dimensions buyable                              | The first minute of each run disappears.                                     |
| 40                                | Replicanti Galaxies stop resetting most things                            | Galaxies become nearly free.                                                 |

Beyond these, milestones at 50, 60 and 80 unlock the Replicanti upgrade autobuyers. **100** unlocks the Eternity autobuyer and offline Eternities (50% of your best Eternities per hour), and **1,000** adds offline Infinities (50% of your best Infinities per hour this Eternity).

<!-- Android 3.18.0 milestone cards (late-eternity/eternity-milestones-0/2.webp): the app folds upstream's 200-Eternity offline-Eternities milestone into 100, and its 7-Eternity card does not mention the Sacrifice autobuyer -->

<Screen
	src="early-eternity/eternity-milestones-1.webp"
	alt="Milestone cards for 5 through 12 Eternities: crunch options, offline EP, auto Infinity Challenges, start-with-Break-upgrades, buy-max Galaxies, start-with-Replicanti, and the first ID autobuyers."
	caption="Milestones 5 to 12 remove the rest of the per-run setup — offline EP, auto ICs, Break upgrades, Replicanti from the start."
/>

<Callout kind="android">

The offline milestones (6, 100 and 1,000) give nothing while Options → **Offline progress** reads **DISABLED**; SHOWN or HIDDEN both work. A higher **Max offline ticks** makes the time away play out closer to online play; see [Offline progress and Max offline ticks](/guide/m1/android-shop-and-saves#offline-progress-and-max-offline-ticks).

Only one of them works at a time, and the game picks Eternities first, then Infinities, then EP. Each has conditions, printed under its card:

- **Offline Eternities (100):** outside all Challenges and Dilation, with the Eternity Autobuyer on and set to 0 EP.
- **Offline Infinities (1,000):** outside Normal and Infinity Challenges and EC4 and EC12, with the Infinity Autobuyer on and set to time mode with 5 seconds or less.

So reaching 100 Eternities does not cost you the 6-Eternity offline EP by itself: the EP milestone stops only while one of the other two actually generates, that is while its autobuyer is set up as above.

</Callout>

<Screen
	src="late-eternity/eternity-milestones-2.webp"
	alt="The bottom of the Milestones subtab: cards for 15 to 80 Eternities, the 100 Eternities card (Unlock Eternity autobuyer; offline Eternities) and the 1,000 Eternities card (offline Infinities), their conditions, and the note that only one offline milestone is active at a time."
	caption="The last milestones and their fine print: one offline milestone at a time, Eternities first."
/>

<!-- eternity-milestones.js:25-41 (autoEP inactive when em200/em1000 rewards are > 0, i.e. their conditions are met), :150-190. In the app at 1,012,907 Eternities with both other milestones "Currently: Disabled", the 6-Eternity card still shows "Currently: 0.00 EP/min", not Inactive. -->

<Callout kind="tip">

Once the 2-Eternity milestone gives your autobuyers back, open the Autobuyers tab and make sure the **Automatic Big Crunch** box is ticked: an Eternity save can carry it switched off, and a run without it crunches only when you tap. From 5 Eternities its mode button offers "Crunch after X seconds" and "X times highest IP" — see [Upgrading autobuyers](/guide/m1/maxing-crunch-autobuyer#after-break-crunch-settings) for which to pick.

</Callout>

## The farming loop

Early on, each Eternity earns little EP, so the goal is Eternity _count_, not EP per run:

1. Eternity, buy Time Dimension 1 and your studies (or respec to your farming tree).
2. Push antimatter → crunch → push IP as far as it goes quickly.
3. Eternity again as soon as EP gain slows — do not grind a stalled run.

Once the 8-Eternity milestone removes the Break Infinity re-buy, runs get much shorter, and by 25–30 Eternities an Eternity takes a couple of minutes of mostly idle play. Around 100 Eternities the Eternity autobuyer can run this loop for you.

## When to move on

Keep farming Eternities until progress stalls even with fresh studies — usually around a few hundred Eternities and a few hundred Time Theorems. That is the point to start [Eternity Challenges](/guide/m1/unlocking-eternity-challenges), whose first studies cost 30+ TT. The walls inside (EC4/EC9–EC12) get their own [walkthrough](/guide/m1/eternity-challenge-walls). Past 1,000 Eternities every milestone is unlocked.

## Further reading

- In-game How to Play: **Eternity Milestones**.
- The [checklists](/checklists) page tracks the 100- and 1,000-Eternity goals against your save.
