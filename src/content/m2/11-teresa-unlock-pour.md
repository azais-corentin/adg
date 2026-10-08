---
title: 'Teresa, Celestial of Reality'
stage: teresa
order: 11
summary: 'How Teresa unlocks, how pouring RM works, and the unlock ladder up to Effarig.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## How Teresa unlocks

Teresa unlocks when you earn achievement 147, which means owning all 25 Reality Upgrades. There is no other requirement. When it happens, the Celestials tab appears next to the Reality tab, with Teresa as its first subtab.

<!-- src/core/celestials/teresa.js: get isUnlocked() { return Achievement(147).isUnlocked; }; vendor/ad-source/src/core/secret-formula/h2p.js (Teresa entry) -->

<Screen
	src="ra/celestials-teresa-0.webp"
	alt="The Teresa subtab: the Pour RM button with the RM multiplier, an arrow down to the six unlock entries, and Teresa's Quotes button."
	caption="The Teresa tab before pouring much. The container bar at the bottom shows what your RM would unlock."
/>

The tab has three parts: a bar showing how full the container is, a **Pour RM** button, and the list of unlocks. Pouring is one-directional: RM that goes into the container never comes back, so pour only what you can spare from Reality Upgrades and Black Hole upgrades.

## How pouring works

Each second the game moves a slice of your current RM into the container. The slice grows the longer you keep pouring without toggling it off (it scales with the square of the unbroken pour time) and with the amount already poured, so small early pours ramp up on their own if you leave the button on. Toggling pouring off resets the timer, so a fresh pour always starts slow. The container holds at most <Num value="1e24" /> RM in total; the bar shows the fraction of that filled.

<!-- vendor/ad-source/src/core/celestials/teresa.js: pourRM(diff): rmPoured = min((pouredAmount + 1e6) * 0.01 * timePoured^2, rm); pouredAmountCap = 1e24 -->

Two things grow as the poured total rises:

- Your **RM gain multiplier**, up to <Num value="2.5e2" /> when the container is full. <!-- src/core/celestials/teresa.js: rmMultiplier = max(250 * (pouredAmount/1e24)^0.1, 1) -->
- The **unlock ladder** below, which opens fixed rewards at fixed poured totals.

| Poured total | Unlock |
| --- | --- |
| <Num value="1e6" /> | Start each Reality with all Eternity Upgrades |
| <Num value="1e10" /> | Undo equipping a Glyph mid-Reality |
| <Num value="1e14" /> | Teresa's Reality |
| <Num value="1e18" /> | Passive EP generation (1% of your best EP/min this Eternity, every second) |
| <Num value="1e21" /> | Teresa's Perk Point Shop |
| <Num value="1e24" /> | Effarig, the next Celestial |

<!-- vendor/ad-source/src/core/secret-formula/celestials/teresa.js -->

<Callout kind="tip">

Pour in milestone order. The <Num value="1e6" /> and <Num value="1e10" /> steps are cheap quality-of-life: buy them as soon as a normal Reality covers them. Save a deliberate push for <Num value="1e14" /> (the Reality) and pour the <Num value="1e21" /> shop unlock as soon as you can, because the shop's RM-doubling upgrades pay for the rest of the ladder.

</Callout>

## The Perk Point Shop

At <Num value="1e21" /> poured, the top of the Teresa tab opens the Perk Point Shop. It spends Perk Points (the small currency you earn one of per Reality) on four repeatable upgrades plus Music Glyphs:

| Upgrade | Effect per buy |
| --- | --- |
| Glyph levels | +5% pre-instability Glyph level |
| RM gain | Doubles RM gain |
| Dilation bulk | Dilation autobuyers buy twice as many at once |
| Autobuyer speed | Dimension, Dilation and Replicanti autobuyers run twice as fast |
| Music Glyph | A Music Glyph at 80% of your best level (costs 1 PP) |

<!-- vendor/ad-source/src/core/secret-formula/celestials/perk-shop.js -->

Buy the RM doubler first, then Glyph levels. The Music Glyph button is handy on touch: one tap gives a decent Glyph without a run, and a later button fills every empty inventory slot with them. Music Glyphs have a single (random-type) effect and are meant for sacrificing, so spend spare Perk Points there when the repeatables get expensive.

<Screen
	src="ra/celestials-teresa-1.webp"
	alt="The Teresa tab with a full container: the Perk Point Shop upgrades at the top, the filled bar with the 1e6 to 1e24 unlock list, and the Teresa's Reality panel with its restrictions."
	caption="A filled container: shop at the top, the full unlock list, and the Reality panel with its penalties."
/>

## What to aim for

1. Pour <Num value="1e6" /> then <Num value="1e10" /> for the two conveniences.
2. Keep running fast Realities. Buy the RM doubler from the shop at <Num value="1e21" />.
3. Push the container to <Num value="1e24" /> to unlock Effarig.
4. Attempt Teresa's Reality once the run feels affordable (next article), and repeat it later whenever your antimatter jumps.

## Common walls

**Pouring stalls early.** The pour rate scales with pour time squared, so a fresh pour starts slow. Leave pouring on across several Realities instead of expecting one Reality to fill a milestone.

**Not wanting to "waste" RM.** Poured RM is gone, but the RM multiplier (up to <Num value="2.5e2" />) and the unlocks outweigh the cost. Keep just enough RM on hand for the next Reality Upgrade or Black Hole upgrade you actually plan to buy, and pour the rest.

**Perk Points feel scarce.** One per Reality adds up fast once runs take minutes. If the shop's first RM doubler still costs more than you earn, shorten your runs rather than pushing long ones.

## Further reading

- [Fandom Teresa page](https://antimatter-dimensions.fandom.com/wiki/Teresa) — unlock and shop reference
- [Tables61 perk guide](https://www.reddit.com/r/AntimatterDimensions/comments/113aoz7/) — which perks to hold for the shop era
