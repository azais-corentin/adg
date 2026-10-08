<script lang="ts">
	import { onMount } from 'svelte';

	type Theme = 'system' | 'light' | 'dark';
	const KEY = 'adg:theme';
	const NEXT: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' };
	const LABEL: Record<Theme, string> = {
		system: 'Theme: follows your device',
		light: 'Theme: light',
		dark: 'Theme: dark'
	};

	let theme = $state<Theme>('system');

	onMount(() => {
		const saved = document.documentElement.dataset.theme;
		theme = saved === 'light' || saved === 'dark' ? saved : 'system';
	});

	function cycle() {
		theme = NEXT[theme];
		const root = document.documentElement;
		try {
			if (theme === 'system') localStorage.removeItem(KEY);
			else localStorage.setItem(KEY, theme);
		} catch {
			// Storage unavailable: the choice lasts for this visit.
		}
		if (theme === 'system') delete root.dataset.theme;
		else root.dataset.theme = theme;
	}
</script>

<button class="toggle" type="button" onclick={cycle} aria-label={LABEL[theme]} title={LABEL[theme]}>
	<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
		{#if theme === 'light'}
			<circle cx="12" cy="12" r="4.5" fill="currentColor" />
			<g stroke="currentColor" stroke-width="2" stroke-linecap="round">
				<path
					d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"
				/>
			</g>
		{:else if theme === 'dark'}
			<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" fill="currentColor" />
		{:else}
			<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2" />
			<path d="M12 3.5a8.5 8.5 0 0 1 0 17Z" fill="currentColor" />
		{/if}
	</svg>
</button>

<style>
	.toggle {
		display: grid;
		place-items: center;
		width: var(--tap);
		height: var(--tap);
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: none;
		color: var(--ink);
		cursor: pointer;
	}

	.toggle:hover {
		background: var(--surface-sunk);
	}
</style>
