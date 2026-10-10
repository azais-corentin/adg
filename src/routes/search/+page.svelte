<script lang="ts">
	import { onMount } from 'svelte';
	import { replaceState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import {
		prepareIndex,
		search,
		type PreparedIndex,
		type SearchIndex,
		type SearchResult
	} from '#lib/search/search.ts';

	const LIMIT = 30;

	let query = $state('');
	let index = $state.raw<PreparedIndex | null>(null);
	let failed = $state(false);
	let input: HTMLInputElement | undefined = $state();

	onMount(() => {
		// Read here, not in a load: the page is prerendered without a query.
		query = new URL(location.href).searchParams.get('q') ?? '';
		input?.focus();
		fetch(resolve('/search-index.json'))
			.then((response) => {
				if (!response.ok) throw new Error(`HTTP ${response.status}`);
				return response.json() as Promise<SearchIndex>;
			})
			.then((loaded) => (index = prepareIndex(loaded)))
			.catch(() => (failed = true));
	});

	const found = $derived(
		index && query.trim() ? search(index, query, LIMIT) : { total: 0, results: [] }
	);

	// Keep the query in the address, so Back from a result returns to the same list.
	$effect(() => {
		const url = new URL(location.href);
		const q = query.trim();
		if ((url.searchParams.get('q') ?? '') === q) return;
		if (q) url.searchParams.set('q', q);
		else url.searchParams.delete('q');
		replaceState(url, {});
	});

	const href = (result: SearchResult) =>
		`${resolve('/guide/[...slug]', { slug: result.slug })}${result.id ? `#${result.id}` : ''}`;
</script>

<svelte:head>
	<title>Search — adg</title>
	<meta
		name="description"
		content="Search every adg article, and game names like perks, Reality Upgrades and Ra memory levels."
	/>
</svelte:head>

<div class="page">
	<h1>Search</h1>
	<form role="search" onsubmit={(e) => e.preventDefault()}>
		<label for="search-q">Search the guide</label>
		<input
			id="search-q"
			type="search"
			bind:this={input}
			bind:value={query}
			enterkeyhint="search"
			autocomplete="off"
			autocapitalize="off"
			spellcheck="false"
			placeholder="DILR, Decoherence, EC4…"
		/>
	</form>

	<p class="status" role="status">
		{#if failed}
			The search index could not load. Check your connection; after one visit, search works offline.
		{:else if !query.trim()}
			Searches the titles, headings and text of every article, plus game names: perk labels like
			DILR, Reality and Imaginary Upgrades, and Ra memory levels like "Effarig level 10".
		{:else if !index}
			Loading the search index…
		{:else if found.total === 0}
			No results for “{query.trim()}”. Try fewer or shorter words.
		{:else}
			{found.total === 1 ? '1 result' : `${found.total} results`}{#if found.total > LIMIT}, showing
				the best {LIMIT}{/if}.
		{/if}
	</p>

	{#if found.results.length > 0}
		<ol class="results">
			{#each found.results as result, i (i)}
				<li>
					<a href={href(result)}>
						<span class="where">{result.title}</span>
						<span class="what">
							{#if result.kind}<span class="kind">{result.kind}</span>{/if}
							{result.heading || 'Top of the article'}
						</span>
						<span class="snippet">
							{#each result.snippet as piece, j (j)}{#if piece.mark}<mark>{piece.text}</mark
									>{:else}{piece.text}{/if}{/each}
						</span>
					</a>
				</li>
			{/each}
		</ol>
	{/if}
</div>

<style>
	form {
		display: grid;
		gap: var(--space-1);
	}

	label {
		font-weight: 650;
	}

	input {
		width: 100%;
		min-height: var(--tap);
		padding: var(--space-2) var(--space-3);
		border: 1.5px solid var(--rule);
		border-radius: var(--radius);
		background: var(--surface);
		color: var(--ink);
		font-size: var(--step-0);
	}

	input:hover,
	input:focus {
		border-color: var(--layer);
	}

	.status {
		min-height: 1.6em;
		margin: var(--space-3) 0;
		color: var(--muted);
		font-size: var(--step--1);
	}

	.results {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.results li + li {
		border-top: 1px solid var(--rule);
	}

	.results a {
		display: grid;
		gap: var(--space-1);
		padding: var(--space-3) 0;
		color: var(--ink);
		text-decoration: none;
	}

	.results a:hover .what,
	.results a:focus-visible .what {
		text-decoration: underline;
		text-decoration-color: var(--layer);
		text-decoration-thickness: 2px;
	}

	.where {
		color: var(--muted);
		font-size: var(--step--1);
	}

	.what {
		font-weight: 720;
	}

	.kind {
		margin-right: var(--space-1);
		padding: 0 var(--space-2);
		border: 1px solid var(--rule);
		border-radius: 999px;
		color: var(--muted);
		font-size: var(--step--1);
		font-weight: 500;
	}

	.snippet {
		font-size: var(--step--1);
		line-height: 1.5;
	}

	mark {
		background: color-mix(in srgb, var(--layer) 25%, transparent);
		color: inherit;
		border-radius: 2px;
	}
</style>
