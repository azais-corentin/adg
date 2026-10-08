import type { PerkFamily, PerkLayoutInfo, PerkPosition, PerksDataset } from '../schema';
import { importUpstream, readUpstream } from '../env';
import {
	asArray,
	asRecord,
	entries,
	optionalNumber,
	requireNumber,
	requireString,
	source,
	textField,
	textPair
} from '../serialize';

const FILE = 'core/secret-formula/reality/perks.js';
const TAB_FILE = 'components/tabs/perks/PerksTab.vue';

interface LayoutSpec extends PerkLayoutInfo {
	/** Index into `layoutPosList`, `null` for random layouts. */
	posIndex: number | null;
	factor: number;
	widthFactor: number;
}

/**
 * `PerkLayouts` lives in a Vue component next to vis.js setup code, so we read its entries from
 * source: `position: config => globalScale(positionNumToVector(config.layoutPosList[i]), f, w)`.
 */
function parseLayouts(): LayoutSpec[] {
	const tab = readUpstream(TAB_FILE);
	const block = /export const PerkLayouts = \[([\s\S]*?)\n\];/.exec(tab)?.[1];
	if (block === undefined) throw new Error(`PerkLayouts not found in ${TAB_FILE}`);
	const specs = [...block.matchAll(/buttonText: "([^"]+)",\s*position: ([^\n]+),\n/g)].map(
		([, name, position], index): LayoutSpec => {
			const fixed =
				/^config => (?:globalScale\()?positionNumToVector\(config\.layoutPosList\[(\d+)\]\)(?:, ([\d.]+)(?:, ([\d.]+))?\))?$/.exec(
					position
				);
			if (fixed === null && !position.includes('Math.random()')) {
				throw new Error(`unrecognised perk layout position: ${position}`);
			}
			return {
				index,
				name,
				isFixed: fixed !== null,
				posIndex: fixed === null ? null : Number(fixed[1]),
				factor: fixed?.[2] === undefined ? 1 : Number(fixed[2]),
				widthFactor: fixed?.[3] === undefined ? 1 : Number(fixed[3])
			};
		}
	);
	if (
		!/function positionNumToVector\(num\) \{\n\s*const xPart = num % 400;\n\s*const yPart = Math\.floor\(num \/ 400\);\n\s*return new Vector\(5 \* \(xPart - 200\), 5 \* \(yPart - 200\)\);/.test(
			tab
		)
	) {
		throw new Error('positionNumToVector changed upstream; update the decoder in perks.ts');
	}
	return specs;
}

/** Upstream `positionNumToVector` followed by `globalScale`. */
function decodePosition(num: number, spec: LayoutSpec): PerkPosition {
	const x = 5 * ((num % 400) - 200);
	const y = 5 * (Math.floor(num / 400) - 200);
	const round = (value: number) => Number(value.toFixed(4));
	return { x: round(x * spec.factor * spec.widthFactor), y: round(y * spec.factor) };
}

export function buildPerks(): PerksDataset {
	const { perks, perkConnections, PERK_FAMILY } = importUpstream(FILE);
	const families = Object.values(asRecord(PERK_FAMILY, 'PERK_FAMILY'));
	const connections = asRecord(perkConnections, 'perkConnections');
	const layouts = parseLayouts();
	const list = entries(perks, 'perks').map(([key, config]) => {
		const id = requireNumber(config, 'id');
		const family = requireString(config, 'family');
		if (!families.includes(family)) throw new Error(`unknown perk family ${family}`);
		const posList = asArray(config.layoutPosList, `${key}.layoutPosList`).map(Number);
		return {
			key,
			id,
			label: requireString(config, 'label'),
			family: family as PerkFamily,
			...textPair('description', textField(config, 'description')),
			automatorPoints: optionalNumber(config, 'automatorPoints'),
			connections: asArray(connections[id], `perkConnections[${id}]`)
				.map(Number)
				.sort((a, b) => a - b),
			positions: layouts.map((spec) =>
				spec.posIndex === null ? null : decodePosition(posList[spec.posIndex], spec)
			)
		};
	});
	const edges = new Map<string, [number, number]>();
	for (const perk of list) {
		for (const other of perk.connections) {
			const edge: [number, number] = perk.id < other ? [perk.id, other] : [other, perk.id];
			edges.set(edge.join('-'), edge);
		}
	}
	return {
		source: source(FILE, TAB_FILE),
		layouts: layouts.map(({ index, name, isFixed }) => ({ index, name, isFixed })),
		perks: list,
		edges: [...edges.values()].sort((a, b) => a[0] - b[0] || a[1] - b[1])
	};
}
