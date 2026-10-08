# Tooling & compatibility research (as of 2026-10-08)

Target stack: SvelteKit + Bun + TypeScript 7 (Go-native `tsc`) under Nix.
Every version below was observed directly (npm registry / GitHub API / NixOS MCP /
official announcement) on 2026-10-08 unless marked `[INFERENCE]`.

## 1. Version table (observed)

| Package | Latest observed | Source (date) | Notes |
|---|---|---|---|
| `typescript` (npm) | **7.0.2** | https://registry.npmjs.org/typescript/latest (observed 2026-10-08) | GA announced **2026-07-08** by Daniel Rosenwasser: https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/ (published 2026-07-08). Native Go port, `bin: { tsc: bin/tsc }`, per-platform optional deps (`@typescript/typescript-linux-x64`, …). `npm i -D typescript` gets the native compiler. |
| `@typescript/native-preview` (npm) | **7.0.0-dev.20260707.2** (stale) | https://registry.npmjs.org/@typescript%2Fnative-preview/latest (observed 2026-10-08) | Preview-era package, `bin: { tsgo }`. Nightlies moved back to `typescript@next` per the 7.0 announcement. Last publish 2026-07-07 ≈ GA cut. **Do not use for new work.** |
| `@typescript/typescript6` (npm, compat) | `^6.0.2` referenced (not directly fetched) | TS 7.0 announcement 2026-07-08 | Provides `tsc6` binary + re-exports the TS 6.0 JS API for side-by-side use. Official pattern (from announcement): `"typescript": "npm:@typescript/typescript6@^6.0.2"` + `"@typescript/native": "npm:typescript@^7.0.2"`. |
| `svelte` (npm) | **5.57.2** | https://registry.npmjs.org/svelte/latest (observed 2026-10-08) | Svelte 5 runes branch; `engines: node >=18`. Its own repo `check:tsgo` script exists, devDeps still `typescript ^5.5.4`. |
| `@sveltejs/kit` (npm) | **`latest` = 3.0.1, `next` = 3.0.0-next.32** | https://registry.npmjs.org/-/package/@sveltejs%2Fkit/dist-tags (observed 2026-10-08) | SvelteKit 3 announced **2026-10-01**: https://svelte.dev/blog/sveltekit-3-is-here. `sv migrate sveltekit-3` / `sv create`. Breaking: config moves to `vite.config.ts`, `$lib` → `#lib` subpath imports. |
| `@sveltejs/kit` 2.x | **2.70.3** tarball observed | https://registry.npmjs.org/@sveltejs%2Fkit/2.70.3 (observed 2026-10-08) | Highest 2.x I verified; `[INFERENCE]` that it is the final 2.x patch (secondary search corroborates, full version list not fetched). Kit 2: `node >=18.13`, Vite `^5 \|\| ^6 \|\| ^7-beta \|\| ^8` peer, TS `^5.3.3 \|\| ^6.0.0` optional peer. |
| `@sveltejs/kit` 3.0.1 requirements | — | same registry metadata (observed 2026-10-08) | `engines: node >=22.17`; peers: `vite ^8.0.12`, `svelte ^5.57.1`, `typescript ^6.0.0` (optional). Notably the Kit repo itself typechecks via `"tsc-native": "node node_modules/@typescript/native/bin/tsc"` with devDep `"@typescript/native": "npm:typescript@^7.0.2"` — i.e. native `tsc` binary for pure-TS files, TS 6 (`typescript ~6.0.3`) for the programmatic API. |
| `@sveltejs/adapter-bun` (npm, official) | **1.0.0** (`next`: 1.0.0-next.1..3 also exist) | https://registry.npmjs.org/@sveltejs%2Fadapter-bun/latest + full doc (observed 2026-10-08) | `engines: { bun: ">=1.4.0" }`, **peer `@sveltejs/kit ^3.0.0-next.0` — Kit 3 only, no Kit 2 support.** Standalone Bun server (`Bun.serve`), its own test script is `bun test .spec`. Supersedes community `svelte-adapter-bun` (gornostay25). |
| `sv` (scaffolding CLI) | **1.1.1** | https://registry.npmjs.org/sv/latest (observed 2026-10-08) | `bin: { sv }`; `sv create` / `sv migrate`. So `bunx sv create` works. |
| `svelte-check` | **4.7.6** (`latest` tag) | https://registry.npmjs.org/svelte-check/latest + dist-tags (observed 2026-10-08) | **Peers `typescript ^5 \|\| ^6` — TS 7 is NOT an accepted peer.** DevDeps include `@typescript/native-preview ~7.0.0-dev.20260703.1` (preview-era) + `typescript ^6.0.3`. |
| `vite` | **8.3.4** | https://registry.npmjs.org/vite/latest (observed 2026-10-08) | `engines: node ^20.19 \|\| >=22.12`. Peer `esbuild ^0.27 \|\| ^0.28`. |
| `bun` (upstream) | **v1.4.2** (published 2026-09-05) | https://api.github.com/repos/oven-sh/bun/releases/latest (observed 2026-10-08) | Matches nixpkgs below. |
| nixpkgs-unstable `bun` | **1.4.2** | NixOS MCP `info bun` (2026-10-08) | Current. |
| nixpkgs-unstable `nodejs` (default) | **24.21.0** | NixOS MCP `info nodejs` (2026-10-08) | Satisfies Kit 3 (`>=22.17`) and Vite (`^20.19 \|\| >=22.12`). |
| nixpkgs-unstable `nodejs_22` | **22.23.3** | NixOS MCP `info nodejs_22` (2026-10-08) | Pin this if you want the minimum Kit-3-supported major. |
| nixpkgs-unstable `typescript` / `typescript_7` | **7.0.2** | NixOS MCP `search typescript` (2026-10-08) | Both attrs are 7.0.2. |
| nixpkgs-unstable `typescript_5` | **5.9.3** | NixOS MCP `search typescript` (2026-10-08) | Available for the svelte-check side-by-side pattern. |
| nixpkgs `tsgo` | **not packaged** (no match) | NixOS MCP `search tsgo` (2026-10-08) | Only unrelated hits (`tsgolint` etc.). The `tsgo` binary name is preview-era anyway; TS 7 ships `tsc`. |
| nixpkgs-unstable `esbuild` | **0.27.2** | NixOS MCP `info esbuild` (2026-10-08) | Satisfies Vite 8's `esbuild ^0.27 \|\| ^0.28` peer — usable for `ESBUILD_BINARY_PATH`. |
| nixpkgs `playwright-driver` | **1.63.0** | NixOS MCP `info playwright-driver` (2026-10-08) | For `PLAYWRIGHT_BROWSERS_PATH`; must match the npm `@playwright/test` minor version. |

## 2. TypeScript 7: CLI, LSP, programmatic API (observed)

- **Package/bin:** `typescript@7.0.2`, binary is **`tsc`** (native Go executable resolving per-platform optional packages). Preview-era `tsgo` binary / `@typescript/native-preview` are superseded (source: registry metadata + 7.0 announcement, 2026-07-08).
- **Drop-in `tsc`?** For pure `.ts` CLI typechecking/emitting: yes — same flags/output, plus experimental `--checkers N` / `--builders N` / `--singleThreaded`, rebuilt `--watch` on a Go port of Parcel's watcher (source: 7.0 announcement). **Caveat:** TS 7 adopts TS 6.0 defaults as hard behavior (`strict` true, `module esnext`, `stableTypeOrdering` locked on, `rootDir` defaults `./`, `types` defaults `[]`, etc.). Migrating projects should pass through TS 6 first (source: same announcement).
- **LSP:** native LSP is supported by editors (VS Code extension `TypeScriptTeam.native-preview`, VS auto-enable, WebStorm) — but this is the *plain TS* language server, not Svelte-aware (source: 7.0 announcement).
- **Programmatic JS API: NOT stable in 7.0.** Registry `typescript@7.0.2` exposes only `exports["./unstable/*"]` (`ast`, `sync`, `async`, `proto`, `fs`). The announcement states explicitly: *"While TypeScript 7.0 is here, it does not ship with an API. We expect TypeScript 7.1 to ship with a new (and different) API"* with the `@typescript/typescript6` side-by-side pattern as the bridge (source: 7.0 announcement 2026-07-08).

## 3. Definitive answer: TS7 + Svelte tooling compatibility

**Status: svelte-check / svelte-language-server do NOT run on pure TypeScript 7 as of 2026-10-08. Keep them on TS 5/6.**

- Tracking issue **sveltejs/language-tools#2733** ("TypeScript Go support (at least in CLI)") is **open**, labeled `Blocked`/`upstream` (observed 2026-10-08; created 2025-04-08, last activity 2026-08-20). Maintainer (@jasonlyu123) points, in order:
  - 2025-04: svelte-check doesn't shell out to `tsc`; it uses low-level TS APIs that tsgo rewrites — "not a simple change".
  - 2025-08: the TS programmatic API library is expected only *after* TS 7 ships.
  - 2025-12: *"The main problem is that there is no way for us to alter the module resolution to resolve Svelte files."*
  - **2026-07-02: svelte-check has `--tsgo` and `--tsgo-experimental-api` flags**, requiring `@typescript/native-preview` in the project; *"TypeScript 7 RC isn't supported yet"*; the APIs/workarounds used *"aren't available in LSP. So the editor integration still has to wait."*
  - 2026-08-20: content-mapper support merged into tsgo (microsoft/typescript-go#4712) — the upstream unblocker, but not yet consumed by a stable svelte-check release (4.7.6 peers still TS `^5 || ^6`).
- **Recommended configuration for `adg`:**
  ```json
  { "devDependencies": {
      "typescript": "~6.0.2",
      "@typescript/native": "npm:typescript@^7.0.2",
      "svelte-check": "^4.7.6"
  } }
  ```
  - `svelte-check` (no flags) runs on TS 6 → covers `.svelte` + `.ts` (this is also exactly what the SvelteKit 3 repo itself does: `typescript ~6.0.3` peer + `@typescript/native` aliased to TS 7 for `tsc-native`).
  - `node node_modules/@typescript/native/bin/tsc` (a.k.a. native `tsc`) for fast pure-TS checks (`--checkers` tunable, `--singleThreaded` for CI determinism — note MS's warning that varying `--checkers` can rarely surface order-dependent results; pin one value everywhere).
  - Treat `svelte-check --tsgo*` as experimental-only (pinned to preview builds per maintainer comment; *"might break when you update"*).
  - Editor: Svelte VS Code extension still runs on the TS-6-backed language server path; plain-TS files can additionally use the TS 7 native LSP. Revisit after **TypeScript 7.1** (new API) + a svelte-check release accepting TS 7 peers.
  - Community stopgaps exist (`svelte-fast-check`, `golar`, `svelte-check-rs` per issue comments) — all unofficial, parser-drift risk; not recommended for CI.

## 4. Bun + SvelteKit + test runner

- **Scaffold:** `bunx sv create` (`sv@1.1.1`, observed).
- **Deploy adapter: use official `@sveltejs/adapter-bun@1.0.0`** (Kit team, `Bun.serve`-native, needs Bun ≥ 1.4). It **requires SvelteKit 3** (peer `^3.0.0-next.0`), so choosing it implies SvelteKit 3.0.1 + `vite ^8` + `node >=22.17`. Community `svelte-adapter-bun` is legacy. `@sveltejs/adapter-node`-under-Bun is only for legacy Node-middleware needs (Node-emulation overhead; `[INFERENCE]` on perf magnitude — adapter comparison detail comes from secondary search, not measured here). For a static guide site, `@sveltejs/adapter-static` remains an option; prerendering needs no server at all.
- **Vite:** v8.3.4 current; matches Kit 3's `vite ^8.0.12` peer. Vite `engines` is Node-only — run dev/build under Node (`bun run dev` invoking the Node runtime or plain `node`), keep Bun for package management/scripts unless you verify `bun --bun` HMR stability yourself `[INFERENCE — unverified claim seen in secondary sources; needs a live test]`.
- **Tests:** follow repo conventions — `vitest` (Svelte 5 devDeps `^4.1.7`, Kit suites, Playwright `^1.60–1.62` for e2e). `bun test` is what adapter-bun dogfoods for its own spec, but Svelte-ecosystem suites are vitest-based; use **vitest for unit, Playwright for e2e**, not `bun test`.

## 5. Nix (nixpkgs-unstable, observed 2026-10-08)

- `bun` 1.4.2 and `nodejs` 24.21.0 are current; `nodejs_22` 22.23.3 available. TypeScript 7 (`typescript`/`typescript_7` = 7.0.2) **is** packaged; `tsgo` is not (nothing to package — preview name). `typescript_5` 5.9.3 covers the svelte-check side.
- **Recommendation: plain `forAllSystems` flake, no flake-utils** (one less input; boring and sufficient). `.envrc` with `use flake` via nix-direnv.
- Sketch:
  ```nix
  {
    inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    outputs = { self, nixpkgs }:
      let
        forAllSystems = nixpkgs.lib.genAttrs [ "x86_64-linux" "aarch64-linux" "aarch64-darwin" ];
      in {
        devShells = forAllSystems (system:
          let pkgs = import nixpkgs { inherit system; }; in {
            default = pkgs.mkShell {
              packages = with pkgs; [
                bun                  # 1.4.2 (observed)
                nodejs_22            # 22.23.3; satisfies Kit 3 >=22.17, Vite >=22.12; prefer over default 24 for min-version fidelity
                typescript           # 7.0.2 native tsc (optional: Bun can also supply it via npm; nix copy is hermetic)
                esbuild              # 0.27.2 for ESBUILD_BINARY_PATH fallback (Vite peer ^0.27||^0.28)
                playwright-driver.browsers  # must match package.json @playwright/test (nixpkgs has 1.63.0)
              ];
              shellHook = ''
                export ESBUILD_BINARY_PATH="${pkgs.esbuild}/bin/esbuild"
                export PLAYWRIGHT_BROWSERS_PATH="${pkgs.playwright-driver.browsers}"
                export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true
                export PATH="$PWD/node_modules/.bin:$PATH"
              '';
            };
          });
      };
  }
  ```
  ```
  # .envrc
  use flake
  ```

## 6. Known pitfalls (NixOS + Bun + Vite + Playwright)

1. **esbuild dynamic linking** (Vite/SvelteKit dep pre-bundling pulls `@esbuild/linux-x64` into `node_modules`, an unpatched ELF on NixOS): point `ESBUILD_BINARY_PATH` at `${pkgs.esbuild}/bin/esbuild` in the shellHook (sourced: evanw/esbuild#2785; nixos.wiki Playwright page pattern; giacomodebidda.com Playwright-on-NixOS guide).
2. **Playwright browsers**: never `playwright install` on NixOS — downloaded Chromium needs `/lib64/ld-linux…` + `libnss3`/`libatk`/`libX11` etc. Use `PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright-driver.browsers}` (+ `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true`); **the npm `@playwright/test` version must match nixpkgs' 1.63.0** or Playwright will reject the browser revision (sourced: nixos.wiki/wiki/Playwright; discourse.nixos.org thread). Fallback: `executablePath` → `${pkgs.chromium}/bin/chromium`.
3. **`programs.nix-ld` as safety net** for any other foreign binaries npm/Bun download (needs `stdenv.cc.cc`, `zlib`, `nss`, `atk`, `mesa`, X11 libs, etc. in `programs.nix-ld.libraries`) — system-level, `sudo nixos-rebuild switch` (standard NixOS guidance).
4. **inotify watches**: default `fs.inotify.max_user_watches` is too low for Vite dep trees → silent HMR death; raise to 524288 in system config (standard Vite-on-NixOS guidance, `[INFERENCE]` for this repo's size — tiny project unlikely to hit it, but set it anyway).
5. **HMR/WebSocket binding**: if HMR hangs, pin `server.host: '127.0.0.1'` + `hmr.clientPort` in `vite.config.ts` (IPv6 `::1` mismatch class of issues); use polling only across VM/WSL shares `[INFERENCE — not reproduced here]`.
6. **TS 6-defaults migration trap**: TS 7 enforces TS 6.0's breaking defaults (`strict` on, `types: []`, `rootDir: ./`, …). `sv create` templates target TS `^6`-era config; adopting native `tsc` for `.ts` files may surface new errors unrelated to TS 7 itself — migrate config first (source: TS 7.0 announcement "Updates Since 5.x" section).

## Open uncertainties

- Whether `@sveltejs/kit@2.70.3` is truly the final 2.x (only the tarball + secondary sources checked; fetch the full version list if the Kit 2-vs-3 decision needs it).
- `svelte-check --tsgo*` behavior against stable `typescript@7` (maintainer said "7 RC isn't supported yet" on 2026-07-02; 4.7.6 still pins preview-era devDep — untested here).
- TypeScript 7.1 API ship date (the actual unblocker for Svelte LSP support) — no date found.
- `bun --bun vite dev` HMR stability specifics — needs a live repro, not a docs answer.
- Exact `@playwright/test` version `sv create` scaffolds (must be aligned to nixpkgs 1.63.0 at scaffold time).
