import { App } from "obsidian";

interface CanvasNode {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	type: string;
	text: string;
	color: string;
}

export class Utils {
	static async writeFileToVaultPath(
		app: App,
		path: string,
		data: string
	): Promise<void> {
		// if file exists, overwrite it, else create it
		const vault = app.vault;
		const fileExists = await vault.adapter.exists(path);
		if (fileExists) {
			await vault.adapter.write(path, data);
		} else {
			await vault.create(path, data);
		}
	}

	static jsonToMarkdown(data: string): string {
		// parse json, pretty-file it
		const json = JSON.parse(data);
		const prettyJson = JSON.stringify(json, null, 2);
		const markdown = `
\`\`\`json
${prettyJson}
\`\`\`
`;
		return markdown;
	}

	static markdownToSections(markdown: string): string[] {
		// divide markdown into sections, return non-empty sections as array
		const sections = markdown.split(/(?<=\n# )/);
		const sections_mapped = sections.map((section) => {
			if (!section.startsWith("# ")) {
				return "# " + section;
			} else {
				return section;
			}
		});
		return sections_mapped;
	}

	static markdownSectionToCanvasNode(
		section: string,
		section_idx: number
	): CanvasNode {
		// generate a random node id
		const id = section_idx + "-" + Math.random().toString(36).substring(7);
		const node = {
			id: id,
			x: 0,
			y: 250 * section_idx,
			width: 300,
			height: 200,
			type: "text",
			text: section,
			color: "1",
		};

		return node;
	}

	static markdownToCanvasString(markdown: string): string {
		const sections = Utils.markdownToSections(markdown);

		const nodes = sections.map((section, idx) => {
			return Utils.markdownSectionToCanvasNode(section, idx);
		});

		const doc = {
			nodes: nodes,
			edges: [],
		};

		const doc_str = JSON.stringify(doc, null, 2);
		return doc_str;
	}
}
