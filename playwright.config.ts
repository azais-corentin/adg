import { defineConfig, devices } from '@playwright/test';

// Browsers come from nixpkgs (PLAYWRIGHT_BROWSERS_PATH, set by flake.nix); the
// @playwright/test version is pinned to match playwright-driver.
export default defineConfig({
	webServer: { command: 'bun run build && bun run preview', port: 4173 },
	testMatch: '**/*.e2e.{ts,js}',
	// The offline service worker precaches the whole site on first load; keep it out of
	// behaviour tests (offline.e2e.ts opts back in).
	use: { baseURL: 'http://localhost:4173', serviceWorkers: 'block' },
	projects: [{ name: 'mobile', use: { ...devices['Pixel 7'] } }]
});
