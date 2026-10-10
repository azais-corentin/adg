import { describe, expect, it } from 'vitest';
import { articles } from '#lib/content/articles.server.ts';
import { markdownSections } from './build.ts';
import { searchIndex } from './index.server.ts';
import { prepareIndex, search } from './search.ts';

const prepared = prepareIndex(searchIndex);
const top = (query: string) => search(prepared, query).results[0];

describe('markdownSections', () => {
	it('splits at h2/h3 with remark-headings ids and renders components as text', () => {
		const md = [
			'---',
			"title: 'T'",
			'---',
			'<script>',
			"\timport Num from '#lib/components/Num.svelte';",
			'</script>',
			'',
			'Intro with **bold** and a [link](/guide). <!-- source note -->',
			'',
			'## Costs: 1e10,500 and more',
			'',
			'| Upgrade | Cost |',
			'| - | ---- |',
			'| Big one | <Num value="1e10500" /> |',
			'',
			'<Screen',
			'\tsrc="x.webp"',
			'\talt="Alt text here."',
			'\tcaption="Caption text."',
			'/>',
			'',
			'### Notes',
			'',
			'<Callout kind="tip">',
			'',
			'- `code` and _emphasis_',
			'',
			'</Callout>',
			'',
			'## Notes'
		].join('\n');
		expect(markdownSections(md)).toEqual([
			{ id: '', heading: '', depth: 0, text: 'Intro with bold and a link.' },
			{
				id: 'costs-1e10-500-and-more',
				heading: 'Costs: 1e10,500 and more',
				depth: 2,
				text: 'Upgrade · Cost. Big one · 1e10,500. Caption text. Alt text here.'
			},
			{ id: 'notes', heading: 'Notes', depth: 3, text: 'code and emphasis' },
			{ id: 'notes-2', heading: 'Notes', depth: 2, text: '' }
		]);
	});

	it('gives every article h2 the id and text the page uses', () => {
		for (const [a, article] of articles.entries()) {
			const ids = searchIndex.sections
				.filter((s) => s.a === a)
				.map((s) => ({ id: s.id, text: s.heading }));
			for (const heading of article.headings) expect(ids).toContainEqual(heading);
		}
	});
});

describe('search', () => {
	it('finds a perk by its label', () => {
		expect(top('DILR')).toMatchObject({ kind: 'Perk', heading: 'DILR', slug: 'm1/perk-tree' });
	});

	it('finds a Ra memory level and links to the pet levels', () => {
		expect(top('Effarig level 10')).toMatchObject({
			kind: 'Ra memory level',
			heading: 'Effarig level 10',
			slug: 'm2/ra-memories',
			id: 'key-levels-per-pet'
		});
	});

	it('finds a section by its heading before mere mentions', () => {
		expect(top('perk point shop')).toMatchObject({
			slug: 'm2/teresa-unlock-pour',
			id: 'the-perk-point-shop'
		});
	});

	it('ranks the section where the query words sit together above scattered matches', () => {
		// "Reality Machines have a cap": the RM cap that unlocks Imaginary Machines.
		expect(top('reality machines cap')).toMatchObject({
			slug: 'm2/imaginary-machines',
			id: 'unlocking-imaginary-machines'
		});
		expect(top('tesseract cost')).toMatchObject({ slug: 'm2/tesseracts-after', id: 'costs' });
	});

	it('ignores apostrophes, accents and thousands separators', () => {
		expect(search(prepared, 'laitela').total).toBe(search(prepared, "Lai'tela").total);
		expect(search(prepared, '1e10500').total).toBeGreaterThan(0);
		expect(search(prepared, '1e10500').total).toBe(search(prepared, '1e10,500').total);
	});

	it('needs every word, and marks them in the snippet', () => {
		const { results } = search(prepared, 'decoherence refining');
		expect(results.length).toBeGreaterThan(0);
		const marks = results[0]?.snippet.filter((p) => p.mark).map((p) => p.text.toLowerCase());
		expect(marks).toContain('decoherence');
		expect(search(prepared, 'decoherence zzzzqx').total).toBe(0);
		expect(search(prepared, '  ').total).toBe(0);
	});

	it('shows table rows as cells and centres the snippet where the words meet', () => {
		const result = search(prepared, 'tickspeed autobuyer').results.find(
			(r) => r.id === 'the-nine-in-suggested-order'
		);
		const text = result?.snippet.map((p) => p.text).join('') ?? '';
		expect(text).toContain('C9 · Tickspeed/dim buys');
		expect(text).toContain('Tickspeed autobuyer upgrades');
		expect(text).not.toMatch(/-{2,}|\|/);
	});
});
