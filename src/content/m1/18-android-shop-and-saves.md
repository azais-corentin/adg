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

The **$ tab** holds the Shop, which sells permanent boosts for **STD coins** ("Support The Developer"). STDs are bought with real money through the Play Store. Base prices from upstream (`secret-formula/shop-purchases.js`); sale or bundle pricing on-device may differ, so treat these as the reference list:

- **30 STD** — double production of all Antimatter Dimensions (2× AD mult).
- **60 STD** — double production of all Dimensions (stacking per row toward the aggregate shown).
- **60 STD** — +50% Replicanti speed.
- **40 STD** — double Infinity Point gain.
- **50 STD** — triple Eternity Point gain.
- **40 STD** — +50% Dilated Time gain.
- **60 STD** — +100% Reality Machine gain on Reality.
- **10 / 20 STD** — blocks of offline progress (6 h / 24 h).
- **20 STD** — a cosmetic glyph set of your choice.
- **~420 STD** — unlocking all remaining sets at once (scales down as you own more).

<Screen
	src="pre-infinity/shop-main-0.webp"
	alt="The Shop tab on a new save: the watch-an-ad bonus at the top, the sign-in prompt, and the permanent STD bonus rows below it."
	caption="The Shop on a fresh save. Sign in to enable purchases; the ad bonus row works without signing in."
/>

Nothing in the Shop is required to finish the game — every boost is a convenience multiplier, and the full progression is completable free. Purchases can be **respecced** (the Respec button refunds STDs for redistribution). STDs and Shop purchases do not transfer to the web or Steam versions.

## Ads: optional and rewarded

The Play listing flags "Contains ads", but there are **no forced ads**. What exists:

- An optional **rewarded ad** (Ads & Personalization section of Options) that grants a temporary production multiplier — commonly 2× production for a few hours — per view.
- A **Permanent Ad Bonus** purchase that grants the ad bonus without watching ads.

If you never open the section, ads never interrupt play. The "Update personalization consent" button in Options controls ad personalization.

## Offline progress and Max offline ticks

Closing the app costs no battery: the game does not run in the background. When you reopen it, it **simulates** the elapsed time — that is the "While you were away for N seconds" popup — using your autobuyer settings at a configurable fidelity:

- **Max offline ticks** (Options → Other) sets how many simulation ticks the game may use, from 1,000 up to 1,000,000.
- Low values mean autobuyers fire rarely in simulation, so offline progress feels slow. Raise it if your overnight gains disappoint: 50,000–100,000 is the sweet spot most players land on, and 1,000,000 gives near-online fidelity at the cost of a long loading simulation (a minute or more on older phones).
- **Offline progress SHOWN** toggles the popup; **Away Progress Options** (new in 3.18.0) configures what it covers.

<Screen
	src="pre-infinity/options-main-2.webp"
	alt="The Options tab lower pages on a new save: cloud save and Other settings including Max offline ticks at 1,000, UI update rate, and offline progress toggles."
	caption="Options on a fresh save. Raise Max offline ticks from its 1,000 default when overnight gains disappoint."
/>

<Callout kind="android">

The popup only *reports* simulated progress, and its Skip/Speed-up buttons trade accuracy for a faster return to the game — never pick Skip thinking it earns more. The speed comes from Max offline ticks and from autobuyers (especially the offline-IP Infinity Upgrade later). Ticks never exceed one-million total and each caps at ~30 s of game time, so very long absences still simulate faithfully in chunks.

</Callout>

## Cloud saves versus manual export

Two backup systems, different jobs:

- **Cloud saving** (Options → Save & Load → **Enable cloud saving** / **Load cloud save**) syncs through Google Play Games. It is automatic once enabled and convenient across your own Android devices — force one before switching devices by holding the cloud button. It does **not** sync to web or Steam, and the web/Steam cloud cannot be pushed back to Android (Android can *load* a web cloud save via a dedicated menu, one-way).
- **Manual export** (holding **Share save**, then Export to web/steam or Export to mobile) writes a text file you keep yourself — the only route onto a PC or into adg's [Save import](/import). Full steps: [Saving and exporting](/guide/m1/saving-and-exporting).

Keep both: cloud for convenience, a manual export somewhere safe (Drive, email to yourself) before anything risky. Uninstalling the app wipes local saves, so **never reinstall to fix a problem before exporting** — the devs repeat this in every crash thread.

## Battery, background and display

- **Battery saver** (Options) reduces visual effects; **Sleep NEVER** controls whether the screen stays on. The game simulates rather than running, so closing it is always the battery-friendly move.
- **UI update rate** trades smoothness for CPU/battery; the default 33 ms is fine on modern phones.
- **Orientation PORTRAIT** locks the layout — recommended, since rotation during heavy screens (Graphs, offline calc) has caused crashes on some devices.
- **Theme**: if the app ever crashes on every launch after a theme change, do not reinstall (see above) — clear the app's cache or wait for the fix; the 3.13.0 System-theme boot crash was fixed in 3.13.1.

## Further reading

- [Fandom Shop](https://antimatter-dimensions.fandom.com/wiki/Shop) and [Offline Progress](https://antimatter-dimensions.fandom.com/wiki/Offline_Progress) (reference pages, current).
- In-game Info → How to play → "Your savefile" (save formats and cloud scope, in your build's own words).
