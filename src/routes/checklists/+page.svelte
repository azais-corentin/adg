<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Milestone checklists — adg</title>
	<meta
		name="description"
		content="The goals of each stage, to tick off as you reach them. Your ticks are saved on this device."
	/>
</svelte:head>

<div class="page">
	<p><a href={resolve('/tools')}>All tools</a></p>
	<h1>Milestone checklists</h1>
	<p>
		The goals of each stage, to tick off as you reach them. Your ticks are saved on this device.
	</p>
	<p class="muted">This tool is not built yet.</p>
	<p><a class="button" href={resolve('/')}>Back to the home page</a></p>
</div>
