import { expect, test } from '@playwright/test';

test('home page renders the stage card and tools', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
	await expect(page.getByText('Stage not set')).toBeVisible();
	await expect(page.getByRole('link', { name: 'Import a save' })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Tools' })).toBeVisible();
	// Phones get the bottom tab bar.
	const tabbar = page.locator('nav.tabbar');
	await expect(tabbar).toBeVisible();
	await expect(tabbar.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
});

test('a manually picked stage persists across reloads', async ({ page }) => {
	await page.goto('/');
	const picker = page.getByLabel('Where are you in the game?');
	await picker.selectOption('replicanti');
	await expect(page.getByText('Stage 4 of 17, picked by you.')).toBeVisible();

	await page.reload();
	await expect(picker).toHaveValue('replicanti');
	await expect(page.locator('.stage-name')).toHaveText('Replicanti');
	const stored = await page.evaluate(() => localStorage.getItem('adg:progress:v1'));
	expect(JSON.parse(stored ?? '{}')).toMatchObject({
		version: 1,
		stage: 'replicanti',
		stageSource: 'manual'
	});

	await picker.selectOption('');
	await page.reload();
	await expect(page.getByText('Stage not set')).toBeVisible();
});

test('corrupt saved progress falls back to no stage', async ({ page }) => {
	await page.goto('/');
	await page.evaluate(() => localStorage.setItem('adg:progress:v1', '{"version":1,"stage":'));
	await page.reload();
	await expect(page.getByText('Stage not set')).toBeVisible();
});
