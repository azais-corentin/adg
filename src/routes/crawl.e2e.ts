import { expect, test } from '@playwright/test';

// Follows every internal link and image from the home page and fails on anything that
// doesn't load or any page wider than the phone screen, so a broken nav link, a missing
// screenshot or a layout overflow is caught.
test('every internal link and image resolves and pages fit the screen', async ({
	page,
	baseURL
}) => {
	// One page load per article, tool and screenshot: well past the default 30 s.
	test.setTimeout(300_000);
	const origin = new URL(baseURL ?? 'http://localhost:4173').origin;
	const queue = ['/'];
	const visited = new Set<string>();
	const assets = new Set<string>();
	const failures: string[] = [];

	while (queue.length > 0) {
		const path = queue.shift() ?? '/';
		if (visited.has(path)) continue;
		visited.add(path);

		const response = await page.goto(path);
		if (!response?.ok()) {
			failures.push(`${path}: HTTP ${response?.status()}`);
			continue;
		}
		if (!response.headers()['content-type']?.includes('text/html')) continue;

		// Pages must fit a phone screen without sideways scrolling.
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - document.documentElement.clientWidth
		);
		if (overflow > 0) failures.push(`${path}: ${overflow}px wider than the screen`);

		const urls = await page.$$eval('a[href], img[src]', (elements) =>
			elements.map((el) =>
				el instanceof HTMLImageElement ? el.src : (el as HTMLAnchorElement).href
			)
		);
		for (const raw of urls) {
			const url = new URL(raw);
			if (url.origin !== origin) continue;
			const target = url.pathname;
			if (/\.(webp|png|jpe?g|svg|txt|woff2)$/.test(target)) assets.add(target);
			else if (!visited.has(target)) queue.push(target);
		}
	}

	for (const asset of assets) {
		const response = await page.request.get(asset);
		if (!response.ok()) failures.push(`${asset}: HTTP ${response.status()}`);
	}

	expect(failures).toEqual([]);
	// Sanity check that the crawl reached the main sections.
	expect([...visited]).toEqual(
		expect.arrayContaining(['/', '/guide', '/tools', '/about', '/guide/m1/getting-started'])
	);
});
