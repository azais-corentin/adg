---
title: 'Infinity Challenges, part 1'
stage: break-infinity
order: 12
summary: 'How Infinity Challenges work, and walkthroughs for IC1 through IC4.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## How Infinity Challenges work

Infinity Challenges live in the **Challenges tab** (triangle icon), on the **Infinity** subtab. Each one is a run with a special restriction, a goal antimatter amount, and a reward that every Big Crunch keeps (an Eternity clears it, until the 7-Eternity milestone completes the challenges as soon as you unlock them). Entering one starts a fresh Infinity run under its rule; leaving or finishing returns you to normal play. **Entering any IC breaks Infinity for you automatically if you haven't already.** <!-- src/core/infinity-challenges.js:57; eternity.js initializeChallengeCompletions -->

Every completion adds a stacking **×1.3 multiplier to all Infinity Dimensions** — eight completions is about ×8.2 total, which is why the later IDs depend on them. Several ICs add a second, unique reward on top. <!-- src/core/secret-formula/challenges/infinity-challenges.js -->

Each IC also has an **unlock threshold**: it only appears once your peak antimatter this Eternity reaches that number, which is at or well above its goal. The Infinity subtab names the next one ("Next Infinity Challenge unlocks at …"). The intended flow is to unlock it while pushing, crunch a few times to grow stronger, then come back and beat it.

| IC  | Unlocks at                 | Goal                       | Unique reward                                |
| --- | -------------------------- | -------------------------- | -------------------------------------------- |
| IC1 | <Num value="1e2000" /> AM  | <Num value="1e650" /> AM   | — (only the ×1.3)                            |
| IC2 | <Num value="1e10500" /> AM | <Num value="1e10500" /> AM | Sacrifice autobuyer + stronger Sacrifice     |
| IC3 | <Num value="1e12000" /> AM | <Num value="1e5000" /> AM  | AD multiplier from galaxies + tickspeed buys |
| IC4 | <Num value="1e14000" /> AM | <Num value="1e13000" /> AM | All AD multipliers raised to ^1.05           |
| IC5 | <Num value="1e18000" /> AM | <Num value="1e16500" /> AM | Galaxies 10% stronger, galaxy/boost needs −1 |
| IC6 | <Num value="1e22500" /> AM | <Num value="2e22222" /> AM | ID multiplier from tickspeed rate            |
| IC7 | <Num value="1e23000" /> AM | <Num value="1e10000" /> AM | Dimboost multiplier minimum ×4               |
| IC8 | <Num value="1e28000" /> AM | <Num value="1e27000" /> AM | AD2–7 multiplier from AD1+AD8                |

<!-- Goals and rewards from src/core/secret-formula/challenges/infinity-challenges.js:1-133. Unlock thresholds read in Android 3.18.0 ("Next Infinity Challenge unlocks at …" with the break-infinity save's peak antimatter set to each threshold): all match upstream except IC2, which Android unlocks at 1e10,500 (upstream pin: 1e11000). Community-tested IP levels from Tables61's stuck-post and r/AD threads (see part 2's reading list). -->

<Screen
	src="break-infinity/challenges-infinity-0.webp"
	alt="The Infinity subtab of the Challenges tab at this stage: Automatically retry challenges ON, Next Infinity Challenge unlocks at 1e10,500 antimatter, the Big Crunch autobuyer note, and the IC1 card with its all-Normal-Challenges restriction, 1e650 goal and ×1.30 reward."
	caption="The Infinity Challenges list. The top names the next unlock; each card shows its restriction, goal and reward."
/>

**Automatically retry challenges** (the button at the top, ON in this save) decides what happens when you complete a challenge: ON restarts the same challenge right away, OFF returns you to normal play. Turn it off before finishing an IC unless you want to run it again.

<!-- big-crunch.js:21-24 (retryChallenge keeps the challenge running after completion) -->

<Callout kind="android">

On Android there are no hotkeys: the PC guides' "hold M" is the floating **Max** button, and "hold 8" is repeated taps on the 8th Dimension. The **Autobuyers tab** (gears icon) holds every toggle the strategies below mention — intervals are already at minimum from breaking, so you only switch buy modes.

</Callout>

## Recommended order

Do them roughly in numeric order, but **wait for the IP level listed**, not the unlock moment. Attempting an IC the instant it appears is the classic way to stall for an hour:

| IC                                  | Attempt around                               | Why the wait                      |
| ----------------------------------- | -------------------------------------------- | --------------------------------- |
| IC1                                 | <Num value="5e11" /> IP + ID2                | Needs the galaxy-strength upgrade |
| IC2                                 | <Num value="1e45" /> IP + ID4                | A pure stat check                 |
| IC3                                 | <Num value="1e56" />–<Num value="1e60" /> IP | Needs ID depth                    |
| IC4                                 | <Num value="1e68" />–<Num value="1e80" /> IP | Needs manual-buy technique below  |
| <span class="nowrap">IC5–IC8</span> | see part 2                                   | Harder mechanics, later economy   |

## IC1 — everything at once

**Restriction:** all Normal Challenge restrictions except C9 (tickspeed) and C12 (Big Crunch) apply simultaneously. **Goal:** <Num value="1e650" /> AM.

This looks terrifying and is actually gentle, because the goal is far below what your normal runs reach. Requirements: the <Num value="5e11" /> IP galaxy upgrade and ID2 bought.

- Enter with autobuyers on. Buying halts production briefly (the C2 restriction), so **tap Max in bursts** rather than holding it: buy, wait a few seconds for production to recover, buy again.
- Push Dimboosts as far as they go and let the Infinity Dimensions carry you. It should finish in minutes.
- If it drags, leave, crunch twice for more IP multipliers, and retry. Never grind inside IC1 — outside progress is faster.

## IC2 — auto-sacrifice

**Restriction:** Dimensional Sacrifice triggers by itself every 400 ms once you own an 8th Dimension. **Goal:** <Num value="1e10500" /> AM.

Wait for about <Num value="1e45" /> IP and ID4. There is no puzzle here: the auto-sacrifice that sounds scary is a mild tax once your multipliers are large, and the reward (a Sacrifice autobuyer plus a permanently stronger Sacrifice formula) pays for the effort immediately.

- Turn everything on — Dimensions, tickspeed, Dimboosts, galaxies — and tap Max steadily.
- Set the new Sacrifice autobuyer to trigger around ×2 once you own it.

## IC3 — tickspeed becomes a multiplier

**Restriction:** tickspeed upgrades stay ×1; instead, each tickspeed purchase adds a flat multiplier to all Dimensions that grows with your galaxy count. **Goal:** <Num value="1e5000" /> AM.

Play it like a normal run that happens to buy a lot of tickspeed: galaxies first, then alternate tickspeed and Dimensions. Attempt around <Num value="1e56" />–<Num value="1e60" /> IP; it is mostly a stat check with no special technique.

## IC4 — only the newest dimension works

**Restriction:** only the most recently bought Dimension produces at full power; every other tier is raised to ^0.25. **Goal:** <Num value="1e13000" /> AM.

This one needs a technique. Buying from the top down (8th first, then 7th, down to 1st) keeps the damage small, because each new purchase nerfs the tiers you already bought the least — the fresh 1st Dimension does the real work:

- Set Dimension autobuyers to buy singles, or buy by hand from the 8th down to the 1st, then tickspeed, and repeat.
- Galaxies and Dimboosts stay on; the reward (all multipliers ^1.05) is worth the fiddling.
- Attempt around <Num value="1e68" />–<Num value="1e80" /> IP. If your 1st Dimension stalls, crunch out, grow, retry.

Part 2 covers IC5–IC8 — including the two challenges that genuinely deserve their reputation — plus what changes about ICs once you reach Eternity.

Further reading:

- In-game How to Play → Infinity Challenges (matches your installed build exactly)
- Tables61, "Common places players get stuck" (r/AntimatterDimensions sticky) — the IC order and IP levels
