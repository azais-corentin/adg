# Android ground truth — Antimatter Dimensions (for `adg`)

Research date: **2026-10-08**. Target scope: **latest Android version (Google Play) only**.
Method: direct page reads (Play listing, APKPure + version history, Fandom wiki, Steam store, App Store listing, GitHub API)
plus web-search excerpts where the reader was blocked (Reddit new-UI blocked; old.reddit redirects to login wall).
Claims not directly opened are marked `[SEARCH-ONLY]`; guesses marked `[INFERENCE]`.

## 1. Google Play listing snapshot (directly read 2026-10-08)

Source: https://play.google.com/store/apps/details?id=kajfosz.antimatterdimensions&hl=en

| Field | Value |
|---|---|
| Package ID | `kajfosz.antimatterdimensions` |
| Developer / publisher | Jakub Kajfosz (support: antimatter.dimensions@gmail.com; site https://kajfik.github.io/) |
| Current version (What's-new header) | **3.18.0** |
| "Updated on" | **Oct 1, 2026** |
| Rating | 4.8★, 35.8K reviews (page also shows a 34.7K-review desktop/tablet slice) |
| Downloads | 1M+ |
| Monetization flags | "Contains ads" + "In-app purchases" |
| Content rating | Everyone |
| Categories/tags | Simulation; Idle, Casual, Single player, Offline, Sci-fi fantasy |
| Size (Play listing does not show it) | **64.2 MB XAPK** per APKPure, same version/date |

Verbatim "What's new" (3.18.0), Play listing 2026-10-08:
> NEW STUFF — Added new news / Added secret themes / Added Away Progress Options / Added the formula popup to some upgrades
> IMPROVED STUFF — Holding a Time Study now buys the shortest route to it first
> FIXED STUFF — Fixed a couple of crashes / Fixed the text of some upgrades not being centered

## 2. Android release timeline (dated)

APKPure upload dates (≈ Play release, may lag by days). Source for all rows unless noted:
https://apkpure.com/antimatter-dimensions/kajfosz.antimatterdimensions/versions (read 2026-10-08).

| Version | Date | Notes / changelog (source) |
|---|---|---|
| (initial launch) | 2019-07-08 `[SEARCH-ONLY]` | Official launch announced on r/AntimatterDimensions (https://www.reddit.com/r/AntimatterDimensions/comments/canrl2/antimatter_dimensions_for_android_is_out/); date per Apptopia/AppBrain. Native port by Jakub Kajfosz (u/FestinaLente167), started as university coursework `[SEARCH-ONLY]` |
| 3.0.0 | 2024-04-01 13:00 UTC | **Reality update reaches Android** — full endgame (Reality layer, Glyphs, Automator, Black Hole, Celestials). Source: https://antimatter-dimensions.fandom.com/wiki/Antimatter_Dimensions_Mobile (read 2026-10-08) |
| 3.0.x – 3.9.x | 2024-04 → 2024-09 | Post-Reality bugfix train; not enumerated (APKPure shows "Show More" beyond 3.9.5). Gap in this report |
| 3.9.5 | 2024-09-05 | Oldest version enumerated on APKPure page |
| 3.10.0 | 2025-01-08 | New: "Basic" glyph filter; load web cloud save; About-tab retrospective link. Source: https://www.reddit.com/r/AntimatterDimensions/comments/1hwuipo/mobile_update_3100_is_out/ `[SEARCH-ONLY]` |
| 3.10.1 | 2025-01-16 | (changelog not pulled) |
| 3.10.2 | 2025-04-17 | (changelog not pulled) |
| 3.11.1 | 2025-04-23 | (changelog not pulled) |
| 3.11.2 | 2025-04-24 | (changelog not pulled) |
| 3.11.3 | 2025-07-25 | |
| 3.11.4 | 2025-07-31 | |
| 3.11.5 | 2025-09-03 | |
| 3.11.6 | 2025-11-14 | |
| 3.12.0 | 2026-04-04 | |
| 3.12.1 | 2026-04-08 | |
| 3.13.0 | 2026-08-17 | Introduced "System" theme crash-on-launch regression (fixed in 3.13.1). Source: https://www.reddit.com/r/AntimatterDimensions/comments/1vq0cw1/game_crashed/ `[SEARCH-ONLY]` |
| 3.13.1 | 2026-08-17 | Hotfix (theme crash). Same source |
| 3.13.2 | 2026-08-18 | |
| 3.14.0 | 2026-08-25 | Memory-leak / overnight-crash fixes `[SEARCH-ONLY]` |
| 3.15.0 | 2026-09-02 | New: Graphs subtab, news, unspent-Perk-Points notifications, Nameless/Pelle visual effects. Notably references Cel 3/4/7 (Pelle) rifts, Continuum, Amplified Realities — i.e. full Celestial content present. Source: https://www.reddit.com/r/AntimatterDimensions/comments/1w5d0ys/android_update_3150_is_out/ `[SEARCH-ONLY]` |
| 3.16.0 | 2026-09-11 | Graphs/Autobuyers-freeze + orientation-crash fixes `[SEARCH-ONLY]` |
| 3.17.0 | 2026-09-18 | |
| **3.18.0 (current)** | **2026-10-01** | Changelog §1 above. Source: Play listing + APKPure (both read 2026-10-08) |

Cadence signal: ~weekly releases Aug–Oct 2026 (3.13.0→3.18.0 in 6 weeks). The app is actively maintained.

## 3. Codebase: what the Android app is built from

| Claim | Source / status |
|---|---|
| Mobile client is **closed-source**; only the issue tracker is public | https://github.com/antimatter-dimensions/mobile-issues (read via API 2026-10-08: 10★, 3 open issues, contains only `.github/ISSUE_TEMPLATE/*`, no game code). Fandom: "The source code for the Android version is not public like the web version" (cites https://www.reddit.com/r/AntimatterDimensions/comments/h0ioep/source_code_for_mobile/) |
| Open-source reference is `IvarK/AntimatterDimensionsSourceCode` (JS/Vue web Reality code); legacy host `IvarK/IvarK.github.io`; shared lib `antimatter-dimensions/notations` | `[SEARCH-ONLY]` — https://github.com/IvarK/AntimatterDimensionsSourceCode |
| Widely reported as a **native rewrite (Kotlin/Java), not a WebView wrapper**; kept private anti-clone rationale | `[INFERENCE — widely reported, not verifiable from public sources]`. Counter-signal: official troubleshooting tells users to update **Android System WebView / Chrome** to fix startup-crash waves, so the app at minimum embeds WebView components (https://www.reddit.com/r/AntimatterDimensions/comments/mba2re/how_to_fix_an_issue_where_the_app_crashes_on_start/ `[SEARCH-ONLY]`) |
| Mobile dev: Jakub Kajfosz (`kajfik`, u/FestinaLente167); web/Steam lead: Hevipelle (IvarK) | Play developer field + Fandom + Steam store page (read 2026-10-08) |

## 4. Platform-parity table (Android vs Web vs Steam vs iOS)

| Axis | Android (target) | Web | Steam | iOS |
|---|---|---|---|---|
| Distributor / ID | Google Play `kajfosz.antimatterdimensions`, Jakub Kajfosz (read 2026-10-08) | `https://ivark.github.io/AntimatterDimensions/` `[SEARCH-ONLY]` | App 1399720, devs Hevipelle/Omsi/Razenpok/Spectralflame/WaitingIdly, pubs Hevipelle/Makopaz; released **2022-12-17** (store page read 2026-10-08) | App Store id `6738206800`, Jakub Kajfosz, 96.4 MB, 4.8★/148 ratings (listing read 2026-10-08) |
| Current version | **3.18.0 (2026-10-01)** | Rolling (no public semver; changelog modal + commits) `[SEARCH-ONLY]` | Rolling builds (e.g. 2-Year Anniversary Build 16370635, 2024-12-17) `[SEARCH-ONLY]` | **2.3 (~2026-10-03)**; rapid 1.0→2.3 since **Jul 16** (year `[INFERENCE: 2026]` from cadence anchor "2.3, 5d ago") |
| Reality content | **Full parity**: Reality layer, Glyphs, Automator, Black Hole, all 7 Celestials incl. **Pelle** (3.0.0 on 2024-04-01; 3.15.0 notes cite Pelle rifts, Continuum, Amplified Realities) | Full (Reality update Dec 2022; open-source) | Full (launched with Reality Dec 2022) | Full Reality content per listing/reviews (read 2026-10-08) |
| Cross-version feature lag | ~1 week behind sibling mobile: Graphs subtab Android 3.15.0 (Sep 2) → iOS 2.0 (Sep 11); Away Progress Options Android 3.18.0 (Oct 1) → iOS 2.3 (~Oct 3) | Reference implementation | Reference implementation | ~1 week behind Android on shared features (same rows) |
| Saves | Google Play Games cloud; **manual** export/import to Web/Steam via base64 string ("Export to web/steam"); can *load* web cloud save, cannot push back `[SEARCH-ONLY]` | Browser local + Google Drive cloud `[SEARCH-ONLY]` | PlayFab cloud `[SEARCH-ONLY]` | Game Center; save-string import from Web/Steam/Android (listing reviews + `[SEARCH-ONLY]` reddit) |
| IAP / Shop | STD coin shop (Android; §5). Purchases do **not** transfer to Web/Steam `[SEARCH-ONLY]` | Kongregate Kreds legacy; no STD shop `[SEARCH-ONLY]` | In-App Purchases tag on store page (STD-equivalent shop exists in client) — store page read 2026-10-08; details `[INFERENCE]` | Same STD-style shop as Android (IAP flag on listing; full item parity `[INFERENCE]`) |
| Achievements | In-game 144+ mapped to Google Play Games (resync by sign-out/in) `[SEARCH-ONLY]` | In-game only | 100 curated Steam achievements (store "About" text, read 2026-10-08) | Game Center achievements; iOS 2.3 adds Game Center opt-out toggle (version history read 2026-10-08) |
| Hotkeys | None (touch; sticky buttons; Time-Study long-press) `[SEARCH-ONLY]` | Full (M/C/D/G/S/E/R/B, 1–8, U/Shift+U, Ctrl+Z/Y) `[SEARCH-ONLY]` (Fandom Keyboard Shortcuts page exists, not opened) | Same as Web | Magic-Keyboard hotkeys added in iOS 1.6 (version history read 2026-10-08) |

Fandom's "no iOS version nor plans (2024-04-01)" note is **outdated** — official iOS app exists (see above). Flag to readers.

## 5. Android-specific feature list (each row sourced)

| # | Feature / difference | Source |
|---|---|---|
| 1 | **Shop ($) with STD ("Support The Developer") coins**: 30 STD 2× AD mult; 60 STD 2× ALL dims (→32×); 40 STD 2× IP; 60 STD +50% Replicanti; 50 STD 3× EP; 40 STD +50% DT; 60 STD +100% RM; 10 STD 6h offline; 20 STD 24h offline; 20 STD glyph cosmetic set; 420−12/set unlock-all. **Respec supported.** Nothing required to finish | https://antimatter-dimensions.fandom.com/wiki/Shop (read 2026-10-08) |
| 2 | **Opt-in ads**: no forced ads; rewarded ad = 2× production/4h; **Permanent Ad Bonus** purchase removes the need (`[SEARCH-ONLY]` for exact 2×/4h figures — Play "Contains ads" flag confirms ads exist; figures from https://www.reddit.com/r/AntimatterDimensions/comments/gh6s80/most_effective_bonus_when_supporting_the_devs/) | Play listing flag (read) + reddit `[SEARCH-ONLY]` |
| 3 | **Cloud saves via Google Play Games** (auto + force by tap/hold Cloud Save in Options); Play Games achievements; cross-compatible save *strings* with Web | Fandom Mobile page (read 2026-10-08) |
| 4 | **Offline progress = tick simulation**, not background running: 0% battery when closed; on reopen simulates elapsed time at 500–1,000,000 "Max offline ticks" (default low); low ticks ⇒ autobuyers fire rarely ⇒ offline feels slow; never Skip/Speed-up; 1-day-per-tick cap; Black-Hole-aware tick weighting; can disable entirely | https://antimatter-dimensions.fandom.com/wiki/Offline_Progress (read 2026-10-08) |
| 5 | **Automator fully present** (text + block modes); same limits (20 scripts / 10k chars / 60k total / 30 constants); scripts import/export as text — mobile users mostly paste community scripts; touch editor with command modals; no keyboard shortcuts; play/pause/step via on-screen buttons `[SEARCH-ONLY]` | reddit/Discord lore via search; limits from https://en.namu.wiki/w/Antimatter%20Dimensions `[SEARCH-ONLY]` |
| 6 | **Touch UI**: bottom navigation (+ optional sticky side nav on tablets), sticky bottom action buttons (hold ~1s to lock "held"), long-press Time Study buys shortest route (new in 3.18.0), portrait lock recommended | 3.18.0 Play changelog (read); sticky/orientation from reddit `[SEARCH-ONLY]` |
| 7 | **Notations**: full shared-library set (Scientific, Standard, Engineering, Logarithm, Letters, Mixed-*, Dots/Braille, Brackets, Roman, Hex, Clock, Emoji/Cancer, Blind, etc.) via `antimatter-dimensions/notations`; Dots = "painful notation" tied to secret achievement "Do you enjoy pain?" `[SEARCH-ONLY]` | https://github.com/antimatter-dimensions/notations + Fandom Achievements `[SEARCH-ONLY]` |
| 8 | Mobile-specific progression aids: offline-IP Infinity upgrade ("50% of best IP/min while offline"), mobile-appropriate replacement achievements (copyrighted/desktop-specific secrets swapped at 2019 launch) `[SEARCH-ONLY]` | launch announcement https://www.reddit.com/r/AntimatterDimensions/comments/canrl2/ + Steam forum `[SEARCH-ONLY]` |

## 6. Official changelogs (Android)

- **3.18.0 (2026-10-01)**: quoted verbatim in §1 (Play + APKPure, read 2026-10-08).
- **3.15.0 (2026-09-02)** `[SEARCH-ONLY]` (https://www.reddit.com/r/AntimatterDimensions/comments/1w5d0ys/android_update_3150_is_out/): New — news ticker entries, Graphs subtab, unspent Perk Points in upgrade notifications, broken-NC (Nameless) + sacrificed-rift (Pelle) visuals. Improved — orange purchased Infinity Upgrades, EU1 reword, Continuum re-enable fix, uncapped Amplified Realities + "Simulating Amplified Reality" dialog. Fixed — crashes, Cel-4 requirement display, tablet wide layout, light-theme glyph header / Pelle rift text, dialogs stuck at endgame, "Start this Reality over" wrongly granting RM, rare STD-coin/IAP reset, Reality glow in Teresa pre-requirement, Automator hyper-speed after offline, sticky side-nav tabs, auto-unhide bugs, sticky button during offline purchases, Autobuyers-tab freeze at Reality start, Cel-7 hidden-tab resets, IC4 exponent display, emoji loss in presets/scripts, Celestial intro quotes.
- **3.10.0 (2025-01-08)** `[SEARCH-ONLY]` (https://www.reddit.com/r/AntimatterDimensions/comments/1hwuipo/mobile_update_3100_is_out/): New — "Basic" glyph filter, load-web-cloud-save, SpectralFlame retrospective link. Updated — Shop + Cloud Save sign-in menus, sign-out from Shop tab. Removed — obsolete glyph filters. Fixed — crash, typo, wrong glyph images.
- Steam 2-Year Anniversary (Build 16370635, 2024-12-17) `[SEARCH-ONLY]` (https://steamdb.info/patchnotes/16370635): DAB perk, retained Study Presets + Companion Glyphs on restart, late-game balance, customizable Modern-UI resources, notation modal, colorblind glyph palettes — the "parity" milestone whose mobile counterpart is the 3.x train above.

## 7. Known Android bugs/quirks to warn about (2024–2026, all `[SEARCH-ONLY]` player/dev reports)

| Issue | Detail / workaround | Source |
|---|---|---|
| System-theme boot crash (3.13.0, Aug 2026) | Setting theme to "System" ⇒ crash on every launch; dev: do NOT reinstall (loses local save); fixed 3.13.1 | https://www.reddit.com/r/AntimatterDimensions/comments/1vq0cw1/game_crashed/ |
| Overnight memory-leak closes (3.13–3.14) | Long sessions die on old hardware; mitigated 3.14.0+ | update threads 3.13–3.16 |
| Autobuyers-tab freeze at Reality start; Graphs "Lines: Both/Max" lag; orientation flip during offline calc ⇒ crash | Fixed across 3.15.0/3.16.0; guide should say: lock portrait, avoid Graphs-max-lines on weak devices | https://www.reddit.com/r/AntimatterDimensions/comments/1w5d0ys/ …/1wdg89n/ |
| Custom-font boot crash on Xiaomi/Huawei/Oppo/Honor skins | Font-rendering incompatibility; restart may bypass; fallbacks patched in | https://www.reddit.com/r/AntimatterDimensions/comments/1bu8ecj/game_crashes_when_i_open_it/ |
| Dots notation + Eternity-respec hard crash | Use Standard/Scientific as daily driver; export save first | https://www.reddit.com/r/AntimatterDimensions/comments/1480ejg/crash_on_eternity/ |
| Play Games sign-in loops; achievements not syncing; cloud-save desync across devices | Sign out/in via About tab; force cloud save (hold button) before switching devices; keep Play Games auto-sign-in on | https://www.reddit.com/r/AntimatterDimensions/comments/j7tv9g/ …/vo2ko4/…/xcck1e/ |
| "Lost save, never reinstall first" | Uninstall wipes unbacked local saves; always Export/share string to Drive/email first | dev + community threads |
| Offline feels slow | Raise Max offline ticks (50–100k sweet spot; 1M max but 1–3 min hot load); never Skip; Black Hole + Automator interact badly at low ticks | reddit offline threads + §5.4 |

## 8. Open uncertainties (for `adg` planning)

1. Pre-3.9.5 version/date mapping (2024-04→2024-09) not pulled — APKPure "Show More" or Uptodown versions page could fill it.
2. Reddit-sourced rows (`[SEARCH-ONLY]`) deserve one direct pass with auth/old-reddit/JSON once credentials exist — especially 3.15.0 changelog and bug threads.
3. Native-vs-WebView architecture unconfirmed; affects "battery/background" and "hotkeys with BT keyboard" guidance. Decompiling the split APK or asking FestinaLente167 on r/AntimatterDimensions would settle it.
4. Exact STD↔fiat prices and current Play "What's new" rotation were not captured (prices need Play billing API or a device).
5. Web (`ivark.github.io`) current build hash and Steam's post-Dec-2024 patch state were not directly read — SteamDB/Steam news hub is the next stop for the parity argument.
