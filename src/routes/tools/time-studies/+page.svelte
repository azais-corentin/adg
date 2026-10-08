<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Time Study planner — adg</title>
	<meta
		name="description"
		content="Plan a Time Study tree and copy it as a string you can paste into the game's Time Study import."
	/>
</svelte:head>

<div class="page">
	<p><a href={resolve('/tools')}>All tools</a></p>
	<h1>Time Study planner</h1>
	<p>
		Plan a Time Study tree and copy it as a string you can paste into the game's Time Study import.
	</p>
	<p class="muted">This tool is not built yet.</p>
	<p><a class="button" href={resolve('/')}>Back to the home page</a></p>
</div>
