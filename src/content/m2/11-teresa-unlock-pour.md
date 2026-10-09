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
	src="teresa/celestials-teresa-0.webp"
	alt="The Teresa subtab: the container bar in the middle with the Pour RM button beside it, the six unlock entries from 1e6 to 1e24 on the right, and the Start Teresa's Reality panel below."
	caption="The Teresa tab. Pour RM feeds the container; the list on the right shows what each poured total unlocks."
/>

The tab has three parts: a bar showing how full the container is, a **Pour RM** button, and the list of unlocks. Pouring is one-directional: RM that goes into the container never comes back, so pour only what you can spare from Reality Upgrades and Black Hole upgrades.

## How pouring works

**Pour RM** is a hold button, not a switch. It pours only while your finger stays on it, and only while the Teresa tab is open. A quick tap pours next to nothing.

While you hold, the pour speeds up fast: each update moves a slice of RM that grows with the square of how long you have been holding and with the amount already poured. Letting go stops the pour and resets the ramp, so the next hold starts slow again. In practice, about two seconds of holding pours as much again as the container already holds, and three seconds about ten times that. From an empty container, about six seconds reaches <Num value="1e14" />. The pour never takes more RM than you have, but a long hold takes all of it, so release early if you want to keep some.

The container holds at most <Num value="1e24" /> RM in total. The label at the bottom of the bar shows your current RM gain multiplier and the poured total, for example "×28.70 RM gain 3.97e14/1.00e24".

<!-- vendor/ad-source/src/core/celestials/teresa.js: pourRM(diff): rmPoured = min((pouredAmount + 1e6) * 0.01 * timePoured^2, rm); pouredAmountCap = 1e24. vendor/ad-source/src/components/tabs/celestial-teresa/TeresaTab.vue: pour = true on touchstart, false on touchend; update() resets Teresa.timePoured to 0 while not pouring. Emulator (3.18.0, 7.5e14 poured): a tap moved no visible RM, a 1 s hold took all 6.5e13 RM, a 3 s hold all 6.1e14. -->

Two things grow as the poured total rises:

- Your **RM gain multiplier**, up to ×<Num value="250" /> when the container is full. <!-- src/core/celestials/teresa.js: rmMultiplier = max(250 * (pouredAmount/1e24)^0.1, 1) -->
- The **unlock ladder** below, which opens fixed rewards at fixed poured totals.

| Poured total         | Unlock                                                                     |
| -------------------- | -------------------------------------------------------------------------- |
| <Num value="1e6" />  | Start each Reality with all Eternity Upgrades                              |
| <Num value="1e10" /> | Undo equipping a Glyph mid-Reality                                         |
| <Num value="1e14" /> | Teresa's Reality                                                           |
| <Num value="1e18" /> | Passive EP generation (1% of your best EP/min this Eternity, every second) |
| <Num value="1e21" /> | Teresa's Perk Point Shop                                                   |
| <Num value="1e24" /> | Effarig, the next Celestial                                                |

<!-- vendor/ad-source/src/core/secret-formula/celestials/teresa.js -->

<Callout kind="tip">

Pour in milestone order. The <Num value="1e6" /> and <Num value="1e10" /> steps are cheap quality-of-life: buy them as soon as a normal Reality covers them. Save a deliberate push for <Num value="1e14" /> (the Reality) and pour the <Num value="1e21" /> shop unlock as soon as you can, because the shop's RM-doubling upgrades pay for the rest of the ladder.

</Callout>

## The Perk Point Shop

At <Num value="1e21" /> poured, the Teresa tab opens the **Perk Point Shop**. It spends Perk Points (you earn one per Reality) on four upgrades that double in price with every purchase and stop at a cap, plus Music Glyphs:

| Card, as the app words it                                                                    | First cost | Cap                   | Total to max |
| -------------------------------------------------------------------------------------------- | ---------- | --------------------- | ------------ |
| Increase pre-instability Glyph levels by 5%                                                  | 1 PP       | ×1.71 (11 purchases)  | 2,047 PP     |
| Double Reality Machine gain                                                                  | 1 PP       | ×2,048 (11 purchases) | 2,047 PP     |
| Dilation autobuyers buy twice as many Dilation Upgrades at once                              | 100 PP     | ×16 (4 purchases)     | 1,500 PP     |
| Infinity Dimension, Time Dimension, Dilation, and Replicanti autobuyers are ×2 faster        | 1,000 PP   | ×4 (2 purchases)      | 3,000 PP     |
| Receive a Music Glyph of a random type that is 80% of your highest level. (Try clicking it!) | 1 PP each  | none                  | —            |

A capped card stops showing a cost and reads "Capped: ×2.05e3" (the app's way of writing ×2,048). Teresa's memory level 15 in Ra raises all four caps later.

<!-- vendor/ad-source/src/core/secret-formula/celestials/perk-shop.js: initialCost 1/1/100/1000, ×2 per purchase, caps 1.05^11 / 2048 / 16 / 4 (Ra perkShopIncrease, Teresa level 15: 1.05^20 / 1048576 / 16384 / 64); fillMusicGlyph only with perkShopIncrease. Emulator (Android 3.18.0), effarig/celestials-teresa-0.webp: "Increase pre-instability Glyph levels by 5% / Currently: ×1.63 / Cost: 1.02e3 Perk Points", "Double Reality Machine gain / Capped: ×2.05e3", "… Currently: ×8 / Cost: 800 Perk Points", "Infinity Dimension, Time Dimension, Dilation, and Replicanti autobuyers are ×2 faster / Currently: ×2 / Cost: 2.00e3 Perk Points", "Receive a Music Glyph … (Try clicking it!) / Cost: 1 Perk Point". -->

<Screen
	src="effarig/celestials-teresa-0.webp"
	alt="The Perk Point Shop on the Teresa tab with 330 Perk Points: Glyph levels ×1.63 for 1.02e3, Double Reality Machine gain Capped: ×2.05e3, Dilation bulk ×8 for 800, autobuyer speed ×2 for 2.00e3, and the Music Glyph card for 1 Perk Point."
	caption="The Perk Point Shop later on: the RM doubler is capped, the others climb toward their caps."
/>

Buy the RM doubler first, every time you can, until it reads Capped; then Glyph levels. The two autobuyer cards are conveniences for later. The Music Glyph card is handy on touch: one tap gives a Glyph without a run (Ra later adds a button that fills every empty inventory slot with them). Music Glyphs have a single random-type effect and are meant for sacrificing, so spend spare Perk Points there once the RM doubler is capped and the next Glyph level costs more than you want to wait for.

<Screen
	src="teresa/celestials-teresa-1.webp"
	alt="The bottom of the Teresa tab: the Start Teresa's Reality panel with its restriction text, the last-run antimatter record, and the finished unlock list above it."
	caption="The Reality panel at the bottom of the tab. Its text lists the run's penalties before you enter."
/>

## What to aim for

1. Pour <Num value="1e6" /> then <Num value="1e10" /> for the two conveniences.
2. Keep running fast Realities. From <Num value="1e21" />, put your Perk Points into the shop's RM doubler until it reads Capped.
3. Push the container to <Num value="1e24" /> to unlock Effarig.
4. Attempt Teresa's Reality once the run feels affordable (next article), and repeat it later whenever your antimatter jumps.

## Common walls

**Pouring seems to do nothing.** A tap pours almost nothing and the ramp resets as soon as you let go. Hold **Pour RM** for a few seconds and watch your RM drop.

**A hold emptied all your RM.** Once the container holds more than your RM, a hold of a second or two pours everything you have. Buy the Reality Upgrades or Black Hole upgrades you want first, then pour the rest.

**Not wanting to "waste" RM.** Poured RM is gone, but the RM multiplier (up to ×<Num value="250" />) and the unlocks outweigh the cost. Keep just enough RM on hand for the next Reality Upgrade or Black Hole upgrade you actually plan to buy, and pour the rest.

**Perk Points feel scarce.** One per Reality adds up fast once runs take minutes, and the last RM doublers cost 512 and 1,024 PP. Short, quick Realities fill the shop faster than long pushes.

## Further reading

- [Fandom Teresa page](https://antimatter-dimensions.fandom.com/wiki/Teresa) — unlock and shop reference
- [Tables61 perk guide](https://www.reddit.com/r/AntimatterDimensions/comments/113aoz7/) — which perks to hold for the shop era
