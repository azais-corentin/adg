/**
 * Minimal browser-like environment for evaluating upstream `secret-formula` modules in Bun.
 *
 * Upstream data modules rely on globals installed by the game (`Decimal`, enums from
 * `constants.js`, formatters from `format.js`, ...) and on live game state (`player`, celestial
 * singletons, ...). We install the real stateless helpers from the pinned checkout and leave game
 * state undefined, so any closure that reads game state throws and gets recorded as unresolved.
 *
 * Upstream files are evaluated by a tiny ES-module loader (`node:vm`) instead of Bun's module
 * system so that Bun's transpiler never rewrites them: `Function.prototype.toString` then returns
 * the exact upstream source of every closure, which we keep as `*Source` fields.
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { relative, resolve } from 'node:path';
import { runInThisContext } from 'node:vm';
import Decimal from 'break_infinity.js';
import { UPSTREAM_SRC_DIR } from './pin';

/** Thrown when a closure touches game state that the extractor deliberately does not model. */
export class StateAccessError extends Error {}

export type ModuleExports = Record<string, unknown>;

const requireBare = createRequire(import.meta.url);
const modules: Record<string, ModuleExports> = {};

/**
 * Replaces an upstream module (absolute path or path relative to upstream `src/`) with the given
 * exports. Used for UI-only modules (Vue components, game-state classes) that data files import.
 */
export function stubUpstreamModule(relPath: string, exports: ModuleExports): void {
	modules[resolve(UPSTREAM_SRC_DIR, relPath)] = exports;
}

function resolveUpstream(specifier: string, importer: string): string {
	const base = specifier.startsWith('@/')
		? resolve(UPSTREAM_SRC_DIR, specifier.slice(2))
		: resolve(importer, '..', specifier);
	for (const candidate of [base, `${base}.js`, `${base}.vue`, `${base}/index.js`]) {
		if (modules[candidate] !== undefined) return candidate;
		if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
	}
	throw new Error(`cannot resolve ${specifier} from ${importer}`);
}

const IMPORT_STATEMENT =
	/^import\s+(?:([\w$]+)|\*\s+as\s+([\w$]+)|\{([^}]*)\})\s+from\s+(["'])([^"']+)\4;?/gm;
const SIDE_EFFECT_IMPORT = /^import\s+(["'])([^"']+)\1;?/gm;
const EXPORT_DECLARATION = /^export\s+(const|let|var|function\*?|class)\s+([\w$]+)/gm;
const EXPORT_LIST = /^export\s+\{([^}]*)\}(?:\s+from\s+(["'])([^"']+)\2)?;?/gm;

/** `a, b as c` → `[["a","a"],["b","c"]]` */
function parseBindings(list: string): [string, string][] {
	return list
		.split(',')
		.map((part) => part.trim())
		.filter((part) => part.length > 0)
		.map((part) => {
			const [name, alias] = part.split(/\s+as\s+/);
			return [name, alias ?? name];
		});
}

/** Loads (once) an upstream ES module given its absolute path, returning its exports. */
function loadModule(path: string): ModuleExports {
	const cached = modules[path];
	if (cached !== undefined) return cached;
	if (path.endsWith('.vue')) throw new Error(`refusing to load Vue component ${path}`);
	const exports: ModuleExports = {};
	modules[path] = exports;

	const deps: string[] = [];
	const depIndex = (specifier: string): number => {
		deps.push(specifier);
		return deps.length - 1;
	};
	const exported: [string, string][] = [];
	const body = readUpstream(path)
		.replace(
			IMPORT_STATEMENT,
			(_m, def?: string, ns?: string, list?: string, _q?: string, spec = '') => {
				const dep = `__import(${depIndex(spec)})`;
				if (def !== undefined) return `const ${def} = ${dep}.default;`;
				if (ns !== undefined) return `const ${ns} = ${dep};`;
				const pattern = parseBindings(list ?? '').map(([name, alias]) => `${name}: ${alias}`);
				return `const { ${pattern.join(', ')} } = ${dep};`;
			}
		)
		.replace(SIDE_EFFECT_IMPORT, (_m, _q: string, spec: string) => `__import(${depIndex(spec)});`)
		.replace(EXPORT_DECLARATION, (_m, kind: string, name: string) => {
			exported.push([name, name]);
			return `${kind} ${name}`;
		})
		.replace(EXPORT_LIST, (_m, list: string, _q?: string, from?: string) => {
			if (from === undefined) {
				exported.push(...parseBindings(list));
				return '';
			}
			const dep = `__import(${depIndex(from)})`;
			return parseBindings(list)
				.map(
					([name, alias]) =>
						`__exports[${JSON.stringify(alias)}] = ${dep}[${JSON.stringify(name)}];`
				)
				.join(' ');
		})
		.replace(/^export\s+default\s+/m, '__exports.default = ');
	if (/^\s*(import|export)\s/m.test(body)) {
		throw new Error(`unsupported import/export syntax in ${relative(UPSTREAM_SRC_DIR, path)}`);
	}
	const assignments = exported
		.map(([local, name]) => `__exports[${JSON.stringify(name)}] = ${local};`)
		.join(' ');
	// The wrapper header stays on line 1 so stack traces keep upstream line numbers.
	const factory = runInThisContext(
		`(function (__import, __exports) { "use strict"; ${body}\n${assignments}\n})`,
		{ filename: path }
	) as (load: (index: number) => ModuleExports, exports: ModuleExports) => void;
	factory((index) => {
		const specifier = deps[index];
		if (/^(@\/|\.\.?\/)/.test(specifier)) return loadModule(resolveUpstream(specifier, path));
		return requireBare(specifier) as ModuleExports;
	}, exports);
	return exports;
}

/** Imports an upstream module by path relative to upstream `src/`. */
export function importUpstream(relPath: string): ModuleExports {
	const path = resolve(UPSTREAM_SRC_DIR, relPath);
	if (!existsSync(path)) throw new Error(`upstream file missing: ${relPath}`);
	return loadModule(path);
}

/**
 * Reads an upstream file as text. Upstream commits CRLF line endings; normalizing to LF keeps
 * extracted closure sources identical regardless of the checkout's line-ending settings.
 */
export function readUpstream(relPath: string): string {
	return readFileSync(resolve(UPSTREAM_SRC_DIR, relPath), 'utf8').replace(/\r\n?/g, '\n');
}

let formatterDepth = 0;

/**
 * Game state readable only from inside upstream formatters: `format.js` checks Pelle's END state
 * and notations check `ui.formatPreBreak` (false = numbers past 1.8e308 are printed, as after
 * Breaking Infinity).
 */
const FORMATTER_STATE: Record<string, Record<string, unknown>> = {
	player: { celestials: { pelle: { doomed: false } }, options: {} },
	GameEnd: { endState: 0 },
	GameUI: { initialized: false },
	ui: { formatPreBreak: false }
};

/**
 * Game state the extractor assumes everywhere: outside Doomed Reality, outside any Celestial
 * Reality, and without Ra's glyph alterations. Descriptions that branch on these show their
 * normal text, as for most of the game.
 */
const ASSUMED_STATE: Record<string, Record<string, unknown>> = {
	Pelle: { isDoomed: false },
	Enslaved: { isRunning: false },
	GlyphAlteration: { isAdded: () => false, isEmpowered: () => false, isBoosted: () => false }
};

/** Extra state visible only inside {@link evaluateWith}. */
let scenario: Record<string, Record<string, unknown>> = {};

function guardedGlobal(name: string): object {
	const lookup = (key: string | symbol): { value: unknown } | undefined => {
		for (const table of [scenario, ASSUMED_STATE, formatterDepth > 0 ? FORMATTER_STATE : {}]) {
			const scoped = table[name];
			if (scoped !== undefined && key in scoped) return { value: Reflect.get(scoped, key) };
		}
		return undefined;
	};
	return new Proxy(
		{},
		{
			get(_target, key) {
				const found = lookup(key);
				if (found === undefined) throw new StateAccessError(`${name}.${String(key)}`);
				return found.value;
			},
			has: (_target, key) => lookup(key) !== undefined
		}
	);
}

/**
 * Runs upstream code deterministically: `Date.now` and `Math.random` throw (so time-animated text
 * such as Pelle's cycling rift names is reported as state-dependent), and `state` adds extra game
 * state, e.g. `{ player: { infinityRebuyables: [0, 0, 0] } }` to price the first purchase of a
 * rebuyable. Unlisted state still throws.
 */
export function evaluateWith<T>(state: Record<string, Record<string, unknown>>, fn: () => T): T {
	const previous = scenario;
	const { now } = Date;
	const { random } = Math;
	const added = Object.keys(state).filter((name) => !(name in g));
	for (const name of added) g[name] = guardedGlobal(name);
	scenario = state;
	Date.now = () => {
		throw new StateAccessError('Date.now');
	};
	Math.random = () => {
		throw new StateAccessError('Math.random');
	};
	try {
		return fn();
	} finally {
		scenario = previous;
		Date.now = now;
		Math.random = random;
		for (const name of added) delete g[name];
	}
}

function asFormatter(fn: (...args: unknown[]) => unknown): (...args: unknown[]) => unknown {
	return function (this: unknown, ...args: unknown[]) {
		formatterDepth++;
		try {
			return fn.apply(this, args);
		} finally {
			formatterDepth--;
		}
	};
}

const g = globalThis as Record<string, unknown>;
let installed = false;

/** Installs globals and the stateless upstream helpers. Safe to call more than once. */
export function installEnvironment(): void {
	if (installed) return;
	installed = true;
	g.window = globalThis;
	g.Decimal = Decimal;
	// script-templates.js imports this component only for template builders that read autobuyers.
	stubUpstreamModule('components/tabs/autobuyers/AutobuyerInput.vue', {
		AutobuyerInputFunctions: {}
	});
	for (const name of new Set([...Object.keys(FORMATTER_STATE), ...Object.keys(ASSUMED_STATE)])) {
		g[name] = guardedGlobal(name);
	}

	// extensions.js builds a hidden clipboard <textarea> at load time; give it an inert DOM.
	const element = { style: {}, setAttribute() {} };
	g.document = { createElement: () => element, body: { appendChild() {} } };
	importUpstream('core/extensions.js');
	delete g.document;
	importUpstream('core/constants.js');
	// Event enums are referenced by data (`checkEvent`); handlers registered here never fire.
	importUpstream('core/event-hub.js');
	const notations = importUpstream('core/notations.js');
	g.Notation = notations.Notation;
	g.Notations = notations.Notations;
	g.END_STATE_MARKERS = importUpstream('core/celestials/pelle/game-end.js').END_STATE_MARKERS;

	const before = new Set(Object.keys(g));
	importUpstream('core/timespan.js');
	importUpstream('core/format.js');
	for (const key of Object.keys(g)) {
		const value = g[key];
		if (before.has(key) || typeof value !== 'function' || key === 'TimeSpan') continue;
		g[key] = asFormatter(value as (...args: unknown[]) => unknown);
	}
	const TimeSpan = g.TimeSpan as { prototype: Record<string, unknown> };
	for (const key of Object.getOwnPropertyNames(TimeSpan.prototype)) {
		const descriptor = Object.getOwnPropertyDescriptor(TimeSpan.prototype, key);
		if (key === 'constructor' || typeof descriptor?.value !== 'function') continue;
		TimeSpan.prototype[key] = asFormatter(descriptor.value as (...args: unknown[]) => unknown);
	}
}
