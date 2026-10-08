---
title: 'The Nameless Ones'' Reality'
stage: nameless
order: 17
summary: 'The restrictions inside the Nameless Reality, the loopholes that beat them, and how the discharge finish works.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## Entering

Start the Reality from the Nameless tab once the unlock is bought. The goal is a normal Reality: reach <Num value="1e4000" /> EP. Bring your rarest Glyphs (Power and Time are strongest here; a Replication Glyph helps but is optional), and — critically — bring a **full bank of stored game time** and do not discharge it until the end.

<!-- vendor/ad-source/src/core/secret-formula/h2p.js (Nameless entry); vendor/ad-source/src/core/secret-formula/celestials/enslaved.js (glyphHints: Power/Time strong, Replication helpful) -->

<Screen
	src="nameless/celestials-nameless-1.webp"
	alt="The lower Nameless tab: the charge and discharge buttons, the stored time banks, and the Start The Nameless Ones' Reality panel with its restrictions."
	caption="Read the whole panel before entering. The Black Hole stays disabled inside, so banked time is your only burst."
/>

## The restrictions

The panel lists them; the important ones:

- Glyph levels are boosted to a minimum of 5000 — rarity and effects decide your power, not levels.
- Infinity, Time and 8th Antimatter Dimension purchases are limited to 1 each; the Black Hole is disabled.
- Time Study 192 (uncapped Replicanti) is locked; Theorem generation from Dilation Glyphs is off; Tachyon and Dilated Time production are severely reduced.
- Certain challenge goals are raised; stored time discharges at exponent <Num value="0.55" />.

Standard progression cannot beat this. The run is a puzzle: several hidden interactions restore what the restrictions take away, and the game drip-feeds hints for them on the tab.

## The loopholes, in run order

1. **Free Theorems:** tap the empty space just right of Time Study 11 for +100 Theorems. <!-- secret-formula/celestials/enslaved.js: secretStudy condition -->
2. **Feel Eternity:** push to Infinity, break it, and tap the **Feel Eternity** button where Fix Infinity used to be (Infinity → Break Infinity). It multiplies time in the Eternity by your Eternity count and powers up EC1 and study 123. <!-- src/core/celestials/enslaved.js: feelEternity -->
3. **Challenge 10 for Galaxies:** with no 8th Dimensions you cannot buy Antimatter Galaxies normally — but inside Normal Challenge 10, Galaxies are bought with 6th Dimensions instead, so C10 restores them. <!-- enslaved.js progress: c10 condition -->
4. **EC6 inside C10:** Eternity Challenges can be entered while inside C10. EC6 inside C10 makes Replicanti Galaxies far cheaper and boosts production enormously — your main engine for the run.
5. **Uncapped EC1:** EC1 can be completed past its usual 5 completions here. Running EC1 inside C10 repeatedly stacks tickspeed bonus very high; alternate EC1+ C10 farming with EC6 + C10 converting until EP reaches roughly <Num value="1e2000" />–<Num value="1e2200" />.

<Callout kind="tip">

The pattern for the middle of the run: farm EC1 inside C10 for tickspeed, then switch to EC6 inside C10 to convert it into EP and studies, then back. Each cycle reaches further. Unlock Dilation along the way (EC10 inside C10 first) and run Dilation inside EC6 + C10 for the first Tachyon Particles.

</Callout>

## The discharge finish

1. With EP around <Num value="1e2200" />, max out dimensions and studies and enter EC6 + C10.
2. Wait 20–30 seconds without touching anything so Galaxies, Replicanti and production settle at their maximum.
3. Open the Nameless tab and **Discharge Black Hole**. The banked years fire in one tick and EP jumps the rest of the way to <Num value="1e4000" />.

<Callout kind="warning">

Never discharge mid-run "to speed things up". The bank is the finish; spending it early strands you with no way to close the final gap except rebuilding it from inside the disabled-Black-Hole run — effectively starting over.

</Callout>

## Reward and next steps

Finishing unlocks **Tesseracts** (next article): permanent Infinity Dimension cap increases bought with IP. Afterwards your amplified short Realities and the new ID cap drive RM far past old records on the way to V.

## Further reading

- [Fandom Guide](https://antimatter-dimensions.fandom.com/wiki/Guide) — full Nameless study-by-study walkthrough
- Community Discord pins — freshest Nameless study orders if the run stalls
