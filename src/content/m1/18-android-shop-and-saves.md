---
title: 'Android features, shop and saves'
stage: pre-infinity
order: 20
summary: 'The Shop and STD coins, ads, offline progress and Max offline ticks, cloud saves versus exports, and battery notes.'
verified:
  android: '3.18.0'
  upstream: '5409e320cecef96a917cca1dfb68f1f183e499ca'
---

<script>
	import Callout from '#lib/components/Callout.svelte';
	import Screen from '#lib/components/Screen.svelte';
</script>

## The Shop ($ tab) and STD coins

The **$ tab** holds the Shop, which sells permanent boosts for **STD coins** ("Support The Developer"). STDs are bought with real money through the Play Store, and the Shop only works once you tap **Sign in to enable the Shop and cloud saving**. The app lists, in this order:

| Item, as the app words it                                                         | Cost                                 |
| --------------------------------------------------------------------------------- | ------------------------------------ |
| Permanent Ad bonus                                                                | 30 STD                               |
| Golden Bottom Buttons (pick any color for the bottom buttons, change it any time) | 50 STD                               |
| Increase your IP gain by 100% (additive)                                          | 40 STD                               |
| Increase your EP gain by 200% (additive)                                          | 50 STD                               |
| Double Antimatter Dimension multipliers (multiplicative)                          | 30 STD                               |
| Double all Dimension multipliers (multiplicative until 32x)                       | 60 STD                               |
| Increase your Replicanti gain speed by 50% (additive)                             | 60 STD                               |
| Increase your Dilated Time gain speed by 50% (additive)                           | 40 STD                               |
| Increase your Reality Machine gain by 100% (additive)                             | 60 STD                               |
| Receive a Glyph of a random type with a level equal to your highest glyph level   | 20 STD                               |
| Get 6 hours of offline progress                                                   | 10 STD                               |
| Get 24 hours of offline progress                                                  | 20 STD                               |
| Unlock a Glyph cosmetic set of your choice                                        | 20 STD                               |
| Unlock all remaining Glyph cosmetic sets at once                                  | 420 STD, less once you own some sets |

The multiplier items can be bought again and again, and each card shows "Currently ×1, next: ×2" so you can see what the next purchase does. **Additive** means repeat purchases add to the bonus instead of multiplying it: the first IP purchase takes IP gain from ×1 to ×2, the first EP purchase from ×1 to ×3, and later ones add the same step again. The two "Double" items multiply by 2 each time; the all-Dimensions one does that until ×32. The offline-progress blocks run with autobuyers below full speed, as the cards say.

<!-- Shop cards and prices read in the emulator (Android 3.18.0: pre-infinity/shop-main-0..2, break-infinity save). Upstream shop-purchases.js has no Permanent Ad bonus, Golden Bottom Buttons or random-Glyph items. -->

<Screen
	src="pre-infinity/shop-main-0.webp"
	alt="The Shop tab on a new save: the Watch an Ad to boost your Antimatter Dimensions by ×2.00 for 5h button, the Sign in to enable the Shop and cloud saving button, You have 0 STD with Buy more, then the first cards: Permanent Ad bonus 30, Golden Bottom Buttons 50, IP gain +100% 40, EP gain +200% 50, Double Antimatter Dimension multipliers 30, Double all Dimension multipliers 60, Replicanti and Dilated Time +50%."
	caption="The top of the Shop on a fresh save. Each boost card shows its current and next multiplier."
/>

Nothing in the Shop is required to finish the game: every boost is a convenience multiplier, and the whole game can be finished without paying. The row under the cards controls what you bought:

- **Toggle IAP bonuses** switches all bought boosts off or back on; the left box shows the state (**IAP bonuses ENABLED**). Turn them off to play without them.
- **Respec IAPs** takes the STDs back out of the boosts so you can spend them differently. Offline-progress blocks, the random Glyph and cosmetic sets are one-time purchases.

STDs and Shop purchases stay on Android: the Shop itself notes that purchases on mobile, Steam and Web are separate and can't be transferred.

<Screen
	src="pre-infinity/shop-main-2.webp"
	alt="The bottom of the Shop: Reality Machine gain +100% 60, the random-type Glyph 20, 6 and 24 hours of offline progress 10 and 20, one Glyph cosmetic set 20 with Choose Set, all remaining sets 420 (Will unlock 35 sets), the disclaimer that purchases are not required and not transferable, and the IAP bonuses ENABLED, Toggle IAP bonuses and Respec IAPs buttons."
	caption="The end of the Shop: one-time purchases, then the IAP toggle and Respec IAPs."
/>

## Ads: optional and rewarded

The Play listing flags "Contains ads", but there are **no forced ads**. What exists:

- An optional **rewarded ad**: the green button at the top of the Shop. Each view gives a bonus for 5 hours, and the bonus follows your progress. A new save gets "boost your Antimatter Dimensions by ×2.00". Later saves get more IP, then ×2 Dilated Time, ×2 Reality Machines, +5% Glyph rarity or ×1.50 Ra Memories.
- **Permanent Ad bonus** (30 STD, first card in the Shop): the ad bonus without watching ads.

If you never tap the button, ads never interrupt play. Until you give consent, the button reads "Provide consent to collect data to be able to watch Ads for a bonus". **Update personalization consent** (Options → Ads & Personalization) changes that choice later.

<!-- Ad button texts read on the shop-main-0 captures of each stage (pre-infinity through imaginary-machines), Android 3.18.0. -->

## Offline progress and Max offline ticks

Closing the app costs no battery: the game does not run in the background. When you reopen it, it **simulates** the time you were away on a "Calculating offline progress" screen, then sums up the result in a "While you were away for …" popup. Three controls under Options → Other decide how that goes:

- **Offline progress** cycles through three states each time you tap it:
  - **SHOWN** (the default): the game simulates your time away and shows the "While you were away" popup.
  - **HIDDEN**: the game still simulates your time away, without the popup.
  - **DISABLED** (red border): nothing is simulated. You come back to exactly what you left, and offline rewards such as the offline Infinity Point upgrade and the offline Eternity milestones give nothing. **If a night away earned nothing at all, check this button first.**
- **Max offline ticks** (1,000 to 1,000,000; a new game starts at 1,000) is how many steps the simulation splits your time away into. Each step covers at least 50 ms, so a short absence uses fewer: 8 hours away took 576,783 ticks with the setting at 1,000,000. Fewer, longer steps mean your autobuyers fire less often than they would while you play, so offline gains fall short. More steps follow online play more closely but take longer to calculate: those 8 hours took about two minutes in our emulator.
- **Away Progress Options** chooses which resources the "While you were away" popup lists (on a new game: Ad bonus, Antimatter, Dimension Boosts and Antimatter Galaxies). It only changes the popup, not what is simulated.

<!-- Emulator (Android 3.18.0): tapping Offline progress goes SHOWN → HIDDEN → DISABLED → SHOWN. With HIDDEN, 90 s in the background advanced "You have played for" by 93 s with no popup; with DISABLED, by 1 s. Max offline ticks slider ends at 1,000,000; a fresh game (pm clear, Start game) shows 1,000 and UI update rate 50 ms. 8 h fast-forward at 1,000,000: "27120/576783 ticks done", "Time left: 01:43", i.e. 50 ms per tick at least (upstream storage.js maxOfflineTicks uses 33 ms). -->

<Screen
	src="pre-infinity/new-game/options-main-2.webp"
	alt="The lower half of the Options tab on a new game: Save & Load buttons, then Other with Max offline ticks at 1,000, UI update rate 50 ms, Offline progress SHOWN, Sleep NEVER, Battery saver OFF, and the Away Progress Options button."
	caption="Options → Other on a new game. Offline progress is in the left column, Max offline ticks at the top left, Away Progress Options at the bottom."
/>

<Callout kind="android">

The "Calculating offline progress" screen has two buttons. **SPEED UP BY ×2** halves the ticks left to simulate (down to 500), and **SKIP** simulates all the remaining time in 10 ticks. Both get you back sooner by making the simulation coarser, so they never earn you more. If you have the time, let it finish.

</Callout>

<!-- vendor/ad-source/src/core/game.js:995-1020 (Speed up: remaining ticks halved, min 500; SKIP: remaining time in 10 ticks); emulator: "SPEED UP BY ×2" and "SKIP" on the Calculating offline progress screen. -->

## Cloud saves versus manual export

Two backup systems, different jobs:

- **Cloud saving** (Options → Save & Load → **Enable cloud saving** / **Load cloud save**) syncs through Google Play Games. It is automatic once enabled and convenient across your own Android devices — force one before switching devices by holding the cloud button. It does **not** sync to web or Steam, and the web/Steam cloud cannot be pushed back to Android (Android can _load_ a web cloud save via a dedicated menu, one-way).
- **Manual export** copies the save as text (tap **Export to web/steam** or **Export to mobile**) or writes it to a text file you keep yourself (hold **Share save**, then pick a format). It is the only route onto a PC or into adg's [Save import](/import). Full steps: [Saving and exporting](/guide/m1/saving-and-exporting).

Keep both: cloud for convenience, a manual export somewhere safe (Drive, email to yourself) before anything risky. Uninstalling the app wipes local saves, so **never reinstall to fix a problem before exporting** — the devs repeat this in every crash thread.

## Battery, background and display

- **Battery saver** (Options) reduces visual effects; **Sleep NEVER** controls whether the screen stays on. The game simulates rather than running, so closing it is always the battery-friendly move.
- **UI update rate** is how often the screen redraws: lower is smoother but uses more CPU and battery. A new game starts at 50 ms, which is fine on modern phones.
- **Orientation PORTRAIT** locks the layout — recommended, since rotation during heavy screens (Graphs, offline calc) has caused crashes on some devices.
- **Theme**: if the app ever crashes on every launch after a theme change, do not reinstall (see above) — clear the app's cache or wait for the fix; the 3.13.0 System-theme boot crash was fixed in 3.13.1.

## Further reading

- [Fandom Shop](https://antimatter-dimensions.fandom.com/wiki/Shop) and [Offline Progress](https://antimatter-dimensions.fandom.com/wiki/Offline_Progress) (reference pages, current).
- In-game Info → How to play → "Your savefile" (save formats and cloud scope, in your build's own words).
