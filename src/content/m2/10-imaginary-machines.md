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

Once a single Reality would give you <Num value="1e1000" /> Reality Machines, two things happen: your Reality Machines become hard-capped at <Num value="1e1000" />, and you start gaining a new resource called Imaginary Machines (iM). <!-- vendor/ad-source/src/core/machines.js:4-8, vendor/ad-source/src/core/secret-formula/h2p.js:1614-1643 -->

In practice this means pushing one Reality as far past <Num value="1e1000" /> RM as you can. Use your strongest glyph set, pulse the Black Holes together for a peak antimatter spike, and Reality at the top. There is nothing new to press: the unlock is automatic the first time your projected RM crosses the cap.

## Cap versus current iM

Imaginary Machines have two numbers, and confusing them is the classic early mistake:

- **iM cap** is the most iM you can ever hold. It is set by the highest *uncapped* RM you have ever projected: push further past the RM cap and the cap rises permanently. <!-- vendor/ad-source/src/core/machines.js:44-60 -->
- **Current iM** drifts toward the cap on its own over time. The gap halves roughly every minute, and this drift ignores game speed entirely, so it keeps filling while you play normally. <!-- vendor/ad-source/src/core/machines.js:62-74 -->

So the loop for this whole stage is: spend current iM on upgrades, then push a bigger Reality to raise the cap, then wait for current iM to refill toward it. The repeatable upgrade Vacuum Acceleration (upgrade 20) makes the refill 10 times faster once you can afford it.

<Callout kind="tip">

If an upgrade looks unaffordable, check the cap, not your wallet. Time fills current iM for free; only a bigger RM push raises what you can hold.

</Callout>

## Where the upgrades live

Unlocking iM adds an **Imaginary Upgrades** subtab to the Reality tab, next to Glyphs, Upgrades, Perks, Black Hole and Alchemy. It works like the Reality Upgrades list: each upgrade has an unlock condition you must meet first, then an iM price. The first two rows are repeatable (rebuyable); the rest are one-time purchases. <!-- vendor/ad-source/src/core/secret-formula/h2p.js:1614-1643 -->

<Screen
	src="imaginary-machines/reality-imaginary-0.webp"
	alt="The top of the Imaginary Upgrades subtab: the Machine cap line, the passive refill explanation, the requirement-lock note, and the first repeatable upgrade rows."
	caption="The Imaginary Upgrades subtab. The header states the cap and the refill rule; the repeatables sit at the top."
/>

Upgrades whose requirement you could fail by accident (buying something you should not, entering the wrong challenge) can be **locked** from the upgrade button: locking blocks the failing action until you unlock it again. Use it. <!-- vendor/ad-source/src/core/secret-formula/reality/imaginary-upgrades.js:168,223-224 -->

## The repeatable rows (upgrades 1–10)

Upgrades 1–5 are Intensifiers: each level adds to one of the Alchemy amplifier multipliers (Temporal, Replicative, Eternal, Superluminal, Boundless). They are cheap, so buy them whenever you have spare iM; cheapest-first is fine. <!-- vendor/ad-source/src/core/secret-formula/reality/imaginary-upgrades.js:14-53 -->

Upgrades 6–10 cost much more per level and each does something specific:

| # | Name | Effect | Priority |
| - | ---- | ------ | -------- |
| 6 | Elliptic Materiality | Raises the RM cap by ×<Num value="1e100" /> per level | Buy early: a higher RM cap means a higher iM cap |
| 7 | Runic Assurance | Delays Glyph Instability by 200 levels per level | Buy when instability starts eating your glyph levels |
| 8 | Hyperbolic Apeirogon | Multiplies Infinity Dimensions by <Num value="1e100000" /> per level | Big push power; buy as affordable |
| 9 | Cosmic Filament | Galaxy strength +3% per level | Steady value |
| 10 | Entropic Condensing | Singularity gain ×(1 + level) (each level adds ×1) | Buy before you start condensing seriously in Lai'tela |
Upgrade 6 deserves emphasis: because the iM cap grows with uncapped RM past the cap, raising the RM cap raises everything downstream. <!-- vendor/ad-source/src/core/machines.js:6-8 -->

## The first one-time upgrades (11–14)

These four cost 5e7–3.5e8 iM each and each has a task attached. They are worth doing in order, since each boosts the push that funds the next:

- **11, Suspicion of Interference** (5e7 iM): hold <Num value="1e90" /> total Relic Shards. This accumulates across Realities, so keep running Realities until the button lights up. Its reward powers Time Dimensions off total antimatter. <!-- vendor/ad-source/src/core/secret-formula/reality/imaginary-upgrades.js:101-114 -->
- **12, Consequences of Illusions** (5e7 iM): make a level-9000 glyph with a single level factor weight set to 100. Set every other factor weight to its minimum in Effarig's glyph-weight adjuster, push glyph level as high as you can, and Reality. Reward: free Dimboosts per Imaginary rebuyable bought. <!-- vendor/ad-source/src/core/secret-formula/reality/imaginary-upgrades.js:115-129 -->
- **13, Transience of Information** (5e7 iM): project past <Num value="1.79e308" /> (Number.MAX_VALUE) RM inside the Nameless Ones' Reality. Store real time, amplify a Reality, and the amplified projection counts. Reward: bigger iM cap per upgrade owned, which compounds the whole stage. <!-- vendor/ad-source/src/core/secret-formula/reality/imaginary-upgrades.js:130-145 -->
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
