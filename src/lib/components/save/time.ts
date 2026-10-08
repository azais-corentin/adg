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

const DURATION_UNITS: [string, number][] = [
	['day', DAY],
	['hour', HOUR],
	['minute', MINUTE],
	['second', 1000]
];

/** A play time in ms as its two largest units, like "12 days, 4 hours" or "3 minutes, 0 seconds". */
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
