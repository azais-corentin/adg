# Save import & data-reuse research (Android focus)

Date of research: 2026-10-08. All dated claims carry source + source date. `[INFERENCE]` = not directly observed.

Target: `adg` — SvelteKit + Bun + TS fan guide for **Antimatter Dimensions, latest Android (Google Play) only**.

---

## 1. Verdict (short)

**Yes — a current Android save can be decoded fully in the browser with ~60 lines of code + `pako`.**
The web upstream (`IvarK/AntimatterDimensionsSourceCode`, MIT) documents the exact wire codec in
`src/core/storage/serializer.js` (`GameSaveSerializer`). The Android app itself is **closed-source native**
(no public codec), but its transport envelope is independently implemented and fixture-tested by the MIT-licensed
community editor (Sato-Isolated, commits through 2026-09-10): prefix
`AntimatterDimensionsAndroidSaveFormat` + `AAA`, `pako.gzip` payload (web uses `pako.deflate`), same
`0a/0b/0c` printable escaping, `EndOfSavefile` suffix. Decode = strip → unescape → base64 → gunzip →
`JSON.parse` with an `"Infinity"` reviver. Progression stage falls out of a handful of `player` fields
(`infinities`, `eternities`, `realities`, `celestials`, `reality`, achievement bit arrays).
**Licensing: safe** provided we (a) keep copyright/permission notices for MIT code/data reused,
(b) write original guide text instead of copying Fandom wiki text (CC-BY-SA ShareAlike), and
(c) bundle **no** art/audio/screenshots/wiki images.

---

## 2. Android save export (player-facing)

### 2.1 What the primary sources say

| # | Source (URL + date) | Claim |
|---|---|---|
| E1 | Steam forum (pinned, moderator Myresa): https://steamcommunity.com/app/1399720/discussions/0/3732953986130532850/ — post **2023-01-03**, edited **2023-01-30** (read 2026-10-08) | Android → Web/Steam: on phone go to **Options** → press **"EXPORT TO WEB"** ("Other options won't work !!!"). Paste string into paste.ee, send link to PC, **Import** on PC. Notes: Android had no Reality content yet at that time; web→Android import not allowed then; "you may lose your autobuyer unlocks in early game". |
| E2 | Same thread, moderator reply **2023-01-28** | "Share Save" (email-to-self) does **not** do the web conversion — "mobile and web are handled differently". Confirms **multiple distinct export paths with different formats**. |
| E3 | Same thread, Formedras comment **2023-06-04** | Generic clipboard flow: Export Save copies text string → save as `.TXT` → USB to PC → Import Save. Notes Steam cloud (Azure PlayFab) vs Android (Google Drive via Play Games) never auto-sync. |
| E4 | Fandom wiki: https://antimatter-dimensions.fandom.com/wiki/Antimatter_Dimensions_Mobile (read 2026-10-08; page states Reality released on mobile **2024-04-01 13:00 UTC, update 3.0.0**) | Android app is **native**; automatic cloud saves via Google services + Google Play achievements; "Savegames are fully cross-compatible" with web; **"The source code for the Android version is not public like the web version"** (cites reddit). |
| E5 | Google Play listing: https://play.google.com/store/apps/details?id=kajfosz.antimatterdimensions (read 2026-10-08) | App by **Jakub Kajfosz**, package `kajfosz.antimatterdimensions`, **1M+ downloads, 4.8★ (35.8K reviews)**. "Updated on **Oct 1, 2026**". What's-new section shows **3.18.0** (news, secret themes, Away Progress options, formula popup, Time Study QoL, crash fixes). Contains ads + in-app purchases. |
| E6 | Steam comment by Formedras **2024-03-21** (same thread) | "No [IAP transfer]. Mobile is a different developer." IAP/STD coins are per-platform. |

### 2.2 Consequences for `adg`

- There are (at least historically) **three Android-side options**: "Export to Web" (converted, web-compatible), "Export to Mobile"/"Share Save" (native mobile envelope), file export. The 2023 thread is explicit that only EXPORT TO WEB imports on web/Steam — i.e. **native Android format ≠ web format**.
- Since mobile now has Reality (3.0.0, 2024-04-01) the 2023 "no Reality on mobile / no web→Android" caveats are **outdated**; current restrictions unknown.
- For the guide, **accept both envelopes** (native `…AndroidSaveFormat…` and converted `…SavefileFormat…`); the decoder detects by prefix. Prefer asking for the **native Android export** (Export-to-Web is reportedly lossy: autobuyer unlocks).
- `[INFERENCE]` Button labels/positions may have changed since 2023 (current app is 3.18.x). **Exact current Options-UI wording needs an on-device check** (suggest cross-check with the `AndroidVersionFacts` track, which owns Play-version facts).
- Practical transfer notes for guide UX copy: save strings are tens of KB; chat apps (Discord/WhatsApp/Messenger) silently truncate — recommend paste.ee/Pastebin link or `.txt` via Drive/USB; warn that any missing char (incl. trailing `=` padding on legacy strings) fails decode.

---

## 3. Save string format (current code)

### 3.1 Which repo is current

- Current: **`IvarK/AntimatterDimensionsSourceCode`** (MIT, default branch `master`; latest commits observed **2026-07-17**: "Update changelog.js 5409e320", "Add app store link and update changelog 18aff668"). Web/Steam codebase.
- Legacy: `IvarK/IvarK.github.io` — old web host repo, **not** current. Do not cite for format.
- Android app: closed source (E4). There is **no official Android codec to copy**; the envelope below is per the independent Sato editor's fixture-backed implementation (Section 5), consistent with the upstream web codec design.

### 3.2 Upstream web codec — exact references

File: `src/core/storage/serializer.js`, object **`GameSaveSerializer`** (read 2026-10-08 via raw.githubusercontent master).

- `startingString.savefile = "AntimatterDimensionsSavefileFormat"`; also `"automator script"`, `"automator data"`, `"glyph filter"` markers (same file).
- `version = "AAB"` (transport/coding version — **not** the player-data version).
- `endingString.savefile = "EndOfSavefile"`.
- `steps` (applied in **encode order**):
  1. `TextEncoder.encode` (string → bytes),
  2. **`pako.deflate`** (bytes → compressed; `pako` dep `^2.0.4` in upstream `package.json`),
  3. bytes → latin-1 string (`String.fromCharCode` per byte),
  4. `btoa` (→ base64),
  5. printable substitution: strip trailing `=`, then `0→0a`, `+→0b`, `/→0c` (order matters; decode reverses `0b→+`, `0c→/`, then `0a→0` — see code comment),
  6. append `EndOfSavefile` — **only when version ≥ "AAB"** (`condition: version => version >= "AAB"`).
  7. prepend `startingString + version` (`getSteps`).
- `encodeText(text, type)` / `decodeText(text, type)`; `serialize(save)` = `JSON.stringify(save, jsonConverter)` → `encodeText(json, "savefile")`.
- `jsonConverter`: `Infinity → "Infinity"` string; `Set → Array.from(keys)`.
- `deserialize(data)`: `decodeText` → `JSON.parse` (reviver maps `"Infinity"` back — upstream reviver as written returns the string `"Infinity"` for the parsed value; in practice large numbers travel as `Decimal` JSON / strings — see §3.4 note).
- `decodeText` fallback: if the prefix is absent → legacy `atob(text)` (pre-Reality saves). Old saves "always started with eYJ" per code comment (base64 of `{"`).
- **Correction to common secondary claims:** current upstream uses **pako deflate + base64, NOT LZString**. (`serializer.js` contains zero `lz` matches; `pako` + `btoa` present.) Guides/posts saying "LZString" describe older or third-party handling — do not implement LZString for current saves.

### 3.3 Storage container vs player export

File: `src/core/storage/storage.js`, object **`GameStorage`** (read 2026-10-08).

- `save()` persists `{ current, saves }` (multi-slot container) via `GameSaveSerializer.serialize(root)` under localStorage key `dimensionSave` (dev: `dimensionTestSave`).
- `loadRoot(root)`: migrates old single-player roots (`root.saves === undefined` → slot 0).
- `import(saveData)`: `deserialize` → `checkPlayerObject` → `loadPlayerObject`. So an **exported player string and a localStorage container string are different shapes**; the guide must expect the **player** shape (`antimatter` present), not `{current, saves}`.
- `checkPlayerObject(save)` error strings (surface in UI as "Could not load the save…"):
  - `"Save decoding failed (invalid format)"` when deserialize returns undefined/null;
  - `"Save does not have antimatter property"` when neither `money` nor `antimatter` exists;
  - plus a recursive NaN scan (`"N player properties found: …"`).
- Reuse for guide validation: require `antimatter` field + integer `version` + finite `lastUpdate`; reject `\r\n` (Sato does; upstream `atob` tolerates whitespace but exported strings are single-line).

### 3.4 Decoded JSON: progression-relevant `player` fields

File: `src/core/player.js` (`window.player`, `Player.defaultStart` merge target; read 2026-10-08). Data-schema version: **`version: 25`** (integer — distinct from transport `"AAB"`).

Minimal field set sufficient to stage a player (all paths relative to decoded player object):

| Stage signal | Field(s) | Notes |
|---|---|---|
| Early / pre-Infinity | `antimatter`, `dimensions.antimatter[8]`, `records.thisInfinity.maxAM` | `antimatter` is the presence check. |
| Break Infinity | `break` (bool), `infinityPoints`, `infinities` / `infinitiesBanked` | Pre-Reality saves used `infinitied/infinitiedBank`; migration `infinitiedConversion` renames (see §3.5). |
| Replication / challenges | `replicanti.*`, `challenge.normal.completedBits`, `challenge.infinity.completedBits`, `infinityUpgrades` (Set→array on wire), `infinityRebuyables` | Bitmasks are numbers (see Sato `challenges.ts`: NC mask `8190`, IC mask `510`, bit 0 unused). |
| Eternity | `eternityPoints`, `eternities`, `timestudy.{theorem,studies,amBought,ipBought,epBought}`, `eternityChalls.eterc1..12` (counts 0–5, **not** bitfield), `dilation.*`, `records.bestEPminReality` etc. | `player.eternities` was a plain number pre-Reality, Decimal after (see `player-progress.js` comment). |
| Reality | `realities` (number), `reality.{realityMachines,maxRM,imaginaryMachines,iMCap,glyphs…}`, `blackHole[2]`, `records.recentRealities[10]`, `records.fullGameCompletions` | Glyphs at `reality.glyphs.{active,inventory,sac,sets,filter,cosmetics}`; sac values per type. |
| Celestials (7) | `celestials.{teresa,effarig,nameless,v,ra,laitela,pelle}` e.g. `teresa.{pouredAmount,quoteBits,unlockBits,run,bestRunAM}`, `effarig.{relicShards,glyphWeights}`, `pelle.doomed` | Presence + `unlockBits`/run flags stage late game. |
| Achievements | `achievementBits[17]`, `secretAchievementBits[4]` | Bit arrays (migration `convertAchivementsToNumbers` history). |
| Meta | `version` (int, currently 25), `records.{realTimePlayed,totalTimePlayed}`, `options.*` (ignore), `speedrun.*` (ignore), `automator` scripts (ignore for staging) | `records.recentInfinities/recentEternities/recentRealities` are length-10 arrays. |

Number encoding note: large values travel as `Decimal` JSON (break_infinity.js; commonly `{mantissa, exponent}` or exponent strings) or the `"Infinity"` marker. A read-only guide does not need Decimal arithmetic for staging — treat antimatter/IP/EP/RM as opaque magnitude strings and compare by parsing `e`-notation / mantissa+exponent. `[INFERENCE]` Decimal's exact `toJSON` shape was not pinned in this pass; Sato's `editorJsonCodec.ts` + `isBigNumberValue` (number | `"Infinity"` | `/^-?\d+(\.\d+)?(e[+-]?\d+)?$/` string | `{mantissa, exponent}`) is the battle-tested acceptance set — mirror it.

### 3.5 Migrations (data-schema versions)

File: `src/core/storage/migrations.js` (68 KB; read head + tail 2026-10-08).

- `migrations.firstRealityMigration = 13`; `patches` keyed by schema numbers (`1, 2, 5, 9, 9.5, 10, 12, 12.1, 13, …` through v25-era entries).
- `prePatch(saveData)`: `totalAntimatter ||= totalmoney || money`; `thisEternity ||= totalTimePlayed`; `version ||= 0`.
- `patch(saveData, maxVersion)`: `deepmergeAll([Player.defaultStart, saveData])`, then apply each `v` with `player.version < v < maxVersion` in order, setting `player.version = v` after each. `patchPreReality` caps at `firstRealityMigration`.
- Last serializer-affecting upstream change observed: **2023-05-12** "Implement import/export for glyph filter" (`src/core/storage/serializer.js` history). Transport `AAB` + suffix logic predates current mobile builds.
- Guide implication: **do not run migrations** for read-only staging — branch on presence (`infinities ?? infinitied`, `records.recent* ?? records.lastTen* ?? records.pastTen*`) and treat `version` as informational. Only a future *write-back* editor would need the migration chain.

### 3.6 Ready-made progression helpers (upstream, web)

- `src/core/player-progress.js`, class **`PlayerProgress`**: `isInfinityUnlocked` (`infinities`/`infinitied > 0`), `isEternityUnlocked` (`eternities > 0`), `isRealityUnlocked` (`realities > 0`), `hasFullCompletion` (`records.fullGameCompletions > 0`), plus `hasBroken`, `dilationUnlocked`, `challengeCompleted`, etc. Directly portable logic (needs `Decimal` + game state for some getters — the four basic ones are trivially portable).
- `src/core/storage/progress-checker.js`, **`ProgressChecker.getProgressStage(save)`** iterates `GameDatabase.progressStages` top-down calling `hasReached(save)`; `getCompositeProgress` interpolates. The backing `progressStages` data file path was **not pinned** in this pass (candidate `src/core/game-database/*` listing failed) — open item if we want the exact stage table rather than our own staging thresholds.

### 3.7 Android/Apple envelope (from community reference implementation)

Upstream has no Android code (closed source). Reference: Sato editor `src/domain/save/transport/codec.ts` (MIT; read 2026-10-08):

- Prefixes: PC `AntimatterDimensionsSavefileFormat`; Android **`AntimatterDimensionsAndroidSaveFormat`**; Apple **`AntimatterDimensionsAppleSaveFormat`**.
- Transport versions: PC `legacy | AAA | AAB`; Android/Apple **`AAA`** only (unknown versions rejected).
- PC-AAA/AAB payload: `pako.deflate`; **mobile payload: `pako.gzip` / `pako.ungzip`** (the key difference — using inflate on an Android string fails).
- Same `0→0a / +→0b / /→0c` escaping, padding stripped; suffix `EndOfSavefile` **required** for mobile and PC-AAB.
- Mobile JSON model ≈ PC model with aliases (`src/domain/save/platforms/mobile.ts`): `records.pastTenInfinities/Eternities/Realities` (Android) vs `recent*` (current PC v25) vs `lastTen*` (older PC); `reality.upgradeRequirementBits` (Android) vs PC `upgReqs`-style field.
- Sato capability flags for mobile adapters: `compatibility: 'fixture-transport'` — i.e. **codec + fixture tested, NOT live-verified against every game build**. Its README: "Mobile transport support is not a claim of PC-to-mobile conversion or compatibility with every live Android or iOS game build… use an untouched backup and perform a manual import/export check."
- `src/domain/save/transport/limits.ts` guard rails worth copying: 4,000,000 encoded chars / 3,000,000 compressed bytes / 16,000,000 inflated bytes.

### 3.8 Browser decode recipe (Android, current)

```
input: raw pasted string S (trim; reject if contains \r or \n)
if S starts with "AntimatterDimensionsAndroidSaveFormat":
    v = S[len(prefix) : +3]; require v == "AAA" (else: unsupported-transport)
    body = S[len(prefix)+3 :]; require body ends with "EndOfSavefile"; strip it
    b64 = body.replace(/0b/g,"+").replace(/0c/g,"/").replace(/0a/g,"0")
    bytes = base64decode(b64)          // strict alphabet, re-pad %4
    json = gunzip(bytes)               // pako.ungzip + TextDecoder
elif S starts with "AntimatterDimensionsSavefileFormat":   // Export-to-Web output
    v = ...; allow AAA (no suffix strip... actually AAA has no suffix; AAB strips) — implement per getSteps: strip suffix iff v >= "AAB"
    same unescape; bytes; json = inflate(bytes)            // pako.inflate
else: legacy: json = atob(S)           // pre-Reality; likely absent on current Android
player = JSON.parse(json, (k,v) => v === "Infinity" ? Infinity : v)
stage = derive from §3.4 fields (own thresholds; cf. PlayerProgress)
```

Dependencies: `pako` (npm, same major as game `^2.0.4`) — `ungzip`+`inflate` both needed. No LZString. Everything runs client-side; saves never leave the device (good for privacy copy).

---

## 4. Existing community tools

| Tool | URL | Last activity observed | Works with current saves? |
|---|---|---|---|
| **Sato-Isolated / MindLated Save Editor** (structured GUI + raw JSON, decrypt/re-encrypt, achievements/celestials/glyphs/automator/challenges incl. bitfield masks) | https://github.com/Sato-Isolated/Antimatter-Dimensions-Save-Editor — live demo linked in its README | **2026-09-10** "Allow fractional dimension boost values"; Apple-format PR merged **2026-08-14** (commit history via API) | **Yes — best reference.** PC + Android + Apple envelopes at codec/fixture level. Key files: `src/domain/save/transport/codec.ts` (`decodeSaveString`, `encodeSaveData`, `detectSaveType`), `transport/editorJsonCodec.ts`, `transport/limits.ts`, `platforms/{android,apple,mobile,pc,adapter}.ts`, `catalog/progression.ts` (pinned upstream snapshot `5409e320…`), `validation/*`. Caveats: fixture-transport, no auto-migrations, not a PC↔mobile converter. License MIT. |
| Legacy editor `ccs19.github.io/ad-save-editor` (repo `1234abcdcba4321/AD-save-editor`) | https://ccs19.github.io/ad-save-editor | Pushed **2019-09-21** (API) | **No** — pre-Reality/base64-era. Useful only as "what not to copy". No license file found. |
| Buck's **AD Save Bank** (curated clean saves per milestone: pre-Break, Eternity, Dilation, Reality, celestials) | https://buck4437.github.io/save-bank/ | Pushed **2026-05-31** (API); repo contains MIT LICENSE (© 2022 Buck4437, verified raw) | N/A (save corpus, not a parser) — **excellent test fixtures** for our decoder/staging (pair each save with its labeled milestone). |
| `lrobt97/glyphapi` (glyph drop-odds/rarity calculator, Flask) | https://github.com/lrobt97/glyphapi | Pushed **2023-08-23** (API) | N/A — math tool, not save parser. **No LICENSE file** (404 on master+main) → all rights reserved; do not copy code; may link. |
| Generic LZString decoders (e.g. coderpatsy bitbucket `decoder.html`); Scribd dump titled `AntimatterDimensionsSavefileFormatA…` | via search | n/a | **No** for current saves (pako, not LZString). Only useful for legacy strings. |
| In-game console (`player` object) / Steam guides / time-study strings / automator presets | n/a | n/a | Not save parsers; time-study import strings and glyph filter are game features, no external planner needed. |

No maintained time-study-tree visual planner or glyph optimizer with current-save import was found — consistent with those features now living in-game (import/export strings, glyph filter). If `adg` wants a differentiator, a **save-aware "where am I / what next" stager** (our §3.8) has no direct competitor; a full editor would duplicate Sato.

---

## 5. Licensing

### 5.1 License table

| Asset | Owner / source | License (verified 2026-10-08 unless noted) | What it allows for `adg` | Conditions / limits |
|---|---|---|---|---|
| Web game **code** incl. `serializer.js`, `storage.js`, `player.js`, `migrations.js`, `player-progress.js`, `progress-checker.js` | `IvarK/AntimatterDimensionsSourceCode`, © 2017 IvarK (LICENSE raw text) | **MIT** (repo badge + full text) | Use, copy, modify, merge, publish, distribute, sublicense, sell — incl. reimplementing the decoder and staging logic in our own code, and bundling small extracted mechanics data. Commercial OK. | Include **copyright + permission notice** in all copies/substantial portions → keep a `NOTICE`/attribution file crediting IvarK + Sato (if reused). |
| Web game **text/art/audio in repo** (`public/images`, `public/audio`, news ticker, quotes, achievement/flavor text) | Same repo / Hevipelle & contributors | MIT as shipped (no separate license observed), **but** expressive content: treat conservatively | Safest: **don't bundle** images/audio. Short functional labels/numbers are facts/mechanics; longer flavor text (news, quotes, celestial dialog) → paraphrase or minimal quote + attribution. | No per-file license headers observed — if we extract verbatim strings at scale, carry the MIT notice and keep excerpts minimal. |
| **Android app** code/assets | Jakub Kajfosz (closed source; Fandom mobile page + reddit citations) | **All rights reserved** (source not public) | Observe behavior + format only. No decompiling/shipping APK content. User-supplied saves are the user's own data — decoding them locally is fine. | Do not bundle anything from the APK. Note "different developer" (mobile vs web/Steam). |
| **Fandom wiki text** (antimatter-dimensions.fandom.com) | Contributors, via Fandom | **CC-BY-SA 3.0** (verified: https://community.fandom.com/wiki/Help:Licensing + page footer "Community content is available under CC-BY-SA") | Share + adapt, even commercially. | **BY**: credit via article URL / author list; **SA**: derivatives under same/similar license + note changes; link license terms; no DRM/additional restrictions. → **Decision: write original guide prose; link to wiki** rather than importing text (avoids ShareAliking our guide). |
| **Fandom images/video** (screenshots, icons, logos) | Game dev / uploaders (fair-use hosting) | **NOT CC-BY-SA** (Help:Licensing "Importing non-text files": each file has its own terms; check file page) | Effectively unusable for bundling. | Make our own diagrams/icons; hotlink nothing. |
| **Sato Save Editor code** (codec, platform adapters, catalogs) | © 2025 MindLated (LICENSE raw) | **MIT** | Copy/adapt `codec.ts` + limits + platform aliases with attribution. | Include its copyright+permission notice. Heed its honesty caveats (fixture-transport; no auto-migration; backup-before-import). |
| **Save Bank saves** | Buck4437 (repo has MIT LICENSE © 2022, raw verified) | MIT (code/repo); individual save strings are player data | Use as **local test fixtures** (don't ship bulk saves in the guide). | Attribute if redistributed. |
| `glyphapi`, legacy `AD-save-editor` | their authors | **Unknown / no license found** | Link only; no copying. | — |
| Fan-tool/developer policy | No formal policy found | De facto permissive community (forks/mods e.g. NG+, Quantum Realm; Discord mod channels), customary "unofficial, not affiliated" disclaimer | Norms ≠ legal grant — rely on the licenses above. | Add disclaimer: "Unofficial fan guide. Not affiliated with Hevipelle/IvarK or Jakub Kajfosz." Saves edited by third-party tools are unsupported on official channels — our tool is read-only, say so. |

### 5.2 Implications for an open-source `adg`

1. **Read-only save staging is the low-risk sweet spot**: decoding a user's own paste locally involves no redistribution of game assets; reimplementing the MIT codec needs only a notice file.
2. **Do not copy wiki prose** (ShareAlike would attach to our guide text). Link out per-topic instead. Same for Steam-guide text and Discord pins (no license; link/summarize in own words).
3. **Data extraction budget**: numbers, thresholds, costs, unlock conditions = fine (facts/mechanics, MIT-noticed). Verbatim flavor/quote text = minimize/paraphrase. Art/audio = zero.
4. Keep `NOTICE` (IvarK MIT 2017 + MindLated MIT 2025 if codec adapted + pako/break_infinity licenses via package managers) and the unofficial-guide disclaimer.
5. Privacy copy writes itself: "Your save never leaves your browser."

---

## 6. Open uncertainties (for follow-ups, not blockers)

1. **Current Android Options UI wording** (Export to Web vs Share/Export-to-Mobile/file in 3.18.x) — needs a device screenshot pass; 2023 labels may be stale. (`[INFERENCE]` from version drift.)
2. **`GameDatabase.progressStages` exact table** — file path unconfirmed (game-database dir listing failed); nice-to-have if we want upstream's own stage list instead of our thresholds.
3. **Decimal `toJSON` wire shape** edge cases (`{mantissa, exponent}` vs plain vs string) — Sato's `isBigNumberValue` covers observed shapes; confirm against 2–3 real/save-bank fixtures during implementation.
4. **iOS**: Fandom (2024-04-01) says no iOS version/plans, yet Apple App Store listing `id6738206800` and Sato's 2026-08 iOS fixture ("derived from a real iOS export") suggest one now exists — out of scope (Android-only) but the Apple prefix in our decoder costs nothing.
5. **Live-verification gap**: no current-Android save was decoded end-to-end in this pass (no device/emulator); implementation should validate against Save Bank fixtures + one real Android export before calling staging "done".
6. API rate limits hit during license re-checks (`lrobt97`, `break_infinity.js` license fields) — re-verify at implementation time if those deps become relevant (recommend: depend only on `pako`).

## 7. Primary file/function reference (answer key)

- `src/core/storage/serializer.js` — `GameSaveSerializer.{serialize, deserialize, encodeText, decodeText, getSteps, startingString, endingString, version, steps, jsonConverter}` (transport `AAB`, pako deflate, `0a/0b/0c` escapes, legacy `atob` fallback).
- `src/core/storage/storage.js` — `GameStorage.{save, load, loadRoot, import, checkPlayerObject, canSave}` (container `{current, saves}` vs player shape; error strings).
- `src/core/player.js` — `window.player` / `Player.defaultStart`, **`version: 25`**; fields per §3.4.
- `src/core/storage/migrations.js` — `migrations.{firstRealityMigration: 13, patches, prePatch, patch, patchPreReality}` (+ named fixups e.g. `infinitiedConversion`, `convertAchivementsToNumbers`).
- `src/core/player-progress.js` — `PlayerProgress.{isInfinityUnlocked, isEternityUnlocked, isRealityUnlocked, hasFullCompletion, …}`.
- `src/core/storage/progress-checker.js` — `ProgressChecker.{getProgressStage, getCompositeProgress}` (backing table path TBD).
- Sato editor — `src/domain/save/transport/codec.ts` (`decodeSaveString`, `encodeSaveData`, `detectSaveType`, Android/Apple `AAA` + gzip), `transport/editorJsonCodec.ts`, `transport/limits.ts`, `platforms/{android,apple,mobile,pc,adapter}.ts`, `catalog/progression.ts`, `validation/*`.
