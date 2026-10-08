---
title: 'Singularities'
stage: laitela
order: 12
summary: 'Condensing Dark Energy, managing the cap, and which milestones matter most.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
</script>

## Condensing

When Dark Energy reaches the cap — 200 to start — the Lai'tela tab offers **Condense**: all current DE resets to zero and you gain Singularities. Only DE resets; Dark Matter and the Dimensions stay exactly as they are. Overflow above the cap is wasted, so condense promptly unless you are deliberately saving for a bigger cap. <!-- vendor/ad-source/src/core/secret-formula/h2p.js:1720-1754 vendor/ad-source/src/core/celestials/laitela/singularity.js:217-277 -->

After your first 10 total Singularities you unlock the cap controls: each step raises or lowers the DE needed per condense by ×10 (never below 200). Raising the cap yields *more than* ×10 Singularities per condense, so big caps pay off if you can afford to wait; small caps cycle faster. <!-- vendor/ad-source/src/core/secret-formula/h2p.js:1720-1754 -->

How many you get per condense grows with cap-increase steps, the repeatable Singularity-gain milestones, and Entropic Condensing (Imaginary Upgrade 10) — buy that upgrade before leaning into long condenses. <!-- vendor/ad-source/src/core/celestials/laitela/singularity.js:222-230 -->

## Managing the cap

- **Active play:** keep the cap low (200–2,000) and condense often. Fast cycles complete the early milestones quickly.
- **Idle or overnight:** raise the cap so production is not wasted while you are away. Pair it with Offline Progress (Options → Max offline ticks) so Dark Energy keeps accumulating.
- **Upgrade 17's task** needs one condense of 20+ Singularities: raise the cap until the preview promises 20, then condense once with auto-condense set above that cap level.
- Auto-condense (a Singularity milestone) condenses for you at the cap, with an optional extra wait multiplier — set it once your DE income makes manual condensing tedious.

<Callout kind="android">

Condensing is one tap on the Lai'tela tab, safe to do any time: it never resets progress outside the DE bar. On a phone, small-cap active condensing while you watch is the fastest early milestone income in this stage.

</Callout>

## Milestones

Singularity Milestones work like Eternity Milestones: reaching the listed total unlocks them permanently, and Singularities are never spent. There are three kinds — one-time, limited-repeat, and infinitely repeatable — and each helps either Lai'tela itself, the rest of the game, or scales Lai'tela off outside resources. <!-- vendor/ad-source/src/core/secret-formula/h2p.js:1720-1754 -->

Milestones worth pushing toward early:

- **Continuum, Dark Matter and Dark Energy multipliers** (repeatable): the backbone scaling of the whole stage.
- **Dark Dimension cost and interval reductions**: make Ascensions come much sooner.
- **Auto-condense and Dark Dimension / Ascension autobuyers**: the point where the stage starts running itself.
- **Annihilation autobuyer** (late unique): automates the DM multiplier loop from the previous article.

The demanding unique milestones scale Dark Matter off outside totals (Infinities, Time Theorems, game speed, Dilated Time). When you approach one, swap to a glyph set rich in the matching type for the push Reality — for example Infinity glyphs for the Infinities-scaling milestone — then swap back to your working set. Completing every milestone once earns the achievement "This mile took a celestial". <!-- vendor/ad-source/src/core/secret-formula/celestials/singularity-milestones.js -->

## Further reading

- Fandom Guide, Lai'tela/Singularity sections — https://antimatter-dimensions.fandom.com/wiki/Guide
