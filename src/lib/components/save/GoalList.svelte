<!--
@component
Goals read from a save (`nextGoals`). A status list, not a form: the round marks are not
checkboxes. A goal is done when the save shows it or when its checklist item was ticked by
hand, so the note under the list sends the player to `stage`'s checklist to tick one.
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Goal } from '#lib/save/types.ts';
	import type { StageId } from '#lib/stages.ts';

	let { goals, stage }: { goals: readonly Goal[]; stage: StageId } = $props();
</script>

<ul class="goals">
	{#each goals as goal (goal.id)}
		<li class:done={goal.done}>
			<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
				{#if goal.done}
					<circle cx="10" cy="10" r="8.5" />
					<path d="m6 10.5 2.75 2.75 5.25-6" />
				{:else}
					<circle class="dot" cx="10" cy="10" r="3.5" />
				{/if}
			</svg>
			<span
				><span class="visually-hidden">{goal.done ? 'Done: ' : 'To do: '}</span>{goal.text}
				{#if goal.byHand}<span class="badge">ticked by you</span>{/if}</span
			>
		</li>
	{/each}
</ul>
<p class="note">
	Done something since this save? Tick it in the <a href="{resolve('/checklists')}#{stage}"
		>stage checklist</a
	>, or import a newer save.
</p>

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

	.dot {
		fill: var(--layer);
		stroke: none;
	}

	.done {
		color: var(--muted);
	}

	.done circle {
		fill: var(--layer);
	}

	.done path {
		stroke: var(--surface);
	}

	.badge {
		display: inline-block;
		padding: 0 var(--space-2);
		border: 1px solid var(--layer);
		border-radius: 999px;
		color: var(--layer);
		font-size: 0.75rem;
		font-weight: 650;
		line-height: 1.5;
		white-space: nowrap;
		vertical-align: 0.1em;
	}

	.note {
		margin: var(--space-3) 0 0;
		color: var(--muted);
		font-size: var(--step--1);
	}
</style>
