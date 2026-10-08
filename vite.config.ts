import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vitest/config';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import remarkHeadings from './src/lib/content/remark-headings.ts';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true,
				// mdsvex 0.12 still emits `<script context="module">` for frontmatter.
				warningFilter: (warning) =>
					!(warning.code === 'script_context_deprecated' && warning.filename?.endsWith('.md'))
			},
			// 404.html is served by Cloudflare for unknown paths (assets.not_found_handling).
			adapter: adapter({ fallback: '404.html' }),
			preprocess: [mdsvex({ extensions: ['.svx', '.md'], remarkPlugins: [remarkHeadings] })],
			extensions: ['.svelte', '.svx', '.md']
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
