# adg — Antimatter Dimensions Guide: pre-planning decisions

Status: pre-planning complete (2026-10-08). Next: implementation plan.
Research reports (sourced, dated): [`docs/research/`](research/).

## Target

- **Game:** Antimatter Dimensions, **Android only**. The current version is **3.18.0** (Play listing "Updated Oct 1, 2026"). The package is `kajfosz.antimatterdimensions` by Jakub Kajfosz.
- The Reality update reached Android in **3.0.0 (2024-04-01)**. Android now has full content parity with Web/Steam, including all Celestials, Pelle, and Doomed Reality. Updates ship weekly (3.13 → 3.18, Aug–Oct 2026).
- The Android client is **closed-source**. The mechanics source of truth is the MIT web source `IvarK/AntimatterDimensionsSourceCode`, pinned at a commit. Mechanics have been stable since the 2024 balance passes.
- **Staleness rule:** advice from before 2024-04-01 that is labeled "mobile" is pre-Reality. Advice from before 2022-12-17 is pre-Reality on every platform. For the known-stale claims, see [`research/guides.md`](research/guides.md).

## Decisions

| # | Topic | Decision |
|---|---|---|
| D1 | Core model | **Save-aware with a manual fallback.** The player pastes an Android export. adg decodes it locally, detects the stage, and shows next goals and the relevant sections. A manual stage picker and checklists cover players who don't import. |
| D2 | Content scope order | **Milestone 1:** Pre-Infinity → first Reality (incl. Glyphs, Perks, Automator basics). **Milestone 2:** Celestials (Teresa → Effarig → Nameless → V → Ra → Lai'tela → Pelle → END). |
| D3 | Interactive tools | All five are in scope: save import + stage detector, Time Study tree planner (in-game import/export strings), Eternity Challenge planner, Automator script library, milestone checklists. |
| D4 | Android ground truth | Captured directly from the user's phone over wireless adb: 3.18.0 screenshots and real exports. See [`device/README.md`](device/README.md) and `/fixtures/saves/`. Articles state "verified against Android 3.18.x". |
| D5 | Game data | **Build-time extraction** from upstream at a pinned SHA. A Bun script evaluates `src/core/secret-formula/*` and emits typed JSON. Bumping the pin produces a reviewable diff. |
| D6 | Deploy | **Static + offline PWA on Cloudflare Pages at `ad.nelieru.cc`.** Uses `@sveltejs/adapter-static` 4, is fully prerendered, and uses Kit's built-in `$service-worker` (`@vite-pwa/sveltekit` only supports Kit 2). Saves never leave the device. Deploys use nixpkgs `wrangler`; Cloudflare login goes through the user. |
| D7 | TypeScript | **TS 7.0.2 native `tsc`** type-checks all `.ts`. **TS 6** (npm alias) runs only `svelte-check` for `.svelte` files, because language-tools#2733 blocks svelte-check on TS 7. Drop TS 6 once TS 7.1's API lands. |
| D8 | UX | **Mobile-first, clean docs style.** Built for a phone next to the game or in split-screen. Neutral documentation look. |
| D9 | Repo & license | **Public GitHub, MIT:** [azais-corentin/adg](https://github.com/azais-corentin/adg). `NOTICE` credits IvarK (upstream MIT ©2017) plus an "unofficial, not affiliated" disclaimer. Prose is original: Fandom text (CC BY-SA) is reworded and linked, Fandom images are never bundled, and third-party guides are summarized and linked. |
| D10 | Automator scripts | **We write our own.** Each script is verified in-game before it ships. Third-party scripts are only linked. |
| D11 | Git hooks | **hk + gitleaks, installed per project by mise** (`mise.toml`, `hk.pkl`, `hk install --mise`). The app toolchain stays in `flake.nix`. |

## Stack (verified against the npm registry / nixpkgs, 2026-10-08)

| Piece | Version | Note |
|---|---|---|
| Bun | 1.4.2 | nixpkgs-unstable `bun` |
| SvelteKit | 3.0.1 | Released 2026-10-01; needs Vite ^8.0.12, Svelte ^5.57.1, Node ≥22.17 for tooling |
| Svelte | 5.57.2 | |
| Vite | 8.3.4 | |
| TypeScript | 7.0.2 (`typescript`) + 6.x alias for svelte-check | nixpkgs `typescript` = 7.0.2 |
| svelte-check | 4.7.6 | peers TS ^5 \|\| ^6 |
| Tests | Vitest (unit) + Playwright (e2e) | Playwright browsers from nixpkgs `playwright-driver.browsers`; the npm version must match it |
| Tooling | `flake.nix` (plain `forAllSystems`) + `.envrc` (`use flake`) | Packages: bun, nodejs_22, wrangler, android-tools, playwright-driver.browsers. See [`research/tooling.md`](research/tooling.md) |
| Hooks | `mise.toml`: hk 2.5.0, gitleaks 8.30.1 | The pre-commit hook runs `gitleaks git --pre-commit --staged`; `hk check` runs a full scan |

## Key technical facts carried into planning

- **Save decoding** ([`research/save-license.md`](research/save-license.md)):
  - **Export to web/steam**: `AntimatterDimensionsSavefileFormat` + `AAB` → zlib deflate → upstream schema (`version: 25`). Verified on real 3.18.0 exports and against `src/core/storage/serializer.js`.
  - **Export to mobile**: `AntimatterDimensionsAndroidSaveFormat` + `AAA` → gzip → an **Android-native schema**, different from upstream. Its `version` is the app versionCode, big numbers are `{mantissa, exponent}`, and field names differ. Verified on real exports; details in [`device/README.md`](device/README.md).
  - Both use the `0a/0b/0c` escapes and base64, then `JSON.parse`. Detect the envelope by prefix.
- **Stage detection:** reuse upstream `progress-checker.js` (17 stages) and the `player` fields (`infinities`, `eternities`, `realities`, `celestials.*`, `achievementBits`, challenge bitmasks). Staging is read-only; skip migrations and branch on which fields are present.
- **Content skeleton:** about 35 upstream How-to-Play articles plus the progress-checker stages give the article tree. Articles are original prose, cross-checked against source and the D4 screenshots.
- **Automator scripts:** we write our own (D10). Ninjatsu's collection (the de-facto standard, no reuse license) is linked as further reading only.

## Open items

1. ~~Android export flow~~: resolved, see `device/README.md`.
2. ~~Automator sourcing~~: we write our own (D10).
3. ~~Hosting~~: Cloudflare Pages, `ad.nelieru.cc` (D6). Repo created (D9).
4. Page authoring format. **mdsvex** (guide pages as Markdown files with embedded interactive components) or **plain Svelte pages**. This is an engineering choice, not a product one; it gets decided by a short compatibility test against SvelteKit 3. Default is mdsvex.
5. Exact upstream pin SHA (master == release @ `5409e32`, 2026-07-17, per research) and how the extractor evaluates `secret-formula` closures. Decided by a spike.
6. Which save format(s) adg accepts. Pending a user decision.
7. Screens for stages the user hasn't reached yet (Eternity Challenges, Dilation, Reality, Celestials). Pending a user decision.

## Process

- Conventional Commits. Commit after each coherent step during implementation.
- Every guide article carries a "verified against Android 3.18.x / upstream SHA" stamp so staleness is visible when the game updates.
