import { formatBigNum, fromNumber } from '#lib/save/bignum.ts';

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
	['year', 365 * DAY],
	['month', 30 * DAY],
	['week', 7 * DAY],
	['day', DAY],
	['hour', HOUR],
	['minute', MINUTE]
];

const relative = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

/** How long ago `then` was, seen from `now` (both epoch ms): "just now", "5 minutes ago", "yesterday". */
export function formatTimeAgo(then: number, now: number): string {
	const elapsed = Math.max(0, now - then);
	for (const [unit, size] of RELATIVE_UNITS) {
		if (elapsed >= size) return relative.format(-Math.floor(elapsed / size), unit);
	}
	return 'just now';
}

const YEAR = 365 * DAY;

const DURATION_UNITS: [string, number][] = [
	['year', YEAR],
	['day', DAY],
	['hour', HOUR],
	['minute', MINUTE],
	['second', 1000]
];

/** A play time in ms as its two largest units, like "1 year, 12 days" or "3 minutes, 0 seconds". */
export function formatDuration(ms: number): string {
	let rest = Math.max(0, Math.floor(ms / 1000) * 1000);
	const first = DURATION_UNITS.findIndex(([, size]) => rest >= size);
	if (first === -1) return '0 seconds';
	return DURATION_UNITS.slice(first, first + 2)
		.map(([unit, size]) => {
			const count = Math.floor(rest / size);
			rest -= count * size;
			return `${count.toLocaleString('en-US')} ${unit}${count === 1 ? '' : 's'}`;
		})
		.join(', ');
}

/**
 * Game time in ms as the Statistics tab shows it (upstream `TimeSpan.toString`): above a
 * million years as a number of years, e.g. "2.788e238 years"; otherwise like `formatDuration`.
 */
export function formatGameTime(ms: number): string {
	const years = ms / YEAR;
	return years > 1e6 ? `${formatBigNum(fromNumber(years), 3)} years` : formatDuration(ms);
}
