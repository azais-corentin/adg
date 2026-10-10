---
title: 'Effarig''s Reality in three layers'
stage: effarig
order: 14
summary: 'What each layer of Effarig''s Reality restricts, which glyphs to bring, and how to finish all three.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## The shape of the run

Effarig's Reality costs <Num value="5e11" /> Relic Shards and plays as **three runs in sequence**: Infinity, then Eternity, then Reality. You must finish each layer to reach the next, and the tab tracks which layer is current. The whole Reality shares one theme: every multiplier, game speed and tickspeed is heavily weakened, Dilation-style, and your Glyph levels are capped per layer — but **rarity is untouched**, so your rarest Glyphs matter more than their levels here.

<!-- vendor/ad-source/src/core/celestials/effarig.js: currentStage Infinity→Eternity→Reality; glyphLevelCap 100/1500/2000; nerfFactor/tickDilation/multDilation -->

<Screen
	src="effarig/celestials-effarig-1.webp"
	alt="The lower Effarig tab: the Start Effarig's Reality panel with its penalty text, and the Infinity, Eternity and Reality layer reward lines below it."
	caption="The Reality panel states the penalties and the Glyph level cap of the layer you are on. Below it, each layer lists its reward lines; layers you have not finished show “?”."
/>

Infinity Power softens the production and game-speed penalties, and Time Shards soften the tickspeed penalty — both are worth pushing before you enter. <!-- src/core/celestials/effarig.js: tickDilation/multDilation; h2p Effarig entry -->

## Layer 1: Infinity (Glyph level cap 100)

Reach Infinity (<Num value="1.8e308" /> antimatter) and Crunch. With levels capped at 100, flat multipliers beat scaling exponents: equip Power Glyphs with Antimatter Dimension multipliers, plus one Dilation Glyph with Time Theorem generation if you need studies. High rarity carries the run, so bring your rarest set even though the levels get clamped.

<!-- src/core/celestials/effarig.js: glyphLevelCap INFINITY = 100 -->

The game lists the Infinity layer as four lines:

- "Infinities raise the Replicanti cap": from here on the Replicanti cap is <Num value="1.8e308" /> times your total Infinities to the power 30 (120 with Time Study 31).
- "Infinities increase your max Replicanti Galaxies": you get one extra Replicanti Galaxy for every factor of <Num value="1.8e308" /> the cap rises.
- "Base IP gain is capped at 1e200 in Effarig's Reality" and "Each type of IP multiplier is capped at 1e50 in Effarig's Reality": these two are not rewards but the extra rules of layer 2.

<!-- vendor/ad-source/src/core/secret-formula/celestials/effarig.js (infinity description); src/core/replicanti.js replicantiCap(): infinitiesTotal^(TS31 ? 120 : 30) × NUMBER_MAX_VALUE once EffarigUnlock.infinity; effarig.js bonusRG = floor(log10(cap)/log10(MAX_VALUE) − 1). Emulator 3.18.0 (Effarig save, Infinity layer done): the four lines as quoted. -->

## Layer 2: Eternity (Glyph level cap 1500)

Reach <Num value="1.80e308" /> IP and Eternity; until then the Eternity button reads "Reach 1.80e308 Infinity Points". Two extra caps apply: base IP gain cannot exceed <Num value="1e200" />, and each IP multiplier cannot exceed <Num value="1e50" />. So the IP has to come from several multipliers at once, and from Infinity Dimensions 7 and 8, which cost <Num value="1e250" /> and <Num value="1e280" /> IP. <!-- vendor/ad-source/src/core/secret-formula/celestials/effarig.js (infinity description); game.js gainedInfinityPoints (min 1e200 in this layer); Effarig.eternityCap 1e50 on TS141–143, the ×2 IP upgrade, achievements 116/125, the DT upgrade and the Glyph effect; player.js ID costs -->

What cleared it on Android 3.18.0, from the community Effarig save with the Infinity layer done, in under an hour of game time:

- **Glyphs**, named as the Glyphs subtab lists them under "Currently active Glyph effects":
  - an Infinity Glyph with **Infinity Point gain** (×9.57e25 from a level 1,211 Glyph at 72% rarity), which also had Infinity gain;
  - a Power Glyph with **Antimatter Dimension multipliers ×**;
  - two Replication Glyphs with **Replicanti multiplier ^**;
  - a Dilation Glyph with **Generating … Time Theorems per hour**.
- **Tree:** the Infinity Dimension path (72, 82, 92, 102) with the Idle row (123, 133, 143), then study 181. [Open it in the Time Study planner](/tools/time-studies?tree=11,21,22,31,32,33,41,42,51,61,62,72,82,92,102,111,123,133,143,151,161,162,171,181) to copy the string. The layer starts with only a few thousand Time Theorems, and more pile up in the first minutes, so import it right after you start and again if a study is missing.
- **Automatic Big Crunch off.** Study 181 adds IP every second without a Big Crunch.

IP stood at <Num value="4e238" /> after 40 seconds and <Num value="2.5e277" /> after 31 minutes, and the Eternity came before the hour was up. The same set on the Time Dimension path with the Active row was slower: <Num value="1.4e270" /> at 35 minutes, done after 70 to 80.

<Callout kind="warning">

**The Infinity Point gain effect is not optional, and neither is the rest of the set.** With the save's everyday set (Power without the AD multiplier, an Infinity Glyph without Infinity Point gain, one Replication without Replicanti multiplier, Dilation and Time), IP was at <Num value="7.3e184" /> after 4 hours. Swapping in only the Infinity Point gain Glyph got to <Num value="3.5e211" /> after 2 hours and kept crawling. If your IP sits between about <Num value="1e185" /> and <Num value="1e215" /> and the Big Crunch button's gain barely moves, the run will not finish: leave it, farm the missing Glyphs (Glyph Filter, Specified Effect), and come back. Your rarest Glyphs at the 1,500 cap are the ones to bring.

</Callout>

<!-- Emulator (Android 3.18.0), fixtures/saves/community/effarig.txt with Glyphs swapped in the save, offline progress, the save's Automator buying the tree after the start (TD/Active + 181, or ID/Idle + 181 with its TSTDActive constant replaced). Set = Power 93% (powerpow, powermult, powerdimboost), Infinity 1211 72% (infinitypow, infinityIP, infinityinfmult), Replication 77% and 80% (replicationspeed, replicationpow + one more), Dilation 100% (galaxy threshold, TT generation). ID/Idle: 4.01e238 at 0.6 min, 2.53e277 at 31.5 min, layer done before 61.5 min. TD/Active: 1.41e270 at 35.5 min, 7.84e278 at 67.5 min, done before 82.5 min. Everyday set (TD/Active): 4.71e180 at 1 h, 7.29e184 at 4 h. Everyday set with the IP Glyph instead of its Infinity Glyph: 4.93e209 at 65 min, 3.52e211 at 126 min; fixtures/saves/android-3.18.0-*-effarig-paired.txt are exports of that run. Effect names from the Glyphs subtab's Current Glyph effects panel. -->

Reward: **the Nameless Ones unlock** — the next Celestial — plus Eternities generating Infinities and the end of Infinity Point limits inside the Reality. Completing the layer also ends the run: "You will exit Effarig's Reality when you complete a Layer of it for the first time."

## Layer 3: Reality (Glyph level cap 2000)

Reach <Num value="1e4000" /> EP and Reality, the same goal as a normal Reality. This layer is a wall the first time: the penalties make Eternity Challenge 10 nearly impossible, which cuts off the bottom of the study tree. <!-- navigation.js Effarig's Reality goal DC.E4000; reality.js isRealityAvailable -->

The intended solution uses the next Celestial. Visit the Nameless Ones tab, charge your Black Hole to store game time (see the Nameless article), then enter layer 3, start EC10 and **discharge the stored time** to blast through it in one tick. With EC10 done, the bottom studies unlock and the rest of the layer plays normally.

<Callout kind="warning">

Do not bang your head on layer 3 before unlocking stored time. If EC10 will not move at all, leave, play the Nameless Ones' charging mechanic first, and come back with a full time bank.

</Callout>

Reward: **Effarig Glyphs** — a new Glyph type with its own equipment slot (next article).

## Glyph notes for all three layers

- Rarity over level: levels clamp, rarity does not. Your 90%+ sets are the ones to wear.
- Keep one Dilation Glyph with Theorem generation in the set so studies stay affordable.
- Save a preset per layer once the filter shop's preset slots are bought — re-entering with the right set is one tap.

## Further reading

- [Fandom Effarig page](https://antimatter-dimensions.fandom.com/wiki/Effarig) — layer goals and cap reference
- [Fandom Guide](https://antimatter-dimensions.fandom.com/wiki/Guide) — community layer walkthroughs
