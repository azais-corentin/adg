<script lang="ts">
	import { resolve } from '$app/paths';
	import Callout from '#lib/components/Callout.svelte';
	import { progress } from '#lib/progress.svelte.ts';
	import { STAGES, type StageId, stageIndex } from '#lib/stages.ts';
	import { AUTOMATOR_SCRIPTS } from '#lib/tools/automator/library.ts';
	import ScriptCard from '#lib/tools/automator/ScriptCard.svelte';

	/** Only scripts that ran in the game are listed. */
	const scripts = AUTOMATOR_SCRIPTS.filter((s) => s.verified !== null);
	const stagesWithScripts = STAGES.filter((stage) => scripts.some((s) => s.stage === stage.id));

	const current = $derived(progress.ready ? progress.stage : null);
	const currentHasScripts = $derived(stagesWithScripts.some((s) => s.id === current));
	const beforeReality = $derived(
		current !== null && stageIndex(current) < stageIndex('early-reality')
	);

	let picked = $state<StageId | 'all' | null>(null);
	/** Your stage's scripts when there are any, until you pick another filter. */
	const filter = $derived(picked ?? (currentHasScripts && current ? current : 'all'));

	/** Stage groups, your stage first, then game order. */
	const groups = $derived(
		[...stagesWithScripts]
			.sort((a, b) => Number(b.id === current) - Number(a.id === current))
			.filter((stage) => filter === 'all' || stage.id === filter)
			.map((stage) => ({ stage, scripts: scripts.filter((s) => s.stage === stage.id) }))
	);
</script>

<svelte:head>
	<title>Automator scripts — adg</title>
	<meta
		name="description"
		content="Scripts for the Reality Automator, each one run in the game before it is listed here."
	/>
</svelte:head>

<div class="page">
	<p><a href={resolve('/tools')}>All tools</a></p>
	<h1>Automator scripts</h1>
	<p>
		Scripts for the Automator, which unlocks during Reality at 100 Automator Points. Each one was
		compiled with the game's own Automator code and run in the Android app before it was listed
		here.
	</p>

	{#if beforeReality}
		<Callout kind="note" title="Not unlocked yet">
			<p>
				You are before Reality, so you do not have the Automator yet. The scripts below are for when
				you get there.
			</p>
		</Callout>
	{/if}

	<Callout kind="android" title="Pasting a script on Android">
		<ol>
			<li>
				Tap the gears icon in the bottom bar (Autobuyers), then the <strong>Automator</strong> subtab.
			</li>
			<li>Tap <strong>Current Script</strong> and choose <strong>Create a new script</strong>.</li>
			<li>
				Tap the black editor and paste: long-press and choose <strong>Paste</strong>, or tap the
				clipboard suggestion above the keyboard. Tap back to close the keyboard.
			</li>
			<li>
				Optional: rename it with the pencil button to the name on its card (names can have up to 15
				characters).
			</li>
			<li>
				Press <strong>▶</strong>. The green line under the buttons shows
				<em>Running: "name" (Line N)</em>; <strong>■</strong> stops and resets it.
			</li>
		</ol>
		<p>
			Two buttons change what happens when a script ends: the circular arrows repeat it from the
			top, and the curved arrow (green when on) starts it again after every Reality. A
			<code>notify</code> line shows a green banner at the bottom of the screen.
		</p>
	</Callout>

	<fieldset class="filter">
		<legend>Show scripts for</legend>
		<label class:on={filter === 'all'}>
			<input
				type="radio"
				name="stage"
				value="all"
				checked={filter === 'all'}
				onchange={() => (picked = 'all')}
			/>
			All stages ({scripts.length})
		</label>
		{#each stagesWithScripts as stage (stage.id)}
			<label class:on={filter === stage.id}>
				<input
					type="radio"
					name="stage"
					value={stage.id}
					checked={filter === stage.id}
					onchange={() => (picked = stage.id)}
				/>
				{stage.name}
				({scripts.filter((s) => s.stage === stage.id).length}){#if stage.id === current}<span
						class="here">· your stage</span
					>{/if}
			</label>
		{/each}
	</fieldset>

	{#each groups as { stage, scripts: list } (stage.id)}
		<section aria-labelledby="stage-{stage.id}">
			<h2 id="stage-{stage.id}">{stage.name}</h2>
			<div class="cards">
				{#each list as script (script.id)}
					<ScriptCard {script} />
				{/each}
			</div>
		</section>
	{/each}
</div>

<style>
	.filter {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin: var(--space-5) 0 0;
		padding: 0;
		border: 0;
	}

	legend {
		margin-bottom: var(--space-2);
		font-weight: 650;
	}

	.filter label {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap);
		padding: 0 var(--space-3);
		border: 1.5px solid var(--rule);
		border-radius: 999px;
		background: var(--surface);
		cursor: pointer;
	}

	.filter label.on {
		border-color: var(--focus);
		background: color-mix(in srgb, var(--focus) 12%, var(--surface));
		font-weight: 650;
	}

	.filter label:has(:focus-visible) {
		outline: 3px solid var(--focus);
		outline-offset: 2px;
	}

	.filter input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	.here {
		margin-left: var(--space-1);
		color: var(--muted);
		font-weight: 400;
	}

	.cards {
		display: grid;
		gap: var(--space-4);
	}

	ol {
		padding-left: 1.2em;
	}
</style>
