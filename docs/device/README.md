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

| Control                                                                                        | Result                                                                                                                                                                                                                                                                                           |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Share save** (tap)                                                                           | Opens the Android share sheet                                                                                                                                                                                                                                                                    |
| **Share save** (hold)                                                                          | Opens a dialog: _Export to mobile_ / _Export to web/steam_ (`options-save-to-file-dialog.webp`). Either choice opens the system file picker, which defaults to Downloads with file names `ADMobileSave_<ISO time>.txt` / `ADWebSave_<ISO time>.txt`. Returning to the game shows the away popup. |
| **Export to mobile** / **Export to web/steam** buttons                                         | Same two formats [INFERENCE: copied to the clipboard; not captured]                                                                                                                                                                                                                              |
| **Import save**, **Load cloud save**, **Load backup**, **Select save**, **Reset current save** | Destructive. Never touched.                                                                                                                                                                                                                                                                      |

## Save formats (decoded from real exports; fixtures in `/fixtures/saves/`)

| Export              | Envelope                                                          | Payload      | Schema                                                                                                                                                                                                                                                                                                                        |
| ------------------- | ----------------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Export to mobile    | `AntimatterDimensionsAndroidSaveFormat` + `AAA` … `EndOfSavefile` | gzip         | **Android-native schema**: `version` = app versionCode (30170000 / 30180000). Big numbers are stored as `{mantissa, exponent}` objects. Field names differ from upstream (`achievements` vs `achievementBits`, `infinityUpgradeBits` vs `infinityUpgrades`, `bankedInfinities` vs `infinitiesBanked`, `brake` vs `break`, …). |
| Export to web/steam | `AntimatterDimensionsSavefileFormat` + `AAB` … `EndOfSavefile`    | zlib deflate | **Upstream web schema** (`version: 25`, Decimals as strings), matching `IvarK/AntimatterDimensionsSourceCode`.                                                                                                                                                                                                                |

Both use the upstream printable escaping (`0`→`0a`, `+`→`0b`, `/`→`0c`, padding stripped).
The two schemas share 47 top-level keys. 17 keys exist only in the Android schema and 19 only in the web schema.
`*-eternity-paired` is one game state exported in both formats (22:11 / 22:12), which allows verifying a field-by-field mapping.
None of the decoded saves contain account or device identifiers. The only Google-related field is the boolean option `hideGoogleName`.
