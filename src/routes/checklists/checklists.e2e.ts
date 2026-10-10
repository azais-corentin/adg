import { expect, test, type Page } from '@playwright/test';

const fixture = (name: string) => new URL(`../../../fixtures/saves/${name}`, import.meta.url);

async function open(page: Page, path = '/checklists') {
	await page.goto(path);
	// Ticks only work once the page has hydrated.
	await page.waitForLoadState('networkidle');
}

test('a manual tick persists across reloads', async ({ page }) => {
	await open(page);
	await expect(page.locator('details.stage')).toHaveCount(17);

	const pre = page.locator('details#pre-infinity');
	const item = pre.getByRole('checkbox', { name: /Use Dimensional Sacrifice/ });
	await pre.locator('summary').click();
	await item.check();
	await expect(pre.locator('summary .count')).toHaveText('1/5');

	await page.reload();
	await page.waitForLoadState('networkidle');
	await pre.locator('summary').click();
	await expect(item).toBeChecked();
	await expect(pre.locator('summary .count')).toHaveText('1/5');

	await item.uncheck();
	await page.reload();
	await page.waitForLoadState('networkidle');
	await pre.locator('summary').click();
	await expect(item).not.toBeChecked();
});

test('the current stage opens, and an imported save ticks what it shows done', async ({ page }) => {
	await open(page, '/import');
	await page
		.locator('input[type=file]')
		.setInputFiles(fixture('android-3.18.0-native-eternity-paired.txt').pathname);
	await expect(page.locator('.result .stage-name')).toHaveText('Eternity');

	await open(page);
	const eternity = page.locator('details#early-eternity');
	await expect(eternity).toHaveAttribute('open', '');
	await expect(eternity.getByText("You're here")).toBeVisible();
	await expect(
		eternity.getByRole('checkbox', { name: /Complete Eternity Challenge 1/ })
	).not.toBeChecked();

	const infinity = page.locator('details#early-infinity');
	await infinity.locator('summary').click();
	const breakItem = infinity.getByRole('checkbox', { name: /^Break Infinity/ });
	await expect(breakItem).toBeChecked();
	await expect(breakItem).toBeDisabled();
	await expect(infinity.getByText('from your save').first()).toBeVisible();
});

test('a goal ticked by hand on the checklist is done in Next goals too', async ({ page }) => {
	await open(page, '/import');
	await page
		.locator('input[type=file]')
		.setInputFiles(fixture('android-3.18.0-native-eternity-paired.txt').pathname);
	await expect(page.locator('.result .stage-name')).toHaveText('Eternity');

	await open(page, '/');
	const home = page.locator('section.stage ul.goals');
	await expect(home.getByText(/^To do: Reach 100 Eternities/)).toBeVisible();

	await open(page);
	await page
		.locator('details#early-eternity')
		.getByRole('checkbox', { name: /^Reach 100 Eternities/ })
		.check();

	await open(page, '/');
	await expect(home.getByText(/Reach 100 Eternities/)).toHaveCount(0);
	await open(page, '/import');
	await expect(
		page.locator('.result .goals li', { hasText: 'Reach 100 Eternities' })
	).toContainText('Done: Reach 100 Eternities ticked by you');
});
