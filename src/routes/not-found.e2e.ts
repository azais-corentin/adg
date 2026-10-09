import { expect, test } from '@playwright/test';

// Cloudflare answers unknown paths with build/404.html (wrangler.jsonc not_found_handling),
// which renders in the browser; `vite preview` would server-render instead, so serve it here.
test('an unknown path shows Page not found inside the app shell', async ({ page }) => {
	const errors: Error[] = [];
	page.on('pageerror', (error) => errors.push(error));
	await page.route('**/tools/import', (route) =>
		route.fulfill({ status: 404, path: 'build/404.html', contentType: 'text/html' })
	);

	await page.goto('/tools/import');
	await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Save import' }).first()).toHaveAttribute(
		'href',
		'/import'
	);
	const tabbar = page.locator('nav.tabbar');
	await tabbar.getByRole('link', { name: 'Guide' }).click();
	await expect(page.locator('section.stage').first()).toBeVisible();
	expect(errors).toEqual([]);
});
