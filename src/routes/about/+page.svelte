<script lang="ts">
	import { resolve } from '$app/paths';

	const UPSTREAM_SHA = '5409e320cecef96a917cca1dfb68f1f183e499ca';
</script>

<svelte:head>
	<title>About — adg</title>
	<meta
		name="description"
		content="What adg is, who made the game, and what happens to your save."
	/>
</svelte:head>

<div class="page">
	<h1>About adg</h1>
	<p>
		adg is an unofficial, fan-made guide to Antimatter Dimensions on Android. It is not affiliated
		with or endorsed by the game's developers or the Android app's publisher.
	</p>

	<h2>Which version it covers</h2>
	<p>
		The guide is written for the Android app <strong>version 3.18.0</strong>
		(<code>kajfosz.antimatterdimensions</code>). Screens come from that version. Mechanics are
		checked against the game's open web source at commit
		<a href="https://github.com/IvarK/AntimatterDimensionsSourceCode/tree/{UPSTREAM_SHA}"
			><code>{UPSTREAM_SHA.slice(0, 7)}</code></a
		>. Each article says which versions it was last checked against, so you can tell when it may be
		out of date.
	</p>

	<h2>Privacy</h2>
	<p>
		Your save never leaves your device. When you import it, adg decodes it in your browser and keeps
		only your stage, checklist ticks and planner state, in this browser's local storage. There are
		no accounts, no analytics and no server that receives your data.
	</p>
	<p>To remove everything adg stored, clear this site's data in your browser settings.</p>

	<h2>Credits</h2>
	<ul>
		<li>
			Antimatter Dimensions is made by IvarK and its contributors. The web source is
			<a href="https://github.com/IvarK/AntimatterDimensionsSourceCode">published on GitHub</a>
			under the MIT license, © 2017 IvarK. adg's game data and save decoding are derived from it.
		</li>
		<li>The Android app is published by Jakub Kajfosz.</li>
		<li>
			Text set in Atkinson Hyperlegible Next and Mono by the Braille Institute, under the SIL Open
			Font License.
		</li>
	</ul>

	<h2>Source</h2>
	<p>
		adg is open source under the MIT license:
		<a href="https://github.com/azais-corentin/adg">azais-corentin/adg</a>. Found a mistake? Open an
		issue there.
	</p>

	<p><a href={resolve('/guide')}>Read the guide</a></p>
</div>
