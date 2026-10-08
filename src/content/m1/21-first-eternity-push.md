---
title: To the first Eternity
stage: replicanti
order: 21
summary: The final push to 1.79e308 IP — last Infinity Dimensions, late Replicanti Galaxies, and the Eternity button.
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

## The goal

Eternity unlocks when a single run's peak reaches <Num value="1.79e308" /> IP — the same digits-of-Infinity figure as the first Big Crunch, one layer up. The Eternity button appears above the tab bar (its purple hourglass joins the floating prestige row) and the top box of the Break subtab starts counting down to it. <!-- src/core/player.js:949-951 (`canEternity`), src/game.js:156-159 (`requiredIPForEP`, floor of 1.79e308 IP) -->

<Screen
	src="early-eternity/infinity-break-0.webp"
	alt="Top of the Break subtab showing the Eternity gain box with the next-EP threshold and the IP gain box."
	caption="The top of the Break subtab near Eternity: the purple box tracks progress to the next EP."
/>

From the Replicanti unlock at <Num value="1e140" /> IP this takes a while — the community's longest Infinity stretch, on the order of days. The shape of it:

| Phase | IP range | What carries you |
| --- | --- | --- |
| Early galaxies | <Num value="1e140" />–<Num value="1e170" /> | First galaxies, ID5 |
| Mid ICs | <Num value="1e170" />–<Num value="1e250" /> | IC6–IC7 rewards, ID6–ID7 |
| Late push | <Num value="1e250" />–<Num value="1.79e308" /> | IC8 reward, ID8, galaxy cap growth |

## The final Infinity Dimensions

ID5 (<Num value="1e140" /> IP) arrives with Replicanti itself. ID6 (<Num value="1e200" />), ID7 (<Num value="1e250" />) and ID8 (<Num value="1e280" />) each need their antimatter thresholds too (<Num value="1e45000" />, <Num value="1e54000" />, <Num value="1e60000" /> AM), so every tier is a two-sided push: antimatter for the unlock, IP for the purchase. <!-- src/core/dimensions/infinity-dimension.js:41-57 -->

Practical order per tier: push antimatter with galaxies until the threshold, buy the tier, crunch for the IP multiplier, repeat. The ×1.3-per-IC stack from part 1–2 of the challenges article matters more than ever here — if a tier feels out of reach, a missing IC completion is usually worth more than another day of grinding.

## Late Replicanti Galaxies

In the late push your galaxy count does triple duty: each galaxy boosts production ~×10, feeds the galaxy-based IC rewards, and raises the antimatter peak that sets your IP payout. Keep the Max Galaxies upgrade within one or two of affordable at all times — a capped galaxy count while IP piles up is the main avoidable stall of this phase.

Two milestones to look forward to, not to chase: later Eternity milestones unlock the Replicanti upgrade autobuyers and eventually start you with Replicanti free. They make the *second* run through this stretch nearly automatic. <!-- src/core/secret-formula/eternity/eternity-milestones.js:60-65,128-147 -->

## The Eternity itself

When the button lights up:

1. **Spend everything first.** Buy all remaining Break upgrades, ID levels and replicanti upgrades — nothing carries over except the permanent unlocks, so unspent IP is wasted.
2. **Tap Eternity.** Everything from Infinity down resets. You gain your first Eternity Points and the Eternity tab (hourglass icon) opens with Time Studies, Eternity Upgrades and Milestones.
3. **Expect slowness.** The first few Eternities each take a while; milestones at 2, 4, 8 and 10 Eternities hand back autobuyers, upgrades and Replicanti quickly. That is the next stage's guide.

<Callout kind="tip">

Do not Eternity the instant it unlocks if a big purchase is minutes away — one more ID tier or galaxy cap level can halve the early-Eternity grind. But do not over-optimize either: the milestone rewards arrive fast, and each one retroactively speeds everything.

</Callout>

<Callout kind="warning">

The Eternity button sits next to B.Crunch above the tab bar on every tab. Double-check the label before tapping during the final push — an accidental crunch at <Num value="1e300" /> IP just costs time, but it stings.

</Callout>

Further reading:

- In-game How to Play → Eternity (read it the moment the tab opens — it describes exactly what reset and what didn't)
- The early-eternity articles in this guide for what the milestones give back

<Checklist stage="replicanti" />
