<script lang="ts">
	import { tick } from 'svelte';
	import { resolve } from '$app/paths';
	import Screen from '#lib/components/Screen.svelte';
	import SaveInput from '#lib/components/save/SaveInput.svelte';
	import SaveResult from '#lib/components/save/SaveResult.svelte';
	import { progress } from '#lib/progress.svelte.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let now = $state(Date.now());
	const save = $derived(progress.ready ? progress.save : null);

	$effect(() => {
		progress.init();
		const timer = setInterval(() => (now = Date.now()), 30_000);
		return () => clearInterval(timer);
	});

	async function showResult() {
		now = Date.now();
		await tick();
		const heading = document.getElementById('result-heading');
		heading?.focus({ preventScroll: true });
		heading?.scrollIntoView({ block: 'start' });
	}
</script>

<svelte:head>
	<title>Save import — adg</title>
	<meta
		name="description"
		content="Export your Antimatter Dimensions save on Android and open it here. adg decodes it on your phone, never on a server, and shows your stage and next goals."
	/>
</svelte:head>

{#snippet steps()}
	<ol class="steps">
		<li>
			In the game, open the <strong>Options</strong> tab (the sliders icon in the bottom bar) and
			scroll to <strong>Save &amp; Load</strong>.
		</li>
		<li>
			Tap <strong>Export to web/steam</strong>. The game shows “Exported to clipboard”.
			<strong>Export to mobile</strong> works too, but adg reads the web/steam format most exactly.
		</li>
		<li>
			Come back here, long-press the box below, choose <strong>Paste</strong> and tap
			<strong>Read pasted save</strong>.
		</li>
	</ol>
	<details class="screens">
		<summary>If pasting fails: save it to a file</summary>
		<ol class="steps">
			<li>
				In <strong>Save &amp; Load</strong>, <strong>hold</strong> the <strong>Share save</strong>
				button. A short tap opens the share sheet instead.
			</li>
			<li>In the dialog, choose <strong>Export to web/steam</strong>.</li>
			<li>
				The file picker opens in <strong>Downloads</strong> with a name like
				<code>ADWebSave_….txt</code>. Tap <strong>Save</strong>.
			</li>
			<li>
				Back in the game, a <strong>While you were away</strong> popup appears. That is normal; tap
				<strong>Confirm</strong>.
			</li>
			<li>Here, tap <strong>Choose the save file</strong> and pick that file from Downloads.</li>
		</ol>
		<div class="screen-row">
			<Screen
				src="early-eternity/options-save-load.webp"
				alt="Options tab, Save & Load section, with the Share save (hold for save to file) and Export to web/steam buttons"
				caption="Tap “Export to web/steam”, or hold “Share save (hold for save to file)”."
			/>
			<Screen
				src="early-eternity/options-save-to-file-dialog.webp"
				alt="Dialog with Export to mobile and Export to web/steam"
				caption="Holding Share save: choose “Export to web/steam”."
			/>
		</div>
	</details>
{/snippet}

<div class="page">
	<p><a href={resolve('/tools')}>All tools</a></p>
	<h1>Save import</h1>
	<p class="lede">
		Export your save from the game and open it here: adg detects your stage and shows your next
		goals.
	</p>
	<p class="private">
		<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
			<path d="M6 11V8a6 6 0 0 1 12 0v3 M5 11h14v10H5z" />
		</svg>
		<span
			>The save is decoded on this device and kept only in this browser. Nothing is uploaded.</span
		>
	</p>

	{#if save}
		<SaveResult
			{save}
			articles={data.articles}
			importedAt={progress.importedAt}
			{now}
			ticks={progress.checklist}
		/>
		<p class="forget">
			<button class="button" type="button" onclick={() => progress.forgetSave()}>
				Forget this save
			</button>
			<span class="muted">Removes it from this browser.</span>
		</p>

		<section class="again" aria-labelledby="again-heading">
			<h2 id="again-heading">Import a newer save</h2>
			<details>
				<summary>How to export from the game</summary>
				{@render steps()}
			</details>
			<SaveInput onimported={showResult} />
		</section>
	{:else}
		<section aria-labelledby="export-heading">
			<h2 id="export-heading">1. Export from the game</h2>
			{@render steps()}
		</section>
		<section aria-labelledby="open-heading">
			<h2 id="open-heading">2. Open it here</h2>
			<SaveInput onimported={showResult} />
		</section>
	{/if}
</div>

<style>
	.lede {
		font-size: var(--step-1);
		line-height: 1.5;
		color: var(--muted);
	}

	.private {
		display: flex;
		gap: var(--space-2);
		align-items: flex-start;
		margin: 0 0 var(--space-5);
		font-weight: 650;
	}

	.private svg {
		flex: none;
		margin-top: 0.15em;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linejoin: round;
	}

	section + section {
		margin-top: var(--space-5);
	}

	.steps {
		padding-left: var(--space-5);
		line-height: 1.5;
	}

	.steps li + li {
		margin-top: var(--space-2);
	}

	details {
		margin: 0 0 var(--space-4);
	}

	summary {
		display: flex;
		align-items: center;
		min-height: var(--tap);
		font-weight: 650;
		cursor: pointer;
	}

	summary::before {
		content: '▸';
		margin-right: var(--space-2);
		transition: rotate 0.15s;
	}

	details[open] > summary::before {
		rotate: 90deg;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	.screen-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0 var(--space-4);
	}

	.screen-row :global(.screen) {
		margin: var(--space-2) 0;
	}

	.forget {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2) var(--space-3);
		margin: var(--space-5) 0;
	}

	.again {
		padding-top: var(--space-5);
		border-top: 1px solid var(--rule);
	}
</style>
