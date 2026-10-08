---
title: 'Beating the game'
stage: pelle
order: 13
summary: 'The ending sequence, the credits, and what a new run keeps.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Checklist from '#lib/components/Checklist.svelte';
</script>

## The ending

Past the final Galaxy Generator cap, antimatter keeps climbing until the game's end meter — driven by total antimatter across the Doom — fills. The screen tells you what is happening as it happens: tabs start glitching into zalgo text, interaction fades, saving disables, and the numbers themselves end before the credits roll. There is nothing to optimize here; the sequence plays itself once your galaxies are uncapped. Let it run to the end rather than reloading — interrupting it just replays the wait. <!-- vendor/ad-source/src/core/celestials/pelle/game-end.js:1-51 -->

<Callout kind="android">

The ending runs for several minutes with animations. Plug the phone in, leave the app in the foreground (backgrounding may pause the game loop and stall the sequence), and dismiss nothing until the New Game button appears.

</Callout>

## Credits and the New Game button

After the fade comes the credits: the full contributor list scrolls with the end song, and then a **New Game** button appears, offering a cosmetic glyph-set choice first if any sets are still locked. Starting it increments your full-game completion count — shown in Statistics as "You have completed the entire game N times" — and resets the run with carryovers. <!-- vendor/ad-source/src/core/new-game.js:1-48 vendor/ad-source/src/components/tabs/statistics/StatisticsTab.vue:202-205 -->

What a new run keeps: the completion counter itself, unlocked glyph cosmetic sets, speedrun records if a speedrun was active, and the usual option settings. Everything else starts over from 10 antimatter — deliberately. A second run is dramatically faster: you keep your knowledge, the early game has no new surprises, and many players set a speedrun seed or chase the remaining achievements (the final rows, "The End" among them) on the way back through. <!-- vendor/ad-source/src/core/new-game.js:43-100 vendor/ad-source/src/core/player.js:276 -->

## After the end

- **Replay the story.** Most completions go straight back in: a fresh run to Pelle takes a fraction of the first, and the Automator can replay your proven scripts.
- **Hunt achievements.** Secret achievements and the last normal rows (including Doomed-only ones like "One more time" through "The End") are cleaner targets when you know the whole map.
- **Speedrun mode.** Importing the word `speedrun` as a seed starts a timed run with per-milestone records; completions archive automatically.
- **Stay on this guide.** Every article stays valid for the next run — and your save import keeps working, so [checklists](/checklists) and the stage detector follow you from the first Dimension to the next Doom.

<Checklist stage="pelle" />
