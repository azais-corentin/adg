<!--
@component
The Time Study tree as an SVG drawn from the extracted upstream layout, with one-finger pan,
two-finger pinch zoom, wheel zoom, and zoom buttons. Tapping (or Enter/Space on) a study calls
`ontap`; a drag never counts as a tap.
-->
<script lang="ts">
	import { untrack } from 'svelte';
	import { formatGameNumber } from '#lib/components/num.ts';
	import type { TimeStudyLayoutCell } from '#lib/data/index.ts';
	import {
		check,
		isSelected,
		NORMAL_STUDIES,
		refCost,
		refKey,
		type LaidOutTree,
		type TimeStudyRef,
		type Tree,
		type TreeContext
	} from './tree.ts';
	import { nodeLabel } from './text.ts';

	let {
		laid,
		tree,
		ctx,
		focused,
		ontap
	}: {
		laid: LaidOutTree;
		tree: Tree;
		ctx: TreeContext;
		focused: TimeStudyRef | null;
		ontap: (ref: TimeStudyRef) => void;
	} = $props();

	type Look = 'bought' | 'available' | 'unavailable';

	/** CSS colour class of a study, as upstream `TimeStudyButton.pathClass`. */
	function pathClass(ref: TimeStudyRef): string {
		if (ref.kind === 'ec') return 'ec';
		if (ref.kind === 'dilation') return ref.id === 6 ? 'reality' : 'dilation';
		const study = NORMAL_STUDIES.get(ref.id);
		if (study?.isTriad) return 'triad';
		return study?.path ?? 'normal';
	}

	function look(ref: TimeStudyRef): Look {
		if (isSelected(tree, ref)) return 'bought';
		return check(tree, ref, ctx).ok ? 'available' : 'unavailable';
	}

	/** Upstream `TimeStudyConnection.classObject`: colour by target, else by source path. */
	function connectionClass(from: TimeStudyRef, to: TimeStudyRef): string {
		if (to.kind === 'ec') return 'ec';
		if (to.kind === 'dilation') return 'dilation';
		const paths = ['antimatter-dim', 'infinity-dim', 'time-dim', 'active', 'passive', 'idle'];
		const own = pathClass(to);
		if (paths.includes(own)) return own;
		const source = pathClass(from);
		return paths.includes(source) ? source : 'plain';
	}

	const cellByKey = $derived(new Map(laid.cells.map((c) => [refKey(c.study), c])));
	const center = (cell: TimeStudyLayoutCell) => ({
		x: cell.x + cell.width / 2,
		y: cell.y + cell.height / 2
	});
	const lines = $derived(
		laid.connections.flatMap((c) => {
			const from = cellByKey.get(refKey(c.from));
			const to = cellByKey.get(refKey(c.to));
			if (!from || !to) return [];
			const a = center(from);
			const b = center(to);
			const bought = isSelected(tree, c.from) && isSelected(tree, c.to);
			return [
				{
					key: `${refKey(c.from)}>${refKey(c.to)}`,
					a,
					b,
					bought,
					cls: connectionClass(c.from, c.to)
				}
			];
		})
	);

	// ---- Pan and zoom -------------------------------------------------------------------------
	const PAD = 2;
	let width = $state(0);
	let height = $state(0);
	/** Pixels per layout unit, and the tree's top-left offset in pixels. */
	let view = $state({ scale: 0, x: 0, y: 0 });
	const treeW = $derived(laid.layout.width + PAD * 2);
	const treeH = $derived(laid.layout.height + PAD * 2);
	const fitScale = $derived(width / treeW);
	const minScale = $derived(Math.min(fitScale, height / treeH) * 0.9);
	const maxScale = $derived(fitScale * 4);

	function clamp(next: { scale: number; x: number; y: number }) {
		const scale = Math.min(maxScale, Math.max(minScale, next.scale));
		const keep = 48;
		const x = Math.min(width - keep, Math.max(keep - treeW * scale, next.x));
		const y = Math.min(height - keep, Math.max(keep - treeH * scale, next.y));
		return { scale, x, y };
	}

	function fit(): void {
		view = clamp({ scale: fitScale, x: 0, y: 0 });
	}

	/** Zooms by `factor` keeping the point (px, py) of the viewport still. */
	function zoomAt(factor: number, px: number, py: number) {
		const scale = Math.min(maxScale, Math.max(minScale, view.scale * factor));
		const k = scale / view.scale;
		view = clamp({ scale, x: px - (px - view.x) * k, y: py - (py - view.y) * k });
	}

	$effect(() => {
		// Fit to the width once the size is known; after that, keep the view in bounds when the
		// viewport or the layout changes size.
		if (width === 0) return;
		const current = untrack(() => view);
		view = current.scale === 0 ? clamp({ scale: fitScale, x: 0, y: 0 }) : clamp(current);
	});

	let viewport: HTMLDivElement | undefined = $state();
	const pointers = new Map<number, { x: number; y: number }>();
	let gesture: {
		start: { x: number; y: number };
		target: TimeStudyRef | null;
		moved: boolean;
	} | null = null;
	let pinch: { dist: number; mid: { x: number; y: number } } | null = null;

	function local(e: PointerEvent | WheelEvent) {
		const rect = viewport?.getBoundingClientRect();
		return { x: e.clientX - (rect?.left ?? 0), y: e.clientY - (rect?.top ?? 0) };
	}

	function studyAt(target: EventTarget | null): TimeStudyRef | null {
		const key =
			target instanceof Element ? target.closest('[data-study]')?.getAttribute('data-study') : null;
		return key ? (cellByKey.get(key)?.study ?? null) : null;
	}

	function pinchState() {
		const [a, b] = [...pointers.values()];
		if (!a || !b) return null;
		return {
			dist: Math.hypot(a.x - b.x, a.y - b.y),
			mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
		};
	}

	function onpointerdown(e: PointerEvent) {
		if (e.pointerType === 'mouse' && e.button !== 0) return;
		viewport?.setPointerCapture(e.pointerId);
		const p = local(e);
		pointers.set(e.pointerId, p);
		if (pointers.size === 1) {
			gesture = { start: p, target: studyAt(e.target), moved: false };
		} else {
			if (gesture) gesture.moved = true;
			pinch = pinchState();
		}
	}

	function onpointermove(e: PointerEvent) {
		const prev = pointers.get(e.pointerId);
		if (!prev) return;
		const p = local(e);
		pointers.set(e.pointerId, p);
		if (pointers.size === 1 && gesture) {
			if (Math.hypot(p.x - gesture.start.x, p.y - gesture.start.y) > 8) gesture.moved = true;
			if (gesture.moved)
				view = clamp({ ...view, x: view.x + p.x - prev.x, y: view.y + p.y - prev.y });
		} else if (pointers.size === 2 && pinch) {
			const next = pinchState();
			if (!next || pinch.dist === 0) return;
			view = clamp({
				...view,
				x: view.x + next.mid.x - pinch.mid.x,
				y: view.y + next.mid.y - pinch.mid.y
			});
			zoomAt(next.dist / pinch.dist, next.mid.x, next.mid.y);
			pinch = next;
		}
	}

	function onpointerup(e: PointerEvent) {
		if (!pointers.delete(e.pointerId)) return;
		if (pointers.size === 0) {
			if (gesture && !gesture.moved && gesture.target && e.type === 'pointerup')
				ontap(gesture.target);
			gesture = null;
			pinch = null;
		} else {
			pinch = pinchState();
		}
	}

	$effect(() => {
		const el = viewport;
		if (!el) return;
		// Non-passive so the page doesn't scroll while zooming the tree.
		const onwheel = (e: WheelEvent) => {
			e.preventDefault();
			const p = local(e);
			zoomAt(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.002)), p.x, p.y);
		};
		el.addEventListener('wheel', onwheel, { passive: false });
		return () => el.removeEventListener('wheel', onwheel);
	});

	function onkeydown(e: KeyboardEvent, ref: TimeStudyRef) {
		if (e.key !== 'Enter' && e.key !== ' ') return;
		e.preventDefault();
		ontap(ref);
	}

	function costText(ref: TimeStudyRef, small: boolean): string {
		const cost = refCost(ref);
		const text = cost >= 1e6 ? formatGameNumber(cost) : cost.toLocaleString('en-US');
		return small ? text : `${text} TT`;
	}

	const lookLabel: Record<Look, string> = {
		bought: 'in build',
		available: 'available',
		unavailable: 'locked'
	};
</script>

<div class="tree-wrap">
	<div
		class="viewport"
		bind:this={viewport}
		bind:clientWidth={width}
		bind:clientHeight={height}
		{onpointerdown}
		{onpointermove}
		{onpointerup}
		onpointercancel={onpointerup}
		role="group"
		aria-label="Time Study tree. Drag to pan, pinch or use the buttons to zoom."
	>
		{#if width > 0 && view.scale > 0}
			<svg {width} {height} class="tree">
				<g transform="translate({view.x} {view.y}) scale({view.scale}) translate({PAD} {PAD})">
					{#each lines as line (line.key)}
						<line
							x1={line.a.x}
							y1={line.a.y}
							x2={line.b.x}
							y2={line.b.y}
							class="link {line.cls}"
							class:bought={line.bought}
						/>
					{/each}
					{#each laid.cells as cell (refKey(cell.study))}
						{@const ref = cell.study}
						{@const state = look(ref)}
						{@const label = nodeLabel(ref)}
						<g
							class="node {pathClass(ref)} {state}"
							class:focused={focused !== null && refKey(focused) === refKey(ref)}
							data-study={refKey(ref)}
							role="button"
							tabindex="0"
							aria-pressed={state === 'bought'}
							aria-label="{ref.kind === 'normal' ? `Study ${label}` : label}, {costText(
								ref,
								false
							)}, {lookLabel[state]}"
							onkeydown={(e) => onkeydown(e, ref)}
						>
							<!-- Hit area: the node plus the gaps around it, for fingers. -->
							<rect
								class="hit"
								x={cell.x - 1.5}
								y={cell.y - 2}
								width={cell.width + 3}
								height={cell.height + 4}
							/>
							<rect
								class="box"
								x={cell.x}
								y={cell.y}
								width={cell.width}
								height={cell.height}
								rx="1.2"
							/>
							<text
								class="label"
								x={cell.x + cell.width / 2}
								y={cell.y + cell.height * 0.47}
								font-size={cell.isSmall ? 3.1 : label.length > 4 ? 3 : 3.6}>{label}</text
							>
							<text
								class="cost"
								x={cell.x + cell.width / 2}
								y={cell.y + cell.height * 0.8}
								font-size={cell.isSmall ? 2.3 : 2.5}>{costText(ref, cell.isSmall)}</text
							>
						</g>
					{/each}
				</g>
			</svg>
		{/if}
	</div>
	<div class="zoom" role="group" aria-label="Zoom">
		<button
			type="button"
			class="zoom-btn"
			aria-label="Zoom in"
			onclick={() => zoomAt(1.4, width / 2, height / 2)}>+</button
		>
		<button
			type="button"
			class="zoom-btn"
			aria-label="Zoom out"
			onclick={() => zoomAt(1 / 1.4, width / 2, height / 2)}>−</button
		>
		<button type="button" class="zoom-btn fit" aria-label="Fit to width" onclick={fit}>
			<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
				<path
					d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
	</div>
</div>

<style>
	.tree-wrap {
		position: relative;
		/* Full-bleed on phones: the tree gets every pixel of the width. */
		margin-inline: calc(-1 * var(--space-4));
	}

	.viewport {
		height: min(70svh, 44rem);
		overflow: hidden;
		touch-action: none;
		user-select: none;
		-webkit-user-select: none;
		background: var(--surface-sunk);
		border-block: 1px solid var(--rule);
		cursor: grab;
	}

	.viewport:active {
		cursor: grabbing;
	}

	@media (min-width: 60rem) {
		.tree-wrap {
			margin-inline: 0;
		}

		.viewport {
			border: 1px solid var(--rule);
			border-radius: var(--radius);
		}
	}

	.tree {
		display: block;
		font-family: var(--font-text);
	}

	.zoom {
		position: absolute;
		right: var(--space-2);
		bottom: var(--space-2);
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.zoom-btn {
		display: grid;
		place-items: center;
		width: var(--tap);
		height: var(--tap);
		padding: 0;
		border: 1px solid var(--rule);
		border-radius: var(--radius);
		background: color-mix(in srgb, var(--surface) 92%, transparent);
		color: var(--ink);
		font-size: var(--step-1);
		font-weight: 700;
		cursor: pointer;
	}

	/* ---- Connections (upstream time-studies.css) ---- */
	.link {
		stroke: light-dark(#a6a6a6, #444444);
		stroke-width: 1.3;
		stroke-linecap: round;
	}

	.link.antimatter-dim {
		stroke: light-dark(#9fb8a6, #37533f);
	}
	.link.infinity-dim {
		stroke: light-dark(#c4b29b, #534737);
	}
	.link.time-dim {
		stroke: light-dark(#b9a3c4, #4a3753);
	}
	.link.active {
		stroke: light-dark(#c9a0a0, #533737);
	}
	.link.passive {
		stroke: light-dark(#ada3c4, #403753);
	}
	.link.idle {
		stroke: light-dark(#a0b0c4, #374553);
	}
	.link.ec {
		stroke: light-dark(#b9a3c4, #4b3753);
	}
	.link.dilation {
		stroke: light-dark(#9bb98a, #759362);
	}

	.link.bought {
		stroke: light-dark(#14161b, #bbbbbb);
	}
	.link.bought.antimatter-dim {
		stroke: #22aa48;
	}
	.link.bought.infinity-dim {
		stroke: #b67f33;
	}
	.link.bought.time-dim {
		stroke: #b241e3;
	}
	.link.bought.active {
		stroke: #ff0100;
	}
	.link.bought.passive {
		stroke: #5e33b6;
	}
	.link.bought.idle {
		stroke: #0080ff;
	}
	.link.bought.ec {
		stroke: light-dark(#490066, #9a4fc2);
	}

	/* ---- Studies: game colours per path ---- */
	.node {
		--c: #b341e0;
		--on-c: #000;
		--dim: #9e9e9e;
		--avail-ink: var(--c);
		cursor: pointer;
		outline: none;
	}

	.node.antimatter-dim {
		--c: #22aa48;
		--dim: #94a89a;
	}
	.node.infinity-dim {
		--c: #b67f33;
		--dim: #a8a094;
	}
	.node.time-dim {
		--c: #b241e3;
		--dim: #a294a8;
	}
	.node.active {
		--c: #e60000;
		--dim: #a89494;
	}
	.node.passive {
		--c: #5e33b6;
		--on-c: #fff;
		--dim: #9b94a8;
		--avail-ink: light-dark(#5e33b6, #9c7ae0);
	}
	.node.idle {
		--c: #0080ff;
		--dim: #949ea8;
	}
	.node.light {
		--c: #ffffff;
		--dim: #b8b8b8;
		--avail-ink: light-dark(#14161b, #ffffff);
	}
	.node.dark {
		--c: #000000;
		--on-c: #fff;
		--dim: #858585;
		--avail-ink: light-dark(#000000, #d0d0d0);
	}
	.node.ec {
		--c: #490066;
		--on-c: #fff;
		--avail-ink: light-dark(#490066, #c98cff);
	}
	.node.dilation {
		--c: #64dd17;
		--dim: #9ca894;
		--avail-ink: light-dark(#3d7a0c, #64dd17);
	}
	.node.reality {
		--c: #0ba00e;
		--dim: #94a895;
		--avail-ink: light-dark(#0b7a0e, #34c437);
	}
	.node.triad {
		--c: #ead584;
		--dim: #a8a494;
		--avail-ink: light-dark(#776410, #ead584);
	}

	.hit {
		fill: transparent;
	}

	.box {
		stroke-width: 0.45;
		transition:
			fill 0.15s,
			stroke 0.15s;
	}

	.label,
	.cost {
		text-anchor: middle;
		dominant-baseline: middle;
		pointer-events: none;
	}

	.label {
		font-weight: 750;
	}

	.cost {
		font-weight: 600;
	}

	.bought .box {
		fill: var(--c);
		stroke: light-dark(#14161b, #000);
	}
	.bought text {
		fill: var(--on-c);
	}
	.bought.light .box,
	.bought.dark .box {
		stroke: light-dark(#14161b, #9a9eaa);
		stroke-width: 0.9;
	}

	.available .box {
		fill: var(--surface);
		stroke: var(--avail-ink);
		stroke-width: 0.6;
	}
	.available text {
		fill: var(--avail-ink);
	}
	.available.light .box {
		fill: #000;
		stroke: #fff;
	}
	.available.light text {
		fill: #fff;
	}
	.available.dark .box {
		fill: #fff;
		stroke: #000;
	}
	.available.dark text {
		fill: #000;
	}

	.unavailable .box {
		fill: var(--dim);
		stroke: light-dark(#7a7e88, #000);
	}
	.unavailable text {
		fill: #000;
		opacity: 0.8;
	}

	.focused .box,
	.node:focus-visible .box {
		stroke: var(--focus);
		stroke-width: 1.1;
	}
</style>
