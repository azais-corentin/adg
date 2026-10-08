<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Eternity Challenge planner — adg</title>
	<meta
		name="description"
		content="Plan which Eternity Challenge to run next and how many completions to aim for at your Eternity Points."
	/>
</svelte:head>

<div class="page">
	<p><a href={resolve('/tools')}>All tools</a></p>
	<h1>Eternity Challenge planner</h1>
	<p>
		Plan which Eternity Challenge to run next and how many completions to aim for at your Eternity
		Points.
	</p>
	<p class="muted">This tool is not built yet.</p>
	<p><a class="button" href={resolve('/')}>Back to the home page</a></p>
</div>
