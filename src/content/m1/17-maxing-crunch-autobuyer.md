---
title: 'Upgrading autobuyers and the road to Break Infinity'
stage: early-infinity
order: 13
summary: 'What interval and bulk do, the upgrade order, and how maxing the Big Crunch interval unlocks Break Infinity.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## Interval and bulk

Every autobuyer has two stats, both upgraded with IP in the Autobuyers tab:

- **Interval** — how often it fires. Lower is faster. Each upgrade ("40% smaller interval") costs IP, down to a floor of 100 ms for every autobuyer.
- **Bulk** — how much it buys per firing. Higher bulk means fewer trips to keep up with production.

Completing a Normal Challenge is what *unlocks* upgrading each autobuyer; IP is what *pays* for the upgrades. So the loop is: clear challenges → spend IP on the autobuyers they unlocked → crunch faster → earn IP faster → afford more upgrades.

Two milestones change the rules: the "Bulked Up" achievement (set every Dimension buyer to 512 per tick) makes bulk effectively unlimited, and Break Infinity later drops all normal intervals to their floor for free. Until then, upgrade deliberately.

<!-- hasUnlimitedBulk at Achievement(61): vendor/ad-source/src/core/autobuyers/antimatter-dimension-autobuyer.js -->

## What to upgrade first

1. **Dimension autobuyers (interval first, then bulk).** They do the moment-to-moment buying that every run is made of. Cheap and immediately felt.
2. **Tickspeed autobuyer.** Same logic — it fires constantly, so interval pays off fast.
3. **Dimboost/Galaxy autobuyers.** Unlock them via C10/C11, then set the Dimboost buyer to "only boost to unlock Dimensions until 4 Galaxies" early: that keeps it from over-boosting while you still need Galaxies. Leave the galaxy cap **off** — capping galaxies to ~1000 to "avoid stalling" is stale advice; uncapped with buy-max is the modern standard.
4. **Big Crunch autobuyer.** This one is special — see below.

<Screen
	src="early-infinity/autobuyers-main-0.webp"
	alt="The Autobuyers tab on a fresh-Infinity save: the Tickspeed autobuyer at 0.500 seconds and Dimension autobuyers below, each row reading Complete the challenge to upgrade interval."
	caption="The Autobuyers tab at this stage. Finishing each Normal Challenge is what unlocks upgrading that row's interval."
/>

## Maxing the Big Crunch interval

The Big Crunch autobuyer (the **Automatic Big Crunch** box) unlocks with Normal Challenge 12. Before Break it has no settings: it crunches as soon as you reach Infinity. Its interval is upgraded the same way as the others, 40% smaller per IP purchase, but it starts much slower (150 seconds). Bring it down to its floor of **100 ms** (0.1 s). That is expensive — most of your IP income for a while — but it is the single gate to the next layer: the **Break Infinity** button only activates once this interval is maxed.

<!-- big-crunch-autobuyer.js extends UpgradeableAutobuyerState; autobuyer.js upgradeInterval: interval * 0.6, hasMaxedInterval: interval <= 100; game.js: Break Infinity requires Autobuyer.bigCrunch.hasMaxedInterval -->

Practical notes:

- Buy each interval step as soon as IP allows; a faster Crunch autobuyer also means faster IP.
- Do not spend IP on the <Num value="1000" />-IP offline upgrade or big rebuyable stacks while the crunch interval still has steps left. The interval is the priority; everything else can wait.
- At 100 ms the Button in the Infinity tab's **Break** subtab lights up. Break right away (next stage's article) — intervals going free makes the whole tab cheaper in hindsight, so there is no prize for over-grinding first.

<Callout kind="warning">

Old guides describe grinding the crunch buyer "down to 0.1 s" as if the number were the goal of an era, with ~35k IP totals quoted. The mechanic is the same but the economy around it was rebalanced: just keep the interval as the top spending priority and break the moment it floors.

</Callout>

## After Break: crunch settings

Once Infinity is broken, the interval upgrade disappears and the box shows a number field that decides **when** to crunch; typing a value is free. At first the only mode is **Crunch at X IP**. The 5-Eternity milestone adds a mode button that cycles through all three:

| Mode | Crunches when | Use it for |
| ---- | ------------- | ---------- |
| **Crunch at X IP** | a crunch would give at least X IP | Right after Break. Set X to the IP you want from each crunch and raise it as your income grows. |
| **Crunch after X seconds** | the current Infinity has lasted X seconds (real time) | Many quick Infinities, e.g. a few seconds while you farm Infinities. |
| **X times highest IP** | a crunch would give X times your best IP this Eternity ("Will trigger at …" shows the target) | Pushing IP toward the next Eternity: each crunch gives at least X times your best so far. |

<!-- big-crunch-autobuyer.js willInfinity (AMOUNT/TIME/X_HIGHEST), hasAdditionalModes = EternityMilestone.bigCrunchModes (5 Eternities); BigCrunchAutobuyerBox.vue (postBreak input); Android labels from break-infinity/ and early-eternity/autobuyers-main-0.webp -->

Inside challenges the autobuyer ignores these settings and crunches as soon as the challenge goal is reached.

## Further reading

- In-game Info → How to play → "Autobuyers" and "Break Infinity".
- [Fandom Autobuyers](https://antimatter-dimensions.fandom.com/wiki/Autobuyers) (reference page, current) for the full cost tables.
