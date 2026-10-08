---
title: 'Replicanti'
stage: replicanti
order: 20
summary: 'Unlocking Replicanti for 1e140 IP, growing them, and tuning the chance, interval and galaxy upgrades.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## Unlocking Replicanti

Replicanti unlock on the **Infinity tab's Replicanti subtab** for a one-time payment of <Num value="1e140" /> IP. The button appears once you can nearly afford it; tapping it starts you with 1 Replicanti. (On later Eternities a milestone hands you Replicanti unlocked from the start — first time through, you pay.) <!-- src/core/replicanti.js:517-528 (`Replicanti.unlock`, cost 1e140 IP) -->

<Screen
	src="replicanti/infinity-replicanti-top.webp"
	alt="The Replicanti subtab at this stage: 1.47e129 Replicanti boosting IDs by ×1.84e5, Chance 12%, Interval 167 ms, Max RGs 5, one Replicanti Galaxy, and the galaxy countdown."
	caption="The Replicanti subtab mid-growth. Chance, Interval and Max Galaxies across the top; the galaxy button and countdown below."
/>

Replicanti are a self-copying currency. Each tick (each "replication interval") every Replicanti has a chance to copy itself, so the total grows exponentially — slowly at first, then explosively. Two numbers control the growth, and a third controls what the growth buys:

| Upgrade | Starts at | First cost | Effect |
| --- | --- | --- | --- |
| Chance | 1% | <Num value="1e150" /> IP | Each level adds 1 percentage point, up to 100% |
| Interval | 1000 ms | <Num value="1e140" /> IP | Each level shrinks the tick 10%, down to a 50 ms floor |
| Max Replicanti Galaxies | 0 | <Num value="1e170" /> IP | Each level raises the cap on Replicanti Galaxies by 1 |

<!-- src/core/replicanti.js:505-514 (initial chance/interval/costs), :326-404 (chance +1%/level capped at 100%, interval ×0.9 floored at 50ms), :412-436 (galaxy cap upgrade) -->

Every purchase also inflates that upgrade's next price enormously (×1e15 for chance, ×1e10 for interval, and steeply rising for galaxies), so costs run away fast — level the cheap one first and alternate as prices cross.

## What Replicanti do for you

Growing Replicanti pays in two ways:

- **More Replicanti multiply your Infinity Dimensions.** The bonus is the squared log-base-2 of your count (log2(amount)²), so it starts small and becomes one of your biggest multipliers by the time you hold thousands of digits of them. <!-- src/core/replicanti.js:266-272 (`replicantiMult`) -->
- **Reaching <Num value="1.79e308" /> Replicanti buys a Replicanti Galaxy.** Each galaxy adds to your shared galaxy strength alongside Antimatter Galaxies, up to your Max Galaxies cap. The galaxy purchase divides your Replicanti back down (or resets them to 1 early on), and growth resumes. <!-- src/core/replicanti.js:34-48 (`replicantiGalaxy`), multiplier-tab/galaxies.js:20-30 -->

So the loop is: grow → galaxy → grow faster → galaxy, with the chance/interval upgrades speeding each cycle and the Max Galaxies upgrade raising the ceiling.

## Tuning the upgrades

Early priorities, in order:

1. **Interval first.** It starts at full price parity with the unlock and each level visibly shortens cycles. The first handful of levels are the cheapest speed you will ever buy.
2. **Chance to ~30–50%, then alternate.** Chance levels cost ×1e15 more each, so they overtake interval quickly; push chance while it is the cheaper of the two, then alternate.
4. **Cap chance at 100%, floor interval at 50 ms** (lower with study 22's Time Study effect). After that every IP goes to Max Galaxies.

<Callout kind="tip">

Replicanti keep growing while you do other things. Set the three autobuyers (gears tab) on, push antimatter toward the next ID unlock, and let the count compound in the background — check back each crunch to spend the gains.

</Callout>

<Callout kind="android">

Growth ticks run on the game clock, so offline stretches count — with a high Max-offline-ticks setting you can come back to a full galaxy cap. Touch specifics: the galaxy button can be held down (or the R.Galaxy floating button used) to buy repeatedly instead of tapping per galaxy.

</Callout>

## When to move on

Replicanti are "done" when galaxies flow without attention and your IP payouts climb past <Num value="1e200" /> toward the <Num value="1.79e308" /> goal. The last stretch is covered in the next article: the final IDs, the last ICs, and the first Eternity.

Further reading:

- In-game How to Play → Replicanti (matches your installed build exactly)
- Tables61's stuck-post Replicanti section for the standard upgrade rhythm
