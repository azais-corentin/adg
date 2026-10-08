---
title: 'Eternity Challenge walls'
stage: eternity-challenges
order: 11
summary: 'How to approach EC4, EC9, EC10, EC11 and EC12 — the five challenges that stop most runs — and what finishes the stage.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Checklist from '#lib/components/Checklist.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## General approach

Every hard EC completion is solved the same way: stop pushing the challenge and grow the economy around it. More TT for a deeper tree, more completions elsewhere for their rewards, a higher EP multiplier, study 181's per-second IP — then come back. The [Eternity Challenge planner](/tools/eternity-challenges) encodes this as a full 60-step order with TT targets and a suggested tree per step; check the next step there before forcing a wall.

<Screen
	src="eternity-challenges/challenges-eternity-2.webp"
	alt="Mid-list EC cards at this stage: EC5 and EC6 at 3 completions with galaxy and cost rewards, EC7 and EC8 below with their dimension-swap restrictions."
	caption="Mid-list EC cards with completion counts. Each card's restriction is the whole ruleset — match the study tree to the half that still works."
/>

<Callout kind="warning">

Do not clear each challenge 1→5 in a row. That linear order hard-walls around EC4/EC5 because the rewards you skipped were the multipliers needed to pass them. Follow the interleaved order in the planner.

</Callout>

## The five walls

**EC4 — no Infinity path.** All Infinity multipliers and generators are off, and each completion allows fewer total Infinities (16 → 12 → 8 → 4 → 0). The last completion must reach <Num value="1e4950" /> antimatter without crunching at all. Bank progress first: the study needs up to <Num value="2e8" /> total Infinities, and the run wants a deep Antimatter-path tree. The zero-Infinity run is mostly waiting on one long push — set it going and leave the phone alone.

<!-- secret-formula/challenges/eternity-challenges.js: EC4 goals/restriction -->

**EC9 — no Tickspeed.** You cannot buy Tickspeed upgrades; Infinity Power multiplies Time Dimensions instead, at reduced effect. The run is driven by Time Shards, so it is slow by nature — the later completions need up to <Num value="1e25500" /> Infinity Power for the study and long shard build-ups inside. Take the Time Dimension path with Active pace, and expect the last two completions to take a day or more of mostly idle play each.

**EC10 — only Antimatter Dimensions.** Time and Infinity Dimensions are both off; instead, total Infinities boost Antimatter Dimensions enormously (to the power of 950). The study needs TS181 and up to <Num value="1e180" /> EP. Farm Banked Infinities first — tens of millions for the late completions — and run the Antimatter path with Active pace. EC10's own reward (Time Dimensions from Infinities) then powers the rest of the game, and its completions unlock studies 191+ below 181.

**EC11 — almost no multipliers.** All Dimension multipliers and powers are off except Infinity Power and Dimension Boosts to Antimatter Dimensions, with a tiny <Num value="1e450" /> goal that still takes a while. Its study costs only 1 TT but needs a row-23 study (231/232) and forbids the Infinity/Time Dimension paths — run Antimatter path only. Early completions use Active; the last two take 30 minutes to 2 hours each, so switch to Idle. Its reward (cheaper Tickspeed growth) is permanent and huge.

<!-- ec-time-studies.js: EC11/EC12 path secondaries -->

**EC12 — the game at 1/1000 speed.** Everything runs a thousand times slower with a shrinking time limit (1 second of game time down to a tenth). The goal is enormous (<Num value="1e110000" /> antimatter, growing <Num value="1e12000" /> per completion). Keep the Eternity autobuyer on for every EC12 run, bank hundreds of millions of Banked Infinities for the late ones, and run the Time Dimension path on Passive. This is the longest single challenge in the stage — finishing it ×5 alongside EC11×5 unlocks Time Dilation.

## Finishing the stage

Once EC11 and EC12 are each complete 5 times, and you own a row-23 study (231–234) with enough lifetime Time Theorems, the Dilation study (5,000 TT) unlocks in the tree. That is the gate to Time Dilation, the next stage — see the checklist below and the planner's final steps.

<Checklist stage="eternity-challenges" />

## Further reading

- The [Eternity Challenge planner](/tools/eternity-challenges) — the full 60-step order with trees.
- In-game How to Play: **Eternity Challenges** and **Time Dilation** (for what comes next).
