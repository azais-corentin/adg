import { defineConfig, devices } from '@playwright/test';

// Browsers come from nixpkgs (PLAYWRIGHT_BROWSERS_PATH, set by flake.nix); the
// @playwright/test version is pinned to match playwright-driver.
export default defineConfig({
	webServer: { command: 'bun run build && bun run preview', port: 4173 },
	testMatch: '**/*.e2e.{ts,js}',
	use: { baseURL: 'http://localhost:4173' },
	projects: [{ name: 'mobile', use: { ...devices['Pixel 7'] } }]
});
