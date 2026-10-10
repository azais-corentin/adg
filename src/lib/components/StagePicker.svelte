<!--
@component
Manual stage picker. Writes to the progress store with source `manual`. With an imported save
kept, its first option goes back to the stage the save reaches.
-->
<script lang="ts">
	import { MILESTONE_NAMES } from '#lib/content/index.ts';
	import { progress } from '#lib/progress.svelte.ts';
	import { detectStage } from '#lib/save/stage.ts';
	import { STAGES, getStage, isStageId } from '#lib/stages.ts';

	const SAVE = 'save';
	const milestones = [...new Set(STAGES.map((s) => s.milestone))];
	const id = $props.id();
	const save = $derived(progress.ready ? progress.save : null);

	function pick(event: Event & { currentTarget: HTMLSelectElement }) {
		const value = event.currentTarget.value;
		if (value === SAVE) progress.useSaveStage();
		else progress.setStage(isStageId(value) ? value : null, 'manual');
	}
</script>

<div class="picker">
	<label for="{id}-stage">Where are you in the game?</label>
	<!-- Disabled until the stored progress has loaded, so a pick made during hydration isn't lost. -->
	<select
		id="{id}-stage"
		value={!progress.ready
			? ''
			: save && progress.stageSource === 'import'
				? SAVE
				: (progress.stage ?? '')}
		disabled={!progress.ready}
		onchange={pick}
	>
		{#if save}
			<option value={SAVE}>My imported save ({getStage(detectStage(save).stage).name})</option>
		{/if}
		<option value="">I don't know yet</option>
		{#each milestones as milestone (milestone)}
			<optgroup label={MILESTONE_NAMES[milestone]}>
				{#each STAGES.filter((s) => s.milestone === milestone) as stage (stage.id)}
					<option value={stage.id}>{stage.name}</option>
				{/each}
			</optgroup>
		{/each}
	</select>
</div>

<style>
	.picker {
		display: grid;
		gap: var(--space-1);
	}

	label {
		font-weight: 650;
	}

	select {
		width: 100%;
		min-height: var(--tap);
		padding: 0 var(--space-3);
		border: 1.5px solid var(--rule);
		border-radius: var(--radius);
		background: var(--surface);
	}

	select:hover {
		border-color: var(--layer);
	}
</style>
