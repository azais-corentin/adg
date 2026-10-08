# Antimatter Dimensions — Full Progression Map (Reality-era, Android target)

- Research date: 2026-10-08
- Primary truth: game source `IvarK/AntimatterDimensionsSourceCode`, master == release @ `5409e32` (2026-07-17). Shallow-cloned to `/tmp/adsrc`. All file paths below are relative to repo root unless noted.
- Scope: latest Android build (Google Play, dev Jakub Kajfosz, 1M+ downloads, 4.8★, release notes titled 3.18.0, listing updated 2026-10-01 — all read directly from the Play listing 2026-10-08). Distinguished from Web (ivark.github.io), Steam (release 2022-12-17, 91% positive), iOS (launched 2026-07-17 per changelog.js:11-31 — the wiki Mobile page claiming "no iOS plans" is stale).
- External cross-checks: Fandom wiki (Reality page ed. 2026-03-06; Guide `?action=raw` ed. 2026-08-12; Mobile page ed. 2024-04-04), Steam guides (Ninjatsu EC + Automator sheets), Tables61 reddit guides (via wiki copy / pullpush archive; reddit.com itself 403-blocked), Discord pins (cited by wiki as freshest; not directly accessible).
- Convention: every unlock number below is source-backed (file + line). Anything not directly observed is marked `[INFERENCE]`.

## 0. Canon phase skeleton (from the game's own `progress-checker.js`)

`src/core/secret-formula/progress-checker.js` defines the authoritative stage order the game itself uses (catchup modal + cloud-save comparison). The outline below follows it, expanded with celestials:

`PRE_INFINITY` (Antimatter Production) → `EARLY_INFINITY` (Infinity) → `BREAK_INFINITY` (Broken Infinity) → `REPLICANTI` → `EARLY_ETERNITY` (Eternity) → `ETERNITY_CHALLENGES` → `EARLY_DILATION` (Time Dilation) → `LATE_ETERNITY` (Late Eternity) → `EARLY_REALITY` (Reality) → `TERESA` → `EFFARIG` → `ENSLAVED` (Nameless Ones) → `V` → `RA` → `IMAGINARY_MACHINES` → `LAITELA` → `PELLE` (Doomed Reality → END).

In-game How-to-Play (`src/core/secret-formula/h2p.js`, 2010 lines, ~35 entries) mirrors this: Antimatter Dimensions → Tickspeed → Dimboosts → Galaxies → Sacrifice → Achievements → Infinity → Normal Challenges → Autobuyers → Break Infinity → Infinity Dimensions → Infinity Challenges → Replicanti → Eternity → Eternity Milestones → Time Dimensions → Time Studies → Eternity Challenges → Time Dilation → Reality → Glyphs → Perks → Automator Overview/Technical → Black Hole → Celestials → Teresa → Effarig → Advanced Glyph Mechanics → Nameless Ones → Tesseracts → V → Ra → Alchemy → Imaginary Machines → Lai'tela → Continuum → Singularities → Pelle → Pelle Strikes → Galaxy Generator. This h2p entry list is itself a ready-made guide ToC.

## Phase-by-phase outline

### Phase 1 — Pre-Infinity (first launch → 1st Big Crunch)
- Unlock condition: none (fresh save). Big Crunch available when antimatter ≥ challenge goal or ≥ `Decimal.NUMBER_MAX_VALUE` (1.79e308) — `src/core/player.js:942-947` (`get canCrunch`). First crunch shows the explanatory modal (`src/core/big-crunch.js:28-37`); speedrun milestone "First Infinity" fires on `BIG_CRUNCH_AFTER`.
- Player decisions: when to Dimension Boost vs Galaxy (boosts reset dims, galaxies reset boosts+dims); buying 1st–8th dims in order; first achievement row.
- Walls: pre-1e130 AM crawl; tickspeed vs dim priority. [INFERENCE — standard genre pacing; wiki Guide splits this into "10–1e130 AM" and "1e130–1e308 AM" sections.]
- Strategy (sourced): wiki Guide sections 1–2 (https://antimatter-dimensions.fandom.com/wiki/Guide, ed. 2026-08-12). Playtime per wiki Guide: 5h–2d (10–1e130 AM) + 3h–2d (1e130–1e308 AM).

### Phase 2 — Early Infinity (IP grind, autobuyers, Normal Challenges 1–9+)
- Unlock: `PlayerProgress.infinityUnlocked` = infinities > 0 (`src/core/player-progress.js:6-12`). Infinity Upgrades cost IP (`src/core/secret-formula/infinity/infinity-upgrades.js`, export `infinityUpgrades`, ~dozen entries with `cost`/`effect`/`charged` Ra variants).
- Decisions: IP spend order (time-mult → dim mults); which Normal Challenge to attempt (12 total, ids 1–12 in `secret-formula/challenges/normal-challenges.js`, export `normalChallenges`; C9 tickspeed + C12 big-crunch noted hardest); crunch autobuyer interval tuning.
- Walls: NC10–12 locked until 16 Infinities [source: changelog Reality entry; `lockedAt` field in normal-challenges.js]. IP softcap feel ~34–100 IP (wiki Guide "challenge era" 2h–3d).
- Strategy/playtime (wiki Guide): 1–33 IP 6h–6d; 34–100 IP 2h–3d; 100–1e5 IP "autobuyer era" 3h–5d.

### Phase 3 — Break Infinity (passive IP, Infinity Dimensions 1–2)
- Unlock: "Break Infinity" button requires maxed big-crunch autobuyer interval (`src/game.js:75-76`: `if (!Autobuyer.bigCrunch.hasMaxedInterval) return`); toggling sets `player.break`. Break Infinity Upgrades data: `secret-formula/infinity/break-infinity-upgrades.js` (`breakInfinityUpgrades`: totalAMMult 1e4 IP, currentAMMult 5e4 IP, galaxyBoost, infinitiedMult, achievementMult, slowestChallenge, etc.; tickspeed 1e6→, dim 1e7→ post-Reality costs per changelog).
- Decisions: when to break (right after maxing crunch interval); BI upgrade buy order; pushing to 1e8–1e9 IP for first ID.
- Walls: 1e5–1e7 IP pre-break grind (wiki: 4h–7d). [INFERENCE: the maxed-interval requirement is the classic "stuck" moment — players sit at 1e5+ IP not knowing autobuyer interval must bottom out.]
- Strategy/playtime (wiki Guide): break 4h–7d; 1e7–1e8 challenges revisited 2h–4d; 1e8–1e9 first ID 4h–2d; 1e9–1e10 2nd ID 4h–2d.

### Phase 4 — Infinity Challenges (8 ICs)
- Unlock: AM thresholds `unlockAM` in `secret-formula/challenges/infinity-challenges.js` (export `infinityChallenges`): IC1 1e2000, IC2 1e11000, IC3 1e12000, IC4 1e14000, IC5 1e18000, IC6 1e22500, IC7 1e23000, IC8 1e28000. Goals: IC1 1e650, IC2 1e10500, IC3 1e5000, IC4 1e13000, IC5 1e16500, IC6 2e22222, IC7 1e10000, IC8 1e27000. Each completion gives stacking 1.3x ID mult. Entering an IC sets `player.break = true` (`src/core/infinity-challenges.js:57`).
- Decisions: order (wiki/Ninjatsu order ~1,3,4→2→5+; IC5 "tickspeed" variant and IC6/IC8 late); retry vs push.
- Walls: IC5 (1e16500 goal) and IC8 are the documented hard ones. Steam mini-guide "IC5" by Drip exists for exactly this.
- Strategy (sourced): Ninjatsu EC/IC sheet lineage; wiki Guide 1e10–5e11 "first IC" 6h–4d, 5e11–1e50 "inflation" 2h–2d, 1e50–1e140 "IC era" 2h–4d.

### Phase 5 — Replicanti (unlock → galaxies → 1e308 IP)
- Unlock: 1e140 IP (÷ Pelle vacuum-milestone effect), `src/core/replicanti.js:517-524`; interval cost 1e140, chance cost 1e150, galaxy cost 1e170 (`replicanti.js:509-514`). Eternity milestone "start with Replicanti unlocked" at 10 eternities (`eternity-milestones.js:60-65`).
- Decisions: chance vs interval vs max-galaxy spend; when to push galaxies for the Eternity run-up.
- Walls: 1e140–1e308 IP grind is the longest Infinity stretch (wiki: 1.5d–12d).
- Strategy/playtime (wiki Guide): 1e140–1e308 replicanti phase 1.5d–12d.

### Phase 6 — Eternity (first Eternity → Time Studies tree, TT economy)
- Unlock: `Player.canEternity` = this-Eternity maxIP ≥ `requiredIPForEP(1)` (`src/core/player.js:949-951`; formula `src/game.js:156-159`: `10^(308·(log(ep/totalEPMult /5)+0.7))`, clamped min 1.79e308 — so first Eternity costs ≥ ~1.79e308 IP).
- Decisions: Eternity Upgrade buy order (`eternity-upgrades.js`, export `eternityUpgrades`: idMultEP 5 EP, idMultEternities 10 EP, …); Eternity Milestones ladder at 1,2,3,4,5,6,7…100,200,1000 eternities (`eternity-milestones.js`); first study-tree paths (idle/active/light-dark splits; 6 tree slots post-Reality).
- Walls: first ~10 eternities slow; EM breakpoints (8 = keep challenges/autobuyers per changelog; 10 = replicanti unlocked) structure the early game.
- Strategy (sourced): Ninjatsu "Eternity + Eternity Challenges" Steam guide (https://steamcommunity.com/sharedfiles/filedetails/?id=2909710573, 51 ratings; wraps Google Sheet covering Eternity start → Dilation with EC order + picturemap v2.5; comment 2023-01-14 confirms Reality-era validity except EC6 counts). Playtime (wiki Guide): 1e308 IP–1e17 EP 1.5d–16d.

### Phase 7 — Eternity Challenges (12 ECs × 5 completions)
- Data: `secret-formula/challenges/eternity-challenges.js` (export `eternityChallenges`): EC1 goal 1e1800 (+1e200/completion) … EC12 goal 1e110000 (+1e12000), EC12 = ×1000 game speed + altered-speed rules. ECs unlocked via EC time studies (`ec-time-studies.js`, export `ecTimeStudies`) each with TT cost + secondary resource gate (e.g. EC1-study: 70 TT + 1e8 infinities scaling; EC10-study: 550 TT + 1e100 EP scaling). Max 5 completions each (`maxCompletions` in `src/core/eternity-challenge.js:82`).
- Decisions: completion order (Ninjatsu sheet order); study respecs between runs (auto-respec on EC exit added 2024-05-02); pushing completions 4–5 with dilated/speed setups.
- Walls: EC10–EC12 (EC12 needs 1e110000 AM at ×1/1000 speed); EC11+EC12 full completion gates Dilation. This is the most-cited mid-game wall cluster.
- Strategy/playtime (wiki Guide): early ECs (1e17–1e50 EP) 1–25d; mid (1e50–1e400) 1–22d; late (1e400–1e1300) 0.5–18d.

### Phase 8 — Time Dilation (unlock → TD5–8 → dilation upgrades → tachyon → 1e4000 EP)
- Unlock: Dilation study id 1, cost 5000 TT, requires a 23x-row study + EC11 & EC12 fully completed + 12900 lifetime TT (`dilation-time-studies.js:1-27`; requirement 12900 in `src/core/time-studies/dilation-time-study.js:25-27`). Bypass paths: Ra `autoUnlockDilation`, perk `bypassECDilation`. TD5/6/7/8 studies cost 1e6/1e7/1e8/1e9 TT (`dilation-time-studies.js:28-54`). Dilation upgrade data: `secret-formula/eternity/dilation-upgrades.js` (`dilationUpgrades`: dtGain rebuyable 1e4 DT ×10, galaxyThreshold, tachyonGain, …).
- Decisions: DT spend (dtGain vs galaxyThreshold); tachyon galaxy pushes; TP-factor routing (TP gain = f(highest AM).
- Walls: 12900 TT accumulation; EC11/12 5× prerequisite; TP-gain understanding. [INFERENCE: the canonical "I have 1e3000 EP, what now" wall.]
- Strategy/playtime (wiki Guide): 1e1300–3e4444 EP dilation phase 7–28d.

### Phase 9 — Road to First Reality (1e4000 EP + achievements + Reality study → Reality)
- Unlock (triple gate, all source-verified): (a) Reality time study id 6, cost 1 TT: requires TD8 study + this-Reality maxEP exponent ≥ 4000 + (START perk OR all pre-Reality achievements) + not doomed (`dilation-time-studies.js:44-54`); pre-Reality = achievement rows < 14 (`src/core/achievements/normal-achievement.js:27-29`); (b) `isRealityAvailable()` = maxEP.exp ≥ 4000 && Reality study bought (`src/core/reality.js:119-121`); (c) first-Reality RM softcapped past 1e6000 EP, hardcapped at 1e8000 EP (wiki Reality page, ed. 2026-03-06 — formula itself lives in reality glyph/RM code, not re-verified line-level).
- Decisions: achievement cleanup order (rows 1–13 re-unlock 1 per 30 min post-Reality per wiki); final EP push route (dilation + EC completions + glyph-less TD scaling).
- Walls: missing 1–2 obscure achievements blocking the study [INFERENCE — the perk-bypass note matters: START perk removes this gate entirely].
- Playtime (wiki Guide): early Realities (>1e4000 EP–100 RM) 4–40d — the widest range in the game.

### Phase 10 — Early Reality (Glyphs, Perks, Automator, Black Hole, Reality Upgrades)
- Glyphs: first Reality grants glyph choice (4 choices with START perk: `perks.js` firstPerk desc); glyph types in `secret-formula/reality/glyph-types.js` (`glyphTypes`: time/dilation/replication/infinity/power/effarig/reality/companion/music…); effects math in `glyph-effects.js` (`glyphEffects`: timepow, timespeed, dilationpow, replicationpow, infinitypow, powerpow, effarigrm, …); sacrifice values in `glyph-sacrifices.js` (`glyphSacrifice`); cosmetics in `glyph-cosmetics.js`.
- Reality Upgrades: `reality-upgrades.js` (export `realityUpgrades`, 25 entries: rows of rebuyables 1–5 + one-shot 6–25; the 100-AP "Reality autobuyer + Automator command" upgrade). All-bought → achievement 147 → unlocks Teresa (`normal-achievements.js:1089-1096`).
- Perks: `secret-formula/reality/perks.js` (export `perks`, families ANTIMATTER/INFINITY/ETERNITY/DILATION/REALITY/AUTOMATION/ACHIEVEMENT; key early perks ACT/ECR/ECB/TTS/ACHNR/EU1/DILR/TP4 per Tables61 perk guide 2023-02-15). Perk Point Shop (Teresa, 1e21 RM poured — `secret-formula/celestials/teresa.js:21-25`) now unlocks BEFORE Effarig (wiki Guide parity note, ed. 2026-08-12).
- Black Hole: RM-bought interval/power/duration upgrades (`src/core/black-hole.js`; h2p Black Hole entry with full cost table); 2nd BH after 100 game-days; unlock = +10 Automator Points.
- Automator: unlock at 100 AP (`automator-points.js:33-35`: perks + reality upgrades + 2 AP/Reality up to 50 + 10 BH). See Automator section below.
- Decisions: first glyph picks (Tables61 glyph guide: reddit 101lby4, mirrored in wiki Guide ~line 997); perk route; automator-first vs BH-first RM spend.
- Playtime (wiki Guide): 100–500 RM Black Hole era 3–7d; 500–1e5 RM Automator era 7–21d; 1e5–1e6 RM row-5 0.5–3d; 1e6–1e14 RM Teresa unlock 2–7d; Teresa→Effarig (1e14–1e21) 5–14d.

### Phase 11 — Teresa, Celestial of Reality
- Unlock: achievement 147 "Master of Reality" (all Reality upgrades) — `Teresa.isUnlocked = Achievement(147).isUnlocked` (`src/core/celestials/teresa.js:12-14`).
- Mechanics: pour RM (cap 1e24, `teresa.js:15-31`); unlock ladder in `secret-formula/celestials/teresa.js` (`unlocks`: run 1e14, epGen 1e18, shop 1e21, effarig 1e24); Teresa reality run (AM-based reward multiplier `rewardMultiplier`, exponent 12 over 1.5e8 log); Perk Shop data `secret-formula/celestials/perk-shop.js` (`perkShop`).
- Decisions: pour timing (1% quadratic pour); when to attempt Teresa's Reality (needs ~1e14+ RM economy); shop buys.
- Playtime (wiki Guide): Teresa→Effarig 1e14–1e21 RM, 5–14d.

### Phase 12 — Effarig, Celestial of Ancient Relics
- Unlock: Teresa `effarig` unlock, 1e24 RM poured (`secret-formula/celestials/teresa.js:15-20`).
- Mechanics: 3-stage run (Infinity → Eternity → Reality stages, `src/core/celestials/effarig.js:27-38`); Relic Shards currency; Effarig unlock shop (`EffarigUnlock`, relic-shard costs in `secret-formula/celestials/effarig.js`); Effarig glyphs; completing Effarig's Eternity unlocks the Nameless Ones (h2p "Nameless Ones" entry).
- Decisions: shard allocation; glyph-filter setup; Effarig Reality completion.
- Playtime: wiki Guide gives no day range past this point — only RM landmarks (Perk Shop + Effarig at 1e21–1e29 RM; Effarig→Nameless at 1e29).

### Phase 13 — The Nameless Ones, Celestial of Time (incl. Tesseracts, companion glyphs)
- Unlock: complete Effarig's Eternity (h2p entry `h2p.js:1365+`).
- Mechanics: store game time (charge Black Hole, game speed →1) + store real time (halt production; cap 8h + Ra bonus, `enslaved.js:79-82`); unlocks bought with stored game time (`secret-formula/celestials/…` rifts/unlocks); Reality amplification (simulate N realities with stored real time); Black Hole discharge time-skip; Tesseracts (h2p entry) extend BH.
- Decisions: charge/discharge cycling; amplify targets (RM/shard farming); time-study power via unlocks.
- Playtime: RM landmarks only — Nameless→V at ~1e50 RM (wiki Guide).

### Phase 14 — V, Celestial of Achievements (incl. Space Theorems)
- Unlock: meet all 6 `mainUnlock` requirements SIMULTANEOUSLY (`secret-formula/celestials/v.js` `v.mainUnlock` + `unlocks.vAchievementUnlock`, `v.js:195-201`): 10000 realities, 1e70 eternities, 1e160 infinities, 1e320 DT (this-Reality max), 1e320000 replicanti (this-Reality max), 1e60 RM.
- Mechanics: 6 run conditions with tiered goals (`runUnlocks`: Glyph Knight, AntiStellar, Se7en, Young Boy EC12-no-dilation 400e6–800e6 AM, …); V-Achievement shards reduce goals (50e6/tier); Space Theorems as second currency (`V.spaceTheorems`); **Ra unlocks at 36 ST** (`src/core/celestials/ra/ra.js:337-339`); auto-EC/perk unlocks at ST counts (`v.js:220-231`).
- Decisions: which V-achievements to push first (shard economy); 36-ST route to Ra vs full V completion.
- Playtime: V→Ra at ~1e60 RM (wiki Guide).

### Phase 15 — Ra, Celestial of the Forgotten (incl. Alchemy)
- Unlock: 36 Space Theorems (`ra.js` `isUnlocked`).
- Mechanics: 4 pets (Teresa/Chandra… level via memories; `requiredUnlock` chains, `ra.js:88-97`); Alchemy resources (`secret-formula/celestials/alchemy.js`, `alchemyResources`: power/infinity/time/replication/dilation/effarig + multiversal reaction products); Glyph Alchemy h2p entries (resources + reactions); charged Infinity upgrades; theorem-boost factor (up to 10× continuous production at high TT).
- Decisions: pet leveling order; alchemy reaction routing; memory farming realities.
- Playtime: Ra unlock → 1e1000 RM; iM generation → Lai'tela (wiki Guide).

### Phase 16 — Imaginary Machines → Lai'tela, Celestial of Dimensions (incl. Continuum, Singularities, Dark Matter)
- Imaginary Upgrades: `secret-formula/reality/imaginary-upgrades.js` (25 upgrades, ids 1–25; intensifiers 1–5, then themed; costs up to 5e7 iM+). **Lai'tela unlocks at Imaginary Upgrade 15** (`src/core/celestials/laitela/laitela.js:12-14`); **Pelle unlocks at 25** (`src/core/celestials/pelle/pelle.js:127-129`).
- Mechanics: iM cap growth; Dark Matter Dimensions (DM eles/interval buys); Annihilation resets; Continuum (h2p); Singularities (cap, milestones — final milestone rebalanced 8e45→2.5e45 in 2023-01-26); Lai'tela reality (8-dimensional reality, destabilizing glyphs).
- Decisions: iM allocation; singularity timing; Lai'tela destabilization management.
- Playtime: Lai'tela→Pelle at ~1e9 iM; Pelle→END at ~1.6e15 iM (wiki Guide).

### Phase 17 — Pelle, Celestial of Antimatter (Doomed Reality → END / full completion)
- Unlock/doom: buying Imaginary Upgrade 25 unlocks Pelle; dooming starts a Doomed Reality (`pelle.js:103-110` — resets almost everything, keeps General/Reality stats + challenge times; disables large mechanic sets unless re-unlocked via Pelle upgrades `pelle-upgrades.js` `pelleUpgrades`).
- Mechanics: Remnants → Reality Shards → Pelle Upgrades; 5 Rifts (`secret-formula/celestials/rifts.js`: vacuum/decay/etc. with fill requirements); Strikes (h2p "Pelle Strikes"); Galaxy Generator (h2p); Armageddon; game-end sequence (`src/core/celestials/pelle/game-end.js`; `player.records.fullGameCompletions`, `player.js:276`; `PlayerProgress.hasFullCompletion`).
- Decisions: rift fill order; strike management; when to armageddon/finish; post-completion replay (companion, speedrun).
- Playtime (anecdotal, self-reports): Bubba guide (2026-04-09): Infinity hours–days, Eternity days–week, Reality week–month, END 1–3 months, author record ~4 weeks. Play reviews: 110 days @15–30 min/day (2026-08-25); 194 days first playthrough (2026-06-06). Reddit: ~42 days 24/7 (2024-10-18); 4th-playthrough author: 1st ~2 years, 2nd 6 months, 3rd 47 days. HowLongToBeat figures seen via search are UNVERIFIED (site 403) — do not use.

## Extractable data files (path → contents → format)

All are ES modules exporting a named const (array of entry objects or keyed object). Descriptions/effects are often functions (need game context to evaluate) — extract `id/name/description-source/cost/requirement` statically; effects require runtime eval.

| Path (`src/core/…`) | Export | Contents | Format |
|---|---|---|---|
| `secret-formula/achievements/normal-achievements.js` | `normalAchievements` | 144 entries, ids 11–188; name/description/checkEvent/checkRequirement/reward | Array of objects; row = floor(id/10)? (row<14 = pre-Reality) |
| `secret-formula/achievements/secret-achievements.js` | `secretAchievements` | 32 entries, ids 11–… | Same shape |
| `secret-formula/challenges/normal-challenges.js` | `normalChallenges` | 12 NCs; description/name/reward/lockedAt | Array; `lockedAt: Decimal` infinities |
| `secret-formula/challenges/infinity-challenges.js` | `infinityChallenges` | 8 ICs; goal/unlockAM/reward | Array |
| `secret-formula/challenges/eternity-challenges.js` | `eternityChallenges` | 12 ECs; goal/goalIncrease/pelleGoal/reward | Array |
| `secret-formula/eternity/time-studies/normal-time-studies.js` | `normalTimeStudies` | ~all normal studies; id/cost/requirement/reqType/secondary | Array (~693 lines) |
| `secret-formula/eternity/time-studies/ec-time-studies.js` | `ecTimeStudies` | EC studies; id/cost/requirement/secondary{resource,required fn} | Array (144 lines) |
| `secret-formula/eternity/time-studies/dilation-time-studies.js` | `dilationTimeStudies` | 6 studies (dilation, TD5–8, Reality); id/cost/requirement fn | Array (55 lines) |
| `secret-formula/eternity/dilation-upgrades.js` | `dilationUpgrades` | DT upgrades incl. rebuyables (dtGain, galaxyThreshold, …) | Keyed object via `rebuyable()` factory |
| `secret-formula/eternity/eternity-upgrades.js` | `eternityUpgrades` | EP upgrades; id/cost/description/effect | Keyed object |
| `secret-formula/eternity/eternity-milestones.js` | `eternityMilestones` | ~26 milestones keyed by eternities count (1…1000) | Keyed object `{eternities, reward}` |
| `secret-formula/infinity/infinity-upgrades.js` | `infinityUpgrades` | IP upgrades + `charged` Ra variants | Keyed object |
| `secret-formula/infinity/break-infinity-upgrades.js` | `breakInfinityUpgrades` | BI upgrades incl. `rebuyable()` factory entries | Keyed object |
| `secret-formula/reality/reality-upgrades.js` | `realityUpgrades` | 25 upgrades (rebuyable rows + one-shots); automatorPoints fields | Array via `rebuyable()` factory (365 lines) |
| `secret-formula/reality/perks.js` | `perks` (+`PERK_FAMILY`) | ~48 perks; id/label/family/description/automatorPoints | Keyed object |
| `secret-formula/reality/imaginary-upgrades.js` | (imaginary list) | 25 iM upgrades; id/name/cost/description | Array |
| `secret-formula/reality/glyph-types.js` | `glyphTypes` | Glyph types (time/dilation/replication/infinity/power/effarig/reality/…) | Keyed object |
| `secret-formula/reality/glyph-effects.js` | `glyphEffects` (+`GlyphCombiner`) | Effect defs (timepow, dilationpow, replicationpow, infinitypow, powerpow, effarigrm, …) | Keyed object |
| `secret-formula/reality/glyph-sacrifices.js` | `glyphSacrifice` | Sacrifice values per type | Keyed object |
| `secret-formula/reality/glyph-cosmetics.js` | `glyphCosmeticSets` | Cosmetic sets incl. cel symbols | Keyed object |
| `secret-formula/reality/automator.js` | command docs + `otherAutomatorPoints` + `templates` | In-game automator reference (ids 0–19), AP sources, script templates | Mixed exports |
| `secret-formula/celestials/teresa.js` | `teresa` | Teresa unlock ladder (run/epGen/shop/effarig + prices 1e14/1e18/1e21/1e24) | `{unlocks:{…}}` |
| `secret-formula/celestials/effarig.js` | (effarig unlocks) | Relic-shard unlock costs | Keyed object |
| `secret-formula/celestials/v.js` | `v` | `mainUnlock` (6 reqs) + `runUnlocks` tiers + `unlocks` (ST-gated) | Nested object |
| `secret-formula/celestials/alchemy.js` | `alchemyResources` | Alchemy resources + reactions | Keyed object |
| `secret-formula/celestials/perk-shop.js` | `perkShop` | Teresa perk-shop upgrades | Keyed object |
| `secret-formula/celestials/pelle-upgrades.js` | `pelleUpgrades` | Pelle/remnant upgrades | Keyed object |
| `secret-formula/celestials/rifts.js` | (rift defs) | 5 Pelle rifts + milestone fill reqs | Keyed object |
| `secret-formula/h2p.js` | (h2p tabs) | ~35 How-to-Play articles (name/info/isUnlocked/tags/tab) — in-game guide text, directly reusable | Array of tab objects |
| `secret-formula/changelog.js` | `changelog` | Date-keyed entries (Reality Update 2022-12-17; Android Reality 2024-05-02; iOS 2026-07-17). NOTE: date-only, no version numbers | Array |
| `secret-formula/speedrun-milestones.js` | `speedrunMilestones` | 25 milestones (firstBoost … full completion) with check fns — phase gates in miniature | Array |
| `secret-formula/progress-checker.js` | `progressStages` | 17 `PROGRESS_STAGE` entries with `hasReached(save)` predicates — the canon phase detector; directly reusable for guide progress tracking | Array |
| `secret-formula/game-database.js` | `GameDatabase` | Index wiring all of the above (tabs/reality/celestials/…) | Aggregator object |
| `core/automator/script-templates.js` | (5 templates) | Climb EP / Grind Eternities / Grind Infinities / Complete EC / Unlock Dilation script generators | Constructor + generators |
| `core/player-progress.js` | `PlayerProgress` | `infinityUnlocked/eternityUnlocked/realityUnlocked/hasFullCompletion` gates (71 lines) | Class with getters |

Runtime-only (not statically extractable, need eval harness): `effect`/`requirement` closures referencing live `player`/`Currency` state; glyph level generation (`gainedGlyphLevel` in `src/game.js:161+`); RM/iM gain formulas.

## What the Reality update reworked (why old guides are wrong)

Source: `secret-formula/changelog.js` "The Reality Update" entry 2022-12-17 (lines 570–795) + follow-up balance entries. The changelog is date-only (no version numbers); the only numeric version in code is save `version: 25` (`player.js:362`).
- New layers/mechanics: Reality prestige, Glyphs, Reality Upgrades, Perks, Automator (new Chevrotain DSL — did not exist pre-2022-12-17), Black Hole, Celestials (7), Modern UI/Vue rewrite, modals, detailed H2P, 5 new achievement rows, Multiplier tab, speedrun mode, cloud saves.
- Renames that break old-guide search: Dimension Shift→Dimension Boost, Infinitied→Infinities, free galaxy→Tachyon Galaxy, Normal Dimensions→Antimatter Dimensions, Challenges→Normal Challenges; tickspeed shown as X/sec; Autobuyers moved to Automation tab.
- Infinity layer: pre-Infinity AM autobuyer unlocks; crunch-autobuyer interval halved; NC10–12 gated at 16 Infinities; +1.03x AD mult per achievement; IP upgrade 500→300 IP; post-break costs lowered (tickspeed 1e6, dims 1e7); NC7 reworked (no RNG); IC1 goal 1e850→1e650 + restrictions-only, IC2 unlock 1e5000→1e10500, IC5 1e11111→1e16500, IC6 1e20000→1e22500.
- Eternity layer: 20-eternity milestone→8; TD costs harder past 1e6000; TS83 hard-capped; EC10 reward nerfed <5; Dilation unlock 13000→12900 TT + now needs a 23x-row study; TP from highest AM; multi-RG ticks; EC progress display; TS131/133 downsides removable.
- Achievements: ~25 requirement/reward changes; ids 101↔117, 113↔124 swapped; ach41 replaced — pre-2022 achievement numbering is unreliable.
- Post-release (still Reality-era, in Android build): 2023-01 Eternity/EC/BH/single-buffs; 2023-04 Glyph RNG overhaul (Realities 2–21 type rotation, 2-effect glyphs boosted, 7 preset slots); 2023-05 offline 6h→24h, automator `stop`, `notify` quotes; 2023-07 Final Patch (glyph filter import/export, ST automator currency); 2024-05-02 Android Reality balance (new DAB perk, cel2↔perk-shop swap, TS131 effect, ach118→Sacrifice autobuyer, EM1000 = Eternity ≤5s, EC-exit auto-respec); 2024-08-12 spent-TT automator currency; 2026-07-17 iOS launch (no mechanics).
- Code staleness signal (GitHub API 2026-10-08): automator/ last functional change 2024-08-12; celestials/ 2024-05-02; glyphs/ 2023-08; secret-formula/reality/ 2024-08-12; HEAD activity is iOS housekeeping only. Mechanics have been stable ~2 years — safe to build against.

## Automator: language overview + script validity

- Chevrotain DSL (`core/automator/lexer.js`, `parser.js`, `compiler.js`, `automator-commands.js`, `automator-backend.js`); block editor compiles to the same text. Full pipeline: lexer (case-insensitive tokens) → per-command `rule` fns → validator + per-command `validate` → stack interpreter (≤100 cmds/update, interval max(500·0.994^realities, 1) ms).
- Commands (~20, docs in `secret-formula/reality/automator.js` ids 0–19): `studies [nowait] purchase/load/respec`, `infinity|eternity|reality [nowait] [respec]`, `unlock ec N|dilation`, `start ec N|dilation`, `auto … on|off|N time|N x highest|N currency`, `black hole on|off`, `store game time on|off|use`, `notify "…"`, `wait <cmp|prestige|black hole …>`, `pause <dur|const>`, `if/while/until <cmp> {…}` (nestable, braces same-line/own-line), `stop`; comments `#` or `//` own-line only.
- Comparisons: `< <= > >=` only — `==`/`=` rejected by compiler ("use an inequality"); single values, NO arithmetic. Currencies: am/ip/ep/dt/tp/rg/rm/replicanti/infinities/banked/eternities/realities/pending ip-ep-tp-rm-glyph/TT/total+spent TT/EC completions/filter score/space theorems. Constants max 30 (name ≤20 chars); scripts 10000 chars/20 scripts/60KB total, name ≤15 chars. 5 built-in templates (Climb EP, Grind Eternities/Infinities, Complete EC, Unlock Dilation).
- Validity of shared scripts: post-2022-12-17 scripts using the base command set still parse (later changes purely additive: `stop`, spent-TT, space theorems, `!` study suffix, `nowait`). Breakage points: inline comments (`cmd // note` invalid), `==`/`!=`, user constants colliding with new reserved words (spent/total TT, space theorems, stop, nowait, blob). Ninjatsu's Automator sheet (Steam guide id 3040232174, comments active through 2026-06-23) is the maintained Reality→END script collection and the best validity reference.

## Open uncertainties (need browser/Discord or device access)
1. Exact current Android↔Web feature delta (Android 3.18.0 notes list Away Progress Options etc.; web already has them — direction is Android catching up, but no source states today's delta). [INFERENCE]
2. First-Reality RM formula caps (soft 1e6000 / hard 1e8000 EP from wiki only; not line-verified in `reality.js`/glyph code).
3. Discord-pin strategies (wiki says fresher than the wiki Guide; inaccessible — reddit.com 403, no Discord access).
4. Per-celestial playtimes beyond RM landmarks (no neutral source; HLTB blocked).
5. Tables61 originals + Patashu Google Doc not directly opened (reddit 403 / doc ID unverified); validity via wiki mirror only.
6. Whether `ivark.github.io` live deploy == repo HEAD (not checked; Android build is the target anyway).
