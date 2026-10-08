---
title: 'Your first Dimensions'
stage: pre-infinity
order: 10
summary: 'How the eight Antimatter Dimensions, buying in tens, Tickspeed and the first autobuyers work.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## The eight Dimensions

You start with <Num value="10" /> antimatter. Spend it on a 1st Antimatter Dimension, which produces antimatter every tick. Each higher Dimension produces the Dimension below it: the 2nd makes 1sts, the 3rd makes 2nds, up to the 8th. Higher Dimensions cost more, so early on almost all your antimatter goes into the lowest tiers.

New Dimensions unlock one at a time. You begin able to buy only the first four; each of your first four Dimension Boosts unlocks one more, up to the 8th. [Buying boosts](/guide/m1/boosts-and-galaxies) is therefore part of unlocking the full ladder.

## Buy in tens

Each Dimension row has buy buttons for one and for ten (plus a **Max** round button above the tab bar that buys everything affordable). Always prefer tens: every 10 of a Dimension multiply that Dimension's production by about ×2. This buy-10 multiplier starts at ×2 and only grows with upgrades, so ten singles bought one at a time are far weaker than a proper batch of ten.

<!-- buyTenMultiplier base DC.D2 in vendor/ad-source/src/core/dimensions/antimatter-dimension.js -->

In practice: buy the cheapest Dimension available in batches of ten, working from the top of the list down. When the 1st Dimension stalls, the 2nd boosts it more per antimatter spent than more 1sts would, and so on down the ladder.

## Tickspeed

Below the Dimensions sits **Tickspeed**: each upgrade makes every Dimension tick faster. Its cost rises with each purchase, and it multiplies together with your Dimensions rather than adding to them.

Early on, Dimensions outscale Tickspeed per antimatter spent. Buy Tickspeed when it is clearly the cheapest upgrade on screen, but do not pour everything into it while cheap Dimensions are waiting. Old guides that tell you to max Tickspeed first are stale: Dimensions (especially the 1st–3rd) win the cost comparison through the whole pre-Infinity game.

<Screen
	src="pre-infinity/dimensions-antimatter-top.webp"
	alt="The Antimatter subtab on a new save: 10 antimatter, the 1st Dimension row with its Cost 10 button, and the Boost and Galaxy requirement boxes below it."
	caption="The Antimatter subtab before the first Boost. The 1st Dimension row, its ×2.71 multiplier and the buy-ten ×2.00 readout are all here."
/>

## The Max button

The round **Max** button floating above the tab bar (with D.Boost and A.Galaxy in the screenshot above) buys as many Dimensions and Tickspeed upgrades as you can currently afford, cheapest-first. On touch it replaces the old keyboard buy-max habit: tap it whenever you come back to the tab instead of tapping each row. It never spends anything you cannot afford, so there is no reason to be shy with it.

## Early autobuyers

The **Autobuyers** tab (gears icon) holds one autobuyer per Dimension. Each can be bought with antimatter directly — the 1st costs <Num value="1e40" /> antimatter, and each higher tier costs ×10 more — so the first ones arrive well before your first Infinity.

<!-- antimatterCost = DC.E10.pow(tier-1).times(DC.E40) in vendor/ad-source/src/core/autobuyers/antimatter-dimension-autobuyer.js -->

<Screen
	src="pre-infinity/autobuyers-main-0.webp"
	alt="The Autobuyers tab on a new save: the Tickspeed autobuyer locked behind a 1e140 total-antimatter requirement, and the 1st and 3rd Dimension autobuyers locked behind 1e40 and 1e60."
	caption="The Autobuyers tab before the first Infinity. Each row shows the lifetime-antimatter requirement that unlocks it."
/>

<Callout kind="tip">

Leave the Autobuyers tab's master switch on. Individual autobuyers can be toggled per row when you want manual control, for example inside challenges.

</Callout>

## What to do

1. Buy 1st Dimensions in tens until the 2nd is affordable, then keep pushing down the ladder to the most expensive Dimension you can reach.
2. Tap **Max** every few seconds while active; buy Tickspeed when it is the cheapest row.
3. Buy each Dimension autobuyer as it becomes affordable and leave it on.
4. When progress stalls even with everything bought, that is the signal to buy a Dimension Boost — the next article.

## Further reading

- In-game Info → How to play → "Antimatter Dimensions" and "Tickspeed" (matches your build exactly).
- The community walkthrough's opening sections: [Fandom Guide](https://antimatter-dimensions.fandom.com/wiki/Guide) (long, partially outdated — trust the mechanics, not old buy orders).
