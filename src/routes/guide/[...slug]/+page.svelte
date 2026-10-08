<script lang="ts">
	import { resolve } from '$app/paths';
	import { layerStyle } from '#lib/components/stage-colors.ts';
	import { getStage } from '#lib/stages.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const article = $derived(data.article);
	const Article = $derived(data.component);
	const stage = $derived(getStage(article.stage));
	const upstreamUrl = $derived(
		`https://github.com/IvarK/AntimatterDimensionsSourceCode/tree/${article.verified.upstream}`
	);
</script>

<svelte:head>
	<title>{article.title} — adg</title>
	<meta name="description" content={article.summary} />
</svelte:head>

{#snippet toc()}
	<ol>
		{#each article.headings as heading (heading.id)}
			<li><a href="#{heading.id}">{heading.text}</a></li>
		{/each}
	</ol>
{/snippet}

<div class="layout" style={layerStyle(article.stage)}>
	<article class="page">
		<header>
			<p class="stage"><a href="{resolve('/guide')}#stage-{article.stage}">{stage.name}</a></p>
			<h1>{article.title}</h1>
			<p class="summary">{article.summary}</p>
			<p class="stamp">
				Checked against Android {article.verified.android} and the game's source at
				<a href={upstreamUrl}><code>{article.verified.upstream.slice(0, 7)}</code></a>.
			</p>
		</header>

		{#if article.headings.length > 0}
			<details class="toc-inline">
				<summary>On this page</summary>
				<nav aria-label="On this page">{@render toc()}</nav>
			</details>
		{/if}

		<div class="prose">
			<Article />
		</div>

		<nav class="pager" aria-label="More articles">
			{#if data.prev}
				<a class="prev" rel="prev" href={resolve('/guide/[...slug]', { slug: data.prev.slug })}>
					<span>Previous</span>
					{data.prev.title}
				</a>
			{/if}
			{#if data.next}
				<a class="next" rel="next" href={resolve('/guide/[...slug]', { slug: data.next.slug })}>
					<span>Next</span>
					{data.next.title}
				</a>
			{/if}
		</nav>
	</article>

	{#if article.headings.length > 0}
		<aside class="toc-rail">
			<p>On this page</p>
			<nav aria-label="On this page">{@render toc()}</nav>
		</aside>
	{/if}
</div>

<style>
	.stage {
		margin: 0 0 var(--space-2);
		font-weight: 720;
	}

	.stage a {
		color: var(--layer);
		text-decoration: none;
	}

	.summary {
		font-size: var(--step-1);
		line-height: 1.5;
		color: var(--muted);
	}

	.stamp {
		padding-top: var(--space-3);
		border-top: 1px solid var(--rule);
		color: var(--muted);
		font-size: var(--step--1);
	}

	.toc-inline {
		margin: 0 0 var(--space-5);
		border: 1px solid var(--rule);
		border-radius: var(--radius);
		background: var(--surface);
	}

	.toc-inline summary {
		display: flex;
		align-items: center;
		min-height: var(--tap);
		padding: 0 var(--space-4);
		font-weight: 650;
		cursor: pointer;
	}

	.toc-inline nav {
		padding: 0 var(--space-4) var(--space-3);
	}

	ol {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	ol li {
		margin: 0;
	}

	ol a {
		display: block;
		padding: 0.65rem 0;
		line-height: 1.35;
		text-decoration: none;
	}

	ol a:hover {
		text-decoration: underline;
		text-decoration-color: var(--layer);
	}

	.toc-rail {
		display: none;
	}

	.prose :global(h2) {
		padding-top: var(--space-4);
		border-top: 1px solid var(--rule);
	}

	.prose :global(img) {
		max-width: 100%;
	}

	.pager {
		display: grid;
		gap: var(--space-3);
		margin-top: var(--space-6);
	}

	.pager a {
		display: grid;
		gap: 2px;
		padding: var(--space-3) var(--space-4);
		border: 1px solid var(--rule);
		border-radius: var(--radius);
		background: var(--surface);
		font-weight: 720;
		text-decoration: none;
	}

	.pager a:hover {
		border-color: var(--layer);
	}

	.pager span {
		color: var(--muted);
		font-size: var(--step--1);
		font-weight: 500;
	}

	.next {
		text-align: right;
	}

	@media (min-width: 40rem) {
		.pager {
			grid-template-columns: 1fr 1fr;
		}

		.next {
			grid-column: 2;
		}
	}

	@media (min-width: 80rem) {
		.layout {
			display: grid;
			grid-template-columns: var(--measure) 13rem;
			gap: var(--space-6);
			align-items: start;
		}

		.toc-inline {
			display: none;
		}

		.toc-rail {
			display: block;
			position: sticky;
			top: calc(var(--header-h) + var(--space-6));
			padding-left: var(--space-4);
			border-left: 1px solid var(--rule);
			font-size: var(--step--1);
		}

		.toc-rail p {
			margin: 0 0 var(--space-1);
			color: var(--muted);
			font-weight: 650;
		}

		.toc-rail ol a {
			padding: var(--space-1) 0;
		}
	}
</style>
