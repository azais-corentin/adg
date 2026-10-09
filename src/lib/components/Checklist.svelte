<!--
@component
One stage's milestone checklist, e.g. `<Checklist stage="early-infinity" />` in an article.
Ticks are shared with the /checklists page through the progress store. Items the imported
save shows as done are ticked "from your save", items of a stage the save is past are ticked
"past this stage"; neither can be unticked. Every other item can be ticked by hand.
`header={false}` drops the title row (/checklists shows its own).
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { stageItems } from '#lib/checklists/items.ts';
	import { itemStatus } from '#lib/checklists/status.ts';
	import { progress } from '#lib/progress.svelte.ts';
	import { getStage, type StageId } from '#lib/stages.ts';
	import { layerStyle } from './stage-colors.ts';

	let { stage, header = true }: { stage: StageId; header?: boolean } = $props();

	const uid = $props.id();
	const rows = $derived.by(() => {
		const save = progress.ready ? progress.save : null;
		const ticks = progress.ready ? progress.checklist : {};
		return stageItems(stage).map((item) => ({ item, status: itemStatus(item, save, ticks) }));
	});
	const done = $derived(rows.filter((row) => row.status !== 'open').length);
</script>

<section class="checklist" class:embedded={header} style={layerStyle(stage)}>
	{#if header}
		<div class="head">
			<p class="title" id="{uid}-title">Checklist: {getStage(stage).name}</p>
			<p class="count">{done} of {rows.length} done</p>
			<div class="bar" aria-hidden="true">
				<span style:width="{(done / rows.length) * 100}%"></span>
			</div>
		</div>
	{/if}
	<ul class="items" aria-labelledby={header ? `${uid}-title` : undefined}>
		{#each rows as { item, status } (item.id)}
			<li class:done={status !== 'open'}>
				<label>
					<!-- aria-disabled, not disabled: a disabled box loses the stage colour. -->
					<input
						type="checkbox"
						checked={status !== 'open'}
						aria-disabled={status === 'auto' || status === 'implied'}
						onclick={(event) => {
							if (status === 'auto' || status === 'implied') event.preventDefault();
						}}
						onchange={() => progress.toggleCheck(item.id)}
						aria-describedby={item.detail ? `${uid}-${item.id}-detail` : undefined}
					/>
					<span class="text">
						{item.text}
						{#if status === 'auto'}<span class="badge">from your save</span>{/if}
						{#if status === 'implied'}<span class="badge">past this stage</span>{/if}
					</span>
					{#if item.detail}
						<span class="detail" id="{uid}-{item.id}-detail">{item.detail}</span>
					{/if}
				</label>
			</li>
		{/each}
	</ul>
	{#if header}
		<p class="more"><a href="{resolve('/checklists')}#{stage}">All milestone checklists</a></p>
	{/if}
</section>

<style>
	.checklist.embedded {
		margin: var(--space-5) 0;
		padding: var(--space-3) var(--space-4);
		border: 1px solid var(--rule);
		border-top: 3px solid var(--layer);
		border-radius: var(--radius);
		background: var(--surface);
	}

	.head {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: baseline;
		gap: 0 var(--space-3);
		margin-bottom: var(--space-2);
	}

	.title {
		margin: 0;
		font-weight: 720;
	}

	.count {
		margin: 0;
		color: var(--muted);
		font-size: var(--step--1);
		font-variant-numeric: tabular-nums;
	}

	.bar {
		grid-column: 1 / -1;
		height: 4px;
		margin-top: var(--space-2);
		border-radius: 2px;
		background: var(--surface-sunk);
		overflow: hidden;
	}

	.bar span {
		display: block;
		height: 100%;
		background: var(--layer);
	}

	.items {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.items li + li {
		margin-top: 0;
		border-top: 1px solid var(--rule);
	}

	label {
		display: grid;
		grid-template-columns: 1.375rem 1fr;
		column-gap: var(--space-3);
		align-items: start;
		min-height: var(--tap);
		padding: var(--space-2) 0;
		cursor: pointer;
	}

	input {
		width: 1.25rem;
		height: 1.25rem;
		margin: 0.2rem 0 0;
		accent-color: var(--layer);
		cursor: pointer;
	}

	input[aria-disabled='true'],
	label:has(input[aria-disabled='true']) {
		cursor: default;
	}

	.text {
		overflow-wrap: anywhere;
	}

	.done .text {
		color: var(--muted);
	}

	.badge {
		display: inline-block;
		margin-left: var(--space-1);
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

	.detail {
		grid-column: 2;
		color: var(--muted);
		font-size: var(--step--1);
		line-height: 1.45;
		overflow-wrap: anywhere;
	}

	.more {
		margin: var(--space-2) 0 0;
		font-size: var(--step--1);
	}

	.more a {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap);
	}
</style>
