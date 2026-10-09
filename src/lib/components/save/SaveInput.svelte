<!--
@component
The two ways to hand adg a save: paste its text (copied by the game's Export button), or pick the exported `.txt` file. Decodes
in the browser and stores the result with `progress.setImported`; calls `onimported` after.
-->
<script lang="ts">
	import { progress } from '#lib/progress.svelte.ts';
	import {
		importSave,
		MAX_SAVE_LENGTH,
		SaveDecodeError,
		type SaveDecodeErrorCode
	} from '#lib/save/index.ts';

	let { onimported }: { onimported?: () => void } = $props();

	const id = $props.id();
	let text = $state('');
	let busy = $state(false);
	let error = $state<string | null>(null);

	const FILE_HINT =
		'Export it to a file instead (hold Share save, then Export to web/steam) and pick that file with Choose the save file.';

	const MESSAGES: Record<SaveDecodeErrorCode, string> = {
		empty: 'There is nothing to read yet. Pick the exported file or paste the save text first.',
		'too-large': 'This is far larger than any save. Check that you picked the exported save file.',
		'unknown-envelope':
			'This is not an Antimatter Dimensions save. A save starts with "AntimatterDimensions" and ends with "EndOfSavefile".',
		'unsupported-version': 'This save uses a format version adg does not know yet.',
		truncated: `The save is cut off: the end is missing. Chat and notes apps often shorten long text. ${FILE_HINT}`,
		corrupt: `The save is damaged and cannot be read. ${FILE_HINT}`,
		'not-a-player': 'This decodes, but it is not a game save.'
	};

	async function read(input: string) {
		busy = true;
		error = null;
		try {
			progress.setImported(await importSave(input));
			text = '';
			onimported?.();
		} catch (cause) {
			if (!(cause instanceof SaveDecodeError)) {
				error = 'Something went wrong while reading this save.';
				throw cause;
			}
			error = MESSAGES[cause.code];
		} finally {
			busy = false;
		}
	}

	async function pickFile(event: Event & { currentTarget: HTMLInputElement }) {
		const input = event.currentTarget;
		const file = input.files?.[0];
		// Clear the input so picking the same file again still fires `change`.
		input.value = '';
		if (!file) return;
		if (file.size > MAX_SAVE_LENGTH) {
			error = MESSAGES['too-large'];
			return;
		}
		await read(await file.text());
	}

	function submit(event: SubmitEvent) {
		event.preventDefault();
		void read(text);
	}
</script>

<div class="save-input">
	<form onsubmit={submit}>
		<label for="{id}-text">Paste the save text</label>
		<textarea
			id="{id}-text"
			bind:value={text}
			rows="4"
			placeholder="AntimatterDimensionsSavefileFormat…EndOfSavefile"
			autocomplete="off"
			autocapitalize="off"
			spellcheck="false"></textarea>
		<button class="button" type="submit" disabled={busy}>Read pasted save</button>
	</form>

	<p class="or" aria-hidden="true">or</p>

	<label class="button file" class:busy>
		<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
			<path d="M14 3H6v18h12V7z M14 3v4h4 M9 13h6 M9 17h6" />
		</svg>
		Choose the save file
		<input
			class="visually-hidden"
			type="file"
			accept=".txt,text/plain"
			disabled={busy}
			onchange={pickFile}
		/>
	</label>

	<div aria-live="polite">
		{#if busy}
			<p class="muted">Reading the save…</p>
		{:else if error}
			<p class="error" role="alert">{error}</p>
		{/if}
	</div>
</div>

<style>
	.save-input {
		display: grid;
		gap: var(--space-3);
	}

	.file {
		justify-self: start;
		position: relative;
	}

	.file:focus-within {
		outline: 3px solid var(--focus);
		outline-offset: 2px;
	}

	.busy {
		opacity: 0.6;
		cursor: progress;
	}

	svg {
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linejoin: round;
	}

	.or {
		margin: 0;
		color: var(--muted);
		font-size: var(--step--1);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	form {
		display: grid;
		gap: var(--space-2);
	}

	form label {
		font-weight: 650;
	}

	textarea {
		width: 100%;
		min-height: 6rem;
		padding: var(--space-2) var(--space-3);
		border: 1.5px solid var(--rule);
		border-radius: var(--radius);
		background: var(--surface);
		color: var(--ink);
		font-family: var(--font-mono);
		font-size: var(--step--1);
		word-break: break-all;
		resize: vertical;
	}

	textarea:hover {
		border-color: var(--layer);
	}

	form .button {
		justify-self: start;
	}

	.error {
		margin: 0;
		padding: var(--space-3);
		border-left: 4px solid var(--layer-pelle);
		border-radius: 0 var(--radius) var(--radius) 0;
		background: color-mix(in srgb, var(--layer-pelle) 10%, var(--surface));
	}
</style>
