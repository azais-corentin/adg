import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

const scriptFile = (id: string) =>
	readFileSync(new URL(`../../../lib/tools/automator/scripts/${id}.txt`, import.meta.url), 'utf8');

async function open(page: Page) {
	await page.goto('/tools/automator');
	// The filter and copy buttons only work once the page has hydrated.
	await page.waitForLoadState('networkidle');
}

test('the stage filter shows one stage, your stage by default', async ({ page }) => {
	await open(page);
	const filter = page.getByRole('group', { name: 'Show scripts for' });
	const all = filter.getByRole('radio', { name: /All stages/ });
	await expect(all).toBeChecked();
	await expect(page.locator('article#ep-doubler')).toBeVisible();

	const reality = filter.getByRole('radio', { name: /^Reality \(\d+\)/ });
	await reality.check({ force: true });
	await expect(reality).toBeChecked();
	await expect(page.getByRole('heading', { level: 2 })).toHaveText(['Reality']);
	await expect(page.locator('article#ep-doubler')).toBeVisible();

	await page.evaluate(() =>
		localStorage.setItem(
			'adg:progress:v1',
			JSON.stringify({ version: 1, stage: 'early-reality', stageSource: 'manual' })
		)
	);
	await page.reload();
	await page.waitForLoadState('networkidle');
	await expect(filter.getByRole('radio', { name: /^Reality .*your stage/ })).toBeChecked();
	await all.check({ force: true });
	await expect(all).toBeChecked();
	// Your stage's scripts come first.
	await expect(page.getByRole('heading', { level: 2 }).first()).toHaveText('Reality');
});

test('the copy button puts the exact script on the clipboard', async ({ page, context }) => {
	await context.grantPermissions(['clipboard-read', 'clipboard-write']);
	await open(page);
	const card = page.locator('article#ep-doubler');
	await card.getByRole('button', { name: 'Copy script' }).click();
	await expect(card.getByRole('status')).toHaveText(/Copied/);
	const copied = await page.evaluate(() => navigator.clipboard.readText());
	expect(copied).toBe(scriptFile('ep-doubler').replace(/\n$/, ''));
});
