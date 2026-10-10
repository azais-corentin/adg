<!--
@component
The suggested Time Study tree for one step of the completion order, as a study string to copy
into the game or open in the Time Study planner. When the tree has study 131, which on Android
stops automatic Replicanti Galaxies while the app is closed, it says so and offers the step's
tree on the Passive row for runs left going offline (EC6 has none: its study needs 121).
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { ORDER } from './order.ts';
	import { offlineTree, stepTree, type StepTree } from './trees.ts';

	let { index }: { /** Index into `ORDER`. */ index: number } = $props();

	const step = $derived(ORDER[index]);
	const tree = $derived(stepTree(index));
	const offline = $derived(offlineTree(index));
	const plannerHref = (studies: string) =>
		`${resolve('/tools/time-studies')}?tree=${encodeURIComponent(studies)}`;

	let copied = $state<string>();

	async function copy(studies: string, field: HTMLInputElement | null) {
		try {
			await navigator.clipboard.writeText(studies);
		} catch {
			field?.select();
			document.execCommand('copy');
		}
		copied = studies;
		setTimeout(() => (copied = undefined), 2000);
	}
</script>

{#snippet row(variant: StepTree, label: string)}
	<div class="row">
		<input
			class="mono"
			readonly
			value={variant.studies}
			aria-label={label}
			onfocus={(e) => e.currentTarget.select()}
		/>
		<button
			type="button"
			class="button"
			onclick={(e) =>
				copy(variant.studies, e.currentTarget.previousElementSibling as HTMLInputElement)}
			>{copied === variant.studies ? 'Copied' : 'Copy tree'}</button
		>
	</div>
{/snippet}

<div class="step-tree">
	{@render row(tree, `Study string for EC${step?.ec} ×${step?.completion}`)}
	<p class="muted small">
		{tree.tt.toLocaleString('en-US')} TT. The game buys the studies left to right and EC{step?.ec} last:
		it is left out if your TT run short or you haven't met its unlock requirement yet.
		<a href={plannerHref(tree.studies)}>Open in the Time Study planner</a> to check it against your TT.
	</p>
	{#if tree.stopsOfflineGalaxies}
		<div class="offline">
			<p class="small">
				<strong>Leaving the app closed during this run?</strong> Study 131 stops Replicanti Galaxies
				while the app is closed (the Replicanti tab reads “Auto galaxy: ON (disabled while
				offline)”).
				{#if offline}
					Keep the game on screen, or use this tree, which takes 122, 132 and 142 instead of 121,
					131 and 141:
				{:else}
					EC{step?.ec}'s study needs 121, so there is no tree without it: keep the game on screen
					for this run.
				{/if}
			</p>
			{#if offline}
				{@render row(offline, `Study string for EC${step?.ec} ×${step?.completion} left offline`)}
				<p class="muted small">
					{offline.tt.toLocaleString('en-US')} TT.
					<a href={plannerHref(offline.studies)}>Open in the Time Study planner</a>.
				</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	.row {
		display: flex;
		gap: var(--space-2);
	}

	.row input {
		flex: 1;
		min-width: 0;
		min-height: var(--tap);
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--rule);
		border-radius: var(--radius);
		background: var(--surface);
		font-family: var(--font-mono);
		font-size: var(--step--1);
	}

	.row .button {
		flex: none;
	}

	.small {
		margin: var(--space-1) 0 0;
		font-size: var(--step--1);
	}

	.offline {
		margin-top: var(--space-3);
		padding-top: var(--space-3);
		border-top: 1px solid var(--rule);
	}

	.offline .small:first-child {
		margin: 0 0 var(--space-2);
	}
</style>
