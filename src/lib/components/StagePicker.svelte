<!--
@component
Manual stage picker. Writes to the progress store with source `manual`.
-->
<script lang="ts">
	import { MILESTONE_NAMES } from '#lib/content/index.ts';
	import { progress } from '#lib/progress.svelte.ts';
	import { STAGES, isStageId } from '#lib/stages.ts';

	const milestones = [...new Set(STAGES.map((s) => s.milestone))];
	const id = $props.id();

	function pick(event: Event & { currentTarget: HTMLSelectElement }) {
		const value = event.currentTarget.value;
		progress.setStage(isStageId(value) ? value : null, 'manual');
	}
</script>

<div class="picker">
	<label for="{id}-stage">Where are you in the game?</label>
	<!-- Disabled until the stored progress has loaded, so a pick made during hydration isn't lost. -->
	<select
		id="{id}-stage"
		value={progress.ready ? (progress.stage ?? '') : ''}
		disabled={!progress.ready}
		onchange={pick}
	>
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
