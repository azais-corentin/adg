---
title: 'Infinity Challenges, part 2'
stage: break-infinity
order: 13
summary: 'Walkthroughs for IC5 through IC8, the two hardest challenges, and finishing all eight.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## IC5 — the cost trap

**Restriction:** buying Dimensions 1–4 raises the cost of all cheaper Dimensions; buying 5–8 raises the cost of all costlier ones. **Goal:** <Num value="1e16500" /> AM. Attempt around <Num value="1e83" /> IP.

This is the run-killer. Buying in bulk — or tapping Max — inflates costs into unreachable exponents within seconds. The fix is the community's **singles setup**:

- In the Autobuyers tab, set Dimensions 1–7 and tickspeed to **buy singles**. Leave the 8th on buy-10/max.
- Keep galaxies, Dimboosts and Sacrifice (around ×2–×5) on, with no galaxy cap.
- Enter and let it run. At <Num value="1e83" />+ IP it usually finishes on its own in a few minutes.

If it stalls past ~85%: turn off the autobuyers for Dimensions 5–7, keep 1–4 on singles and 8th on max, and tap the 8th Dimension by hand with occasional tickspeed taps. A Dimboost reset also unsticks runs — your Infinity Dimensions rebuild production past the cost wall.

<Callout kind="warning">

When IC5 is done, **switch Dimensions 1–7 and tickspeed back to buy-max**. Forgetting this is the single most common post-IC stall: your normal runs will crawl because nothing buys in bulk anymore.

</Callout>

## IC6 — rising matter

**Restriction:** once you own a 2nd Dimension, a rising "matter" total divides all Dimension multipliers. **Goal:** <Num value="2e22222" /> AM. Attempt around <Num value="1e102" /> IP.

No technique — this is a race. Outgrow the divider with galaxies, Dimboosts and your IC rewards so far, and tap Max steadily. Its unlock (<Num value="1e22500" /> AM) sits almost exactly at its goal, so by the time you can enter it you can usually finish it. The reward (an Infinity Dimension multiplier from your tickspeed rate) is strong and keeps growing.

## IC7 — no galaxies

**Restriction:** Antimatter Galaxies cannot be bought; the base Dimboost multiplier rises to compensate (up to ×10). **Goal:** <Num value="1e10000" /> AM. Attempt around <Num value="1e114" /> IP.

Dimboosts are your galaxies here. Push Dimboosts hard — the boosted multiplier plus your accumulated IC stack carries the run. The reward raises the Dimboost multiplier floor to ×4 permanently, which speeds up every future run including Eternity pushes.

## IC8 — decaying production

**Restriction:** production starts at 100% after every purchase and then drops fast toward zero. **Goal:** <Num value="1e27000" /> AM. Attempt around <Num value="1e129" /> IP.

The counter is constant buying: every purchase resets production to full, so purchases every fraction of a second pin it near 100%.

- Set **everything** — Dimensions 1–8 and tickspeed — to buy-max at the fastest interval, galaxies and Dimboosts on, Sacrifice on.
- Tap the Max button in steady bursts through the run.
- Double-check the IC5 warning above first: leftover singles settings will stall this challenge completely.

At the recommended IP it finishes in under a minute.

## After all eight

Eight completions stack to about ×8.2 on every Infinity Dimension, and the unique rewards (Sacrifice autobuyer, ^1.05 exponents, stronger galaxies, ×4 Dimboost floor) compound across all future runs. That stack is what unlocks ID5–ID8 and carries you to <Num value="1e140" /> IP — the Replicanti unlock.

Two things to know going forward:

- **Within this stage, ICs are one-time.** Re-entering a finished IC just replays it; the reward does not stack twice.
- **Later prestiges replay them free.** Eternity milestones eventually auto-complete Normal and Infinity Challenges at the start of each run, so this is the only time you solve them by hand. <!-- src/core/secret-formula/eternity/eternity-milestones.js (7- and 100-eternity milestone rewards) -->

<Callout kind="tip">

If one IC resists at the recommended level, skip it and push IP instead. The challenges multiply each other (each ×1.3 helps the next), but raw IP multipliers help more — two crunches outside are worth more than ten retries inside.

</Callout>

<Screen
	src="break-infinity/challenges-infinity-1.webp"
	alt="A finished Infinity Challenge card: the green Completed badge, the 1e650 antimatter goal, the ×1.30-on-Infinity-Dimensions reward and the running ×1.30 total."
	caption="A completed IC card. The green badge, goal and stacked ×1.3 total are all on the card — the restriction text above it is the whole ruleset."
/>

Further reading:

- In-game How to Play → Infinity Challenges (matches your installed build exactly)
- r/AntimatterDimensions threads on IC5 singles setups (2024–2025) and the IC5 Steam mini-guide by Drip — all post-Reality
- Ninjatsu's Eternity/EC sheet lineage for what the IC stack enables next
