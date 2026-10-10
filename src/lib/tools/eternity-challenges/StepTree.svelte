<!--
@component
The suggested Time Study tree for one step of the completion order, as a study string to copy
into the game or open in the Time Study planner. When the tree has study 131, which on Android
stops automatic Replicanti Galaxies while the app is closed, the step gets two labelled trees:
the Active row for the game on screen and the Passive row for a run left going with the app
closed. EC6 has no second tree: its study needs 121.

Measured on Android 3.18.0 (eternity-challenges save, game on screen): EC2 ×5 at 219 TT, the
Active tree was at 8.83e1565 IP after 7½ minutes, the Passive tree at 9.94e1520 after 8½.
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
	{#if offline}
		<p class="variant"><strong>Game on screen</strong> · Active row (121, 131, 141)</p>
		{@render row(
			tree,
			`Study string for EC${step?.ec} ×${step?.completion} with the game on screen`
		)}
		<p class="muted small">
			{tree.tt.toLocaleString('en-US')} TT.
			<a href={plannerHref(tree.studies)}>Open in the Time Study planner</a>.
		</p>
		<p class="variant"><strong>App closed</strong> · Passive row (122, 132, 142)</p>
		{@render row(
			offline,
			`Study string for EC${step?.ec} ×${step?.completion} with the app closed`
		)}
		<p class="muted small">
			{offline.tt.toLocaleString('en-US')} TT.
			<a href={plannerHref(offline.studies)}>Open in the Time Study planner</a>.
		</p>
		<p class="small why">
			Study 131 stops Replicanti Galaxies while the app is closed (the Replicanti tab reads “Auto
			galaxy: ON (disabled while offline)”), so a run you leave going offline needs the second tree.
			On screen the first is faster. Study 121 does nothing for the goal either way: it boosts EP,
			and a challenge only asks for IP. The Active row pays through 141, an IP multiplier that is
			largest when your Infinities are short.
		</p>
		<p class="muted small">
			The game buys the studies left to right and EC{step?.ec} last: it is left out if your TT run short
			or you haven't met its unlock requirement yet.
		</p>
	{:else}
		{@render row(tree, `Study string for EC${step?.ec} ×${step?.completion}`)}
		<p class="muted small">
			{tree.tt.toLocaleString('en-US')} TT. The game buys the studies left to right and EC{step?.ec}
			last: it is left out if your TT run short or you haven't met its unlock requirement yet.
			<a href={plannerHref(tree.studies)}>Open in the Time Study planner</a> to check it against your
			TT.
		</p>
		{#if tree.stopsOfflineGalaxies}
			<p class="small why">
				Study 131 stops Replicanti Galaxies while the app is closed (the Replicanti tab reads “Auto
				galaxy: ON (disabled while offline)”). EC{step?.ec}'s study needs 121, so there is no tree
				without it: keep the game on screen for this run.
			</p>
		{/if}
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

	.variant {
		margin: 0 0 var(--space-1);
		font-size: var(--step--1);
	}

	.variant ~ .variant {
		margin-top: var(--space-3);
	}

	.why {
		margin-top: var(--space-3);
	}
</style>
