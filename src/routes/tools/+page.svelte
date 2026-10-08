<script lang="ts">
	import { resolve } from '$app/paths';
	import { TOOLS } from '#lib/content/tools.ts';
</script>

<svelte:head>
	<title>Tools — adg</title>
	<meta
		name="description"
		content="Save import, checklists and planners for Antimatter Dimensions on Android."
	/>
</svelte:head>

<div class="page">
	<h1>Tools</h1>
	<p class="muted">They all run in your browser and keep what you enter on this device.</p>
	<ul>
		{#each TOOLS as tool (tool.href)}
			<li>
				<a href={resolve(tool.href)}>{tool.name}</a>
				<p>{tool.summary}</p>
			</li>
		{/each}
	</ul>
</div>

<style>
	ul {
		margin: var(--space-5) 0 0;
		padding: 0;
		list-style: none;
	}

	li {
		padding: var(--space-3) 0;
		border-top: 1px solid var(--rule);
	}

	li + li {
		margin: 0;
	}

	a {
		display: inline-block;
		padding: 0.4rem 0;
		font-size: var(--step-1);
		font-weight: 720;
	}

	li p {
		margin: 0;
		color: var(--muted);
	}
</style>
