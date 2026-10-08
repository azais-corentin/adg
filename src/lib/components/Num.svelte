<!--
@component
A game number, formatted like the game's Scientific notation: `<Num value="1.79e308" />`
renders `1.79e308`; `<Num value="2.72e108838" />` renders `2.72e108,838`.
-->
<script lang="ts">
	import { formatGameNumber } from './num.ts';

	let {
		value,
		places = 2,
		placesUnder1000 = 0
	}: { value: string | number; places?: number; placesUnder1000?: number } = $props();
</script>

<span class="num">{formatGameNumber(value, places, placesUnder1000)}</span>

<style>
	.num {
		white-space: nowrap;
	}
</style>
