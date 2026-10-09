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

Each Dimension row has a single **Cost** button. A tap buys as many of that Dimension as you can afford, up to the next multiple of ten, and the button shows the total price of that purchase. The bar inside the button tracks the current ten: the dark part is what you have already bought toward it, the lighter part is what a tap would add.

Every completed ten multiplies that Dimension's production by the **Buy ten multiplier** shown above the rows (×2.00 at the start; upgrades raise it later). The price per Dimension only rises when a ten is completed, so finishing a ten is what each row is working toward.

<!-- buyTenMultiplier base DC.D2 in vendor/ad-source/src/core/dimensions/antimatter-dimension.js -->

In practice: complete a ten on the cheapest row you can, and keep adding rows further down the list, up to the highest Dimension you can afford. When the 1st Dimension stalls, the 2nd boosts it more per antimatter spent than more 1sts would, and so on down the ladder.

## Tickspeed

**Tickspeed** appears above the Dimension rows once you own a 2nd Dimension: an "Increase Tickspeed by ×1.125" line with a **Cost** button and a **Buy max** button, then your current "Tickspeed: N / sec". Each upgrade makes every Dimension tick faster. Its cost rises with each purchase, and it multiplies together with your Dimensions rather than adding to them.

<!-- Tickspeed.isUnlocked: AntimatterDimension(2).bought > 0 in vendor/ad-source/src/core/tickspeed.js -->

Early on, Dimensions outscale Tickspeed per antimatter spent. Buy Tickspeed when it is clearly the cheapest upgrade on screen, but do not pour everything into it while cheap Dimensions are waiting. Old guides that tell you to max Tickspeed first are stale: Dimensions (especially the 1st–3rd) win the cost comparison through the whole pre-Infinity game.

<Screen
	src="pre-infinity/first-minutes/dimensions-antimatter-top.webp"
	alt="The Antimatter subtab a few minutes into a new game: 40.56 K antimatter, the Tickspeed line with Cost 10 K and Buy max buttons, Tickspeed 1.125 / sec, Buy ten multiplier ×2.00, then four Dimension rows. The 1st and 3rd rows' Cost 40 K buttons are partly filled; the 2nd and 4th cost 1 M. Only the Max button floats above the tab bar."
	caption="A few minutes in. Tickspeed sits above the rows. The 3rd row's bar shows 1 bought toward its ten (dark) plus 4 more a tap would buy for 40 K (light)."
/>

## The Max button

The round **Max** button floating above the tab bar goes through the Dimensions from the 1st to the 8th and buys **complete tens** of each as long as you can afford them. Then it spends what is left on Tickspeed upgrades. It never buys a partial ten: a row that needs 4 more to reach ten, with antimatter for only 3, is skipped. So if Max seems to do nothing, tap the row's own button instead, which tops up a partial ten with whatever you can afford.

Tap Max whenever you come back to the tab instead of tapping each row. It never spends anything you cannot afford, so there is no reason to be shy with it.

<!-- maxAll / buyMaxDimension (isAffordableUntil10) in vendor/ad-source/src/core/dimensions/antimatter-dimension.js -->

## Early autobuyers

The **Autobuyers** tab (gears icon) appears once you have made <Num value="1e40" /> antimatter in total, well before your first Infinity. It holds one autobuyer per Dimension plus one for Tickspeed. They are not bought: each box shows a requirement ("Requirement: 1e40 total antimatter" for the 1st Dimension), and once you have reached it an **Unlock** button appears in the box. Tapping it costs nothing. The requirement rises ×<Num value="1e10" /> per tier, from <Num value="1e40" /> for the 1st to <Num value="1e110" /> for the 8th. The Tickspeed Autobuyer needs <Num value="1e140" />. Despite the label, the game checks the most antimatter you have held at once in this Eternity, not your lifetime total.

<!-- automation tab condition totalAntimatter >= 1e40 in secret-formula/tabs.js; antimatterCost = DC.E10.pow(tier-1).times(DC.E40), purchase() only checks canUnlockSlowVersion in vendor/ad-source/src/core/autobuyers/antimatter-dimension-autobuyer.js; tickspeed-autobuyer.js antimatterCost DC.E140 -->

<Screen
	src="pre-infinity/autobuyers-main-0.webp"
	alt="The Autobuyers tab in a pre-Infinity game with 2 Galaxies: the Autobuyers enabled, Toggle all autobuyers and Toggle buy until 10 buttons, the Tickspeed Autobuyer box reading Requirement 1e140 total antimatter, and the 1st to 6th Dimension Autobuyer boxes reading 1e40 to 1e90."
	caption="The Autobuyers tab before the first Infinity. Each box shows the antimatter requirement that unlocks it."
/>

Three buttons sit at the top of the tab:

- **Autobuyers enabled** is the master switch. Leave it on.
- **Toggle all autobuyers** turns every unlocked autobuyer on or off at once. Each box also has its own toggle, for when you want manual control, for example inside challenges.
- **Toggle buy until 10** switches the Dimension autobuyers between buying one Dimension at a time and buying until ten.

## What to do

1. Buy 1st Dimensions in tens until the 2nd is affordable, then keep pushing down the ladder to the most expensive Dimension you can reach.
2. Tap **Max** every few seconds while active; buy Tickspeed when it is the cheapest row.
3. Unlock each Dimension autobuyer as soon as you reach its requirement, and leave it on.
4. When progress stalls even with everything bought, that is the signal to buy a Dimension Boost — the next article.

## Further reading

- In-game Info → How to play → "Antimatter Dimensions" and "Tickspeed" (matches your build exactly).
- The community walkthrough's opening sections: [Fandom Guide](https://antimatter-dimensions.fandom.com/wiki/Guide) (long, partially outdated — trust the mechanics, not old buy orders).
