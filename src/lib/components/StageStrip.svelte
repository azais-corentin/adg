<!--
@component
The whole game as one strip: a segment per stage in its layer colour, filled up to
`current`. Purely visual; pair it with text naming the stage.
-->
<script lang="ts">
	import { STAGES, stageIndex, type StageId } from '#lib/stages.ts';
	import { layerStyle } from './stage-colors.ts';

	let { current }: { current: StageId | null } = $props();

	const reached = $derived(current === null ? -1 : stageIndex(current));
</script>

<ol class="strip" aria-hidden="true">
	{#each STAGES as stage, i (stage.id)}
		<li
			style={layerStyle(stage.id)}
			class:reached={i <= reached}
			class:current={i === reached}
			class:milestone-start={i > 0 && STAGES[i - 1].milestone !== stage.milestone}
			title={stage.name}
		></li>
	{/each}
</ol>

<style>
	.strip {
		display: flex;
		align-items: flex-end;
		gap: 3px;
		height: 1.25rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		flex: 1;
		height: 0.5rem;
		margin: 0;
		border-radius: 2px;
		background: color-mix(in srgb, var(--layer) 22%, transparent);
	}

	.reached {
		background: var(--layer);
	}

	.current {
		height: 100%;
	}

	.milestone-start {
		margin-left: 0.5rem;
	}
</style>
