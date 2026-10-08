<!--
@component
Content that applies to a range of stages (`from` and/or `until`, inclusive).
- `mode="hide"` (default): outside the range, the content collapses behind a "show anyway"
  toggle.
- `mode="highlight"`: inside the range, the content is marked as relevant now.
With no known stage (no import, nothing picked) the content shows normally.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { progress } from '#lib/progress.svelte.ts';
	import { getStage, stageIndex, type StageId } from '#lib/stages.ts';
	import { layerStyle } from './stage-colors.ts';

	let {
		from,
		until,
		mode = 'hide',
		children
	}: { from?: StageId; until?: StageId; mode?: 'hide' | 'highlight'; children: Snippet } = $props();

	const current = $derived(progress.ready ? progress.stage : null);
	const inRange = $derived.by(() => {
		if (current === null) return undefined;
		const i = stageIndex(current);
		return (
			(from === undefined || i >= stageIndex(from)) &&
			(until === undefined || i <= stageIndex(until))
		);
	});
	const range = $derived.by(() => {
		const first = from && getStage(from).name;
		const last = until && getStage(until).name;
		if (first && last) return first === last ? `At ${first}` : `From ${first} to ${last}`;
		if (first) return `From ${first} on`;
		if (last) return `Up to ${last}`;
		return 'Every stage';
	});
</script>

{#if inRange === false && mode === 'hide'}
	<details class="gate hidden">
		<summary>
			<span>{range}. You're at {current && getStage(current).name}.</span>
			<span class="show">Show anyway</span>
		</summary>
		<div class="body">{@render children()}</div>
	</details>
{:else if inRange === true && mode === 'highlight'}
	<div class="gate highlight" style={layerStyle(current)}>
		<p class="label">Relevant at your stage</p>
		<div class="body">{@render children()}</div>
	</div>
{:else}
	{@render children()}
{/if}

<style>
	.gate {
		margin: var(--space-4) 0;
	}

	.hidden summary {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-1) var(--space-3);
		min-height: var(--tap);
		padding: var(--space-2) var(--space-3);
		border: 1px dashed var(--rule);
		border-radius: var(--radius);
		color: var(--muted);
		font-size: var(--step--1);
		cursor: pointer;
		list-style: none;
	}

	.hidden summary::-webkit-details-marker {
		display: none;
	}

	.show {
		color: var(--ink);
		font-weight: 650;
		text-decoration: underline;
		text-decoration-color: var(--layer);
	}

	.hidden[open] .show {
		display: none;
	}

	.hidden[open] .body {
		padding-top: var(--space-3);
	}

	.highlight {
		padding: var(--space-2) 0 var(--space-2) var(--space-4);
		border-left: 4px solid var(--layer);
	}

	.label {
		margin: 0 0 var(--space-1);
		color: var(--layer);
		font-size: var(--step--1);
		font-weight: 720;
	}

	.body > :global(:last-child) {
		margin-bottom: 0;
	}
</style>
