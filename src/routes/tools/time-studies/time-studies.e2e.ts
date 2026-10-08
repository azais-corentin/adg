import { expect, test } from '@playwright/test';

test('imports a study string, edits it on the tree, and exports it', async ({ page }) => {
	await page.goto('/tools/time-studies');
	const study = (id: string) => page.locator(`[data-study="${id}"]`);
	const total = page.getByTestId('tt-total');
	const exported = page.getByTestId('export');
	await expect(study('11')).toBeVisible();
	await expect(total).toHaveText('0');

	// Ranges and group names, as the game accepts them.
	await page.getByLabel('Import a study string').fill('11-61, antimatter, 111, passive, 151-171|2');
	await page.getByRole('button', { name: 'Import', exact: true }).click();

	const full = '11,21,22,31,32,33,41,42,51,61,71,81,91,101,111,122,132,142,151,161,162,171|2';
	await expect(exported).toHaveValue(full);
	await expect(total).toHaveText('147');
	for (const id of ['11', '61', '71', '101', '122', '171', 'EC2']) {
		await expect(study(id)).toHaveAttribute('aria-pressed', 'true');
	}
	await expect(study('72')).toHaveAttribute('aria-pressed', 'false');
	await expect(page.getByText('Antimatter Dims · Passive')).toBeVisible();

	// Inspect a study, then remove one in add/remove mode: what needed it goes too.
	await study('72').click();
	await expect(page.getByRole('dialog', { name: 'Time Study 72' })).toContainText(
		'Only one Dimension path (71–103) until you buy study 201.'
	);
	await page.getByRole('button', { name: 'Close details' }).click();

	await page.getByText('Add / remove').click();
	await study('22').click();
	await expect(page.getByRole('status')).toHaveText(
		'Removed study 22, and what needed it: 32, 33, 42.'
	);
	await expect(total).toHaveText('135');
	await expect(exported).toHaveValue(
		'11,21,31,41,51,61,71,81,91,101,111,122,132,142,151,161,162,171|2'
	);

	// The build survives a reload.
	await page.reload();
	await expect(exported).toHaveValue(
		'11,21,31,41,51,61,71,81,91,101,111,122,132,142,151,161,162,171|2'
	);
});

test('explains strings the game would reject', async ({ page }) => {
	await page.goto('/tools/time-studies');
	await expect(page.locator('[data-study="11"]')).toBeVisible();
	await page.getByLabel('Import a study string').fill('11,21|1|2');
	await page.getByRole('button', { name: 'Import', exact: true }).click();
	await expect(page.getByRole('alert')).toHaveText(
		'Only one "|" is allowed, before the EC number at the end.'
	);
	await expect(page.getByTestId('export')).toHaveValue('|0');
});
