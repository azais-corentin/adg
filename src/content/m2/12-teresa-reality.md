---
title: 'Teresa''s Reality'
stage: teresa
order: 12
summary: 'The restrictions inside Teresa''s Reality, a setup that clears it, and how the sacrifice reward scales.'
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

## Entering

The **Start Teresa's Reality** panel sits at the bottom of the Teresa tab once you have poured <Num value="1e14" /> RM. The run ends with a normal Reality: push to <Num value="1e4000" /> EP and press the Reality button. Attempt it when your regular Realities reach that EP comfortably, since the penalties below slow everything down.

## The restrictions

The panel lists them, and they stay for the whole run. It sits at the bottom of the Teresa tab, under the unlock list, with your last-run antimatter and the equipped glyph set recorded underneath:

<Screen
	src="teresa/celestials-teresa-1.webp"
	alt="The Start Teresa's Reality panel: its restriction text, the last-run record, and the equipped glyph set shown underneath."
	caption="The Reality panel records your best antimatter and glyph set, so repeats only need to beat the previous total."
/>

- Glyph Time Theorem generation is disabled.
- Infinity Point and Eternity Point gain are raised to the power <Num value="0.55" /> — each is roughly square-rooted.
- Several upgrades that multiply total IP are disabled inside the run. <!-- vendor/ad-source/src/core/secret-formula/infinity/infinity-upgrades.js: "Disabled in this reality" when Teresa.isRunning -->

Plan around the EP penalty: your Time Studies cost the same but your EP income is much lower, so bring a study route that reaches Dilation cheaply and lean on Replicanti and Time Dimensions rather than raw EP multipliers.

## A setup that clears it

- **Glyphs:** favour Replication (speed and multiplier power) and Time (Time Dimension power, EP multiplier). Leave Dilation Glyphs out — their Theorem generation does nothing here.
- **Studies:** the Idle path with the cheap Dilation shortcut (studies 193 → 214 → 228 → 234) gets Dilation online early without waiting for the full tree. Finish the Eternity Challenges you can, since each completion still pays out.
- **Execution:** unlock Dilation as soon as you can afford it, then let Replicanti and Time Dimensions carry the run to <Num value="1e4000" /> EP. Progress often slows near the end; that is normal.

<Callout kind="android">

Long-press a study to buy the shortest route to it. Inside a slow run like this, that saves a lot of tapping compared to buying each study by hand.

</Callout>

## The reward

Completing the run multiplies your **Glyph Sacrifice** — the permanent bonus from sacrificed Glyphs — based on the most antimatter you held during the run:

> sacrifice multiplier = (log10(antimatter + 1) / <Num value="1.5e8" />)<sup>12</sup>, at least <Num value="1" />

<!-- vendor/ad-source/src/core/celestials/teresa.js: rewardMultiplier(antimatter) = max(((log10(am+1))/1.5e8)^12, 1) -->

The tab shows your current multiplier and your best antimatter. Re-entering and beating your best antimatter raises it, so repeat the run whenever your glyphs and RM economy jump — each repeat only needs to beat the previous antimatter total, not to be fast.

## When to move on

One clear is enough to continue: the sacrifice multiplier starts working immediately. Keep pouring toward <Num value="1e21" /> (shop) and <Num value="1e24" /> (Effarig), and schedule repeat clears when your normal runs produce noticeably more antimatter than your best Teresa run did.

<Checklist stage="teresa" />

## Further reading

- [Fandom Teresa page](https://antimatter-dimensions.fandom.com/wiki/Teresa) — reward formula reference
- [Tables61 glyph guide](https://www.reddit.com/r/AntimatterDimensions/comments/101lby4/) — which glyph effects to bring
