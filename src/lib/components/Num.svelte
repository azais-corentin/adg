<!--
@component
A game number, formatted like the game's Scientific notation: `<Num value="1.79e308" />`
renders `1.79e308`; `<Num value="2.72e108838" />` renders `2.72e108,838`. Below 1000 a plain
decimal keeps the places it is written with (`<Num value="0.75" />` renders `0.75`) unless
`placesUnder1000` is given.
-->
<script lang="ts">
	import { formatGameNumber } from './num.ts';

	let {
		value,
		places = 2,
		placesUnder1000
	}: { value: string | number; places?: number; placesUnder1000?: number } = $props();

	const written = $derived(/^\d*\.(\d+)$/.exec(String(value).trim())?.[1]?.length ?? 0);
</script>

<span class="num">{formatGameNumber(value, places, placesUnder1000 ?? written)}</span>

<style>
	.num {
		white-space: nowrap;
	}
</style>
