<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import Callout from '#lib/components/Callout.svelte';
	import Num from '#lib/components/Num.svelte';
	import { progress } from '#lib/progress.svelte.ts';
	import {
		DILATION_COST,
		DILATION_TOTAL_TT,
		eternityChallenge,
		ETERNITY_CHALLENGES,
		goalAt,
		MAX_COMPLETIONS,
		restrictionAt,
		unlockRequirementAt
	} from '#lib/tools/eternity-challenges/challenges.ts';
	import EcSheet from '#lib/tools/eternity-challenges/EcSheet.svelte';
	import { ORDER, ORDER_PHASES, type OrderStep } from '#lib/tools/eternity-challenges/order.ts';
	import {
		isStepDone,
		nextStep,
		NO_COMPLETIONS,
		normalizeCompletions,
		parsePlannerState,
		PLANNER_KEY,
		toggleStep,
		type Completions,
		type Source
	} from '#lib/tools/eternity-challenges/plan.ts';

	onMount(() => progress.init());

	const planner = $derived(parsePlannerState(progress.planner[PLANNER_KEY]));
	const save = $derived(progress.ready ? progress.save : null);
	const source: Source = $derived(save && planner.source === 'save' ? 'save' : 'manual');
	const completions: Completions = $derived(
		!progress.ready
			? NO_COMPLETIONS
			: save && source === 'save'
				? save.eternityChallenges
				: planner.completions
	);
	const editable = $derived(source === 'manual');
	const doomed = $derived(save?.pelleDoomed ?? false);
	const next = $derived(nextStep(completions));
	const doneCount = $derived(ORDER.filter((step) => isStepDone(step, completions)).length);

	let openEc = $state<number | null>(null);

	function setCompletions(value: Completions) {
		progress.setPlannerState(PLANNER_KEY, { ...planner, completions: normalizeCompletions(value) });
	}

	function setSource(value: Source) {
		// Manual tracking starts from the save's completions, so switching never loses progress.
		progress.setPlannerState(PLANNER_KEY, {
			source: value,
			completions: value === 'manual' && save ? [...save.eternityChallenges] : planner.completions
		});
	}

	function setEcCompletions(ec: number, value: number) {
		setCompletions(completions.map((c, i) => (i === ec - 1 ? value : c)));
	}

	const label = (step: OrderStep) => `EC${step.ec} ×${step.completion}`;
</script>

<svelte:head>
	<title>Eternity Challenge planner — adg</title>
	<meta
		name="description"
		content="The usual order for all 60 Eternity Challenge completions, with the goal, restriction, reward and unlock requirement of each step."
	/>
</svelte:head>

<div class="page planner" style="--layer: var(--layer-eternity)">
	<p><a href={resolve('/tools')}>All tools</a></p>
	<h1>Eternity Challenge planner</h1>
	<p>
		The order most players follow for all 60 completions, from EC1 ×1 to EC12 ×5 and Time Dilation.
		Goals and requirements are the game's own numbers.
	</p>

	<div class="source">
		{#if save}
			<fieldset class="segmented">
				<legend>Completions from</legend>
				<label>
					<input
						type="radio"
						name="ec-source"
						checked={source === 'save'}
						onchange={() => setSource('save')}
					/>
					<span>Your save</span>
				</label>
				<label>
					<input
						type="radio"
						name="ec-source"
						checked={source === 'manual'}
						onchange={() => setSource('manual')}
					/>
					<span>Marked by hand</span>
				</label>
			</fieldset>
			<p class="muted hint">
				{source === 'save'
					? 'Read from your imported save. Import a newer one to update, or mark by hand.'
					: 'Tap a step or a challenge to change it.'}
			</p>
		{:else}
			<p class="muted hint">
				Tap steps to mark them done, or <a href={resolve('/import')}>import a save</a> to fill them in.
			</p>
		{/if}
	</div>

	{#if save && save.realities > 0}
		<Callout>
			<p>
				This order is for your first time through. Completions reset with each Reality, and Perks
				later remove the unlock requirements.
			</p>
		</Callout>
	{/if}

	<section class="next" aria-labelledby="next-title">
		{#if next}
			{@const ec = eternityChallenge(next.step.ec)}
			{@const restriction = restrictionAt(ec, next.step.completion - 1)}
			<p class="eyebrow">Next · step {next.index + 1} of {ORDER.length}</p>
			<h2 id="next-title">{label(next.step)}</h2>
			<dl>
				<dt>Goal</dt>
				<dd>
					<Num value={goalAt(ec, next.step.completion - 1, doomed)} /> IP{restriction
						? `, ${restriction}`
						: ''}{doomed ? ' (Doomed Reality goal)' : ''}
				</dd>
				<dt>Unlock</dt>
				<dd>{ec.unlock.cost} TT and {unlockRequirementAt(ec, next.step.completion - 1)}</dd>
				<dt>Tree</dt>
				<dd>
					~{next.step.tt.toLocaleString('en-US')} TT · {next.step.path} path · {next.step.pace}
				</dd>
			</dl>
			<p class="note">{next.step.note}</p>
			<div class="actions">
				{#if editable}
					<button
						type="button"
						class="button"
						onclick={() => setCompletions(toggleStep(completions, next.step))}
					>
						Mark {label(next.step)} done
					</button>
				{/if}
				<button type="button" class="button quiet" onclick={() => (openEc = next.step.ec)}>
					EC{next.step.ec} details
				</button>
			</div>
		{:else}
			<p class="eyebrow">All {ORDER.length} completions done</p>
			<h2 id="next-title">Unlock Time Dilation</h2>
			<p>
				The Time Dilation study at the bottom of the tree costs {DILATION_COST.toLocaleString(
					'en-US'
				)}
				TT. It needs EC11 and EC12 at ×5, one of studies 231–234, and
				{DILATION_TOTAL_TT.toLocaleString('en-US')} Time Theorems in total.
			</p>
		{/if}
	</section>

	<h2>Challenges</h2>
	<p class="muted">
		{doneCount} of {ORDER.length} completions. Tap one for goals, reward and unlock.
	</p>
	<ul class="grid">
		{#each ETERNITY_CHALLENGES as ec (ec.id)}
			{@const count = completions[ec.id - 1] ?? 0}
			<li>
				<button
					type="button"
					class="chip"
					class:full={count === MAX_COMPLETIONS}
					onclick={() => (openEc = ec.id)}
					aria-label="EC{ec.id}, {count} of {MAX_COMPLETIONS} completions"
				>
					<span class="chip-name">EC{ec.id}</span>
					<span class="pips" aria-hidden="true">
						{#each { length: MAX_COMPLETIONS }, i (i)}
							<span class="pip" class:on={i < count}></span>
						{/each}
					</span>
				</button>
			</li>
		{/each}
	</ul>

	<h2>The order</h2>
	{#each ORDER_PHASES as phase (phase.id)}
		{@const start = ORDER.indexOf(phase.steps[0]!)}
		{@const phaseDone = phase.steps.every((step) => isStepDone(step, completions))}
		<details class="phase" open={!phaseDone}>
			<summary>
				<span class="phase-title">{phase.title}</span>
				<span class="muted phase-count">
					{phase.steps.filter((step) => isStepDone(step, completions)).length}/{phase.steps.length}
				</span>
			</summary>
			<p class="muted phase-summary">{phase.summary}</p>
			<ol class="steps" start={start + 1}>
				{#each phase.steps as step, i (`${step.ec}x${step.completion}`)}
					{@const done = isStepDone(step, completions)}
					<li class:done aria-current={next?.index === start + i ? 'step' : undefined}>
						<label class="step">
							<input
								type="checkbox"
								checked={done}
								disabled={!editable}
								onchange={() => setCompletions(toggleStep(completions, step))}
							/>
							<span class="step-text">
								<span class="step-head">
									<strong>{label(step)}</strong>
									<span class="muted"
										>~{step.tt.toLocaleString('en-US')} TT · {step.path} · {step.pace}</span
									>
								</span>
								<span class="step-note">{step.note}</span>
							</span>
						</label>
						<button
							type="button"
							class="info"
							onclick={() => (openEc = step.ec)}
							aria-label="EC{step.ec} details"
						>
							<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
								<path
									d="m9 6 6 6-6 6"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</button>
					</li>
				{/each}
			</ol>
		</details>
	{/each}

	<p class="muted sources">
		Order and Time Theorem amounts follow Ninjatsu's Eternity Challenge chart and the
		<a href="https://antimatter-dimensions.fandom.com/wiki/Guide">community wiki guide</a>; goals
		and requirements are read from the game's source.
	</p>

	<EcSheet
		ec={openEc === null ? null : eternityChallenge(openEc)}
		completions={openEc === null ? 0 : (completions[openEc - 1] ?? 0)}
		{editable}
		{doomed}
		onset={setEcCompletions}
		onclose={() => (openEc = null)}
	/>
</div>

<style>
	.source {
		margin: var(--space-4) 0;
	}

	.hint {
		margin: var(--space-2) 0 0;
		font-size: var(--step--1);
	}

	.segmented {
		display: flex;
		gap: var(--space-1);
		margin: 0;
		padding: 0;
		border: 0;
	}

	.segmented legend {
		margin-bottom: var(--space-1);
		font-weight: 650;
	}

	.segmented label {
		position: relative;
		flex: 1;
	}

	.segmented input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	.segmented span {
		display: grid;
		place-items: center;
		min-height: var(--tap);
		padding: 0 var(--space-2);
		border: 1.5px solid var(--rule);
		border-radius: var(--radius);
		background: var(--surface);
		font-weight: 650;
		text-align: center;
		cursor: pointer;
	}

	.segmented input:checked + span {
		border-color: var(--layer);
		background: color-mix(in srgb, var(--layer) 16%, var(--surface));
	}

	.segmented input:focus-visible + span {
		outline: 3px solid var(--focus);
		outline-offset: 2px;
	}

	.next {
		margin: var(--space-4) 0 0;
		padding: var(--space-3) var(--space-4) var(--space-4);
		border: 1px solid var(--rule);
		border-left: 4px solid var(--layer);
		border-radius: var(--radius);
		background: var(--surface);
	}

	.eyebrow {
		margin: 0;
		color: var(--layer);
		font-size: var(--step--1);
		font-weight: 720;
		letter-spacing: 0.02em;
		text-transform: uppercase;
	}

	.next h2 {
		margin: var(--space-1) 0 var(--space-2);
		font-size: var(--step-3);
	}

	.next dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: var(--space-1) var(--space-3);
		margin: 0 0 var(--space-3);
	}

	.next dt {
		color: var(--muted);
	}

	.next dd {
		margin: 0;
		overflow-wrap: anywhere;
	}

	.note {
		margin-bottom: var(--space-3);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.quiet {
		border-color: var(--rule);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--space-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.grid li {
		margin: 0;
	}

	.chip {
		display: grid;
		justify-items: center;
		gap: var(--space-1);
		width: 100%;
		min-height: 3.25rem;
		padding: var(--space-2) var(--space-1);
		border: 1.5px solid var(--rule);
		border-radius: var(--radius);
		background: var(--surface);
		cursor: pointer;
	}

	.chip:hover {
		border-color: var(--layer);
	}

	.chip.full {
		border-color: var(--layer);
		background: color-mix(in srgb, var(--layer) 12%, var(--surface));
	}

	.chip-name {
		font-weight: 720;
		line-height: 1;
	}

	.pips {
		display: flex;
		gap: 3px;
	}

	.pip {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--rule);
	}

	.pip.on {
		background: var(--layer);
	}

	.phase {
		margin: 0 0 var(--space-3);
		border: 1px solid var(--rule);
		border-radius: var(--radius);
		background: var(--surface);
	}

	summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
		min-height: var(--tap);
		padding: var(--space-2) var(--space-3);
		font-weight: 720;
		cursor: pointer;
	}

	.phase-count {
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	.phase-summary {
		margin: 0 var(--space-3) var(--space-2);
		font-size: var(--step--1);
	}

	.steps {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.steps li {
		display: flex;
		align-items: stretch;
		margin: 0;
		border-top: 1px solid var(--rule);
	}

	.steps li[aria-current='step'] {
		box-shadow: inset 4px 0 0 var(--layer);
		background: color-mix(in srgb, var(--layer) 7%, var(--surface));
	}

	.step {
		display: flex;
		flex: 1;
		gap: var(--space-3);
		min-width: 0;
		min-height: var(--tap);
		padding: var(--space-2) var(--space-1) var(--space-2) var(--space-3);
		cursor: pointer;
	}

	.step input {
		flex: none;
		width: 1.25rem;
		height: 1.25rem;
		margin: 0.15rem 0 0;
		accent-color: var(--layer);
	}

	.step:has(input:disabled) {
		cursor: default;
	}

	.step-text {
		display: grid;
		gap: 0.1rem;
		min-width: 0;
	}

	.step-head {
		display: flex;
		flex-wrap: wrap;
		gap: 0 var(--space-2);
		align-items: baseline;
	}

	.step-head .muted {
		font-size: var(--step--1);
	}

	.step-note {
		font-size: var(--step--1);
		color: var(--muted);
	}

	.done .step-head strong {
		text-decoration: line-through;
		text-decoration-color: var(--layer);
		text-decoration-thickness: 2px;
	}

	.info {
		display: grid;
		flex: none;
		place-items: center;
		width: var(--tap);
		border: 0;
		background: none;
		color: var(--muted);
		cursor: pointer;
	}

	.info:hover {
		color: var(--ink);
		background: var(--surface-sunk);
	}

	.sources {
		margin-top: var(--space-5);
		font-size: var(--step--1);
	}
</style>
