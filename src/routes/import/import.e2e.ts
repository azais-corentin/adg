import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

const fixture = (name: string) => new URL(`../../../fixtures/saves/${name}`, import.meta.url);

async function open(page: Page) {
	await page.goto('/import');
	// The file input and the form only work once the page has hydrated.
	await page.waitForLoadState('networkidle');
}

test('an uploaded web/steam export shows its stage and persists across reloads', async ({
	page
}) => {
	await open(page);
	await page
		.locator('input[type=file]')
		.setInputFiles(fixture('android-3.18.0-web-export-eternity-paired.txt').pathname);

	const stage = page.locator('.result .stage-name');
	await expect(stage).toHaveText('Eternity');
	await expect(page.getByRole('heading', { name: 'Next goals' })).toBeVisible();
	await expect(page.getByText('Buy Time Study 171')).toBeVisible();
	await expect(page.getByText('This save came from Export to mobile')).toHaveCount(0);

	await page.reload();
	await expect(stage).toHaveText('Eternity');

	await page.goto('/');
	await expect(page.locator('.stage-name')).toHaveText('Eternity');
	await expect(page.getByText(/From your save \(imported just now\)/)).toBeVisible();
	await expect(page.getByText('Buy Time Study 171')).toBeVisible();

	await page.goto('/import');
	await page.getByRole('button', { name: 'Forget this save' }).click();
	await expect(page.getByRole('heading', { name: '2. Open it here' })).toBeVisible();
	await page.goto('/');
	await expect(page.getByText('Stage not set')).toBeVisible();
});

test('a pasted Export to mobile save is read and flagged', async ({ page }) => {
	await open(page);
	await page
		.getByLabel('Paste the save text')
		.fill(readFileSync(fixture('android-3.17.0-native-pre-break.txt'), 'utf8'));
	await page.getByRole('button', { name: 'Read pasted save' }).click();

	await expect(page.locator('.result .stage-name')).toHaveText('Infinity');
	await expect(page.getByText('This save came from Export to mobile')).toBeVisible();
});

test('a truncated paste explains that the save is cut off', async ({ page }) => {
	await open(page);
	const save = readFileSync(fixture('android-3.18.0-web-export-eternity-paired.txt'), 'utf8');
	await page.getByLabel('Paste the save text').fill(save.slice(0, 600));
	await page.getByRole('button', { name: 'Read pasted save' }).click();

	await expect(page.getByRole('alert')).toContainText('The save is cut off');
	await expect(page.locator('.result')).toHaveCount(0);
});
