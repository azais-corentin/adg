/**
 * Formats a game number the way Antimatter Dimensions shows it in Scientific
 * notation (upstream `format()` with the `@antimatter-dimensions/notations` library):
 * below 1000 as a plain number, otherwise `m.mme<exponent>`, with commas in exponents
 * from 100,000 and a nested mantissa once the exponent reaches 1e9.
 *
 * Accepts strings such as `1e308`, `1.79e308`, `2.72e108838` so exponents beyond
 * double range format exactly.
 */
export function formatGameNumber(value: string | number, places = 2, placesUnder1000 = 0): string {
	if (typeof value === 'number') {
		if (Number.isNaN(value)) return 'NaN';
		if (!Number.isFinite(value)) return value > 0 ? 'Infinite' : '-Infinite';
		value = value.toExponential();
	}
	const match = /^(-)?(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/i.exec(value.trim().replaceAll(',', ''));
	if (!match || (match[2] === '' && !match[3])) throw new Error(`Not a game number: ${value}`);
	const [, minus = '', int = '', frac = '', exp = '0'] = match;

	const digits = (int + frac).replace(/^0+/, '');
	if (digits === '') return (0).toFixed(placesUnder1000);
	// Exponent of the first significant digit.
	const leadingZeros = (int + frac).length - digits.length;
	const exponent = Number(exp) + int.length - 1 - leadingZeros;
	const mantissa = Number(`${digits[0]}.${digits.slice(1)}`);

	if (exponent < 3) {
		return minus + (mantissa * 10 ** exponent).toFixed(placesUnder1000);
	}
	let roundedMantissa = Number(mantissa.toFixed(places));
	let roundedExponent = exponent;
	if (roundedMantissa >= 10) {
		roundedMantissa /= 10;
		roundedExponent += 1;
	}
	return `${minus}${roundedMantissa.toFixed(places)}e${formatExponent(roundedExponent)}`;
}

function formatExponent(exponent: number): string {
	if (exponent < 100_000) return String(exponent);
	if (exponent < 1e9) return exponent.toLocaleString('en-US');
	return formatGameNumber(exponent, 2, 2);
}
