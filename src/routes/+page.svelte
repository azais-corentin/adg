<script lang="ts">
	import { resolve } from '$app/paths';
	import { articlesForStage } from '#lib/content/index.ts';
	import { TOOLS } from '#lib/content/tools.ts';
	import StagePicker from '#lib/components/StagePicker.svelte';
	import StageStrip from '#lib/components/StageStrip.svelte';
	import { layerStyle } from '#lib/components/stage-colors.ts';
	import { progress } from '#lib/progress.svelte.ts';
	import { STAGES, getStage, stageIndex } from '#lib/stages.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const stage = $derived(progress.ready ? progress.stage : null);
	const reading = $derived(stage ? articlesForStage(data.articles, stage) : undefined);
	const firstArticle = $derived(data.articles[0]);
	const importedOn = $derived(
		progress.importedAt
			? new Date(progress.importedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })
			: undefined
	);
</script>

<svelte:head>
	<title>adg — Antimatter Dimensions Guide</title>
	<meta
		name="description"
		content="An unofficial guide to Antimatter Dimensions on Android 3.18.0: what to do at every stage, from your first Dimension Boost to the end of the game."
	/>
</svelte:head>

<div class="page">
	<h1>What to do next in Antimatter Dimensions</h1>
	<p class="lede">
		A guide to the Android app, version 3.18.0, from your first Dimension Boost to the end of the
		game. Tell adg where you are, and it shows the part of the guide that matters now.
	</p>

	<section
		class="stage"
		class:unset={!stage}
		style={layerStyle(stage)}
		aria-labelledby="stage-heading"
	>
		<h2 id="stage-heading" class="visually-hidden">Your stage</h2>
		{#if stage}
			<p class="stage-name">{getStage(stage).name}</p>
			<p class="stage-meta">
				Stage {stageIndex(stage) + 1} of {STAGES.length},
				{#if progress.stageSource === 'import'}
					detected from your save{importedOn ? ` on ${importedOn}` : ''}.
				{:else}
					picked by you.
				{/if}
			</p>
		{:else}
			<p class="stage-name">Stage not set</p>
			<p class="stage-meta">Pick it below, or import a save to detect it.</p>
		{/if}
		<StageStrip current={stage} />
		<StagePicker />
		<a class="button" href={resolve('/import')}>Import a save</a>
	</section>

	<section aria-labelledby="reading-heading">
		<h2 id="reading-heading">Continue reading</h2>
		{#if stage && reading}
			{#if reading.stage.id !== stage}
				<p class="muted">
					Nothing is written for {getStage(stage).name} yet. The closest earlier section is {reading
						.stage.name}.
				</p>
			{/if}
			<ul class="reading" style={layerStyle(reading.stage.id)}>
				{#each reading.articles as article (article.slug)}
					<li>
						<a href={resolve('/guide/[...slug]', { slug: article.slug })}>{article.title}</a>
						<p>{article.summary}</p>
					</li>
				{/each}
			</ul>
		{:else if firstArticle}
			<p>Set your stage to see the articles for it, or start at the beginning:</p>
			<ul class="reading" style={layerStyle(firstArticle.stage)}>
				<li>
					<a href={resolve('/guide/[...slug]', { slug: firstArticle.slug })}>{firstArticle.title}</a
					>
					<p>{firstArticle.summary}</p>
				</li>
			</ul>
		{/if}
		<p><a href={resolve('/guide')}>All articles</a></p>
	</section>

	<section aria-labelledby="tools-heading">
		<h2 id="tools-heading">Tools</h2>
		<dl class="tools">
			{#each TOOLS as tool (tool.href)}
				<dt><a href={resolve(tool.href)}>{tool.name}</a></dt>
				<dd>{tool.summary}</dd>
			{/each}
		</dl>
	</section>
</div>

<style>
	.lede {
		font-size: var(--step-1);
		line-height: 1.5;
		color: var(--muted);
	}

	.stage {
		display: grid;
		gap: var(--space-4);
		margin: var(--space-5) 0 var(--space-6);
		padding: var(--space-4);
		border: 1px solid var(--rule);
		border-top: 4px solid var(--layer);
		border-radius: 0 0 var(--radius) var(--radius);
		background: var(--surface);
	}

	.stage-name {
		margin: 0;
		color: var(--layer);
		font-size: var(--step-3);
		font-weight: 800;
		line-height: 1.1;
		letter-spacing: -0.02em;
	}

	.unset {
		border-top-color: var(--rule);
	}

	.unset .stage-name {
		color: var(--ink);
	}

	.stage-meta {
		margin: calc(-1 * var(--space-3)) 0 0;
		color: var(--muted);
	}

	.stage .button {
		justify-self: start;
	}

	.reading {
		margin: 0 0 var(--space-4);
		padding: 0 0 0 var(--space-4);
		border-left: 3px solid var(--layer);
		list-style: none;
	}

	.reading li + li {
		margin-top: var(--space-3);
	}

	.reading a {
		font-weight: 720;
		font-size: var(--step-1);
	}

	.reading p {
		margin: var(--space-1) 0 0;
		color: var(--muted);
	}

	.tools {
		margin: 0;
	}

	.tools dt {
		margin-top: var(--space-2);
		font-weight: 720;
	}

	.tools dt a {
		display: inline-block;
		padding: 0.55rem 0;
	}

	.tools dd {
		margin: 0;
		color: var(--muted);
	}
</style>
