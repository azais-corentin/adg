/**
 * Compiles every library script with upstream's own Automator compiler
 * (`vendor/ad-source/src/core/automator/`, chevrotain lexer + parser + validator + compiler),
 * loaded by the extractor's module loader. The game state the validator reads is stubbed from
 * each script's declared unlocks, so a script passes only if the game accepts it with exactly
 * those unlocks. Needs the pinned upstream checkout (`bun scripts/extract/fetch.ts`).
 */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import {
	evaluateWith,
	importUpstream,
	installEnvironment,
	readUpstream
} from '../../../../scripts/extract/env.ts';
import { UPSTREAM_SRC_DIR } from '../../../../scripts/extract/pin.ts';
import { perks, timeStudies } from '#lib/data/index.ts';
import { STAGE_IDS } from '#lib/stages.ts';
import { AUTOMATOR_SCRIPTS, type AutomatorUnlock, UNLOCK_LABELS } from './library.ts';

interface CompileError {
	startLine: number;
	info: string;
}
type Compile = (input: string) => { errors: CompileError[]; compiled: unknown[] | undefined };

const ALL_UNLOCKS = Object.keys(UNLOCK_LABELS) as AutomatorUnlock[];
const unlocked = new Set<AutomatorUnlock>();
const g = globalThis as Record<string, unknown>;
let compileUpstream: Compile;

/** Installs the game objects the validator and compiler read, backed by `unlocked`. */
function stubGameState(): void {
	const studies = new Map(timeStudies.normal.map((s) => [s.id, s]));
	const pathIds = g.TIME_STUDY_PATH as Record<string, number>;
	const paths: Record<number, number[]> = {};
	for (const [name, id] of Object.entries(pathIds)) {
		if (id === pathIds.NONE) continue;
		const key = name.toLowerCase().replaceAll('_', '-');
		const path = timeStudies.paths.find((p) => p.path === key);
		if (!path) throw new Error(`no Time Study path ${key} in the extracted data`);
		paths[id] = path.studies;
	}
	const has = (unlock: AutomatorUnlock) => unlocked.has(unlock);
	Object.assign(g, {
		Player: { automatorUnlocked: false },
		TimeStudy: (id: number) => {
			const study = studies.get(id);
			return study && { isTriad: study.isTriad };
		},
		NormalTimeStudies: { paths },
		Ra: {
			get canBuyTriad() {
				return has('triadStudies');
			}
		},
		Enslaved: {
			get isUnlocked() {
				return has('storeGameTime');
			}
		},
		Autobuyer: {
			bigCrunch: {
				get isUnlocked() {
					return has('infinityAutobuyer');
				}
			},
			eternity: {},
			reality: {}
		},
		EternityMilestone: {
			bigCrunchModes: {
				get isReached() {
					return has('infinityAutobuyerModes');
				},
				config: { eternities: 5 }
			},
			autobuyerEternity: {
				get isReached() {
					return has('eternityAutobuyer');
				},
				config: { eternities: 100 }
			}
		},
		RealityUpgrade: (id: number) => ({
			isBought:
				(id === 13 && has('eternityAutobuyerModes')) || (id === 25 && has('realityAutobuyer'))
		}),
		// Not a compile gate: comparisons on "filter score" compile either way, but compile to
		// always-false while the Glyph filter is locked. Library scripts assume it is unlocked.
		EffarigUnlock: { glyphFilter: { isUnlocked: true } },
		// Mirrors automator-backend.js, which pulls in the whole game and is not loaded here.
		AUTOMATOR_VAR_TYPES: {
			NUMBER: { id: 0, name: 'number' },
			STUDIES: { id: 1, name: 'studies' },
			DURATION: { id: 2, name: 'duration' },
			UNKNOWN: { id: -1, name: 'unknown' }
		}
	});
}

function compileWith(unlocks: readonly AutomatorUnlock[], text: string) {
	unlocked.clear();
	for (const unlock of unlocks) unlocked.add(unlock);
	// No study presets and no Automator constants: library scripts must stand alone.
	return evaluateWith(
		{ player: { reality: { automator: { constants: {} } }, timestudy: { presets: [] } } },
		() => compileUpstream(text)
	);
}

function backendLimit(name: string): number {
	const match = new RegExp(`${name}: (\\d+)`).exec(
		readUpstream('core/automator/automator-backend.js')
	);
	if (!match) throw new Error(`${name} not found in automator-backend.js`);
	return Number(match[1]);
}

beforeAll(() => {
	if (!existsSync(resolve(UPSTREAM_SRC_DIR, 'core/automator/compiler.js'))) {
		throw new Error('upstream checkout missing: run `bun scripts/extract/fetch.ts`');
	}
	installEnvironment();
	stubGameState();
	compileUpstream = importUpstream('core/automator/compiler.js').compile as Compile;
});

describe("upstream's Automator compiler", () => {
	it('reports errors (the harness is not vacuous)', () => {
		expect(compileWith(ALL_UNLOCKS, 'studies purchase 11, 999').errors).not.toHaveLength(0);
		expect(compileWith(ALL_UNLOCKS, 'wait ep = 1e10').errors).not.toHaveLength(0);
		expect(compileWith(ALL_UNLOCKS, 'while ep < 10 {\n  eternity\n').errors).not.toHaveLength(0);
		expect(compileWith([], 'reality').errors).not.toHaveLength(0);
		expect(compileWith(['realityAutobuyer'], 'reality').errors).toHaveLength(0);
	});
});

describe.each(AUTOMATOR_SCRIPTS.map((script) => [script.id, script] as const))(
	'script %s',
	(_id, script) => {
		it('compiles with exactly its declared unlocks, and not without any of them', () => {
			const result = compileWith(script.unlocks, script.text);
			expect(result.errors).toEqual([]);
			expect(result.compiled?.length).toBeGreaterThan(0);
			for (const unlock of script.unlocks) {
				const without = script.unlocks.filter((u) => u !== unlock);
				expect(compileWith(without, script.text).errors, unlock).not.toHaveLength(0);
			}
		});

		it("fits the game's limits", () => {
			expect(script.text.length).toBeLessThanOrEqual(backendLimit('MAX_ALLOWED_SCRIPT_CHARACTERS'));
			expect(script.id.length).toBeLessThanOrEqual(backendLimit('MAX_ALLOWED_SCRIPT_NAME_LENGTH'));
			expect(script.text).not.toMatch(/\r|\t/);
		});

		it('references a known stage and perks', () => {
			expect(STAGE_IDS).toContain(script.stage);
			for (const id of script.perks) expect(perks.perks.map((p) => p.id)).toContain(id);
		});
	}
);

describe('library', () => {
	it('has unique ids', () => {
		const ids = AUTOMATOR_SCRIPTS.map((s) => s.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it("lists each EC's unlock study as the extracted data has it", () => {
		const runner = AUTOMATOR_SCRIPTS.find((s) => s.id === 'ec-runner');
		const note = runner?.tweaks.find((t) => t.includes('needs a different study'));
		expect(note).toBeDefined();
		for (const ec of timeStudies.eternityChallenges.filter((e) => e.id >= 4 && e.id <= 10)) {
			expect(note).toMatch(new RegExp(`EC${ec.id} needs ${ec.requires.join(' or ')}\\b`));
		}
	});
});
