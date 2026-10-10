<script lang="ts">
	import { resolve } from '$app/paths';
	import { groupArticles, MILESTONE_NAMES } from '#lib/content/index.ts';
	import { layerStyle } from '#lib/components/stage-colors.ts';
	import { progress } from '#lib/progress.svelte.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const articleGroups = $derived(groupArticles(data.articles));

	const current = $derived(progress.ready ? progress.stage : null);
</script>

<svelte:head>
	<title>Guide — adg</title>
	<meta name="description" content="Every adg article, in game order, grouped by stage." />
</svelte:head>

<div class="page">
	<h1>Guide</h1>
	<p class="muted">Articles in the order you reach them in the game, grouped by stage.</p>
	<form class="find" role="search" method="get" action={resolve('/search')}>
		<label for="guide-q">Search the guide</label>
		<div>
			<input
				id="guide-q"
				name="q"
				type="search"
				enterkeyhint="search"
				autocomplete="off"
				autocapitalize="off"
				spellcheck="false"
				placeholder="DILR, Decoherence, EC4…"
			/>
			<button class="button" type="submit">Search</button>
		</div>
	</form>

	{#each articleGroups as group (group.milestone)}
		<section aria-labelledby="milestone-{group.milestone}">
			<h2 id="milestone-{group.milestone}">{MILESTONE_NAMES[group.milestone]}</h2>
			{#each group.stages as { stage, articles } (stage.id)}
				<section class="stage" style={layerStyle(stage.id)} aria-labelledby="stage-{stage.id}">
					<h3 id="stage-{stage.id}">
						{stage.name}
						{#if current === stage.id}<span class="here">Your stage</span>{/if}
					</h3>
					<ol>
						{#each articles as article (article.slug)}
							<li>
								<a href={resolve('/guide/[...slug]', { slug: article.slug })}>{article.title}</a>
								<p>{article.summary}</p>
							</li>
						{/each}
					</ol>
				</section>
			{/each}
		</section>
	{/each}
</div>

<style>
	.find {
		display: grid;
		gap: var(--space-1);
		margin-bottom: var(--space-5);
	}

	.find label {
		font-weight: 650;
	}

	.find div {
		display: flex;
		gap: var(--space-2);
	}

	.find input {
		flex: 1;
		min-width: 0;
		min-height: var(--tap);
		padding: var(--space-2) var(--space-3);
		border: 1.5px solid var(--rule);
		border-radius: var(--radius);
		background: var(--surface);
		color: var(--ink);
		font-size: var(--step-0);
	}

	.find input:hover,
	.find input:focus {
		border-color: var(--layer);
	}

	.stage {
		padding: 0 0 var(--space-2) var(--space-4);
		border-left: 4px solid var(--layer);
	}

	.stage + .stage {
		padding-top: var(--space-2);
	}

	h3 {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--space-2);
		margin: 0 0 var(--space-2);
		padding-top: var(--space-3);
		color: var(--layer);
	}

	.here {
		padding: 0 var(--space-2);
		border-radius: var(--radius);
		background: var(--layer);
		color: var(--paper);
		font-size: var(--step--1);
		font-weight: 720;
		letter-spacing: 0;
	}

	ol {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li + li {
		margin-top: var(--space-3);
	}

	a {
		display: inline-block;
		padding: 0.55rem 0;
		font-weight: 720;
	}

	li p {
		margin: 0;
		color: var(--muted);
	}
</style>
