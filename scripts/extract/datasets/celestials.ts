import type { CelestialId, CelestialInfo, CelestialUnlock, CelestialsDataset } from '../schema';
import { importUpstream, readUpstream } from '../env';
import {
	asArray,
	decimalString,
	entries,
	optionalBoolean,
	optionalNumber,
	optionalString,
	rawField,
	records,
	requireNumber,
	requireString,
	resolveText,
	source,
	sourceField,
	textField,
	textPair
} from '../serialize';

const TABS_FILE = 'core/secret-formula/tabs.js';
const DIR = 'core/secret-formula/celestials';
const FILES = {
	teresa: `${DIR}/teresa.js`,
	effarig: `${DIR}/effarig.js`,
	v: `${DIR}/v.js`,
	ra: `${DIR}/ra.js`,
	pelleUpgrades: `${DIR}/pelle-upgrades.js`,
	strikes: `${DIR}/strikes.js`,
	rifts: `${DIR}/rifts.js`
};

/** Celestial tab key → our id (upstream calls The Nameless Ones `enslaved`). */
const CELESTIAL_TABS: Record<string, CelestialId> = {
	teresa: 'teresa',
	effarig: 'effarig',
	enslaved: 'nameless',
	v: 'v',
	ra: 'ra',
	laitela: 'laitela',
	pelle: 'pelle'
};

/** Where `<Celestial>.isUnlocked` is defined, for tab conditions that defer to it. */
const UNLOCK_GETTER_FILES: Record<string, string> = {
	Teresa: 'core/celestials/teresa.js',
	Laitela: 'core/celestials/laitela/laitela.js',
	Pelle: 'core/celestials/pelle/pelle.js'
};

/** Turns an unlock check (closure source or getter body) into a structured reference. */
function parseUnlock(code: string): { unlock: CelestialUnlock; source: string } {
	const patterns: [RegExp, (m: RegExpExecArray) => CelestialUnlock][] = [
		[/^Achievement\((\d+)\)\.isUnlocked$/, (m) => ({ kind: 'achievement', id: Number(m[1]) })],
		[/^TeresaUnlocks\.(\w+)\.isUnlocked$/, (m) => ({ kind: 'teresa-unlock', key: m[1] })],
		[/^EffarigUnlock\.(\w+)\.isUnlocked$/, (m) => ({ kind: 'effarig-unlock', key: m[1] })],
		[/^VUnlocks\.(\w+)\.isUnlocked$/, (m) => ({ kind: 'v-unlock', key: m[1] })],
		[
			/^ImaginaryUpgrade\((\d+)\)\.isBought$/,
			(m) => ({ kind: 'imaginary-upgrade', id: Number(m[1]) })
		]
	];
	const expression = code.replace(/^\(\) => /, '').trim();
	for (const [pattern, build] of patterns) {
		const match = pattern.exec(expression);
		if (match !== null) return { unlock: build(match), source: code };
	}
	const deferred = /^(\w+)\.isUnlocked$/.exec(expression)?.[1];
	const file = deferred === undefined ? undefined : UNLOCK_GETTER_FILES[deferred];
	if (file === undefined) throw new Error(`unrecognised celestial unlock check: ${code}`);
	const body = /get isUnlocked\(\) \{\s*return ([^;]+);\s*\}/.exec(readUpstream(file))?.[1];
	if (body === undefined) throw new Error(`isUnlocked getter not found in ${file}`);
	return {
		unlock: parseUnlock(body).unlock,
		source: `${code}\n// ${file}: get isUnlocked() { return ${body}; }`
	};
}

function buildCelestialList(): CelestialInfo[] {
	const tabs = records(importUpstream(TABS_FILE).tabs, 'tabs');
	const celestialTab = tabs.find((tab) => tab.key === 'celestials');
	if (celestialTab === undefined) throw new Error('celestials tab not found');
	const tabCondition = sourceField(celestialTab, 'condition');
	return records(celestialTab.subtabs, 'celestials.subtabs')
		.filter((subtab) => CELESTIAL_TABS[requireString(subtab, 'key')] !== undefined)
		.map((subtab) => {
			const tabKey = requireString(subtab, 'key');
			// Teresa's subtab has no own condition: it shows whenever the Celestials tab does.
			const condition = sourceField(subtab, 'condition') ?? tabCondition;
			if (condition === null) throw new Error(`no unlock condition for ${tabKey}`);
			const { unlock, source: unlockSource } = parseUnlock(condition);
			return {
				id: CELESTIAL_TABS[tabKey],
				tabKey,
				name: requireString(subtab, 'name'),
				unlock,
				unlockSource
			};
		});
}

export function buildCelestials(): CelestialsDataset {
	const { teresa } = importUpstream(FILES.teresa) as { teresa: { unlocks: unknown } };
	const { effarigUnlocks } = importUpstream(FILES.effarig);
	const { v } = importUpstream(FILES.v) as {
		v: { mainUnlock: unknown; unlocks: unknown; runUnlocks: unknown };
	};
	const { ra } = importUpstream(FILES.ra) as { ra: { pets: unknown; unlocks: unknown } };
	const { pelleUpgrades } = importUpstream(FILES.pelleUpgrades);
	const { pelleStrikes } = importUpstream(FILES.strikes);
	const { pelleRifts } = importUpstream(FILES.rifts);
	const celestials = buildCelestialList();
	const missing = Object.values(CELESTIAL_TABS).filter(
		(id) => !celestials.some((c) => c.id === id)
	);
	if (missing.length > 0) throw new Error(`celestial tabs missing: ${missing.join(', ')}`);

	return {
		source: source(TABS_FILE, ...Object.values(UNLOCK_GETTER_FILES), ...Object.values(FILES)),
		celestials,
		teresa: {
			unlocks: entries(teresa.unlocks, 'teresa.unlocks').map(([key, config]) => ({
				key,
				id: requireNumber(config, 'id'),
				price: requireNumber(config, 'price'),
				description: requireString(config, 'description'),
				isDisabledInDoomed: optionalBoolean(config, 'isDisabledInDoomed')
			}))
		},
		effarig: {
			unlocks: entries(effarigUnlocks, 'effarigUnlocks').map(([key, config]) => ({
				key,
				id: requireNumber(config, 'id'),
				cost: optionalNumber(config, 'cost'),
				label: optionalString(config, 'label'),
				...textPair('description', textField(config, 'description'))
			}))
		},
		v: {
			mainUnlock: entries(v.mainUnlock, 'v.mainUnlock').map(([key, config]) => ({
				key,
				id: requireNumber(config, 'id'),
				name: requireString(config, 'name'),
				requirement: decimalString(rawField(config, 'requirement'))
			})),
			unlocks: entries(v.unlocks, 'v.unlocks').map(([key, config]) => ({
				key,
				id: requireNumber(config, 'id'),
				...textPair('reward', textField(config, 'reward')),
				...textPair('description', textField(config, 'description'))
			})),
			achievements: records(v.runUnlocks, 'v.runUnlocks').map((config) => {
				const values = asArray(config.values, 'values').map(Number);
				const description = rawField(config, 'description');
				const descriptions = values.map((value) => resolveText(description, value));
				return {
					id: requireNumber(config, 'id'),
					name: requireString(config, 'name'),
					descriptions: descriptions.map((d) => d.text),
					descriptionSource: descriptions.some((d) => d.text === null) ? String(description) : null,
					values,
					isHard: optionalBoolean(config, 'isHard')
				};
			})
		},
		ra: {
			pets: entries(ra.pets, 'ra.pets').map(([, config]) => ({
				id: requireString(config, 'id'),
				name: requireString(config, 'name'),
				color: requireString(config, 'color'),
				chunkGain: requireString(config, 'chunkGain'),
				memoryGain: requireString(config, 'memoryGain')
			})),
			unlocks: entries(ra.unlocks, 'ra.unlocks').map(([key, config]) => ({
				key,
				id: requireNumber(config, 'id'),
				pet: requireString(config, 'pet'),
				level: requireNumber(config, 'level'),
				...textPair('reward', textField(config, 'reward')),
				disabledByPelle: optionalBoolean(config, 'disabledByPelle')
			}))
		},
		pelle: {
			upgrades: entries(pelleUpgrades, 'pelleUpgrades').map(([key, config]) => {
				const rebuyable = optionalBoolean(config, 'rebuyable');
				const id = rawField(config, 'id');
				if (typeof id !== 'string' && typeof id !== 'number')
					throw new Error(`bad pelle upgrade id ${key}`);
				return {
					key,
					id,
					rebuyable,
					...textPair('description', textField(config, 'description')),
					cost: rebuyable ? null : decimalString(rawField(config, 'cost')),
					cap: optionalNumber(config, 'cap')
				};
			}),
			strikes: entries(pelleStrikes, 'pelleStrikes').map(([key, config]) => {
				const riftSource = sourceField(config, 'rift') ?? '';
				const rift = /^\(\) => PelleRifts\.(\w+)$/.exec(riftSource)?.[1];
				if (rift === undefined) throw new Error(`unrecognised strike rift: ${riftSource}`);
				return {
					key,
					id: requireNumber(config, 'id'),
					...textPair('requirement', textField(config, 'requirementDescription')),
					...textPair('penalty', textField(config, 'penaltyDescription')),
					...textPair('reward', textField(config, 'rewardDescription')),
					rift
				};
			}),
			rifts: entries(pelleRifts, 'pelleRifts').map(([key, config]) => ({
				key,
				id: requireNumber(config, 'id'),
				names: asArray(config.name, `${key}.name`).map(String),
				// Chaos drains Decay, whose name cycles like a rift name: keep the canonical first word.
				drainResource: String([rawField(config, 'drainResource')].flat()[0]),
				milestones: records(config.milestones, `${key}.milestones`).map((milestone) => ({
					requirement: requireNumber(milestone, 'requirement'),
					...textPair('description', textField(milestone, 'description'))
				}))
			}))
		}
	};
}
