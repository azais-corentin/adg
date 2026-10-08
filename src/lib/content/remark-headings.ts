/**
 * Remark plugin for mdsvex: gives every h2/h3 a stable `id` (so TOC links work in
 * the prerendered HTML) and records the h2s in the frontmatter as `headings`, which
 * mdsvex exports as part of `metadata`.
 *
 * Written against the minimal mdast shape so it needs no extra dependencies.
 */

export interface ArticleHeading {
	id: string;
	text: string;
}

interface MdNode {
	type: string;
	depth?: number;
	value?: string;
	children?: MdNode[];
	data?: { hProperties?: Record<string, unknown> };
}

interface MdFile {
	data: { fm?: Record<string, unknown> };
}

export function slugify(text: string): string {
	return text
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/['’]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function textOf(node: MdNode): string {
	if (typeof node.value === 'string') return node.value;
	return (node.children ?? []).map(textOf).join('');
}

function visitHeadings(node: MdNode, found: MdNode[]): void {
	if (node.type === 'heading') {
		found.push(node);
		return;
	}
	for (const child of node.children ?? []) visitHeadings(child, found);
}

export default function remarkHeadings() {
	return (tree: MdNode, file: MdFile) => {
		const headings: MdNode[] = [];
		visitHeadings(tree, headings);
		const used = new Map<string, number>();
		const toc: ArticleHeading[] = [];
		for (const heading of headings) {
			if (heading.depth !== 2 && heading.depth !== 3) continue;
			const text = textOf(heading).trim();
			const base = slugify(text) || 'section';
			const count = used.get(base) ?? 0;
			used.set(base, count + 1);
			const id = count === 0 ? base : `${base}-${count + 1}`;
			heading.data = { ...heading.data, hProperties: { ...heading.data?.hProperties, id } };
			if (heading.depth === 2) toc.push({ id, text });
		}
		if (file.data.fm) file.data.fm.headings = toc;
	};
}
