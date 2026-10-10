import { expect, test, type Page } from '@playwright/test';

const fixture = (name: string) => new URL(`../../../../fixtures/saves/${name}`, import.meta.url);

async function importSave(page: Page, name: string) {
	await page.goto('/import');
	await page.waitForLoadState('networkidle');
	await page.locator('input[type=file]').last().setInputFiles(fixture(name).pathname);
	await expect(page.locator('.result .stage-name')).toBeVisible();
}

test('marks by hand belong to their save; a newer import is followed again', async ({ page }) => {
	await importSave(page, 'community/eternity-challenges.txt');
	await page.goto('/tools/eternity-challenges');
	await page.getByText('Marked by hand', { exact: true }).click();
	await expect(page.getByRole('radio', { name: 'Marked by hand' })).toBeChecked();
	await expect(page.getByTestId('ec-source-hint')).toContainText('Marked by hand, starting from');

	await importSave(page, 'community/late-eternity.txt');
	await page.goto('/tools/eternity-challenges');
	await expect(page.getByRole('radio', { name: 'Your save' })).toBeChecked();
	await expect(page.getByTestId('ec-source-hint')).toContainText('Read from your save from');
});

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
	await expect(sheet.getByText('1e2750')).toBeVisible();
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

test('the next step’s tree opens in the Time Study planner and checks against a TT budget', async ({
	page
}) => {
	await page.goto('/tools/eternity-challenges');
	const tree = '11,22,32,42,51,61,72,82,92,102,111,121,131,141,151,161,171|1';
	await expect(
		page.getByRole('textbox', { name: 'Study string for EC1 ×1 with the game on screen' })
	).toHaveValue(tree);
	// Study 131 stops Replicanti Galaxies offline, so the step also offers a Passive tree.
	await expect(
		page.getByRole('textbox', { name: 'Study string for EC1 ×1 with the app closed' })
	).toHaveValue('11,22,32,42,51,61,72,82,92,102,111,122,132,142,151,161,171|1');
	await page.getByRole('link', { name: 'Open in the Time Study planner' }).first().click();

	await expect(page).toHaveURL(/\/tools\/time-studies$/);
	await expect(page.getByTestId('export')).toHaveValue(tree);
	await expect(page.getByTestId('tt-total')).toHaveText('130');

	await page.getByTestId('tt-budget').fill('120');
	await page.getByTestId('tt-budget').blur();
	await expect(page.getByTestId('budget-verdict')).toContainText('10 TT short');
	await expect(page.getByTestId('budget-verdict')).toContainText('leave out EC1');
});
