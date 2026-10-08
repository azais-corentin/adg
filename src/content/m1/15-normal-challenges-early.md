---
title: 'Normal Challenges 1 to 9'
stage: early-infinity
order: 11
summary: 'What each of the first nine challenges changes, the order to clear them, and the C3 and C9 tactics.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## How challenges work

The Challenges tab (triangle icon) offers **Normal Challenges**. Entering one starts a fresh Infinity run under a restriction — weaker Dimensions, stranger costs, missing Boosts — and completing it (reaching <Num value="1.80e308" /> antimatter inside) grants its reward permanently. Challenges 1–9 are open as soon as you have crunched once; 10–12 stay locked until 16 Infinities.

<!-- goals 1.80e308; NC10-12 lockedAt 16 Infinities: src/lib/data/generated/challenges.json -->

Every challenge reward unlocks or improves an autobuyer, so challenges are not optional content — they are how your automation grows. You can retry freely, and leaving a challenge keeps nothing but costs nothing either. If the Big Crunch autobuyer is on when you enter, it will crunch for you the moment you hit the goal.

<Screen
	src="early-eternity/challenges-normal-0.webp"
	alt="The Challenges tab Normal subtab: challenge cards C1 to C4 with restriction text, Completed buttons and reward lines."
	caption="Normal Challenges. Each card states its restriction and its autobuyer reward."
/>

## The nine, in suggested order

| # | Restriction | Reward | Notes |
| - | ----------- | ------ | ----- |
| C1 | none beyond a fresh run | 1st Dimension autobuyer upgrades | Do it first; it is nearly a normal run |
| C2 | buying anything halts production for 3 min (recovering gradually) | 2nd Dimension autobuyer upgrades | Buy rarely and in bulk; then wait |
| C3 | 1st Dimension weakened, gains an exponential multiplier that resets on Boost/Galaxy | 3rd Dimension autobuyer upgrades | Boost/Galaxy often — the multiplier resets anyway, so spend it |
| C4 | buying a Dimension erases all lower tiers | 4th Dimension autobuyer upgrades | Buy top-down (high tiers first) so wipes destroy little |
| C5 | Tickspeed multiplier starts at ×1.080 not ×1.125 | 5th Dimension autobuyer upgrades | Noticeably slower Tickspeed; lean on Dimensions |
| C6 | Dimensions cost the Dimension 2 tiers below instead of antimatter | 6th Dimension autobuyer upgrades | Odd economy; keep lower tiers stocked as currency |
| C7 | buy-10 multiplier reduced (recovers with Boosts) | 7th Dimension autobuyer upgrades | Boost early and often — each Boost restores part of the multiplier |
| C8 | no Boost multiplier, no Galaxies; Sacrifice resets everything but hits much harder | 8th Dimension autobuyer upgrades | Sacrifice constantly, even at small multipliers — it is your only engine |
| C9 | Tickspeed/dim buys raise the cost of everything else of equal price | Tickspeed autobuyer upgrades | The hardest of the nine — see below |

<!-- descriptions: src/lib/data/generated/challenges.json (normal) -->

Do them roughly in numeric order: earlier numbers are gentler, and each autobuyer you unlock speeds the next attempt. C1–C3 are an evening's work with a few Infinities behind you; C4–C8 each want a little more IP and patience.

## C3 and C9 tactics

**C3** looks scary (your main producer crippled) but the replacement multiplier grows fast. The mistake is playing it like a normal run: instead, Boost and Galaxy aggressively. Resets that would waste progress elsewhere are free here because the bonus resets anyway — convert it into permanent Boosts before it evaporates.

**C9** is the wall of this set. Every purchase drags all same-cost purchases up with it, so the usual Max-everything habit bleeds value. Buy manually and in narrow focus: push one Dimension at a time, buy Tickspeed in small batches, and accept a slower run. If it feels impossible, leave it, grind more IP and Infinities, and come back — C9 after Break Infinity (or with the buy-max setup from the later guide) is a different fight.

<Callout kind="warning">

Ignore any guide telling you to set numeric autobuyer priorities for C9. Priorities were removed from the game before the Reality update — modern C9 is balanced for manual or standard-autobuyer play.

</Callout>

## Further reading

- In-game Info → How to play → "Normal Challenges".
- [The Challenges tab, Infinity subtab](/guide/m1/normal-challenges-late), for C10–C12 once they unlock.
