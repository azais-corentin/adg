import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'allow' });

test('guide and tools keep working offline after the first visit', async ({ page, context }) => {
	await page.goto('/');
	await page.evaluate(async () => {
		await navigator.serviceWorker.ready;
	});
	// The page that registered the worker isn't controlled yet; reload so fetches go through it.
	await page.reload();
	await expect
		.poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null))
		.toBe(true);

	await context.setOffline(true);

	await page.goto('/guide');
	await expect(page.locator('h1')).toBeVisible();

	await page.goto('/tools/time-studies');
	await expect(page.locator('h1')).toBeVisible();

	// The search page and its index are precached too.
	await page.goto('/search?q=Decoherence');
	await expect(page.getByRole('main').getByRole('listitem').first()).toContainText('Decoherence');

	// Unknown pages fall back to the cached home page instead of the browser's offline error.
	await page.goto('/not-a-page');
	await expect(page.locator('h1')).toBeVisible();
});
