<!--
@component
The suggested Time Study tree for one step of the completion order, as a study string to copy
into the game or open in the Time Study planner.
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { ORDER } from './order.ts';
	import { stepTree } from './trees.ts';

	let { index }: { /** Index into `ORDER`. */ index: number } = $props();

	const step = $derived(ORDER[index]);
	const tree = $derived(stepTree(index));
	const plannerHref = $derived(
		`${resolve('/tools/time-studies')}?tree=${encodeURIComponent(tree.studies)}`
	);

	let field = $state<HTMLInputElement>();
	let copied = $state(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(tree.studies);
		} catch {
			field?.select();
			document.execCommand('copy');
		}
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<div class="step-tree">
	<div class="row">
		<input
			class="mono"
			readonly
			value={tree.studies}
			bind:this={field}
			aria-label="Study string for EC{step?.ec} ×{step?.completion}"
			onfocus={(e) => e.currentTarget.select()}
		/>
		<button type="button" class="button" onclick={copy}>{copied ? 'Copied' : 'Copy tree'}</button>
	</div>
	<p class="muted small">
		{tree.tt.toLocaleString('en-US')} TT. The game buys the studies left to right and EC{step?.ec} last:
		it is left out if your TT run short or you haven't met its unlock requirement yet.
		<a href={plannerHref}>Open in the Time Study planner</a> to check it against your TT.
	</p>
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
</style>
