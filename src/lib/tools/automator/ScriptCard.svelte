<!--
@component
One Automator script: what it does, what it needs, the text and a copy button.
-->
<script lang="ts">
	import { layerStyle } from '#lib/components/stage-colors.ts';
	import { getStage } from '#lib/stages.ts';
	import { type AutomatorScript, UNLOCK_LABELS, perk } from './library.ts';

	let { script }: { script: AutomatorScript } = $props();

	const needs = $derived([
		...script.unlocks.map((unlock) => UNLOCK_LABELS[unlock]),
		...script.perks.map((id) => {
			const { label, description } = perk(id);
			return `Perk ${label}: ${description}`;
		}),
		...script.setup
	]);
	const lines = $derived(script.text.split('\n').length);

	let status = $state<'idle' | 'copied' | 'failed'>('idle');
	let reset: ReturnType<typeof setTimeout> | undefined;

	async function copy() {
		clearTimeout(reset);
		try {
			await navigator.clipboard.writeText(script.text);
			status = 'copied';
		} catch {
			status = 'failed';
		}
		reset = setTimeout(() => (status = 'idle'), 4000);
	}
</script>

<article class="card" id={script.id} style={layerStyle(script.stage)}>
	<header>
		<h3>{script.title}</h3>
		<p class="meta">
			<span class="stage">{getStage(script.stage).name}</span>
			<span class="muted">Name: <code>{script.id}</code></span>
			<span class="muted">{lines} lines</span>
		</p>
	</header>
	<p>{script.purpose}</p>

	{#if needs.length > 0}
		<h4>Before you start</h4>
		<ul>
			{#each needs as need (need)}
				<li>{need}</li>
			{/each}
		</ul>
	{/if}

	{#if script.tweaks.length > 0}
		<h4>To change</h4>
		<ul>
			{#each script.tweaks as tweak (tweak)}
				<li>{tweak}</li>
			{/each}
		</ul>
	{/if}

	<pre><code>{script.text}</code></pre>

	<button type="button" class="button copy" onclick={copy}>
		{status === 'copied' ? 'Copied' : 'Copy script'}
	</button>
	<p class="status" role="status">
		{#if status === 'copied'}
			Copied. Paste it into a new script in the Automator.
		{:else if status === 'failed'}
			Your browser blocked the clipboard. Select the script above and copy it by hand.
		{/if}
	</p>

	{#if script.verified}
		<p class="verified">
			Ran in Android {script.verified.android} on {script.verified.date}, from the
			{script.verified.save} community save: {script.verified.observed}
		</p>
	{/if}
</article>

<style>
	.card {
		padding: var(--space-4);
		border: 1px solid var(--rule);
		border-left: 4px solid var(--layer);
		border-radius: var(--radius);
		background: var(--surface);
	}

	h3 {
		margin: 0;
	}

	h4 {
		margin: var(--space-4) 0 var(--space-2);
		font-size: var(--step-0);
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1) var(--space-3);
		margin: var(--space-1) 0 var(--space-3);
		font-size: var(--step--1);
	}

	.stage {
		color: var(--layer);
		font-weight: 720;
	}

	ul {
		font-size: var(--step--1);
	}

	pre {
		margin: var(--space-4) 0 var(--space-3);
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}

	.copy {
		width: 100%;
		min-height: 3.25rem;
		font-size: var(--step-1);
	}

	.status {
		min-height: 1.6em;
		margin: var(--space-2) 0 0;
		font-size: var(--step--1);
	}

	.verified {
		margin: var(--space-2) 0 0;
		padding-top: var(--space-2);
		border-top: 1px solid var(--rule);
		color: var(--muted);
		font-size: var(--step--1);
	}
</style>
