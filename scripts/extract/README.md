# Game data extractor

`bun run extract` turns the upstream game source
([IvarK/AntimatterDimensionsSourceCode](https://github.com/IvarK/AntimatterDimensionsSourceCode), MIT)
at a pinned commit into typed JSON under `src/lib/data/generated/`. The app imports it through
`src/lib/data/index.ts` and never runs upstream code in the browser.

## What it does

1. `fetch.ts` shallow-fetches the pinned SHA into `vendor/ad-source/` (gitignored). It skips the
   fetch when the checkout is already at the pin and clean, and fails if `HEAD` differs.
2. `env.ts` sets up a minimal game environment. It loads the stateless upstream helpers
   (`constants.js`, `extensions.js`, `event-hub.js`, `notations.js`, `timespan.js`, `format.js`)
   with break_infinity.js `Decimal`, then evaluates `src/core/secret-formula/**` with a small ES
   module loader built on `node:vm`. That loader bypasses Bun's transpiler, so every closure keeps
   its exact upstream source text.
3. `datasets/*.ts` map upstream configs to the types in `schema.ts`. Static fields are copied.
   Decimals become strings (`"1e2000"`). Text closures (descriptions, rewards, ...) are called with
   the real formatters in the game's default notation (Mixed scientific). The result is kept only
   if the closure reads no live game state. Otherwise the field is `null` and `…Source` holds the
   closure source. The run log lists how many closures stayed unresolved and which state each
   one read first.
4. `index.ts` wipes and rewrites `src/lib/data/generated/`: one `<dataset>.json` each, plus
   `types.ts`, a verbatim copy of `schema.ts`.

The extractor assumes this state everywhere: outside Doomed Reality, outside Celestial Realities,
and no Ra glyph alterations (`ASSUMED_STATE` in `env.ts`). Any other game-state read throws, and
so do `Date.now`/`Math.random`. That keeps the output deterministic.

Some data lives outside `secret-formula`, so it is read from source with strict patterns that fail
loudly if upstream changes:

- the Time Study tree layout (`components/tabs/time-studies/time-study-tree-layout.js`, evaluated
  with stubbed Vue setup classes)
- Time Study connections and dimension paths (`core/time-studies/`)
- perk layouts (`components/tabs/perks/PerksTab.vue`)
- Celestial unlock checks (`core/secret-formula/tabs.js` and `core/celestials/`)

## Bumping the pin

1. Edit `sha` (and `date`) in `scripts/extract/pin.ts`. This is the only place the pin lives.
2. Run `bun run extract`. It fetches the new commit and regenerates everything.
3. Review the diff: `git diff --stat src/lib/data/generated` and then
   `git diff src/lib/data/generated`. The JSON is pretty-printed in upstream order, so the diff
   shows only real data changes. Check the "kept as source" counts in the run log as well: a
   jump there usually means upstream started reading new state in a description.
4. If extraction throws, a pattern or shape changed upstream. Fix the dataset builder and update
   `schema.ts` if the shape really changed.
5. Run `bunx vitest run src/lib/data` (data invariants), `bun run check`, and the extractor
   type-check `node node_modules/@typescript/native/bin/tsc -p scripts/extract`.
6. If `progress-checker.js` changed, update `src/lib/stages.ts` to match. The extractor fails
   when the two disagree.

Running `bun run extract` twice gives byte-identical output.
