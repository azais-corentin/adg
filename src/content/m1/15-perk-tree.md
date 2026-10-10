---
title: 'Perks: the early tree'
stage: early-reality
order: 26
summary: 'How Perk Points and the perk tree work, and the recommended route for your first dozen Realities.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## How perks work

Each Reality gives exactly **1 Perk Point**, and each perk costs 1 point. You can only buy perks adjacent to ones you already own, and a new tree owns none: **your first Perk Point must go into START**, the card in the middle of the tree ("Remove the achievement requirement from the Reality Study, and allow you to choose from 4 different Glyphs on Reality."). It is the only perk you can buy after your first Reality; tapping any other card does nothing, without a message. From your second Reality on, follow the order below. Loops in the tree can be walked either way, so plan a route, not a shopping list. <!-- in-game How to Play, "Perks"; vendor/ad-source/src/core/secret-formula/reality/perks.js firstPerk; emulator (Android 3.18.0), community early-reality-first save: 1 Perk Point, only START highlighted (black card, green text) as buyable; round-4 review: tapping EU1 does nothing, tapping START buys it (PP 1 → 0) -->

Most perks are convenience rather than raw power: autobuyers, auto-unlocks, removed requirements. Perks whose label ends in an AP amount, like **ACH1 (+5 AP)**, also grant Automator Points, which count toward the 100 needed for the Automator. On Android each perk is a card with its label and full text; drag to move around the tree, and tap a card to buy it once it is next to one you own.

<Screen
	src="early-reality/first-reality/reality-perks-top.webp"
	alt="The Perks subtab after the first Reality: START in the middle, highlighted as the only buyable card with green text on black, reading Remove the achievement requirement from the Reality Study, and allow you to choose from 4 different Glyphs on Reality; EC5R, PASS and EC1R above it, SAM, ANR and DAB (+5 AP) below, ACH1 (+5 AP), EU1, EU2 and DAU (+5 AP) to the right, all greyed out."
	caption="The perk tree after your first Reality: only START can be bought. Cards marked (+5 AP) also give Automator Points."
/>

## Recommended order

This follows the community perk route (Tables61's perk guide with later refinements), starting with your second Perk Point, after START. Perks mostly save time rather than multiply power, so treat any order as guidance — but this one removes the biggest early walls first.

1. **EU1, EU2.** EU1 auto-unlocks the first row of Eternity Upgrades free (all three once you have any Eternities); paired with the Existentially Prolong upgrade (start with 100 Eternities) it fires on every Reality and speeds up early Eternities enormously. EU2 buys the second row at 1e10× discount.
2. **DAU, DILR.** DAU unlocks autobuyers for the repeatable Dilation Upgrades. DILR removes the EC11/EC12 and Theorem-count requirements from the Dilation unlock — it skips the grueling EC11 slog inside every early Reality.
3. **EC5R, ACT.** EC5R drops the EC5-completion requirement from study 62 (faster Replicanti); ACT pins Active-path EP at a flat ×50, turning it into a high-power route with no ramp-up.
4. **PASS, EC1R, ECR, ECB, TTS.** PASS sets Passive-path EP to ×50, perks up study 142, and triples Replicanti speed via study 132; EC1R/ECR strip Eternity Challenge unlock requirements; ECB lets you clear several EC tiers at once when you overshoot a goal; TTS adds the Time Theorem autobuyer the Automator scripts rely on.
5. **The ACH line to ACHNR.** ACH1–ACH4 shorten the 30-minute auto-achievement timer stepwise (20 → 12 → 6 → 2 minutes); ACHNR keeps all pre-Reality achievements across Realities, ending the re-earn chore entirely. Grab ACH1 early if the timer annoys you; otherwise take the whole line here.
6. **TGR and TP1–TP4.** TGR stops the 2nd rebuyable Dilation Upgrade from wiping Dilated Time; TP1–TP4 retroactively multiply Tachyon Particles (×1.5, ×2, ×2.5, ×3 on the 3rd rebuyable), so you stop babysitting Dilation runs.

## Alternative opening

If your second Reality glyph is a Time glyph with EP multiplier (great for Eternity speed, useless for early Infinities), the pre-Infinity stretch can drag. Starting SAM then ANR instead — starting antimatter plus Dimension Boosts and Galaxies no longer resetting your Dimensions — cuts that grind, then pivot back into EU1 and DILR.

## Further reading

- In-game How to Play: Perks (Info tab → How to play).
- Tables61's [guide to perks and perk choices](https://www.reddit.com/r/AntimatterDimensions/comments/113aoz7/) (summarized here in our own words).
