import { expect, test } from '@playwright/test';

test('marking completions moves the next step and persists across reloads', async ({ page }) => {
	await page.goto('/tools/eternity-challenges');
	const next = page.locator('#next-title');
	await expect(next).toHaveText('EC1 ×1');

	await page.getByRole('button', { name: 'Mark EC1 ×1 done' }).click();
	await expect(next).toHaveText('EC2 ×1');

	await page.getByRole('checkbox', { name: /^EC2 ×1 / }).check();
	await expect(next).toHaveText('EC1 ×2');

	// Set EC4 to two completions from its sheet; EC4 ×1 and ×2 count as done in the list.
	await page.getByRole('button', { name: 'EC4, 0 of 5 completions' }).click();
	const sheet = page.getByRole('dialog', { name: 'Eternity Challenge 4' });
	await expect(sheet.getByText('1.00e2750')).toBeVisible();
	await sheet.getByText('2', { exact: true }).click();
	await sheet.getByRole('button', { name: 'Close' }).click();
	await expect(sheet).toBeHidden();
	await expect(page.getByRole('checkbox', { name: /^EC4 ×2 / })).toBeChecked();

	await page.reload();
	await expect(next).toHaveText('EC1 ×2');
	await expect(page.getByRole('button', { name: 'EC4, 2 of 5 completions' })).toBeVisible();
	await expect(page.getByRole('checkbox', { name: /^EC1 ×1 / })).toBeChecked();
	const stored = await page.evaluate(() => localStorage.getItem('adg:progress:v1'));
	expect(JSON.parse(stored ?? '{}').planner['eternity-challenges'].completions).toEqual([
		1, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0
	]);

	// Unchecking a step undoes it.
	await page.getByRole('checkbox', { name: /^EC1 ×1 / }).uncheck();
	await expect(next).toHaveText('EC1 ×1');
});
