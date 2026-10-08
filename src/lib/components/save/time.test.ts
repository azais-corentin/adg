import { describe, expect, it } from 'vitest';
import { formatDuration, formatTimeAgo } from './time.ts';

describe('formatTimeAgo', () => {
	const now = Date.UTC(2026, 9, 8, 12);
	it.each([
		[now - 10_000, 'just now'],
		[now + 5_000, 'just now'],
		[now - 60_000, '1 minute ago'],
		[now - 59 * 60_000, '59 minutes ago'],
		[now - 3 * 3_600_000, '3 hours ago'],
		[now - 30 * 3_600_000, 'yesterday'],
		[now - 10 * 86_400_000, 'last week'],
		[now - 400 * 86_400_000, 'last year']
	])('%d → %s', (then, text) => {
		expect(formatTimeAgo(then, now)).toBe(text);
	});
});

describe('formatDuration', () => {
	it.each([
		[0, '0 seconds'],
		[999, '0 seconds'],
		[61_000, '1 minute, 1 second'],
		[3_600_000, '1 hour, 0 minutes'],
		[2 * 86_400_000 + 5 * 3_600_000 + 59_000, '2 days, 5 hours'],
		[1500 * 86_400_000, '1,500 days, 0 hours']
	])('%d ms → %s', (ms, text) => {
		expect(formatDuration(ms)).toBe(text);
	});
});
