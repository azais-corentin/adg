---
title: 'Rifts and the Galaxy Generator'
stage: pelle
order: 12
summary: 'Filling all five Rifts, running the Galaxy Generator, and sacrificing Rifts for caps.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## Filling Rifts to full

Each Rift's effect scales with its total fill, and its three milestones sit at fixed percentages — Vacuum at 4%, 6% and 40%; Decay at 20%, 60% and 100%; Chaos at 9%, 15% and 100%; Recursion at 10%, 15% and 100%; Paradox at 15%, 25% and 50%. The 100%-fill milestones are the big prizes (extra Replicanti Galaxies, passive EP income, Galaxy Generator access), so plan fills around them. <!-- vendor/ad-source/src/core/secret-formula/celestials/rifts.js:27-46,66-94,124-141,157-178,194-220 -->

Filling drains 3% of the linked resource per second per active Rift, two at most. Practical consequences:

- **Vacuum (IP):** fill while IP income exceeds the drain; idle it during IP-spending bursts (Infinity upgrades, Break upgrades, shard-adjacent purchases).
- **Decay (Replicanti):** needs Replicanti flowing faster than the drain — push Vacuum to 6% (uncapped Replicanti) and the Replication-glyph effect first if it stalls. Its fill can pass 100%, and the excess is what Chaos spends.
- **Chaos (Decay fill):** drains your Decay *percentage*, not a currency: each 1% of Chaos costs 10% of Decay's fill. Its 9% milestone keeps Decay's effect maxed and its milestones active from then on, so fill Decay high first, then let Chaos take 90% of it ([Pelle Strikes](/guide/m2/pelle-strikes) has the order).
- **Recursion (EP):** the long one. Fill it during late-Doom EP farming with a Time glyph equipped (EP^0.3 scaling once Chaos's glyph milestone is on).
- **Paradox (Dilated Time):** fills alongside normal post-Dilation play; its second milestone raises Tachyon gain to the 1.4th power, speeding its own completion.

## The Galaxy Generator

At 100% Recursion the Pelle tab gains the **Galaxy Generator**: it passively manufactures Generated Galaxies, which cut Tickspeed costs exactly like Antimatter Galaxies but never raise the Galaxy price. Five Generator upgrades spend Generated Galaxies (base rate), Antimatter, IP and EP (multipliers) — base cost 3 per level scaling ×3, multipliers ×10 per level, so buy base first and multipliers as their currencies allow. <!-- vendor/ad-source/src/core/secret-formula/h2p.js:1820-1845 vendor/ad-source/src/core/secret-formula/celestials/galaxy-generator.js:17-63 -->

Generation is capped in phases: 1,000, then 1e5, 1e7, 1e9 and 1e10 galaxies. Each cap names the Rift holding it back. **Sacrificing** the named Rift — a one-way button on the Generator panel — destroys that Rift (its effect and milestones go with it) and lifts the cap to the next one. Order: Vacuum at 1,000, Paradox at 1e5, Decay at 1e7, Chaos at 1e9, Recursion at 1e10. <!-- vendor/ad-source/src/core/secret-formula/celestials/rifts.js:26,65,123,156,193 vendor/ad-source/src/core/celestials/pelle/galaxy-generator.js:10-14,58-83 -->

<Callout kind="warning">

Sacrifices are permanent for the rest of the Doom. Before each one, spend the Rift's benefits while you still have them: fill it as far past its milestones as is cheap, bank the currencies it boosted, and only then sacrifice.

</Callout>

<Screen
	src="pelle/reality-imaginary-0.webp"
	alt="The Imaginary Upgrades subtab inside Doom: the capped Machine header with the disabled-upgrade note and the repeatable rows below."
	caption="Imaginary Upgrades in Doom. Most one-time effects switch off here, so buy everything you can before Dooming."
/>

## The final push

After the fifth sacrifice there is no cap. Generated Galaxies explode, Tickspeed collapses, and antimatter climbs toward <Num value="9e15" /> (log-scale) — the number that drives the ending sequence. Keep the Generator upgrades bought, stay Dilated, and let it run: the last stretch is idle-friendly. Past a threshold the tab names glitch and the screen starts to go — that is the game ending, covered in [Beating the game](/guide/m2/beating-the-game). <!-- vendor/ad-source/src/core/celestials/pelle/game-end.js:17-23 -->

## Further reading

- In-game How to Play: Pelle, Pelle Strikes, The Galaxy Generator (Info tab → How to play; unlocked progressively)
- Fandom Guide, Pelle section — https://antimatter-dimensions.fandom.com/wiki/Guide
