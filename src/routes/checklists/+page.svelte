<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { stageProgress } from '#lib/checklists/status.ts';
	import Checklist from '#lib/components/Checklist.svelte';
	import StagePicker from '#lib/components/StagePicker.svelte';
	import { layerStyle } from '#lib/components/stage-colors.ts';
	import { progress } from '#lib/progress.svelte.ts';
	import { STAGES, isStageId } from '#lib/stages.ts';

	const current = $derived(progress.ready ? progress.stage : null);
	const hasSave = $derived(progress.ready && progress.save !== null);
	const sections = $derived.by(() => {
		const save = progress.ready ? progress.save : null;
		const ticks = progress.ready ? progress.checklist : {};
		return STAGES.map((stage) => ({ stage, ...stageProgress(stage.id, save, ticks) }));
	});
	/** A stage named in the URL hash (`/checklists#replicanti`) opens too. */
	let linked = $state<string | null>(null);

	onMount(() => {
		const hash = decodeURIComponent(location.hash.slice(1));
		if (isStageId(hash)) linked = hash;
	});
</script>

<svelte:head>
	<title>Milestone checklists — adg</title>
	<meta
		name="description"
		content="The goals of each stage, to tick off as you reach them. Your ticks are saved on this device."
	/>
</svelte:head>

<div class="page">
	<p><a href={resolve('/tools')}>All tools</a></p>
	<h1>Milestone checklists</h1>
	<p>
		The goals of each stage, to tick off as you reach them. Your ticks are saved on this device.
	</p>
	<p class="muted">
		{#if hasSave}
			Items marked “from your save” are done in the save you imported, and items marked “past this
			stage” belong to a stage your save has moved beyond, so both stay ticked.
			<a href={resolve('/import')}>Import a newer save</a> to update them.
		{:else}
			<a href={resolve('/import')}>Import a save</a> to tick what you have already done, or tick items
			by hand.
		{/if}
	</p>

	<StagePicker />

	<div class="stages">
		{#each sections as { stage, done, total }, i (stage.id)}
			<details
				id={stage.id}
				class="stage"
				class:current={stage.id === current}
				style={layerStyle(stage.id)}
				open={stage.id === current || stage.id === linked}
			>
				<summary>
					<span class="index">{i + 1}</span>
					<span class="name">
						{stage.name}
						{#if stage.id === current}<span class="here">You're here</span>{/if}
					</span>
					<span class="count">{done}/{total}</span>
					<span class="bar" aria-hidden="true">
						<span style:width="{(done / total) * 100}%"></span>
					</span>
				</summary>
				<div class="body">
					<Checklist stage={stage.id} header={false} />
				</div>
			</details>
		{/each}
	</div>
</div>

<style>
	.stages {
		display: grid;
		gap: var(--space-2);
		margin-top: var(--space-5);
	}

	.stage {
		border: 1px solid var(--rule);
		border-left: 4px solid var(--layer);
		border-radius: var(--radius);
		background: var(--surface);
	}

	summary {
		display: grid;
		grid-template-columns: 1.75rem 1fr auto;
		align-items: center;
		gap: var(--space-1) var(--space-2);
		min-height: var(--tap);
		padding: var(--space-2) var(--space-3);
		cursor: pointer;
		list-style: none;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary:hover .name {
		text-decoration: underline;
		text-decoration-color: var(--layer);
	}

	.index {
		color: var(--layer);
		font-weight: 720;
		font-variant-numeric: tabular-nums;
	}

	.name {
		font-weight: 650;
		overflow-wrap: anywhere;
	}

	.here {
		display: inline-block;
		margin-left: var(--space-1);
		padding: 0 var(--space-2);
		border-radius: 999px;
		background: var(--layer);
		color: var(--surface);
		font-size: 0.75rem;
		font-weight: 700;
		line-height: 1.5;
		white-space: nowrap;
		vertical-align: 0.1em;
	}

	.count {
		color: var(--muted);
		font-size: var(--step--1);
		font-variant-numeric: tabular-nums;
	}

	.count::after {
		content: '';
		display: inline-block;
		width: 0.45em;
		height: 0.45em;
		margin-left: var(--space-2);
		border-right: 2px solid currentColor;
		border-bottom: 2px solid currentColor;
		transform: translateY(-0.2em) rotate(45deg);
	}

	.stage[open] .count::after {
		transform: translateY(0.05em) rotate(-135deg);
	}

	.bar {
		grid-column: 2 / -1;
		height: 4px;
		border-radius: 2px;
		background: var(--surface-sunk);
		overflow: hidden;
	}

	.bar span {
		display: block;
		height: 100%;
		background: var(--layer);
	}

	.body {
		padding: 0 var(--space-3) var(--space-2);
		border-top: 1px solid var(--rule);
	}
</style>
