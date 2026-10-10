<script lang="ts">
	import { untrack } from 'svelte';
	import { replaceState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { progress } from '#lib/progress.svelte.ts';
	import { formatTheorems } from '#lib/save/bignum.ts';
	import { getStage } from '#lib/stages.ts';
	import TreeView from '#lib/tools/time-studies/TreeView.svelte';
	import { PRESETS } from '#lib/tools/time-studies/presets.ts';
	import {
		EMPTY_STATE,
		parsePlannerState,
		PLANNER_KEY,
		type PlannerState
	} from '#lib/tools/time-studies/state.ts';
	import { exportStudyString, importStudyString } from '#lib/tools/time-studies/study-string.ts';
	import {
		nodeLabel,
		requirementLines,
		stCostNote,
		studyDescription,
		studyTitle
	} from '#lib/tools/time-studies/text.ts';
	import {
		affordable,
		check,
		contextFromSave,
		DEFAULT_CONTEXT,
		dimensionPaths,
		evaluate,
		isSelected,
		laidOutTree,
		pacePaths,
		PERK,
		refCost,
		refKey,
		toggle,
		type Skipped,
		type TimeStudyRef,
		type Tree,
		type TreeContext
	} from '#lib/tools/time-studies/tree.ts';

	let plan = $state<PlannerState>(EMPTY_STATE);
	let loaded = $state(false);

	$effect(() => {
		progress.init();
		if (loaded || !progress.ready) return;
		plan = parsePlannerState(progress.planner[PLANNER_KEY]);
		loaded = true;
		// A tree shared by link (the EC planner's "Open in the Time Study planner").
		const shared = new URL(location.href).searchParams.get('tree');
		if (shared) {
			untrack(() => loadString(shared, 'Opened from the link'));
			replaceState(resolve('/tools/time-studies'), {});
		}
	});

	const save = $derived(progress.ready ? progress.save : null);
	const ctx = $derived(plan.context ?? (save ? contextFromSave(save) : DEFAULT_CONTEXT));
	const contextSource = $derived(
		plan.context ? 'set by you' : save ? 'from your imported save' : 'defaults'
	);
	const tree = $derived(evaluate(plan, ctx).tree);
	const laid = $derived(laidOutTree(ctx));

	/** Total Time Theorems to check the build against: set by hand, else the save's. */
	const budget = $derived(
		plan.budget ?? (save && Number.isFinite(save.totalTimeTheorems) ? save.totalTimeTheorems : null)
	);
	const left = $derived(budget === null ? [] : affordable(tree, ctx, budget).left);
	const leftLabels = $derived(
		left.length <= 6
			? left.map(nodeLabel).join(', ')
			: `${left.slice(0, 5).map(nodeLabel).join(', ')} and ${left.length - 5} more`
	);

	function setBudget(value: string) {
		const n = Math.floor(Number(value.replaceAll(',', '')));
		persist({ ...plan, budget: value.trim() === '' || !(n >= 0) ? null : n });
	}

	let mode = $state<'inspect' | 'select'>('inspect');
	let focused = $state<TimeStudyRef | null>(null);
	let status = $state('');

	function persist(next: PlannerState) {
		plan = next;
		progress.setPlannerState(PLANNER_KEY, $state.snapshot(plan));
	}

	function commit(next: Tree, extra: Partial<PlannerState> = {}) {
		persist({
			...plan,
			studies: [...next.studies],
			ec: next.ec,
			startEC: next.ec === 0 ? false : plan.startEC,
			...extra
		});
	}

	function toggleStudy(ref: TimeStudyRef) {
		const label = ref.kind === 'normal' ? `study ${nodeLabel(ref)}` : nodeLabel(ref);
		const removing = isSelected(tree, ref);
		const result = toggle(tree, ref, ctx);
		if (!result.ok) {
			status = `Can't add ${label}: ${result.reason}`;
			return;
		}
		commit(result.tree);
		const dropped = result.skipped.map((s) => nodeLabel(s.ref)).join(', ');
		if (!removing) status = `Added ${label} (+${formatTheorems(refCost(ref))} TT).`;
		else if (dropped) status = `Removed ${label}, and what needed it: ${dropped}.`;
		else status = `Removed ${label}.`;
	}

	function tap(ref: TimeStudyRef) {
		if (mode === 'select' && ref.kind !== 'dilation') {
			focused = null;
			toggleStudy(ref);
		} else {
			focused = ref;
		}
	}

	function setContext(next: TreeContext | null) {
		const nextCtx = next ?? (save ? contextFromSave(save) : DEFAULT_CONTEXT);
		const { tree: kept, skipped } = evaluate(plan, nextCtx);
		commit(kept, { context: next });
		const dropped = skipped.map((s) => nodeLabel(s.ref)).join(', ');
		status = dropped
			? `Removed what the new game state forbids: ${dropped}.`
			: 'Game state updated.';
	}

	function editContext(change: Partial<TreeContext>) {
		setContext({ ...ctx, ...change });
	}

	function toggleIn(list: readonly number[], ids: readonly number[], on: boolean): number[] {
		const rest = list.filter((id) => !ids.includes(id));
		return on ? [...rest, ...ids].sort((a, b) => a - b) : rest;
	}

	// ---- Import / export ----------------------------------------------------------------------
	let input = $state('');
	let importError = $state('');
	let importReport = $state<{ invalid: string[]; skipped: Skipped[] } | null>(null);

	function loadString(text: string, source: string) {
		const result = importStudyString(text, ctx);
		if (!result.ok) {
			importError = result.error;
			importReport = null;
			return false;
		}
		importError = '';
		commit(result.tree, { startEC: result.startEC && result.tree.ec !== 0 });
		importReport = { invalid: result.invalid, skipped: result.skipped };
		focused = null;
		status = `${source}: ${result.tree.studies.length} studies${result.tree.ec ? ` and EC${result.tree.ec}` : ''}, ${formatTheorems(result.tree.tt)} TT.`;
		return true;
	}

	function importInput(event: SubmitEvent) {
		event.preventDefault();
		if (loadString(input, 'Imported')) input = '';
	}

	const exported = $derived(exportStudyString(tree, plan.startEC && tree.ec !== 0));
	let copied = $state(false);
	let exportField: HTMLInputElement | undefined = $state();

	async function copyExport() {
		try {
			await navigator.clipboard.writeText(exported);
		} catch {
			exportField?.select();
			document.execCommand('copy');
		}
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	function loadMine() {
		if (!save) return;
		const { tree: mine, skipped } = evaluate({ studies: save.timeStudies, ec: 0 }, ctx);
		commit(mine);
		importReport = { invalid: [], skipped };
		importError = '';
		status = `Loaded your ${mine.studies.length} studies from the imported save.`;
	}

	function clearBuild() {
		commit({ studies: [], ec: 0, tt: 0, st: 0 });
		importReport = null;
		status = 'Build cleared.';
	}

	const presetCosts = $derived(
		new Map(
			PRESETS.map((p) => {
				const result = importStudyString(p.studies, ctx);
				return [p.id, result.ok ? result.tree.tt : 0];
			})
		)
	);
	const stage = $derived(progress.ready ? progress.stage : null);

	// ---- Details ------------------------------------------------------------------------------
	const verdict = $derived(focused ? check(tree, focused, ctx) : null);
	const focusedSelected = $derived(focused ? isSelected(tree, focused) : false);
	const paths = $derived([...dimensionPaths(tree), ...pacePaths(tree)]);
	const studyCount = $derived(tree.studies.length);

	const EC_GATES = [
		{ ids: [5], label: 'EC5 completed (opens 62)' },
		{ ids: [1, 2, 3], label: 'EC1, EC2 and EC3 completed (open 181)' },
		{ ids: [10], label: 'EC10 completed (opens 191–193)' }
	];
	const PERK_GATES = [
		{ ids: [PERK.bypassEC5Lock], label: 'Perk: no EC5 lock on 62' },
		{
			ids: [PERK.bypassEC1Lock, PERK.bypassEC2Lock, PERK.bypassEC3Lock],
			label: 'Perks: no EC1–3 locks on 181'
		},
		{ ids: [PERK.studyECRequirement], label: 'Perk: no study requirements on ECs' }
	];
</script>

<svelte:head>
	<title>Time Study planner — adg</title>
	<meta
		name="description"
		content="Plan a Time Study tree and copy it as a string you can paste into the game's Time Study import."
	/>
</svelte:head>

<div class="page">
	<p class="back"><a href={resolve('/tools')}>All tools</a></p>
	<h1>Time Study planner</h1>
	<p>
		Build a tree, then copy its study string into the game: <strong>Eternity</strong> tab,
		<strong>Studies</strong>, <strong>Import tree</strong>. Copy first: the game's import box fills
		itself from the clipboard. Strings from the game, a guide or a friend import here too.
	</p>

	<div class="toolbar">
		<div class="modes" role="radiogroup" aria-label="Tap a study to">
			<label class:on={mode === 'inspect'}>
				<input type="radio" name="mode" value="inspect" bind:group={mode} />
				See details
			</label>
			<label class:on={mode === 'select'}>
				<input type="radio" name="mode" value="select" bind:group={mode} />
				Add / remove
			</label>
		</div>
	</div>

	<div class="summary" aria-label="Build summary">
		<p class="totals">
			<span><strong class="num" data-testid="tt-total">{formatTheorems(tree.tt)}</strong> TT</span>
			{#if tree.st > 0 || ctx.spaceTheorems > 0}
				<span><strong class="num">{tree.st}</strong>/{ctx.spaceTheorems} ST</span>
			{/if}
			<span><strong class="num">{studyCount}</strong> {studyCount === 1 ? 'study' : 'studies'}</span
			>
			<span>{tree.ec ? `EC${tree.ec}` : 'no EC'}</span>
		</p>
		{#if paths.length > 0}
			<p class="paths muted">{paths.join(' · ')}</p>
		{/if}
		<div class="budget">
			<label class="number">
				Your Time Theorems
				<!-- Text, not number: a late-game budget like 3.15e76 stays readable and editable. -->
				<input
					type="text"
					inputmode="decimal"
					autocomplete="off"
					placeholder="Total"
					value={budget === null ? '' : budget < 1e9 ? String(budget) : formatTheorems(budget)}
					onchange={(e) => setBudget(e.currentTarget.value)}
					data-testid="tt-budget"
				/>
			</label>
			<p class="small" data-testid="budget-verdict">
				{#if budget === null}
					<span class="muted"
						>Enter all your TT, unspent plus what your tree cost (what you hold after a respec), to
						see what the game would buy.</span
					>
				{:else if left.length > 0}
					<strong>{formatTheorems(tree.tt - budget)} TT short.</strong> The game buys left to right
					and skips what it can't afford, and what needs it: it would leave out {leftLabels}.
				{:else if tree.tt > 0}
					Fits, with {formatTheorems(budget - tree.tt)} TT to spare.
				{/if}
				{#if plan.budget === null && budget !== null}
					<span class="muted">From your imported save.</span>
				{:else if plan.budget !== null && save}
					<button type="button" class="linkish" onclick={() => persist({ ...plan, budget: null })}
						>Use my save's {formatTheorems(save.totalTimeTheorems)}</button
					>
				{/if}
			</p>
		</div>
		<p class="status" role="status" aria-live="polite">{status}</p>
	</div>

	{#if loaded}
		<TreeView {laid} {tree} {ctx} {focused} ontap={tap} />
	{:else}
		<div class="tree-placeholder" aria-hidden="true"></div>
	{/if}

	<section aria-labelledby="export-h">
		<h2 id="export-h">Study string</h2>
		<div class="field-row">
			<input
				class="mono"
				readonly
				value={exported}
				bind:this={exportField}
				aria-label="Study string for the game"
				data-testid="export"
				onfocus={(e) => e.currentTarget.select()}
			/>
			<button type="button" class="button" onclick={copyExport}>{copied ? 'Copied' : 'Copy'}</button
			>
		</div>
		{#if tree.ec !== 0}
			<label class="check">
				<input
					type="checkbox"
					checked={plan.startEC}
					onchange={(e) => persist({ ...plan, startEC: e.currentTarget.checked })}
				/>
				End with <code>!</code> so the game also starts EC{tree.ec} after importing
			</label>
		{/if}

		<form class="import" onsubmit={importInput}>
			<label for="ts-import">Import a study string</label>
			<textarea
				id="ts-import"
				class="mono"
				rows="3"
				bind:value={input}
				placeholder="11,21,22,31-62,time,111,idle,151,161,171|1"
				spellcheck="false"
				autocapitalize="off"
				autocomplete="off"></textarea>
			<div class="actions">
				<button type="submit" class="button">Import</button>
				<button
					type="button"
					class="button quiet"
					onclick={clearBuild}
					disabled={studyCount === 0 && tree.ec === 0}>Clear build</button
				>
			</div>
		</form>
		{#if importError}
			<p class="error" role="alert">{importError}</p>
		{/if}
		{#if importReport && (importReport.invalid.length > 0 || importReport.skipped.length > 0)}
			<div class="report" role="alert">
				{#if importReport.invalid.length > 0}
					<p>Not studies, ignored: <code>{importReport.invalid.join(', ')}</code></p>
				{/if}
				{#if importReport.skipped.length > 0}
					<p>Left out, as the game would:</p>
					<ul>
						{#each importReport.skipped as s (refKey(s.ref))}
							<li><strong>{nodeLabel(s.ref)}</strong>: {s.reason}</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/if}
		<p class="muted small">
			Same format as the game: ids separated by commas, ranges like <code>11-62</code>, group names
			(<code>antimatter</code>, <code>idle</code>, <code>light</code>…), then <code>|</code> and the EC
			number. The order matters: the game buys studies left to right.
		</p>
	</section>

	<section aria-labelledby="presets-h">
		<h2 id="presets-h">Starting points</h2>
		<p class="muted">
			adg suggestions, written for this guide — not the game's presets. Load one, then adjust it.
		</p>
		{#if save && save.timeStudies.length > 0}
			<div class="preset mine">
				<div>
					<h3>My current studies</h3>
					<p>The {save.timeStudies.length} studies in your imported save.</p>
				</div>
				<button type="button" class="button" onclick={loadMine}>Load my current studies</button>
			</div>
		{/if}
		<ul class="presets">
			{#each PRESETS as preset (preset.id)}
				<li class="preset" class:near={stage === preset.stage}>
					<div>
						<h3>{preset.name}</h3>
						<p class="meta">
							<span class="chip">adg suggestion</span>
							<span>{getStage(preset.stage).name}</span>
							<span class="num">{formatTheorems(presetCosts.get(preset.id) ?? 0)} TT</span>
							{#if stage === preset.stage}<strong>Your stage</strong>{/if}
						</p>
						<p>{preset.rationale}</p>
					</div>
					<button
						type="button"
						class="button"
						aria-label="Load {preset.name}"
						onclick={() => loadString(preset.studies, preset.name)}>Load</button
					>
				</li>
			{/each}
		</ul>
	</section>

	<section aria-labelledby="state-h">
		<h2 id="state-h">Game state</h2>
		<p class="muted">
			Some studies depend on more than the tree. Currently {contextSource}.
			{#if plan.context}
				<button type="button" class="linkish" onclick={() => setContext(null)}
					>Use {save ? 'my save' : 'the defaults'} instead</button
				>
			{/if}
		</p>
		<fieldset>
			<legend>Eternity Challenges</legend>
			{#each EC_GATES as gate (gate.label)}
				<label class="check">
					<input
						type="checkbox"
						checked={gate.ids.every((id) => ctx.completedECs.includes(id))}
						onchange={(e) =>
							editContext({
								completedECs: toggleIn(ctx.completedECs, gate.ids, e.currentTarget.checked)
							})}
					/>
					{gate.label}
				</label>
			{/each}
		</fieldset>
		<fieldset>
			<legend>Reality and beyond</legend>
			<label class="check">
				<input
					type="checkbox"
					checked={ctx.dimensionSplit}
					onchange={(e) => editContext({ dimensionSplit: e.currentTarget.checked })}
				/>
				Dilation upgrade: all three Dimension paths
			</label>
			{#each PERK_GATES as gate (gate.label)}
				<label class="check">
					<input
						type="checkbox"
						checked={gate.ids.every((id) => ctx.perks.includes(id))}
						onchange={(e) =>
							editContext({ perks: toggleIn(ctx.perks, gate.ids, e.currentTarget.checked) })}
					/>
					{gate.label}
				</label>
			{/each}
			<label class="number">
				Space Theorems (from V)
				<input
					type="number"
					inputmode="numeric"
					min="0"
					max="200"
					value={ctx.spaceTheorems}
					onchange={(e) =>
						editContext({
							spaceTheorems: Math.max(0, Math.floor(Number(e.currentTarget.value) || 0))
						})}
				/>
			</label>
			<label class="number">
				Triad Studies unlocked (Ra's V level ÷ 6)
				<select
					value={ctx.triads}
					onchange={(e) => editContext({ triads: Number(e.currentTarget.value) })}
				>
					{#each [0, 1, 2, 3, 4] as n (n)}
						<option value={n}>{n}</option>
					{/each}
				</select>
			</label>
		</fieldset>
		<p class="muted small">
			An imported save fills these in, except the Dilation upgrade and triads, which adg infers from
			the studies you own.
		</p>
	</section>
</div>

{#if focused}
	{@const ref = focused}
	<div class="sheet" role="dialog" aria-labelledby="sheet-title" aria-modal="false">
		<div class="sheet-head">
			<h2 id="sheet-title">{studyTitle(ref)}</h2>
			<button
				type="button"
				class="close"
				aria-label="Close details"
				onclick={() => (focused = null)}
			>
				<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
					<path
						d="M6 6l12 12M18 6 6 18"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/>
				</svg>
			</button>
		</div>
		<p>{studyDescription(ref)}</p>
		<p class="cost">
			Cost: <strong class="num">{formatTheorems(refCost(ref))} TT</strong>
			{#if stCostNote(ref)}<span class="muted">, plus {stCostNote(ref)}</span>{/if}
		</p>
		{#if requirementLines(ref).length > 0}
			<p class="req-h">Requires</p>
			<ul class="reqs">
				{#each requirementLines(ref) as line (line)}
					<li>{line}</li>
				{/each}
			</ul>
		{/if}
		{#if ref.kind === 'dilation'}
			<p class="muted">
				Not part of study strings: buy it in the game once the requirements are met.
			</p>
		{:else}
			<div class="sheet-actions">
				<p class="verdict" class:locked={!focusedSelected && !verdict?.ok}>
					{#if focusedSelected}
						In your build.
					{:else if verdict?.ok}
						Can be added.
					{:else if verdict}
						{verdict.reason}
					{/if}
				</p>
				{#if focusedSelected || verdict?.ok}
					<button type="button" class="button" onclick={() => toggleStudy(ref)}>
						{focusedSelected ? 'Remove' : 'Add to build'}
					</button>
				{/if}
			</div>
		{/if}
		{#if ref.kind === 'ec'}
			<p class="small">
				<a href={resolve('/tools/eternity-challenges')}>Goals and rewards in the EC planner</a>
			</p>
		{/if}
	</div>
{/if}

<style>
	.back {
		margin-bottom: var(--space-2);
	}

	.toolbar {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
	}

	.modes {
		display: inline-flex;
		border: 1.5px solid var(--layer);
		border-radius: var(--radius);
		overflow: hidden;
	}

	.modes label {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap);
		padding: 0 var(--space-4);
		font-weight: 650;
		cursor: pointer;
	}

	.modes label + label {
		border-left: 1.5px solid var(--layer);
	}

	.modes label.on {
		background: var(--layer);
		color: var(--paper);
	}

	.modes input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	.modes label:has(input:focus-visible) {
		outline: 3px solid var(--focus);
		outline-offset: -3px;
	}

	.summary {
		margin-bottom: var(--space-2);
	}

	.totals {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1) var(--space-4);
		margin: 0;
	}

	.paths {
		margin: 0;
		font-size: var(--step--1);
	}

	.tree-placeholder {
		height: min(70svh, 44rem);
		margin-inline: calc(-1 * var(--space-4));
		background: var(--surface-sunk);
	}

	.status {
		min-height: 1.6em;
		margin: var(--space-2) 0 0;
		font-size: var(--step--1);
	}

	.mono {
		font-family: var(--font-mono);
		font-size: var(--step--1);
	}

	.field-row {
		display: flex;
		gap: var(--space-2);
	}

	.field-row input {
		flex: 1;
		min-width: 0;
	}

	input:not([type]),
	input[readonly],
	input[type='number'],
	input[type='text'],
	select,
	textarea {
		min-height: var(--tap);
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--rule);
		border-radius: var(--radius);
		background: var(--surface);
	}

	textarea {
		display: block;
		width: 100%;
		resize: vertical;
	}

	.import {
		margin-top: var(--space-5);
	}

	.import label {
		display: block;
		margin-bottom: var(--space-1);
		font-weight: 650;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-top: var(--space-2);
	}

	.button.quiet {
		border-color: var(--rule);
	}

	.button:disabled {
		opacity: 0.5;
		cursor: default;
	}

	.check {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		min-height: var(--tap);
	}

	.check input {
		width: 1.25rem;
		height: 1.25rem;
		flex: none;
		accent-color: var(--layer);
	}

	.number {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		min-height: var(--tap);
		margin-top: var(--space-2);
	}

	.number input {
		width: 6rem;
	}

	.budget input {
		width: 8rem;
	}

	.budget {
		margin-top: var(--space-2);
	}

	.budget .number {
		justify-content: flex-start;
		margin-top: 0;
		font-weight: 650;
	}

	.budget p {
		margin: var(--space-1) 0 0;
	}

	.error {
		margin-top: var(--space-2);
		color: light-dark(#a3001b, #ff8a9a);
		font-weight: 650;
	}

	.report {
		margin-top: var(--space-3);
		padding: var(--space-3) var(--space-4);
		border-left: 4px solid light-dark(#a35400, #f0a43c);
		background: color-mix(in srgb, light-dark(#a35400, #f0a43c) 7%, var(--surface));
		font-size: var(--step--1);
	}

	.report p,
	.report ul {
		margin-bottom: var(--space-2);
	}

	.report > :last-child {
		margin-bottom: 0;
	}

	.small {
		font-size: var(--step--1);
	}

	fieldset {
		margin: 0 0 var(--space-4);
		padding: var(--space-2) var(--space-4) var(--space-3);
		border: 1px solid var(--rule);
		border-radius: var(--radius);
	}

	legend {
		padding: 0 var(--space-1);
		font-weight: 720;
	}

	.linkish {
		min-height: var(--tap);
		padding: 0;
		border: 0;
		background: none;
		text-decoration: underline;
		text-decoration-color: var(--layer);
		text-decoration-thickness: 2px;
		text-underline-offset: 0.22em;
		cursor: pointer;
	}

	.presets {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.preset {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--space-3);
		margin: 0;
		padding: var(--space-3) 0;
		border-top: 1px solid var(--rule);
	}

	.preset.near {
		border-top: 2px solid var(--layer);
	}

	.preset h3 {
		margin: 0;
		font-size: var(--step-0);
	}

	.preset p {
		margin: var(--space-1) 0 0;
		font-size: var(--step--1);
	}

	.preset .button {
		flex: none;
	}

	.preset.mine {
		margin-bottom: var(--space-3);
		padding: var(--space-3) var(--space-4);
		border: 1.5px solid var(--layer);
		border-radius: var(--radius);
		flex-wrap: wrap;
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1) var(--space-3);
		color: var(--muted);
	}

	.chip {
		padding: 0 var(--space-2);
		border: 1px solid var(--rule);
		border-radius: 999px;
	}

	/* ---- Details sheet ---- */
	.sheet {
		position: fixed;
		z-index: 20;
		left: 0;
		right: 0;
		bottom: calc(var(--tabbar-h) + env(safe-area-inset-bottom));
		max-height: 55svh;
		overflow-y: auto;
		padding: var(--space-3) var(--space-4) var(--space-4);
		border-top: 2px solid var(--layer);
		border-radius: 12px 12px 0 0;
		background: var(--surface);
		box-shadow: 0 -6px 24px rgb(0 0 0 / 0.25);
	}

	@media (min-width: 60rem) {
		.sheet {
			left: auto;
			right: var(--space-5);
			bottom: var(--space-5);
			width: 26rem;
			border: 1px solid var(--rule);
			border-top: 2px solid var(--layer);
			border-radius: var(--radius);
		}
	}

	.sheet-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
	}

	.sheet h2 {
		margin: 0;
		font-size: var(--step-1);
	}

	.sheet p {
		margin: var(--space-2) 0 0;
	}

	.close {
		display: grid;
		place-items: center;
		width: var(--tap);
		height: var(--tap);
		flex: none;
		margin-right: calc(-1 * var(--space-2));
		border: 0;
		background: none;
		color: var(--muted);
		cursor: pointer;
	}

	.req-h {
		font-weight: 720;
	}

	.reqs {
		margin: var(--space-1) 0 0;
		font-size: var(--step--1);
	}

	.sheet-actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		margin-top: var(--space-3);
	}

	.verdict {
		margin: 0;
		font-weight: 650;
	}

	.verdict.locked {
		color: var(--muted);
		font-weight: 500;
	}
</style>
