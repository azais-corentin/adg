<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Save import — adg</title>
	<meta
		name="description"
		content="Paste an export from Options, Save & Load. adg decodes it on your phone, never on a server, and detects your stage."
	/>
</svelte:head>

<div class="page">
	<p><a href={resolve('/tools')}>All tools</a></p>
	<h1>Save import</h1>
	<p>
		Paste an export from Options, Save & Load. adg decodes it on your phone, never on a server, and
		detects your stage.
	</p>
	<p class="muted">
		This tool is not built yet. Until the importer is ready, pick your stage by hand on the home
		page.
	</p>
	<p><a class="button" href={resolve('/')}>Back to the home page</a></p>
</div>
