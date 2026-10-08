<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import favicon from '#lib/assets/favicon.svg';
	import { groupArticles, MILESTONE_NAMES } from '#lib/content/index.ts';
	import ThemeToggle from '#lib/components/ThemeToggle.svelte';
	import { layerStyle } from '#lib/components/stage-colors.ts';
	import { progress } from '#lib/progress.svelte.ts';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();

	const articleGroups = $derived(groupArticles(data.articles));

	onMount(() => progress.init());

	const NAV = [
		{ href: resolve('/'), label: 'Home', match: ['/'] },
		{ href: resolve('/guide'), label: 'Guide', match: ['/guide'] },
		{ href: resolve('/tools'), label: 'Tools', match: ['/tools', '/import', '/checklists'] },
		{ href: resolve('/about'), label: 'About', match: ['/about'] }
	] as const;

	const path = $derived(page.url.pathname);
	const isCurrent = (match: readonly string[]) =>
		match.some((m) => (m === '/' ? path === '/' : path === m || path.startsWith(`${m}/`)));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#snippet icon(label: string)}
	<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
		{#if label === 'Home'}
			<path
				d="M4 10.5 12 4l8 6.5V20h-5.5v-5.5h-5V20H4z"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linejoin="round"
			/>
		{:else if label === 'Guide'}
			<path
				d="M4 5.5C6.5 4 9.5 4 12 5.5v14C9.5 18 6.5 18 4 19.5zM20 5.5C17.5 4 14.5 4 12 5.5v14c2.5-1.5 5.5-1.5 8 0z"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linejoin="round"
			/>
		{:else if label === 'Tools'}
			<path
				d="M14.5 6.5a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3l7.5-7.5a4 4 0 0 1-2-2Z M14.5 6.5 17 4l3 3-2.5 2.5"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linejoin="round"
			/>
		{:else}
			<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2" />
			<path
				d="M12 11v5.5M12 7.5v.5"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
			/>
		{/if}
	</svg>
{/snippet}

<div class="shell" style={layerStyle(progress.ready ? progress.stage : null)}>
	<a class="skip" href="#content">Skip to content</a>

	<header class="site-header">
		<a class="brand" href={resolve('/')}>
			<span class="brand-short">adg</span>
			<span class="brand-long">— Antimatter Dimensions Guide</span>
		</a>
		<ThemeToggle />
	</header>

	<aside class="sidebar" aria-label="Site">
		<nav aria-label="Main">
			<ul class="side-main">
				{#each NAV as item (item.label)}
					<li>
						<a href={item.href} aria-current={isCurrent(item.match) ? 'page' : undefined}>
							{@render icon(item.label)}
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
		<nav class="side-guide" aria-label="Guide contents">
			{#each articleGroups as group (group.milestone)}
				<p class="side-milestone">{MILESTONE_NAMES[group.milestone]}</p>
				{#each group.stages as { stage, articles } (stage.id)}
					<div class="side-stage" style={layerStyle(stage.id)}>
						<p class="side-stage-name">{stage.name}</p>
						<ul>
							{#each articles as article (article.slug)}
								{@const href = resolve('/guide/[...slug]', { slug: article.slug })}
								<li>
									<a {href} aria-current={path === href ? 'page' : undefined}>{article.title}</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			{/each}
		</nav>
	</aside>

	<main id="content">
		{@render children()}
	</main>

	<footer class="site-footer">
		<p>
			An unofficial fan guide, not affiliated with the developers of Antimatter Dimensions. Written
			for the Android app, version 3.18.0.
		</p>
		<p><a href={resolve('/about')}>About, credits and privacy</a></p>
	</footer>

	<nav class="tabbar" aria-label="Main">
		{#each NAV as item (item.label)}
			<a href={item.href} aria-current={isCurrent(item.match) ? 'page' : undefined}>
				{@render icon(item.label)}
				<span>{item.label}</span>
			</a>
		{/each}
	</nav>
</div>

<style>
	.shell {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-template-areas: 'header' 'main' 'footer';
		grid-template-rows: auto 1fr auto;
		min-height: 100dvh;
	}

	.skip {
		position: absolute;
		left: var(--space-2);
		top: -4rem;
		z-index: 20;
		padding: var(--space-2) var(--space-3);
		background: var(--surface);
	}

	.skip:focus {
		top: var(--space-2);
	}

	.site-header {
		grid-area: header;
		position: sticky;
		top: 0;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
		height: var(--header-h);
		padding: 0 var(--space-1) 0 var(--space-4);
		padding-top: env(safe-area-inset-top);
		box-sizing: content-box;
		background: color-mix(in srgb, var(--paper) 88%, transparent);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--rule);
	}

	.brand {
		display: flex;
		align-items: baseline;
		gap: 0.4em;
		min-width: 0;
		min-height: var(--tap);
		align-content: center;
		flex-wrap: wrap;
		line-height: var(--tap);
		text-decoration: none;
		white-space: nowrap;
		overflow: hidden;
	}

	.brand-short {
		font-weight: 800;
		font-size: var(--step-1);
		letter-spacing: -0.02em;
	}

	.brand-long {
		color: var(--muted);
		font-size: var(--step--1);
		overflow: hidden;
		text-overflow: ellipsis;
	}

	main {
		grid-area: main;
		width: 100%;
		padding: var(--space-5) var(--space-4) var(--space-6);
		min-width: 0;
	}

	.site-footer {
		grid-area: footer;
		padding: var(--space-5) var(--space-4)
			calc(var(--tabbar-h) + var(--space-5) + env(safe-area-inset-bottom));
		border-top: 1px solid var(--rule);
		color: var(--muted);
		font-size: var(--step--1);
	}

	.site-footer p {
		max-width: var(--measure);
		margin-bottom: var(--space-2);
	}

	.sidebar {
		display: none;
	}

	/* Phones: a bottom tab bar, like the game's own navigation. */
	.tabbar {
		position: fixed;
		inset: auto 0 0;
		z-index: 10;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		height: calc(var(--tabbar-h) + env(safe-area-inset-bottom));
		padding-bottom: env(safe-area-inset-bottom);
		background: var(--surface);
		border-top: 1px solid var(--rule);
	}

	.tabbar a {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2px;
		color: var(--muted);
		font-size: 0.75rem;
		font-weight: 650;
		text-decoration: none;
	}

	.tabbar a[aria-current='page'] {
		color: var(--ink);
	}

	.tabbar a[aria-current='page']::after {
		content: '';
		position: absolute;
		bottom: 4px;
		width: 2rem;
		height: 3px;
		border-radius: 2px;
		background: var(--layer);
	}

	/* Wide screens: a sidebar with the main links and the guide's table of contents. */
	@media (min-width: 60rem) {
		.shell {
			grid-template-columns: 17rem minmax(0, 1fr);
			grid-template-areas: 'header header' 'sidebar main' 'sidebar footer';
			grid-template-rows: auto 1fr auto;
		}

		.tabbar {
			display: none;
		}

		.sidebar {
			grid-area: sidebar;
			display: block;
			position: sticky;
			top: calc(var(--header-h) + 1px);
			align-self: start;
			max-height: calc(100dvh - var(--header-h) - 1px);
			overflow-y: auto;
			padding: var(--space-4) var(--space-3) var(--space-6);
			border-right: 1px solid var(--rule);
			font-size: var(--step--1);
		}

		.sidebar ul {
			margin: 0;
			padding: 0;
			list-style: none;
		}

		.sidebar li {
			margin: 0;
		}

		.side-main a {
			display: flex;
			align-items: center;
			gap: var(--space-3);
			min-height: var(--tap);
			padding: 0 var(--space-3);
			border-radius: var(--radius);
			font-size: var(--step-0);
			font-weight: 650;
			text-decoration: none;
		}

		.side-main a:hover,
		.side-guide a:hover {
			background: var(--surface-sunk);
		}

		.side-main a[aria-current='page'] {
			background: var(--surface);
			box-shadow: inset 3px 0 0 var(--layer);
		}

		.side-guide {
			margin-top: var(--space-5);
			padding-top: var(--space-4);
			border-top: 1px solid var(--rule);
		}

		.side-milestone {
			margin: var(--space-4) var(--space-3) var(--space-2);
			color: var(--muted);
			font-weight: 650;
		}

		.side-stage {
			margin-left: var(--space-3);
			padding-left: var(--space-3);
			border-left: 3px solid var(--layer);
		}

		.side-stage-name {
			margin: 0;
			padding-top: var(--space-2);
			color: var(--layer);
			font-weight: 720;
		}

		.side-guide a {
			display: block;
			padding: var(--space-1) var(--space-2);
			margin-left: calc(-1 * var(--space-2));
			border-radius: var(--radius);
			line-height: 1.4;
			text-decoration: none;
		}

		.side-guide a[aria-current='page'] {
			font-weight: 720;
			text-decoration: underline;
			text-decoration-color: var(--layer);
		}

		main {
			padding: var(--space-6) var(--space-6) var(--space-6);
		}

		.site-footer {
			padding: var(--space-5) var(--space-6);
		}
	}
</style>
