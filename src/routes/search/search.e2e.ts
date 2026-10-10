import { expect, test } from '@playwright/test';

test('the header search finds a perk code and opens its section', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'Search the guide' }).click();
	const box = page.getByRole('searchbox', { name: 'Search the guide' });
	await expect(box).toBeFocused();
	await box.fill('DILR');

	const first = page.getByRole('main').getByRole('listitem').first();
	await expect(first).toContainText('Perk');
	await expect(first).toContainText('Remove the Eternity Challenge 11');
	await first.getByRole('link').click();

	await expect(page).toHaveURL(/\/guide\/m1\/perk-tree#recommended-order$/);
	await expect(page.locator('#recommended-order')).toBeInViewport();

	// Back returns to the same query and results.
	await page.goBack();
	await expect(page.getByRole('searchbox', { name: 'Search the guide' })).toHaveValue('DILR');
	await expect(page.getByRole('main').getByRole('listitem').first()).toContainText('DILR');
});

test('the guide index searches by Ra memory level', async ({ page }) => {
	await page.goto('/guide');
	await page.waitForLoadState('networkidle');
	await page.getByRole('searchbox', { name: 'Search the guide' }).fill('Effarig level 10');
	await page.getByRole('button', { name: 'Search' }).click();

	await expect(page).toHaveURL(/\/search\?q=Effarig/);
	const first = page.getByRole('main').getByRole('listitem').first();
	await expect(first).toContainText('Effarig level 10');
	await first.getByRole('link').click();
	await expect(page).toHaveURL(/\/guide\/m2\/ra-memories#key-levels-per-pet$/);
	await expect(page.locator('#key-levels-per-pet')).toBeInViewport();
});
