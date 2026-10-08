<!--
@component
Goals read from a save (`nextGoals`), done ones ticked. Read-only: a goal is done when the
save says so, so it changes only with a newer import.
-->
<script lang="ts">
	import type { Goal } from '#lib/save/types.ts';

	let { goals }: { goals: readonly Goal[] } = $props();
</script>

<ul class="goals">
	{#each goals as goal (goal.id)}
		<li class:done={goal.done}>
			<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
				<rect x="1.5" y="1.5" width="17" height="17" rx="4" />
				{#if goal.done}
					<path d="m5.5 10.5 3 3 6-7" />
				{/if}
			</svg>
			<span><span class="visually-hidden">{goal.done ? 'Done: ' : 'To do: '}</span>{goal.text}</span
			>
		</li>
	{/each}
</ul>

<style>
	.goals {
		display: grid;
		gap: var(--space-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		display: grid;
		grid-template-columns: 1.25rem 1fr;
		gap: var(--space-3);
		align-items: start;
		line-height: 1.45;
	}

	svg {
		margin-top: 0.1em;
		fill: none;
		stroke: var(--layer);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.done {
		color: var(--muted);
	}

	.done rect {
		fill: color-mix(in srgb, var(--layer) 18%, transparent);
	}
</style>
