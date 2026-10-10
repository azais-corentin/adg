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

- **Infinity Challenge 2 unlocks at 1e10,500 antimatter** (upstream `unlockAM`: 1e11000). The other seven IC thresholds match. `src/lib/checklists/items.ts` (which also feeds the import's Next goals) and the Infinity Challenges article use the app's value; `src/lib/data/generated/challenges.json` keeps upstream's.
- **Big Crunch autobuyer:** the Broken Infinity save shows no "Dynamic amount" checkbox under "Crunch at X IP" (`break-infinity/autobuyers-main-0.webp`); upstream shows one after Break. The guide does not mention it.
- **Eternity milestones** (`late-eternity/eternity-milestones-0/2.webp`): there is no 200-Eternity milestone; the 100 card reads "Unlock Eternity autobuyer; While offline, gain 50% of your best Eternities/hour". The 7 card only says "You complete Infinity Challenges as soon as you unlock them" (upstream adds "and keep the Dimensional Sacrifice Autobuyer"). The 1,000 card's condition does not mention turning the Eternity autobuyer off. `nextGoals.ts` and the milestones article follow the app.
- **Import tree dialog:** the box fills itself from the clipboard ("Antimatter Dimensions pasted from your clipboard"), and there is no "Also respec tree and eternity" toggle (upstream `StudyStringModal.vue`); only CANCEL and IMPORT. The Time Studies article describes the app's dialog.
- **Shop:** the app sells three items upstream's `shop-purchases.js` lacks: Permanent Ad bonus (30 STD), Golden Bottom Buttons (50) and a random-type Glyph at your highest level (20). Its wording differs too: "Increase your IP gain by 100% (additive)" where upstream says "Double your Infinity Point gain". The Toggle IAP bonuses and Respec IAPs buttons sit under the cards (`pre-infinity/shop-main-0..2.webp`). The Android shop article follows the app.
- **Offline progress:** the Options button has three states, SHOWN → HIDDEN → DISABLED (upstream: an on/off toggle; the native save stores the string). HIDDEN simulates without the "While you were away" popup; DISABLED simulates nothing. Offline ticks cover at least 50 ms each (upstream `maxOfflineTicks`: 33 ms), so 8 hours at the 1,000,000 setting is 576,783 ticks. A new game starts at 1,000 Max offline ticks and a 50 ms UI update rate. Away Progress Options adds an "Ad bonus" line. The Android shop article follows the app.
- **Time Study 131** reads "Automatic Replicanti Galaxies are disabled while offline, but you can get 50% more of them" (upstream: disabled outright until Achievement 138). With it, the Replicanti tab shows "Auto galaxy: ON (disabled while offline)": the autobuyer works online but takes no galaxy during offline progress. The Eternity Challenge planner therefore gives each step whose tree has 131 a second tree on the Passive row, labelled for the app closed (`offlineTree` in `src/lib/tools/eternity-challenges/trees.ts`), except EC6, whose study needs 121. EC5 runs on the Passive row on screen too (`EC5_PASSIVE` in `order.ts`: EC5 ×4 passed its goal in about 3 minutes with it and was far short after 23 with 131). The tree also words studies its own way ("You gain ×35 more EP", "Make the IP formula better 10^(x/307.8) ➜ 10^(x/285)"); the Time Study planner's fallback texts in `src/lib/tools/time-studies/text.ts` follow the app.
- **Numbers:** the default Scientific notation puts commas in exponents from 5 digits (`8.16e3430`, `2.74e10,422`, `6.26e380,575,449`); upstream's setting starts at 6 digits. From 1e9 the exponent is itself scientific with 3 places (`3.34e1.312e9`). Eternity Challenge goals read `Goal: 1e1675 IP` (0 places; upstream uses 2), and the import summary shows counts in full ("Infinities: 5,832,648"). `formatBigNum` in `src/lib/save/bignum.ts` follows the app; `<Num>` keeps the decimals an article writes.

## Save formats (decoded from real exports; fixtures in `/fixtures/saves/`)

| Export              | Envelope                                                          | Payload      | Schema                                                                                                                                                                                                                                                                                                                        |
| ------------------- | ----------------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Export to mobile    | `AntimatterDimensionsAndroidSaveFormat` + `AAA` … `EndOfSavefile` | gzip         | **Android-native schema**: `version` = app versionCode (30170000 / 30180000). Big numbers are stored as `{mantissa, exponent}` objects. Field names differ from upstream (`achievements` vs `achievementBits`, `infinityUpgradeBits` vs `infinityUpgrades`, `bankedInfinities` vs `infinitiesBanked`, `brake` vs `break`, …). |
| Export to web/steam | `AntimatterDimensionsSavefileFormat` + `AAB` … `EndOfSavefile`    | zlib deflate | **Upstream web schema** (`version: 25`, Decimals as strings), matching `IvarK/AntimatterDimensionsSourceCode`.                                                                                                                                                                                                                |

Both use the upstream printable escaping (`0`→`0a`, `+`→`0b`, `/`→`0c`, padding stripped).
The two schemas share 47 top-level keys. 17 keys exist only in the Android schema and 19 only in the web schema.
`*-eternity-paired` is one game state exported in both formats (22:11 / 22:12), which allows verifying a field-by-field mapping.
None of the decoded saves contain account or device identifiers. The only Google-related field is the boolean option `hideGoogleName`.
