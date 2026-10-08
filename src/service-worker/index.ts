import { self } from '$app/service-worker';
import { version } from '$app/env';
import { assets, immutable, prerendered } from '$app/manifest';
import { asset, resolve } from '$app/paths';
import type { AssetPath } from '$app/types';

// One cache per deployment; older ones are deleted on activate.
const CACHE = `adg-${version}`;

// Screenshots are large (tens of MB across all stages), so they are cached on
// first view instead of up front. Everything else is precached so every guide
// page, tool, and font works offline next to the game.
const isScreen = (pathname: string) => pathname.includes('/screens/');

const PRECACHE = [
	// Build output is served from the same assets base as `static/`; AssetPath only lists static files.
	...immutable.map((file) => asset(file.path as AssetPath)),
	...assets.map((file) => asset(file.path)).filter((path) => !isScreen(path)),
	...prerendered.map((page) => resolve(page.path))
];
const PRECACHED = new Set<string>(PRECACHE);

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE)
			.then((cache) => cache.addAll(PRECACHE))
			.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
			)
			.then(() => self.clients.claim())
	);
});

async function respond(request: Request): Promise<Response> {
	const url = new URL(request.url);
	const cache = await caches.open(CACHE);

	// Build output and precached assets never change within a deployment.
	if (PRECACHED.has(url.pathname) && request.mode !== 'navigate') {
		const cached = await cache.match(url.pathname);
		if (cached) return cached;
	}

	if (isScreen(url.pathname)) {
		const cached = await cache.match(request);
		if (cached) return cached;
		const response = await fetch(request);
		if (response.ok) await cache.put(request, response.clone());
		return response;
	}

	// Pages: prefer the network so updates show up, fall back to the cached copy offline.
	try {
		const response = await fetch(request);
		if (response.ok && PRECACHED.has(url.pathname)) await cache.put(url.pathname, response.clone());
		return response;
	} catch (error) {
		const cached = (await cache.match(url.pathname)) ?? (await cache.match(request));
		if (cached) return cached;
		if (request.mode === 'navigate') {
			const home = await cache.match(resolve(''));
			if (home) return home;
		}
		throw error;
	}
}

self.addEventListener('fetch', (event) => {
	const url = new URL(event.request.url);
	if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
	event.respondWith(respond(event.request));
});
