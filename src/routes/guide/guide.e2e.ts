import { expect, test } from '@playwright/test';

test('an article renders with its stamp, TOC and prev/next links', async ({ page }) => {
	await page.goto('/guide/m1/getting-started');
	await expect(page.locator('h1')).toHaveText('Getting started');
	await expect(page.getByText(/Checked against Android 3\.18\.0/)).toBeVisible();

	// On phones the TOC is a collapsed disclosure listing every h2.
	const toc = page.locator('details.toc-inline');
	await toc.locator('summary').click();
	const tocLinks = toc.getByRole('link');
	const h2s = page.locator('.prose h2');
	await expect(tocLinks).toHaveCount(await h2s.count());
	await expect(tocLinks.first()).toBeVisible();

	await tocLinks.nth(1).click();
	await expect(page).toHaveURL(/#the-tab-bar$/);
	await expect(page.locator('#the-tab-bar')).toBeInViewport();

	await expect(page.locator('a[rel="prev"]')).toHaveCount(0);
	await page.locator('a[rel="next"]').click();
	await expect(page).toHaveURL(/\/guide\/m1\/saving-and-exporting$/);
	await expect(page.locator('h1')).toHaveText('Saving and exporting');
	await expect(page.locator('a[rel="prev"]')).toHaveAttribute('href', /getting-started$/);
});

test('the guide index lists articles by stage', async ({ page }) => {
	await page.goto('/guide');
	const stage = page.locator('section.stage', { hasText: 'Antimatter Production' });
	await expect(stage.getByRole('link', { name: 'Getting started' })).toBeVisible();
	await expect(stage.getByRole('link', { name: 'Saving and exporting' })).toBeVisible();
});
