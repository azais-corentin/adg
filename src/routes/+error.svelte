<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { ArticleMeta } from '#lib/content/index.ts';
	import { TOOLS } from '#lib/content/tools.ts';

	const notFound = $derived(page.status === 404);
	const lastSegment = $derived(page.url.pathname.split('/').findLast(Boolean) ?? '');

	// A stale or hand-typed link usually still ends with the right name
	// (/tools/import, /guide/first-eternity), so offer the page that ends with it.
	const suggestion = $derived.by(() => {
		if (!notFound || lastSegment === '') return undefined;
		const tool = TOOLS.find((t) => t.href.split('/').at(-1) === lastSegment);
		if (tool) return { href: resolve(tool.href), name: tool.name };
		const articles: readonly ArticleMeta[] = page.data.articles ?? [];
		const article = articles.find((a) => a.slug.split('/').at(-1) === lastSegment);
		if (article) {
			return { href: resolve('/guide/[...slug]', { slug: article.slug }), name: article.title };
		}
		return undefined;
	});
</script>

<svelte:head>
	<title>{notFound ? 'Page not found' : 'Error'} — adg</title>
</svelte:head>

<div class="page">
	{#if notFound}
		<h1>Page not found</h1>
		<p>There is no page at <code>{page.url.pathname}</code>.</p>
		{#if suggestion}
			<p>Did you mean <a href={suggestion.href}>{suggestion.name}</a>?</p>
		{/if}
	{:else}
		<h1>Something went wrong</h1>
		<p>{page.error?.message ?? `Error ${page.status}`}</p>
	{/if}

	<ul>
		<li><a href={resolve('/guide')}>Guide</a>: every article, in game order.</li>
		<li><a href={resolve('/tools')}>Tools</a>: save import, checklists and planners.</li>
		<li><a href={resolve('/import')}>Save import</a>: find your stage and next goals.</li>
		<li><a href={resolve('/')}>Home</a></li>
	</ul>
</div>

<style>
	ul {
		margin: var(--space-5) 0 0;
		padding: 0;
		list-style: none;
	}

	li {
		padding: var(--space-2) 0;
		border-top: 1px solid var(--rule);
		color: var(--muted);
	}

	a {
		display: inline-block;
		padding: 0.4rem 0;
		font-weight: 720;
	}
</style>
