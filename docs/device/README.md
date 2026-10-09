# Android device captures

Captured on 2026-10-08 over wireless adb. Device: Pixel 9 Pro, Android 17. App: `kajfosz.antimatterdimensions` **3.18.0** (versionCode 30180000).
At capture time the player was in early Eternity (9 EP, 13 Eternities, Break Infinity, Replicanti, Infinity Challenges unlocked; no Eternity Challenges or Dilation yet).

## Screens (`android-3.18.0/screens/`)

File names are `<tab>-<subtab>-<scroll page>.webp`, where `top` means the page doesn't scroll. The bottom navigation bar, left to right:

| Icon      | Tab          | Subtabs (as unlocked at capture)               |
| --------- | ------------ | ---------------------------------------------- |
| cube      | Dimensions   | Antimatter, Infinity, Time                     |
| gears     | Autobuyers   | —                                              |
| triangle  | Challenges   | Normal, Infinity                               |
| ∞         | Infinity     | Upgrades, Break, Replicanti                    |
| hourglass | Eternity     | Studies, Upgrades, Milestones                  |
| trophy    | Achievements | Normal, Secret                                 |
| clipboard | Statistics   | Stats, Records, Past Runs, Multipliers, Graphs |
| sliders   | Options      | —                                              |
| $         | Shop         | —                                              |
| i         | Info         | How to play, About                             |

Other things that matter for the guide:

- The prestige buttons (Eternity, B.Crunch, D.Boost, A.Galaxy, R.Galaxy, Max) float above the navigation bar on every tab.
- Each tab remembers the subtab you last opened.
- Coming back to the app always shows a **"While you were away for N seconds"** popup (`away-progress-popup.webp`), including right after a save export. Tap **Confirm** to close it.

## Save export (verified)

The exports live under Options → **Save & Load**:

| Control                                                                                                            | Result                                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Share save** (tap)                                                                                               | Opens the Android share sheet                                                                                                                                                                                                                                                                    |
| **Share save** (hold)                                                                                              | Opens a dialog: _Export to mobile_ / _Export to web/steam_ (`options-save-to-file-dialog.webp`). Either choice opens the system file picker, which defaults to Downloads with file names `ADMobileSave_<ISO time>.txt` / `ADWebSave_<ISO time>.txt`. Returning to the game shows the away popup. |
| **Export to mobile** / **Export to web/steam** buttons                                                             | Copy the save text in that format to the clipboard; the game shows "Exported to clipboard". No file picker, no away popup. Verified in the emulator for Export to web/steam (`scripts/device/export-save.ts` relies on it) and Export to mobile.                                                 |
| **Import save**, **Load cloud save**, **Load backup**, **Select save**, **Reset current save**, **Start Speedrun** | Destructive. Never touched.                                                                                                                                                                                                                                                                      |

## Game differences from the upstream pin

Mechanics come from the upstream source at the pin, but the app is a separate build. Where the emulator shows something else, the guide follows the app:

- **Infinity Challenge 2 unlocks at 1e10,500 antimatter** (upstream `unlockAM`: 1e11000). The other seven IC thresholds match. `src/lib/save/nextGoals.ts` and the Infinity Challenges article use the app's value; `src/lib/data/generated/challenges.json` keeps upstream's.
- **Big Crunch autobuyer:** the Broken Infinity save shows no "Dynamic amount" checkbox under "Crunch at X IP" (`break-infinity/autobuyers-main-0.webp`); upstream shows one after Break. The guide does not mention it.
- **Eternity milestones** (`late-eternity/eternity-milestones-0/2.webp`): there is no 200-Eternity milestone; the 100 card reads "Unlock Eternity autobuyer; While offline, gain 50% of your best Eternities/hour". The 7 card only says "You complete Infinity Challenges as soon as you unlock them" (upstream adds "and keep the Dimensional Sacrifice Autobuyer"). The 1,000 card's condition does not mention turning the Eternity autobuyer off. `nextGoals.ts` and the milestones article follow the app.
- **Import tree dialog:** the box fills itself from the clipboard ("Antimatter Dimensions pasted from your clipboard"), and there is no "Also respec tree and eternity" toggle (upstream `StudyStringModal.vue`); only CANCEL and IMPORT. The Time Studies article describes the app's dialog.
- **Shop:** the app sells three items upstream's `shop-purchases.js` lacks: Permanent Ad bonus (30 STD), Golden Bottom Buttons (50) and a random-type Glyph at your highest level (20). Its wording differs too: "Increase your IP gain by 100% (additive)" where upstream says "Double your Infinity Point gain". The Toggle IAP bonuses and Respec IAPs buttons sit under the cards (`pre-infinity/shop-main-0..2.webp`). The Android shop article follows the app.

## Save formats (decoded from real exports; fixtures in `/fixtures/saves/`)

| Export              | Envelope                                                          | Payload      | Schema                                                                                                                                                                                                                                                                                                                        |
| ------------------- | ----------------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Export to mobile    | `AntimatterDimensionsAndroidSaveFormat` + `AAA` … `EndOfSavefile` | gzip         | **Android-native schema**: `version` = app versionCode (30170000 / 30180000). Big numbers are stored as `{mantissa, exponent}` objects. Field names differ from upstream (`achievements` vs `achievementBits`, `infinityUpgradeBits` vs `infinityUpgrades`, `bankedInfinities` vs `infinitiesBanked`, `brake` vs `break`, …). |
| Export to web/steam | `AntimatterDimensionsSavefileFormat` + `AAB` … `EndOfSavefile`    | zlib deflate | **Upstream web schema** (`version: 25`, Decimals as strings), matching `IvarK/AntimatterDimensionsSourceCode`.                                                                                                                                                                                                                |

Both use the upstream printable escaping (`0`→`0a`, `+`→`0b`, `/`→`0c`, padding stripped).
The two schemas share 47 top-level keys. 17 keys exist only in the Android schema and 19 only in the web schema.
`*-eternity-paired` is one game state exported in both formats (22:11 / 22:12), which allows verifying a field-by-field mapping.
None of the decoded saves contain account or device identifiers. The only Google-related field is the boolean option `hideGoogleName`.
