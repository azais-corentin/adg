---
title: 'Imaginary Machines'
stage: imaginary-machines
order: 10
summary: 'How the Reality Machine cap unlocks Imaginary Machines, and which upgrades to buy first.'
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

## Unlocking Imaginary Machines

Reality Machines have a cap: at first you can hold at most <Num value="1e1000" />. The first time your Reality Machines reach it, the Reality tab gains an **Imaginary** subtab and you start gaining a new resource, Imaginary Machines (iM). There is nothing new to press. <!-- vendor/ad-source/src/core/machines.js:4-8 (baseRMCap 1e1000, hardcapRM × Imaginary Upgrade 6), 36-38 (isIMUnlocked: RM ≥ hardcap) -->

The subtab's header says how the two caps work: "You have reached the limits of reality and cannot hold more than 1e1200 Reality Machines. Machines gained in excess of 1e1000 will raise the maximum amount of Imaginary Machines you can have." In the screenshot further down, the RM cap reads 1e1200 because two levels of Elliptic Materiality (upgrade 6, below) raised it from 1e1000; the 1e1000 that counts for iM never moves. The **Make a new Reality** button then reads "No Machines gained (iM Cap: …)" once you are at the RM cap.

In practice this means pushing a Reality as far past <Num value="1e1000" /> RM as you can. Use your strongest glyph set, pulse the Black Holes together for a peak antimatter spike, and Reality at the top. <!-- emulator (Android 3.18.0), imaginary-machines save: "Your Machine cap is 1.00e1200 + 1.14e8i." and the header text quoted (imaginary-machines/reality-imaginary-0.webp) -->

## Cap versus current iM

Imaginary Machines have two numbers, and confusing them is the classic early mistake:

- **iM cap** is the most iM you can ever hold. It is set by the most Reality Machines a Reality would have given you beyond <Num value="1e1000" />, before the RM cap cuts them off, and it only ever rises. <!-- vendor/ad-source/src/core/machines.js:40-62 (baseIMCap from log10(uncappedRM) − 1000; updateIMCap keeps the highest) -->
- **Current iM** fills toward the cap on its own: "Imaginary Machines are gained passively over time up to the cap, but gain slows down exponentially as you approach the cap. Every 60 seconds the difference in iM between your current amount and the cap will be cut in half." The refill ignores game speed, so it keeps filling while you play normally. <!-- vendor/ad-source/src/core/machines.js:64-74; header text from imaginary-machines/reality-imaginary-0.webp -->

So the loop for this whole stage is: spend current iM on upgrades, then push a bigger Reality to raise the cap, then wait for current iM to refill toward it. The repeatable upgrade Vacuum Acceleration (upgrade 20) makes the refill 10 times faster once you can afford it.

<Callout kind="tip">

If an upgrade looks unaffordable, check the cap, not your wallet. Time fills current iM for free; only a bigger RM push raises what you can hold.

</Callout>

## Where the upgrades live

Unlocking iM adds an **Imaginary** subtab to the Reality tab, between Upgrades and Perks (Glyphs · Upgrades · Imaginary · Perks · Black Hole · Alchemy). It works like the Reality Upgrades list: each upgrade has an unlock condition you must meet first, then an iM price. The first two rows are repeatable (rebuyable); the rest are one-time purchases. <!-- vendor/ad-source/src/core/secret-formula/h2p.js:1614-1643; subtab bar in imaginary-machines/reality-imaginary-0.webp -->

<Screen
	src="imaginary-machines/reality-imaginary-0.webp"
	alt="The top of the Imaginary subtab: Your Machine cap is 1.00e1200 + 1.14e8i, the header about the 1e1200 Reality Machine cap, iM gained in excess of 1e1000 and the 60-second halving, the requirement-lock note, and the Temporal Intensifier upgrade."
	caption="The Imaginary subtab. The header states both caps and the refill rule; the repeatables sit at the top."
/>

Upgrades whose requirement you could fail by accident (buying something you should not, entering the wrong challenge) can be **locked** from the upgrade button: locking blocks the failing action until you unlock it again. Use it. <!-- vendor/ad-source/src/core/secret-formula/reality/imaginary-upgrades.js:168,223-224 -->

## The repeatable rows (upgrades 1–10)

Upgrades 1–5 are Intensifiers. Each level raises the per-level multiplier of one of the five Amplifiers in the first row of [Reality Upgrades](/guide/m1/reality-upgrades-1-2): "Increase Temporal Amplifier multiplier by +0.15" turns its ×3 per level into ×3.15, and that applies to every Amplifier level you own. Temporal, Replicative and Superluminal get +0.15 per level, Eternal +0.40 and Boundless +0.60. <!-- vendor/ad-source/src/core/secret-formula/reality/imaginary-upgrades.js:14-53; reality-upgrades.js:16 rebuyable effect = (base + ImaginaryUpgrade(id).effect)^level. Emulator 3.18.0: "Temporal Intensifier — Increase Temporal Amplifier multiplier by +0.15, Currently: +0.75" -->

The first levels cost a few iM, but each level costs 30 to 80 times the one before, so after a handful they cost as much as the one-time upgrades 11–14. Once that happens, compare them against the next one-time upgrade instead of buying them by reflex.

Upgrades 6–10 cost much more per level and each does something specific:

| #   | Name                 | Effect                                                               | Priority                                                   |
| --- | -------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------- |
| 6   | Elliptic Materiality | Raises the RM cap by ×<Num value="1e100" /> per level                | When you want to hold more RM; it doesn't raise the iM cap |
| 7   | Runic Assurance      | Delays Glyph Instability by 200 levels per level                     | Buy when instability starts eating your glyph levels       |
| 8   | Hyperbolic Apeirogon | Multiplies Infinity Dimensions by <Num value="1e100000" /> per level | Big push power; buy as affordable                          |
| 9   | Cosmic Filament      | Galaxy strength +3% per level                                        | Steady value                                               |
| 10  | Entropic Condensing  | Singularity gain ×(1 + level) (each level adds ×1)                   | Buy before you start condensing seriously in Lai'tela      |

Upgrade 6 only changes how many Reality Machines you can hold. The iM cap counts the Machines a Reality would give beyond <Num value="1e1000" /> whatever your RM cap is, so for iM, a bigger push is what counts. <!-- vendor/ad-source/src/core/machines.js:6-8, 40-43 -->

## The first one-time upgrades (11–14)

These four cost 5e7–3.5e8 iM each and each has a task attached. They are worth doing in order, since each boosts the push that funds the next:

- **11, Suspicion of Interference** (5e7 iM): hold <Num value="1e90" /> total Relic Shards. This accumulates across Realities, so keep running Realities until the button lights up. Its reward powers Time Dimensions off total antimatter. <!-- vendor/ad-source/src/core/secret-formula/reality/imaginary-upgrades.js:101-114 -->
- **12, Consequences of Illusions** (5e7 iM): make a level-9000 glyph with a single level factor weight set to 100. Set every other factor weight to its minimum in Effarig's glyph-weight adjuster, push glyph level as high as you can, and Reality. Reward: free Dimboosts per Imaginary rebuyable bought. <!-- vendor/ad-source/src/core/secret-formula/reality/imaginary-upgrades.js:115-129 -->
- **13, Transience of Information** (5e7 iM): project past <Num value="1.80e308" /> (Number.MAX_VALUE) RM inside the Nameless Ones' Reality. Store real time, amplify a Reality, and the amplified projection counts. Reward: bigger iM cap per upgrade owned, which compounds the whole stage. <!-- vendor/ad-source/src/core/secret-formula/reality/imaginary-upgrades.js:130-145 -->
- **14, Recollection of Intrusion** (3.5e8 iM): reach <Num value="1e75000000000" /> tickspeed per second inside Eternity Challenge 5. Enter EC5 with a tickspeed-focused study tree and let it run; the check is passive. Reward: all per-purchase Dimension multipliers raised to the 1.5th power. <!-- vendor/ad-source/src/core/secret-formula/reality/imaginary-upgrades.js:146-158 -->

## What comes next

Upgrade **15, Fabrication of Ideals** (1e9 iM) unlocks Lai'tela and converts your Antimatter Dimensions to Continuum. Its task — reach <Num value="1e1500000000000" /> antimatter without ever owning a 1st Infinity Dimension — is covered with the later upgrades in [Imaginary Upgrades 16 to 25](/guide/m2/imaginary-upgrades-16-to-25). The standard trick is entering Eternity Challenge 2, which locks Infinity Dimensions for you, with ID autobuyers off so nothing slips through. <!-- vendor/ad-source/src/core/secret-formula/reality/imaginary-upgrades.js:159-177 -->

<Callout kind="android">

On Android there are no hotkeys, so run these requirement Realities with the Automator stopped or on a simple script: an automatic Reality or Eternity at the wrong moment can fail a "never" condition like upgrade 15's.

</Callout>

## Further reading

- Fandom Guide, Imaginary/Lai'tela sections — https://antimatter-dimensions.fandom.com/wiki/Guide
- New community wiki, Imaginary Upgrades reference — https://antimatterdimensions.wiki.gg/

<Checklist stage="imaginary-machines" />
