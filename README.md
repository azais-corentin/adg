# adg — Antimatter Dimensions Guide

An interactive, mobile-first guide for **Antimatter Dimensions on Android (3.18.0)**: <https://ad.nelieru.cc>

- **Guide:** 70 articles from the first Dimension to the end of the game, each checked against the game's source at a pinned commit and against screenshots of the real Android app.
- **Search:** the magnifier in the header (or the box on the guide index) searches every article's titles, headings and text, plus game names such as perk labels (DILR), Reality and Imaginary Upgrades and Ra memory levels ("Effarig level 10"). Results open the matching section. The index is built at build time (`/search-index.json`) and searched on the device.
- **Save import:** paste or pick the save you export from the game. adg decodes it on your device (nothing is uploaded), detects your stage, and lists your next goals. It reads both Android export formats.
- **Tools:** milestone checklists, a Time Study planner (with the game's import/export strings), an Eternity Challenge planner, and Automator scripts that were run in the game before being listed.
- **Offline:** installable PWA. After the first visit, the guide, search and tools work without a connection.

Unofficial fan project, not affiliated with the game's developers. See [NOTICE](NOTICE).

## Development

Tooling comes from the Nix flake (`flake.nix`, loaded by direnv via `.envrc`): Bun, Node 22, wrangler, adb, and the Playwright browsers. Git hooks (hk + gitleaks) are installed per project by mise:

```sh
direnv allow
mise install && mise x -- hk install --mise
bun install
bun run dev
```

| Command             | What it does                                                                                                |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| `bun run check`     | TS 7 `tsc` on every TS project + TS 6 `svelte-check` on `.svelte` files                                     |
| `bun run test:unit` | Vitest (decoder, data invariants, planners, checklists, Automator compile test)                             |
| `bun run test:e2e`  | Playwright on a phone viewport (builds and previews first)                                                  |
| `bun run extract`   | Regenerate `src/lib/data/generated/` from the pinned upstream source ([details](scripts/extract/README.md)) |
| `bun run device:*`  | Android emulator pipeline for screenshots and in-game checks ([details](docs/device/EMULATOR.md))           |
| `bun run deploy`    | Build and deploy to Cloudflare (`wrangler.jsonc`)                                                           |

TypeScript 7 can't run `svelte-check` yet (sveltejs/language-tools#2733), so TS 6 is installed alongside it only for that step.

## Layout

- `src/content/m1`, `src/content/m2`: guide articles (mdsvex). Frontmatter is validated at build time.
- `src/lib/save`: save decoder, Android-native → web schema mapping ([NATIVE_SCHEMA.md](src/lib/save/NATIVE_SCHEMA.md)), stage detection, next goals.
- `src/lib/data`: typed game data extracted from upstream.
- `src/lib/search`: the build-time search index (`build.ts`, served by `src/routes/search-index.json`) and the in-browser search (`search.ts`).
- `src/lib/tools`, `src/lib/checklists`: the interactive tools.
- `static/screens/<stage>`: screenshots of the Android app at each stage, captured in the emulator.
- `fixtures/saves`: real Android exports and community saves ([sources](fixtures/saves/community/SOURCES.md)).
- `docs/`: [pre-planning decisions](docs/PREPLANNING.md), [implementation plan](docs/PLAN.md), [device notes](docs/device/README.md), research.

## License

MIT. Game data and save handling derive from [IvarK/AntimatterDimensionsSourceCode](https://github.com/IvarK/AntimatterDimensionsSourceCode) (MIT, © 2017 IvarK).
