<!--
@component
A game number in the app's Scientific notation, with the decimals it is written with:
`<Num value="1e10500" />` renders `1e10,500` (like a cost or unlock in the game),
`<Num value="1.80e308" />` renders `1.80e308`, `<Num value="0.75" />` renders `0.75`. A whole
number written without an exponent is a count and gets separators: `<Num value="5000" />`
renders `5,000`. `places` and `placesUnder1000` override the written decimals.
-->
<script lang="ts">
	import { formatWrittenNumber } from '#lib/save/bignum.ts';

	let {
		value,
		places,
		placesUnder1000
	}: { value: string | number; places?: number; placesUnder1000?: number } = $props();

	const formatted = $derived(formatWrittenNumber(value, places, placesUnder1000));
</script>

<span class="num">{formatted}</span>

<style>
	.num {
		white-space: nowrap;
	}
</style>
