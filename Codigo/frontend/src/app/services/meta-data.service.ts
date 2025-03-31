import { Injectable, OnInit } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";

@Injectable({
	providedIn: 'root',
})
export class MetaData implements OnInit {
	titleTemplate = '%s | Villa Pisani';
	private metaData: Record<string, string> = {};

	constructor(
		private metaService: Meta,
		private titleService: Title,
	) {}

	ngOnInit(): void {
		// Default meta data
		this.setMetaData({
			title: 'Villa Pisani',
			description: 'Default description for Villa Pisani',
			keywords: 'villa pisani',
		});
	}

	setMetaData(metaData: Record<string, string>): void {
		if (metaData['title']) {
			this.title = metaData['title'];
		}

		Object.keys(metaData).forEach((key) => {
			if (key !== 'title') {
				this.metaData[key] = metaData[key];
				this.metaService.updateTag({ name: key, content: metaData[key] });
			}
		});
	}

	getMetaData(key: string): string | undefined {
		return this.metaData[key];
	}

	removeMetaData(key: string): void {
		delete this.metaData[key];
		this.metaService.removeTag(`name='${key}'`);
	}

	getAllMetaData(): Record<string, string> {
		return { ...this.metaData };
	}

	set title(title: string) {
		const formattedTitle = 
		(title.toLowerCase() === 'villa pisani') ? 'Villa Pisani' :
		(title ? this.titleTemplate.replace('%s', title) : 'Villa Pisani');
		this.titleService.setTitle(formattedTitle);
	}
}