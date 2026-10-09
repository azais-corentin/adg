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

| Upgrade                 | Starts at | First cost               | Effect                                                 |
| ----------------------- | --------- | ------------------------ | ------------------------------------------------------ |
| Chance                  | 1%        | <Num value="1e150" /> IP | Each level adds 1 percentage point, up to 100%         |
| Interval                | 1000 ms   | <Num value="1e140" /> IP | Each level shrinks the tick 10%, down to a 50 ms floor |
| Max Replicanti Galaxies | 0         | <Num value="1e170" /> IP | Each level raises the cap on Replicanti Galaxies by 1  |

<!-- src/core/replicanti.js:505-514 (initial chance/interval/costs), :326-404 (chance +1%/level capped at 100%, interval ×0.9 floored at 50ms), :412-436 (galaxy cap upgrade) -->

Every purchase also makes that upgrade's next level far more expensive: ×1e15 for chance, ×1e10 for interval, and more each time for Max Galaxies (<Num value="1e170" />, <Num value="1e195" />, <Num value="1e225" />, <Num value="1e260" />, <Num value="1e300" />, <Num value="1e345" />).

## What Replicanti do for you

Growing Replicanti pays in two ways:

- **More Replicanti multiply your Infinity Dimensions.** The bonus is the squared log-base-2 of your count (log2(amount)²), so it starts small and becomes one of your biggest multipliers by the time you hold thousands of digits of them. <!-- src/core/replicanti.js:266-272 (`replicantiMult`) -->
- **Replicanti stop at <Num value="1.80e308" />, and that is when you can take a Replicanti Galaxy.** Nothing happens on its own: tap **Reset Replicanti amount for a Replicanti Galaxy** on the subtab (or the round **R.Galaxy** button) while you are below your Max Galaxies cap. Each galaxy adds to your shared galaxy strength alongside Antimatter Galaxies. Taking it sets your Replicanti back to 1, and growth starts over. From 3 Eternities, an Eternity milestone adds a Replicanti Galaxy autobuyer that takes them for you. <!-- src/core/replicanti.js:34-48 (`replicantiGalaxy`), multiplier-tab/galaxies.js:20-30; eternity-milestones.js (3: Replicanti Galaxy autobuyer); emulator (3-2): Replicanti sat at 1.80e308 with 0 RG after 2.2 h until the button was tapped -->

So the loop is: grow → tap for a galaxy → grow faster → tap again, with the chance/interval upgrades speeding each cycle and the Max Galaxies upgrade raising the ceiling.

## Big Crunches reset Replicanti at first

Until you earn the achievement **Is this safe?**, every Big Crunch sets your Replicanti back to 1 and takes away your Replicanti Galaxies. The achievement asks for <Num value="1.80e308" /> Replicanti within one hour of an Infinity. From then on, your Replicanti and one Replicanti Galaxy survive each crunch.

So at first, Replicanti only grow within a single Infinity. The countdown under the galaxy count also gives the full time from 1 to <Num value="1.80e308" /> ("17 minutes and 24 seconds total" in the screenshot). Once that total is under an hour, turn off **Automatic Big Crunch** (Autobuyers tab) and don't crunch until Replicanti reach <Num value="1.80e308" />: that earns the achievement.

<!-- big-crunch.js:121-162 (Replicanti to 1 and galaxies to 0 on crunch unless Achievement 95), normal-achievements.js:663-672 (Is this safe?); emulator (Android 3.18.0): pre-Eternity save with achievement 95 cleared and no Replicanti Galaxy, B.Crunch took Replicanti from 3.41e60 to 3 -->

## Tuning the upgrades

None of the three gets near its cap before your first Eternity. Prices climb that fast, and this stage ends at about <Num value="1.80e308" /> IP. The screenshot above is a save ready for its first Eternity: 12% chance, a 167 ms interval and 5 Max Replicanti Galaxies, with the next chance level at <Num value="1e315" /> IP.

1. **Buy the cheapest of the three.** Interval opens at <Num value="1e140" /> IP, chance at <Num value="1e150" /> and Max Galaxies at <Num value="1e170" />; after that their prices leapfrog each other.
2. **When chance and interval cost about the same, take chance below about 9% and interval above it.** Replicanti grow at a speed set by ln(1 + chance) ÷ interval. Going from 5% to 6% chance makes them about 19% faster, from 12% to 13% only 8%, while every interval level gives 11%.
3. **Raise Max Galaxies only when you are about to fill it.** Each Replicanti Galaxy sends your Replicanti back to 1, and climbing to <Num value="1.80e308" /> again takes a while (17 minutes in the screenshot), so you won't fill many galaxies before the first Eternity.

<!-- replicanti.js:205 (growth per tick: ln(1 + chance)), :336-397 (cost steps, caps), :472-478 (Max Galaxies cost: 10^(170 + 25n + 5n(n-1)/2)); emulator (Android 3.18.0): Chance 5% next cost 1e210, Interval 531.44 ms cost 1e200, Max RGs 2 cost 1e225 on a Replicanti-stage save; replicanti/infinity-replicanti-top.webp at 2.69e315 IP -->

The caps come into play after Eternity: chance stops at 100% and the interval at 50 ms (Time Study 22 lowers that floor to 1 ms), and Eternity milestones add autobuyers for all three upgrades. See [Eternity Upgrades and Replicanti](/guide/m1/eternity-upgrades-and-replicanti).

<Callout kind="tip">

Replicanti keep growing while you do other things. There are no Replicanti autobuyers yet, so check the subtab after each crunch: buy the cheapest upgrade, and take a galaxy once Replicanti reach <Num value="1.80e308" />. Until 40 Eternities a Replicanti Galaxy also resets your Antimatter Dimensions and Dimension Boosts, like an Antimatter Galaxy, so take it early in a run.

</Callout>

<Callout kind="android">

Growth ticks run on the game clock, so offline stretches count: Replicanti fill up to <Num value="1.80e308" /> while the app is closed, then wait there. No galaxy comes until you take it with the **Reset Replicanti amount for a Replicanti Galaxy** button or the round **R.Galaxy** button above the tab bar, so a night away earns at most the one galaxy you collect in the morning.

</Callout>

## When to move on

Replicanti are "done" when the galaxy countdown is short and your IP payouts climb past <Num value="1e200" /> toward the <Num value="1.80e308" /> goal. The last stretch is covered in the next article: the final IDs, the last ICs, and the first Eternity.

Further reading:

- In-game How to Play → Replicanti (matches your installed build exactly)
- Tables61's stuck-post Replicanti section for the standard upgrade rhythm
