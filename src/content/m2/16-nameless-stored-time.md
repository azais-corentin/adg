---
title: 'The Nameless Ones and stored time'
stage: nameless
order: 16
summary: 'How the Nameless Ones unlock, how storing and discharging time works, and what to buy with it.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## How they unlock

The Nameless Ones unlock when you finish **Effarig's Eternity** — the second layer of Effarig's Reality. A Nameless subtab appears in the Celestials tab. They do not unlock the next Celestial directly; V comes from achievements instead.

<!-- src/core/celestials/enslaved.js: isUnlocked = EffarigUnlock.eternity.isUnlocked; vendor/ad-source/src/core/secret-formula/h2p.js (Nameless entry: "will not directly unlock the next Celestial") -->

<Screen
	src="ra/celestials-nameless-0.webp"
	alt="The Nameless tab: the two store-time buttons, discharge, offline-time setting, the reality panel and the two time-cost unlocks."
	caption="The Nameless tab. Charging, discharging and both unlocks live on this one screen."
/>

## Storing game time

**Charging Black Hole** banks your Black Hole's speed bonus as stored game time instead of applying it. While charging, game speed drops to <Num value="1" /> — the game converts the lost speed into the bank, measured in years. **Discharge Black Hole** releases the bank into a single tick, skipping forward by the stored duration. Discharging ignores game-speed modifiers when it lands; only the storing was modified.

<!-- vendor/ad-source/src/core/secret-formula/h2p.js (Nameless entry: charging/discharging); src/core/celestials/enslaved.js: useStoredTime -->

Practical notes:

- Charge during normal Realities, where your Black Hole is strong and the lost speed costs little.
- Bank **well past** what the unlocks cost before attempting the Reality — the discharge at the end needs its own large reserve (next article).
- Discharging inside the Nameless Reality works at reduced effectiveness (exponent <Num value="0.55" />), so bring more than you think you need. <!-- screenshot: "Stored game time is discharged at a reduced effectiveness (exponent 0.55)" -->

## Storing real time

**Store real time** halts all production (game speed 0) and banks real seconds at 70% efficiency, up to a base cap of 8 hours (a Ra unlock raises the cap further). <!-- src/core/celestials/enslaved.js: storedRealTimeEfficiency 0.7; storedRealTimeCap 8h + Ra improvedStoredTime bonus -->

Its use is **amplifying** a Reality: on the Glyphs tab you can spend the whole bank to simulate the Reality you just ran repeatedly, multiplying out its RM, shards, Glyphs and Perk Points. Short Realities amplify best — the multiplier is roughly stored time divided by run length. There is a setting to store offline time as real time automatically; turn it on if you close the game for hours at a time.

<Callout kind="tip">

Amplify short, profitable Realities, not long pushes. A 10-minute run with 50 minutes stored pays five copies of everything; a 2-hour run with the same bank pays barely more than one.

</Callout>

## The two unlocks

Stored game time is also the currency for two unlocks at the bottom of the tab:

| Cost (stored game time) | Unlock |
| --- | --- |
| <Num value="1e35" /> years | Tickspeed softcap from Time Dimensions raised by <Num value="1e5" /> upgrades |
| <Num value="1e40" /> years, plus a level-<Num value="5000" /> and 100%-rarity Glyph in your best-Reality records | The Nameless Ones' Reality |

<!-- vendor/ad-source/src/core/celestials/enslaved.js: ENSLAVED_UNLOCKS FREE_TICKSPEED_SOFTCAP / RUN -->

Buy the softcap first — it is cheap relative to the bank you will build anyway. The Reality unlock additionally demands proof of Glyph progress (a level 5000 Glyph and a max-rarity one in your best-Reality records), so keep pushing Glyph level and rarity while charging.

## What to aim for

1. Charge the Black Hole across normal Realities until the bank holds well over <Num value="1e40" /> years.
2. Buy the tickspeed softcap, then the Reality unlock.
3. Amplify short Realities with stored real time whenever the bank is full.
4. Attempt the Reality with the bank intact (next article) — do not discharge early.

## Further reading

- [Fandom Guide](https://antimatter-dimensions.fandom.com/wiki/Guide) — Nameless walkthrough with study orders
