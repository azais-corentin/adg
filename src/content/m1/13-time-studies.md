---
title: 'Time Studies'
stage: early-eternity
order: 13
summary: 'The dimension and pace paths of the study tree, the active/passive/idle choice, study import strings, and how to plan a tree.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## The tree

The **Studies** subtab of the Eternity tab shows the Time Study tree: rows of numbered boxes connected by lines. Each box costs Time Theorems, and you can only buy a study connected to one you already own. Tap a study to buy it; a dialog shows its effect and cost. There is also **Respec**: wiping the whole tree and refunding every TT, so you can rebuild for a different goal. The Eternity Challenges tab refunds your tree automatically when you leave a challenge, so experimenting is free.

<Screen
	src="early-eternity/eternity-studies-0.webp"
	alt="The top of the Studies subtab: a Buy max Theorems button and Time Theorem counts, a study loadout selector, the import and export buttons, a respec button, and the Time Study presets row."
	caption="The top of the Studies subtab: theorem counts, loadouts, import/export, respec — and presets below."
/>

<Screen
	src="early-eternity/eternity-studies-1.webp"
	alt="The study tree: study 11 at the top, rows for studies 21 to 62 below, EC study boxes on the right edge, and the prestige buttons above the tab bar."
	caption="The tree itself. Tap a study to buy it; hold a study to buy every study up to that point."
/>

<Callout kind="android">

On Android, **touch and hold a study to buy every study up to that point** along the shortest route — the header says so right above the tree. On a phone this is the main way to fill in a tree: hold the deepest study you want instead of tapping each box. Pinch-zoom with two fingers when the tree gets wide.

</Callout>

## The two splits

Two rows of the tree force a choice between exclusive branches.

**The Dimension Split (studies 71/72/73).** Each makes Dimensional Sacrifice boost a different tier: 71 affects all other Antimatter Dimensions, 72 the 4th Infinity Dimension, 73 the 3rd Time Dimension. You can only walk one branch at a time (a later study allows a second). Rule of thumb: take the **Time Dimension branch (73)** once you can also afford study 171 behind it — before that, the Antimatter branch (71) is cheaper and better. Do not take the TD split the moment it unlocks without 171.

<!-- secret-formula/eternity/time-studies/normal-time-studies.js: 71/72/73, 171 -->

**The Pace Split (studies 121/122/123).** Each boosts Eternity Points for a different play style: 121 Active (fast Eternities), 122 Passive (long idle runs), 123 Idle (offline). **Active is the default for pushing and for Eternity Challenges** — it rewards short Eternity times, which is what farming runs look like. Passive is a trap outside a narrow band: it only wins if your runs genuinely last a long time. Idle is for overnight runs and a few specific challenges.

The rows behind each pace study deepen the same choice (131/132/133, 141/142/143), so switching pace means respeccing that whole column.

## What to buy first

A new tree starts at study 11 (1 TT) and grows downward. The cheap early backbone — 11 → 21/22 → 31/32 → 41/42 → 51 → 61/62 — is all strong and worth buying in roughly that order. Then:

- Study 111 (12 TT) improves the whole IP formula — a big early jump.
- 121/122/123 picks your pace (Active, unless you know why not).
- 151 (8 TT) multiplies all Time Dimensions by 10,000.
- 161/162 (7 TT each) are huge flat multipliers to Antimatter and Infinity Dimensions.
- 171 (15 TT) slows Tickspeed cost growth — required for the first EC studies.

Study 181 (200 TT) generates a share of your per-crunch IP every second and marks the transition into the Eternity Challenge era.

## Import strings and presets

The row of buttons under the tree header imports and exports trees as text. An export looks like a list of study numbers separated by commas, then `|` and the Eternity Challenge number, for example `11,22,32,...|0` for no EC. **Import** pastes such a string and buys everything it can afford in order, skipping what the tree rules forbid. This is how other players share trees: copy the string, tap Import, paste, confirm.

<!-- src/core/time-studies/time-study-tree.js: exportString/import -->

The **Time Study presets** row holds a few built-in trees you can load directly. They are a fine starting point, but a tree tuned to your own TT count beats them — which is what the planner below is for.

## Plan your tree

Do not copy a fixed tree from an old guide: the right tree depends on exactly how many TT you have. Use the **[Time Study planner](/tools/time-studies)**: enter your TT, pick a goal (pushing, farming, or a specific Eternity Challenge), and it suggests a tree you can export as an import string and paste into the game.

## Further reading

- In-game How to Play: **Time Studies** and **Eternity Challenges**.
- The [Eternity Challenge planner](/tools/eternity-challenges) suggests a tree per challenge step.
