import { expect, test } from '@playwright/test';

// Follows every internal link and image from the home page and fails on anything that
// doesn't load, so a broken nav link or a missing screenshot is caught.
test('every internal link and image resolves', async ({ page, baseURL }) => {
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
