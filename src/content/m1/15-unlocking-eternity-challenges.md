---
title: 'Unlocking Eternity Challenges'
stage: eternity-challenges
order: 10
summary: 'How EC studies, secondary requirements and the 5-completion track work, and which early challenges to open first.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## What an Eternity Challenge is

Eternity Challenges are 12 special runs, listed in the **Eternity** subtab of the Challenges tab. Each one disables or warps part of the game — Time Dimensions off, Infinity Dimensions off, no galaxies — and sets an antimatter or IP goal. Reaching the goal finishes the run and grants part of that challenge's reward.

Every challenge can be completed **up to 5 times**. Each completion raises the goal and strengthens the reward. Completions survive every Eternity with no need to keep the study bought; the Challenges tab says "The rewards are applied permanently with no need to have the respective EC Time Study purchased." Only a Reality sets them back to 0 (see [Your first Reality](/guide/m1/first-reality)). The tab shows each challenge's goal span, current reward and completion count.

<!-- secret-formula/challenges/eternity-challenges.js; src/core/eternity-challenge.js: maxCompletions -->

<Screen
	src="eternity-challenges/challenges-eternity-1.webp"
	alt="The Eternity subtab of the Challenges tab at this stage: EC3 through EC6 cards with restrictions, goals, rewards and completed counts, plus the no-need-to-keep-study note above."
	caption="The Challenges tab's Eternity subtab. Each card shows its rule, goal span and reward; completions stack to five."
/>

## Unlocking one

Each challenge is unlocked by buying its **EC study** in the Time Study tree. An EC study has two costs:

1. **Time Theorems** — 30 TT for EC1, rising to 550 TT for EC10. (EC11 and EC12 studies cost 1 TT but sit behind the expensive row-23 studies.)
2. **A secondary requirement** — a resource threshold that grows with completions. The first EC1 study needs 20,000 Eternities; EC4's needs <Num value="100000000" /> Infinities; EC5's needs 160 Antimatter Galaxies; EC10's needs <Num value="1e100" /> EP. The study box shows both.

Meeting the secondary requirement is remembered until you **complete** that challenge. As the Eternity subtab of the Challenges tab puts it: "When you respec out of an unlocked Eternity Challenge, you don't need to redo the secondary requirement in order to unlock it again until you complete it; only the Time Theorems are required." So you can buy the study, respec to a different tree, and buy the study again later for its TT alone. Each completion clears that memory, and the next tier's secondary requirement has to be met again.

<!-- secret-formula/eternity/time-studies/ec-time-studies.js; src/core/time-studies/ec-time-study.js:38,122 (requirementBits); src/core/eternity.js:29 (cleared on completion); EternityChallengesTab.vue:107-110 -->

EC studies also need a normal study as a stepping stone: EC1–EC3 studies connect to study 171, EC4's to 143, EC5's to 42, EC6's to 121, EC7's to 111, EC8's to 123, EC9's to 151 and EC10's to 181. So the tree you run to _unlock_ a challenge is not always the tree you run _inside_ it — buy the study, then respec to the run tree. The planner gives every EC3 step and EC7 from ×2 a separate unlock tree on the Time Dimension path, where 8th Antimatter Dimensions and antimatter grow faster than on the run's path.

To enter, tap the challenge's box in the Challenges tab. Leaving or finishing a challenge refunds your study tree automatically (a respec on exit), so you always rebuild fresh afterward.

## Completions ×5

Each completion raises the goal by a fixed step (EC1's goal grows <Num value="1e1800" /> → <Num value="1e2000" /> → … per completion) and some challenges tighten a restriction instead: EC4 must finish in fewer and fewer Infinities — the last completion allows **zero** — and EC12 must finish in less and less game time.

<!-- secret-formula/challenges/eternity-challenges.js: goals, restrictions -->

You do **not** clear challenges linearly — EC1×1 through ×5, then EC2. Rewards from one challenge unlock the next, so completions interleave. The full step-by-step sequence lives in the [Eternity Challenge planner](/tools/eternity-challenges); follow it rather than a flat list.

## Where to start

The first studies open up around 130–150 TT with study 171 bought:

1. **EC1×1** (30 TT + 20,000 Eternities). Time Dimensions do nothing inside, so run Infinity Dimensions with an Active tree.
2. **EC2×1** (35 TT + tickspeed upgrades from Time Dimensions). Infinity Dimensions are off — Time Dimensions carry the run.
3. **EC1×2, EC3×1** — EC3 disables upper Antimatter Dimensions and Sacrifice; run it on the Antimatter path.

Each completion's reward is small at first but they stack across all 60 completions into the multipliers that carry the rest of the game. If a study's secondary requirement looks far away (Eternities, galaxies, EP), farm it outside the challenge first — the planner's TT numbers assume the secondary is already met.

<Callout kind="tip">

Stuck on a secondary? Most of them are farmed, not pushed: Eternities come from the [milestone loop](/guide/m1/eternity-milestones), galaxies from a long idle run, EP from theorems → studies → faster runs. EC7's antimatter needs one long Infinity: turn off **Automatic Big Crunch** (Autobuyers tab), because a Big Crunch resets antimatter. Switch goals for a day rather than forcing the challenge.

</Callout>

## Further reading

- In-game How to Play: **Eternity Challenges**.
- The community [EC spreadsheet and picturemap](https://docs.google.com/spreadsheets/d/1NrYADsW4s7wRYTE91Z0EFHbXcHaswuuMzG9a2WyGG0A/) — the order chart every current guide follows.
- Ninjatsu's Steam guide [Eternity + Eternity Challenges](https://steamcommunity.com/sharedfiles/filedetails/?id=2909710573).
