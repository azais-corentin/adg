---
title: 'Your first Reality'
stage: early-reality
order: 10
summary: 'What the Reality reset keeps and wipes, how Reality Machines scale, and how to make the first one count.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## How you unlock it

The gate has two parts. Buy the **Reality study** (1 Time Theorem) at the end of the Time Studies tree, then press the Reality button. The study itself needs Time Dimension 8 bought, a best of <Num value="1e4000" /> Eternity Points this Reality, and either all pre-Reality achievements or the START perk. <!-- vendor/ad-source/src/core/secret-formula/eternity/time-studies/dilation-time-studies.js, vendor/ad-source/src/core/reality.js (isRealityAvailable) -->

If the study will not buy, check which of those three is missing: usually it is one or two obscure achievements, or max EP sitting just under <Num value="1e4000" />.

## What a Reality resets — and what it keeps

Reality resets almost everything up to this point: antimatter, Infinity Points, Eternity Points, Infinities, Eternities, Time Theorems, Time Dimensions, Tachyon Particles, Dilated Time, Replicanti, EC studies, normal/infinity challenge _completions_, studies and Dilation upgrades. EC _completion counts_ survive — only the studies and unlock flags clear. <!-- vendor/ad-source/src/core/reality.js (finishProcessReality); vendor/ad-source/src/core/eternity.js (initializeChallengeCompletions) -->

Two things surprise most players:

- **You lose the first 13 rows of achievements** — every pre-Reality achievement and its reward goes dark. You keep everything under the General header in Statistics, and all your best challenge times. <!-- in-game How to Play, "Reality" -->
- **You re-earn those achievements one at a time.** Every 30 minutes the game completes your next unfinished achievement for free, even offline, until rows 1–13 are full again. The Achievements tab (trophy) shows the countdown and an **Auto: ON** button. You can also redo their requirements by hand, which is faster for the easy ones. Switching Auto off doesn't stop the countdown: it runs down to zero and waits there, and the next achievement arrives as soon as you switch Auto back on. <!-- in-game How to Play, "Reality"; normal-achievement.js:141-158 (timer clamps at the period while auto is off); emulator: Achievements → Normal shows Hide completed rows and Auto: ON -->

Each Reality pays three things: **Reality Machines** (the new currency), **Glyphs** (your starting Power glyph plus a Companion on run one; a choice of glyphs on later runs), and **one Perk Point**. <!-- vendor/ad-source/src/core/reality.js (giveRealityRewards) -->

<Callout kind="warning">

There is a button on the Glyphs tab that restarts your current Reality without changing your upcoming glyph choices. It gives **no rewards**, even if you could otherwise complete a Reality. It exists for swapping equipped glyphs, not for farming.

</Callout>

## How many Reality Machines you get

Reality Machines scale purely off your Eternity Points when you Reality:

- The first 10 RM scale roughly linearly between <Num value="1e4000" /> and <Num value="2.16e5333" /> EP (exactly 10^5333⅓, i.e. 16000/3).
- Past that, RM = 1,000^(log10(EP)/4,000 − 1): every extra 4,000 EP exponent multiplies RM by 1,000. <!-- in-game How to Play, "Reality"; vendor/ad-source/src/core/machines.js (uncappedRM) -->

Two caps apply only before your first-ever Reality: gains soften past <Num value="1e6000" /> EP and stop entirely at <Num value="1e8000" /> EP, so there is no point pushing past that on run one. <!-- vendor/ad-source/src/core/machines.js (uncappedRM) -->

The Reality button tells you how much EP the next RM needs, so you can decide whether another hour of pushing is worth it.

<Callout kind="tip">

Aim for **2–4 RM** on the first Reality (around <Num value="1e4148" />–<Num value="1e4444" /> EP). One RM makes the second run painfully slow, because you can only afford a single small upgrade; three or four buys you a comfortable start. Idlers who leave the game running overnight often wake up to four. Do not stall weeks chasing more — early upgrades multiply later gains.

</Callout>

The run back up feels familiar but faster: Autobuyers, challenges and milestones return quickly, and the 30-minute achievement timer rebuilds your multipliers in the background. Spend your first RM on the repeatable Reality Upgrades; [Reality Upgrades, rows 1 and 2](/guide/m1/reality-upgrades-1-2) says what to buy for 1, 2, 3 or 4 RM.

Your first Glyph is fixed: an Uncommon Glyph of Power with Antimatter Dimension power. A Companion glyph, a pink heart that records the EP you Realitied with, comes with it. On the Glyphs tab, tap the Power glyph and press **Equip**. Leave the Companion in the inventory: it does nothing and would take one of your three circles. Your first Perk Point can only go into **START**, the highlighted card in the middle of the Perks subtab; tap it to buy it. See [the perk tree](/guide/m1/perk-tree).

<Screen
	src="early-reality/first-reality/reality-glyphs-1.webp"
	alt="The Glyphs subtab right after the first Reality: three empty circles above the inventory, with the Power glyph (Ω) and the Companion (♥) in its first row."
	caption="The Glyphs tab after your first Reality. Equip the Power glyph; the Companion only takes up a circle. Your first Perk Point goes into START on the Perks subtab."
/>

## Further reading

- In-game How to Play: Reality (Info tab → How to play) — the exact reset and RM rules for your build.
- [Fandom: Reality](https://antimatter-dimensions.fandom.com/wiki/Reality) — reference values including the RM curve (prose reworded here; page is CC BY-SA).
