<!--
@component
Bottom sheet with one Eternity Challenge: what it does, reward, unlock study, and the goal,
unlock requirement and suggested study tree of each completion. In manual mode it also sets the
completion count.
-->
<script lang="ts">
	import Num from '#lib/components/Num.svelte';
	import type { EternityChallenge } from '#lib/data/index.ts';
	import {
		ecDescription,
		goalAt,
		MAX_COMPLETIONS,
		restrictionAt,
		REWARD_FORMULAS,
		unlockGates,
		unlockRequirementAt
	} from './challenges.ts';
	import { ORDER } from './order.ts';
	import StepTree from './StepTree.svelte';

	let {
		ec,
		completions,
		editable,
		doomed,
		onset,
		onclose
	}: {
		/** The challenge to show; `null` closes the sheet. */
		ec: EternityChallenge | null;
		completions: number;
		editable: boolean;
		doomed: boolean;
		onset: (ec: number, completions: number) => void;
		onclose: () => void;
	} = $props();

	const id = $props.id();
	let dialog = $state<HTMLDialogElement>();

	$effect(() => {
		if (!dialog) return;
		if (ec && !dialog.open) dialog.showModal();
		else if (!ec && dialog.open) dialog.close();
	});

	const TIERS = Array.from({ length: MAX_COMPLETIONS }, (_, i) => i + 1);
</script>

<dialog
	bind:this={dialog}
	class="sheet"
	aria-labelledby="{id}-title"
	{onclose}
	onclick={(event) => {
		// A click on the backdrop lands on the dialog element itself.
		if (event.target === dialog) dialog.close();
	}}
>
	{#if ec}
		{@const gates = unlockGates(ec)}
		<header>
			<h2 id="{id}-title">Eternity Challenge {ec.id}</h2>
			<button type="button" class="close" onclick={() => dialog?.close()} aria-label="Close">
				<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
					<path
						d="M6 6l12 12M18 6 6 18"
						stroke="currentColor"
						stroke-width="2.2"
						stroke-linecap="round"
					/>
				</svg>
			</button>
		</header>
		<div class="body">
			{#if !editable}
				<p class="count">
					<strong>{completions} of {MAX_COMPLETIONS}</strong> completions, from your save
				</p>
			{:else}
				<fieldset class="segmented">
					<legend>Completions</legend>
					{#each [0, ...TIERS] as n (n)}
						<label>
							<input
								type="radio"
								name="{id}-completions"
								value={n}
								checked={completions === n}
								onchange={() => onset(ec.id, n)}
							/>
							<span>{n}</span>
						</label>
					{/each}
				</fieldset>
			{/if}

			<h3>In this challenge</h3>
			<p>{ecDescription(ec)}</p>

			<h3>Reward</h3>
			<p>{ec.reward}.</p>
			<p class="formula">{REWARD_FORMULAS[ec.id]} (c = completions)</p>

			<h3>Unlock study</h3>
			<p>
				Costs <strong>{ec.unlock.cost} TT</strong>, below
				{ec.unlock.requires.map((study) => `TS${study}`).join(' or ')}.
				{#if gates.length > 0}
					Reaching it needs one completion of {gates.map((gate) => `EC${gate}`).join(', ')} first.
				{/if}
				{#if ec.unlock.secondary.kind === 'resource'}
					It also needs an amount of {ec.unlock.secondary.resource} that grows with each completion, listed
					below.
				{:else}
					While it is bought, only the {ec.unlock.secondary.path} path is allowed.
				{/if}
			</p>

			<h3>Completions</h3>
			{#if doomed}
				<p class="muted">Goals shown are the Doomed Reality ones.</p>
			{/if}
			<ol class="tiers">
				{#each TIERS as tier (tier)}
					{@const step = ORDER.findIndex((s) => s.ec === ec.id && s.completion === tier)}
					{@const restriction = restrictionAt(ec, tier - 1)}
					<li class:done={completions >= tier} class:next={completions + 1 === tier}>
						<p class="tier-head">
							<span class="tier">×{tier}</span>
							{#if completions >= tier}<span class="badge">Done</span>{/if}
							{#if step !== -1}<span class="muted">Step {step + 1} · ~{ORDER[step]?.tt} TT</span
								>{/if}
						</p>
						<dl>
							<dt>Goal</dt>
							<dd>
								<Num value={goalAt(ec, tier - 1, doomed)} /> IP{restriction
									? `, ${restriction}`
									: ''}
							</dd>
							<dt>Unlock</dt>
							<dd>{unlockRequirementAt(ec, tier - 1)}</dd>
						</dl>
						{#if step !== -1 && completions < tier}
							<p class="step-note">{ORDER[step]?.note}</p>
							<details class="tree">
								<summary
									>{ORDER[step]?.unlockPath
										? 'Study trees to unlock and run'
										: 'Study tree for this run'}</summary
								>
								<StepTree index={step} />
							</details>
						{/if}
					</li>
				{/each}
			</ol>
		</div>
	{/if}
</dialog>

<style>
	.sheet {
		width: 100%;
		max-width: var(--measure);
		max-height: 88dvh;
		margin: auto auto 0;
		padding: 0;
		border: 0;
		border-radius: 14px 14px 0 0;
		background: var(--surface);
		color: var(--ink);
		overscroll-behavior: contain;
	}

	.sheet::backdrop {
		background: rgb(0 0 0 / 0.5);
	}

	@media (min-width: 40rem) {
		.sheet {
			margin: auto;
			border-radius: 14px;
		}
	}

	header {
		position: sticky;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-2) var(--space-2) var(--space-4);
		border-bottom: 1px solid var(--rule);
		background: var(--surface);
	}

	h2 {
		margin: 0;
		font-size: var(--step-1);
	}

	h3 {
		margin: var(--space-4) 0 var(--space-1);
		font-size: var(--step-0);
	}

	.close {
		display: grid;
		place-items: center;
		width: var(--tap);
		height: var(--tap);
		border: 0;
		border-radius: var(--radius);
		background: none;
		cursor: pointer;
	}

	.close:hover {
		background: var(--surface-sunk);
	}

	.body {
		padding: var(--space-3) var(--space-4) var(--space-5);
	}

	.body p {
		margin-bottom: var(--space-2);
	}

	.count {
		margin: 0;
	}

	.formula {
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius);
		background: var(--surface-sunk);
		font-size: var(--step--1);
	}

	.segmented {
		display: flex;
		gap: var(--space-1);
		margin: var(--space-2) 0 0;
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
		border: 1.5px solid var(--rule);
		border-radius: var(--radius);
		font-weight: 650;
		font-variant-numeric: tabular-nums;
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

	.tiers {
		display: grid;
		gap: var(--space-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.tiers li {
		margin: 0;
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--rule);
		border-radius: var(--radius);
	}

	.tiers li.next {
		border-color: var(--layer);
		border-width: 2px;
	}

	.tiers li.done {
		background: var(--surface-sunk);
	}

	.tier-head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--space-2);
		margin: 0 0 var(--space-1);
		font-size: var(--step--1);
	}

	.tier {
		font-size: var(--step-0);
		font-weight: 750;
	}

	.badge {
		padding: 0 var(--space-2);
		border-radius: 999px;
		background: color-mix(in srgb, var(--layer) 20%, transparent);
		font-weight: 650;
	}

	dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0 var(--space-3);
		margin: 0;
		font-size: var(--step--1);
	}

	dt {
		color: var(--muted);
	}

	dd {
		margin: 0;
		overflow-wrap: anywhere;
	}

	.step-note {
		margin: var(--space-2) 0 0;
		font-size: var(--step--1);
	}

	.tree {
		margin-top: var(--space-2);
	}

	.tree summary {
		padding: var(--space-2) 0;
		font-size: var(--step--1);
		font-weight: 650;
		cursor: pointer;
	}
</style>
