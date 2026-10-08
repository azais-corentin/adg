---
title: Getting started
stage: pre-infinity
order: 1
summary: What Antimatter Dimensions is, and how to find your way around the Android app.
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
	import StageGate from '#lib/components/StageGate.svelte';
</script>

## What the game is

Antimatter Dimensions is an incremental game: you produce a resource, spend it on things that produce it faster, and repeat. You start with 10 antimatter and spend it on the 1st Antimatter Dimension, which produces antimatter. Each higher Dimension produces the one below it, up to the 8th.

Numbers grow fast, so the game writes them in scientific notation. <Num value="2.72e108838" /> means 2.72 × 10<sup>108,838</sup>.

The game is built in layers. Once you have about <Num value="1.79e308" /> antimatter (2<sup>1024</sup>, which the game calls Infinity), you do a Big Crunch: your antimatter and Dimensions reset, and you get Infinity Points to spend on permanent upgrades. Eternity and Reality later repeat that pattern on a larger scale. This guide follows the layers in the order you reach them.

## The tab bar

The app's tabs sit in a bar along the bottom of the screen. With Eternity unlocked, there are ten, from left to right:

| Icon      | Tab          | What's in it                                      |
| --------- | ------------ | ------------------------------------------------- |
| Cube      | Dimensions   | Antimatter, Infinity and Time Dimensions          |
| Gears     | Autobuyers   | Settings for everything the game buys for you     |
| Triangle  | Challenges   | Normal and Infinity Challenges                    |
| ∞         | Infinity     | Infinity Upgrades, Break Infinity, Replicanti     |
| Hourglass | Eternity     | Time Studies, Eternity Upgrades, Milestones       |
| Trophy    | Achievements | Normal and secret achievements                    |
| Clipboard | Statistics   | Stats, records, past runs, multipliers and graphs |
| Sliders   | Options      | Display settings, and saving and loading          |
| $         | Shop         | The in-app store                                  |
| i         | Info         | How to play, and About                            |

<StageGate until="early-infinity" mode="highlight">

Tabs for layers you haven't reached yet, such as Infinity and Eternity, stay hidden, so a new save shows fewer of them.

</StageGate>

The subtabs of the current tab are listed below the bar. Each tab remembers the subtab you last opened, so the Dimensions tab may not open on Antimatter.

<Screen
	src="early-eternity/dimensions-antimatter-top.webp"
	alt="The Antimatter subtab of the Dimensions tab: antimatter and Dimension amounts, prestige buttons above the tab bar, and the Antimatter, Infinity and Time subtabs below it."
	caption="The Dimensions tab at early Eternity. The round prestige buttons sit above the tab bar, and the subtabs below it."
/>

## The buttons above the tab bar

A row of round buttons floats above the tab bar on every tab, so you can reset without switching tabs. Each one appears once you unlock it:

- **Eternity** does an Eternity.
- **B.Crunch** does a Big Crunch.
- **D.Boost** buys a Dimension Boost.
- **A.Galaxy** buys an Antimatter Galaxy.
- **R.Galaxy** buys a Replicanti Galaxy.
- **Max** buys as many Dimensions and Tickspeed upgrades as you can afford.

<Callout kind="tip">

The top of the Dimensions tab shows what a reset would give you right now. In the screenshot above, the boxes read "Eternity for 7 EP" and "Gain <Num value="2.14e516" /> Infinity Points".

</Callout>

## Before you go further

Export your save now and then. It is your backup, and it lets adg detect your stage. [Saving and exporting](/guide/m1/saving-and-exporting) shows how.
