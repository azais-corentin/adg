<!--
@component
What adg reads from an imported save: the detected stage, key numbers, next goals, and
where to go from here (articles for the stage and the tools that apply to it).
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { MILESTONE_NAMES, articlesForStage, type ArticleMeta } from '#lib/content/index.ts';
	import { TOOLS, type Tool } from '#lib/content/tools.ts';
	import StageStrip from '#lib/components/StageStrip.svelte';
	import { layerStyle } from '#lib/components/stage-colors.ts';
	import { detectStage, formatBigNum, gt, nextGoals } from '#lib/save/index.ts';
	import type { BigNum, NormalizedSave } from '#lib/save/types.ts';
	import { STAGES, getStage, stageIndex, type StageId } from '#lib/stages.ts';
	import GoalList from './GoalList.svelte';
	import { formatDuration, formatTimeAgo } from './time.ts';

	let {
		save,
		articles,
		importedAt,
		now
	}: {
		save: NormalizedSave;
		articles: readonly ArticleMeta[];
		/** ISO time of the import. */
		importedAt: string | undefined;
		/** Epoch ms used for "imported … ago". */
		now: number;
	} = $props();

	/** First stage at which a tool is worth opening; tools not listed apply from the start. */
	const TOOL_FROM: Partial<Record<Tool['href'], StageId>> = {
		'/tools/time-studies': 'early-eternity',
		'/tools/eternity-challenges': 'early-eternity',
		'/tools/automator': 'early-reality'
	};

	const stage = $derived(getStage(detectStage(save).stage));
	const goals = $derived(nextGoals(save, stage.id));
	const reading = $derived(articlesForStage(articles, stage.id));
	const tools = $derived(
		TOOLS.filter((tool) => {
			const from = TOOL_FROM[tool.href];
			return tool.href !== '/import' && (!from || stageIndex(stage.id) >= stageIndex(from));
		})
	);

	const count = (value: BigNum) => formatBigNum(value, 2, 0);
	const stats = $derived.by(() => {
		const reality = save.realities > 0 || gt(save.realityMachines, 0);
		const eternity = reality || gt(save.eternities, 0) || gt(save.eternityPoints, 0);
		const infinity = eternity || gt(save.infinities, 0) || gt(save.infinityPoints, 0);
		return [
			{ label: 'Antimatter', value: formatBigNum(save.antimatter), show: true },
			{ label: 'Infinity Points', value: formatBigNum(save.infinityPoints), show: infinity },
			{ label: 'Infinities', value: count(save.infinities), show: infinity },
			{ label: 'Eternity Points', value: formatBigNum(save.eternityPoints), show: eternity },
			{ label: 'Eternities', value: count(save.eternities), show: eternity },
			{ label: 'Reality Machines', value: formatBigNum(save.realityMachines), show: reality },
			{ label: 'Realities', value: save.realities.toLocaleString('en-US'), show: reality },
			{ label: 'Time played', value: formatDuration(save.records.totalTimePlayed), show: true }
		].filter((stat) => stat.show);
	});

	const exportedOn = $derived(
		new Date(save.lastUpdate).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
	);
</script>

<div class="result" style={layerStyle(stage.id)}>
	<section class="stage" aria-labelledby="result-heading">
		<h2 id="result-heading" tabindex="-1">
			<span class="label">Your stage</span>
			<span class="stage-name">{stage.name}</span>
		</h2>
		<p class="meta">
			Stage {stageIndex(stage.id) + 1} of {STAGES.length}, in milestone {stage.milestone}: {MILESTONE_NAMES[
				stage.milestone
			]}.
		</p>
		<StageStrip current={stage.id} />
		<p class="meta">
			Save from {exportedOn}{#if importedAt}, imported {formatTimeAgo(
					Date.parse(importedAt),
					now
				)}{/if}.
		</p>
		{#if save.source.format === 'android-native'}
			<p class="note">
				This save came from <strong>Export to mobile</strong>. adg reads it, but a few values in
				that format are inferred rather than confirmed. Next time, pick
				<strong>Export to web/steam</strong> for the most accurate result.
			</p>
		{/if}
		<dl class="stats">
			{#each stats as stat (stat.label)}
				<div>
					<dt>{stat.label}</dt>
					<dd class="num">{stat.value}</dd>
				</div>
			{/each}
		</dl>
	</section>

	<section aria-labelledby="goals-heading">
		<h2 id="goals-heading">Next goals</h2>
		<GoalList {goals} />
	</section>

	<section aria-labelledby="read-heading">
		<h2 id="read-heading">Read next</h2>
		{#if reading}
			{#if reading.stage.id !== stage.id}
				<p class="muted">
					Nothing is written for {stage.name} yet. The closest earlier section is {reading.stage
						.name}.
				</p>
			{/if}
			<ul class="links" style={layerStyle(reading.stage.id)}>
				{#each reading.articles as article (article.slug)}
					<li>
						<a href={resolve('/guide/[...slug]', { slug: article.slug })}>{article.title}</a>
						<p>{article.summary}</p>
					</li>
				{/each}
			</ul>
		{:else}
			<p><a href={resolve('/guide')}>All articles</a></p>
		{/if}
	</section>

	<section aria-labelledby="tools-heading">
		<h2 id="tools-heading">Tools for this stage</h2>
		<ul class="links">
			{#each tools as tool (tool.href)}
				<li>
					<a href={resolve(tool.href)}>{tool.name}</a>
					<p>{tool.summary}</p>
				</li>
			{/each}
		</ul>
	</section>
</div>

<style>
	.result {
		display: grid;
		gap: var(--space-5);
	}

	h2 {
		margin: 0 0 var(--space-3);
	}

	.stage {
		display: grid;
		gap: var(--space-3);
		padding: var(--space-4);
		border: 1px solid var(--rule);
		border-top: 4px solid var(--layer);
		border-radius: 0 0 var(--radius) var(--radius);
		background: var(--surface);
	}

	.stage h2 {
		display: grid;
		gap: var(--space-1);
		margin: 0;
		scroll-margin-top: calc(var(--header-h) + var(--space-4));
	}

	/* Focused by script after an import so screen readers land on the result. */
	.stage h2:focus {
		outline: none;
	}

	.label {
		color: var(--muted);
		font-size: var(--step--1);
		font-weight: 650;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.stage-name {
		color: var(--layer);
		font-size: var(--step-3);
		font-weight: 800;
		line-height: 1.1;
		letter-spacing: -0.02em;
	}

	.meta {
		margin: 0;
		color: var(--muted);
	}

	.note {
		margin: 0;
		padding: var(--space-3);
		border-left: 3px solid var(--layer);
		background: var(--surface-sunk);
		font-size: var(--step--1);
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
		gap: var(--space-3) var(--space-4);
		margin: var(--space-2) 0 0;
	}

	.stats div {
		min-width: 0;
	}

	.stats dt {
		color: var(--muted);
		font-size: var(--step--1);
	}

	.stats dd {
		margin: 0;
		font-size: var(--step-1);
		overflow-wrap: anywhere;
	}

	.links {
		margin: 0;
		padding: 0 0 0 var(--space-4);
		border-left: 3px solid var(--layer);
		list-style: none;
	}

	.links li + li {
		margin-top: var(--space-3);
	}

	.links a {
		display: inline-block;
		padding: 0.55rem 0;
		font-weight: 720;
	}

	.links p {
		margin: 0;
		color: var(--muted);
	}
</style>
