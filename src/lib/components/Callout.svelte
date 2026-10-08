<!--
@component
Boxed aside inside an article.
`kind`: `note` (default), `tip`, `warning`, or `android` for behaviour specific to the
Android app. In Markdown, leave blank lines around the content so it is parsed as Markdown.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	type Kind = 'note' | 'tip' | 'warning' | 'android';

	let {
		kind = 'note',
		title,
		children
	}: { kind?: Kind; title?: string; children: Snippet } = $props();

	const DEFAULT_TITLE: Record<Kind, string> = {
		note: 'Note',
		tip: 'Tip',
		warning: 'Warning',
		android: 'On Android'
	};
	const heading = $derived(title ?? DEFAULT_TITLE[kind]);
</script>

<aside class="callout {kind}" aria-label={heading}>
	<p class="heading">
		<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
			{#if kind === 'tip'}
				<path
					d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linejoin="round"
				/>
			{:else if kind === 'warning'}
				<path
					d="M12 3 2 20h20L12 3Z"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linejoin="round"
				/>
				<path
					d="M12 10v4.5M12 17v.5"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
				/>
			{:else if kind === 'android'}
				<rect
					x="6"
					y="2.5"
					width="12"
					height="19"
					rx="2.5"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				/>
				<path d="M10.5 18.5h3" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
			{:else}
				<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" />
				<path
					d="M12 11v6M12 7.5v.5"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
				/>
			{/if}
		</svg>
		{heading}
	</p>
	<div class="body">
		{@render children()}
	</div>
</aside>

<style>
	.callout {
		--tone: var(--muted);
		margin: var(--space-5) 0;
		padding: var(--space-3) var(--space-4);
		border-left: 4px solid var(--tone);
		border-radius: 0 var(--radius) var(--radius) 0;
		background: color-mix(in srgb, var(--tone) 7%, var(--surface));
	}

	.tip {
		--tone: light-dark(#17708a, #5cc3dd);
	}

	.warning {
		--tone: light-dark(#a35400, #f0a43c);
	}

	/* The pink of the game's own Android tab indicator. */
	.android {
		--tone: light-dark(#b81d5b, #f0679a);
	}

	.heading {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin: 0 0 var(--space-1);
		color: var(--tone);
		font-weight: 720;
	}

	.body > :global(:last-child) {
		margin-bottom: 0;
	}
</style>
