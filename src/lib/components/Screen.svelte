<!--
@component
Screenshot from the Android app, served from `static/screens/`.
`src` is relative to `/screens/`, e.g. `early-eternity/options-save-load.webp`.
`width`/`height` default to the phone capture size (960×2142) and reserve space before
the image loads. Tapping the image opens it full size.
-->
<script lang="ts">
	import { asset } from '$app/paths';
	import type { AssetPath } from '$app/types';

	let {
		src,
		alt,
		caption,
		width = 960,
		height = 2142
	}: { src: string; alt: string; caption?: string; width?: number; height?: number } = $props();

	// Paths come from article Markdown, which isn't type-checked; the e2e crawl checks they load.
	const url = $derived(asset(`/screens/${src}` as AssetPath));
</script>

<figure class="screen">
	<a href={url} aria-label="Open full-size screenshot: {alt}">
		<img src={url} {alt} {width} {height} loading="lazy" decoding="async" />
	</a>
	{#if caption}
		<figcaption>{caption}</figcaption>
	{/if}
</figure>

<style>
	.screen {
		margin: var(--space-5) 0;
	}

	a {
		display: block;
		width: min(100%, 15.5rem);
	}

	img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 14px;
		border: 1px solid var(--rule);
		background: #000;
	}

	figcaption {
		max-width: 24rem;
		margin-top: var(--space-2);
		color: var(--muted);
		font-size: var(--step--1);
		line-height: 1.45;
	}
</style>
