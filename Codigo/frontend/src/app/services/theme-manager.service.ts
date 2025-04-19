import { Injectable, OnInit, Renderer2 } from '@angular/core';
import { Theme } from '../enums/themes.enum';
import { CookieService } from './cookie.service';

@Injectable({
	providedIn: 'root',
})
export class ThemeManagerService implements OnInit {
	themalight = true;

	constructor(private renderer: Renderer2, private cookieService: CookieService) {
		this.ngOnInit();
	}

	ngOnInit(): void {
		if (typeof window !== 'undefined') {
			const savedTheme = this.cookieService.get('user-theme');
			if (savedTheme) {
				this.themalight = savedTheme === 'light';
			} else {
				this.detectSystemTheme();
			}
			this.updateBodyClass();
		} else {
			console.warn('Cookies não estão disponíveis no lado do servidor.');
		}
	}

	public switchTheme(): boolean {
		this.themalight = !this.themalight;
		this.cookieService.set('user-theme', this.themalight ? 'light' : 'dark');
		this.updateBodyClass();
		return this.themalight;
	}

	private detectSystemTheme(): void {
		if (typeof window !== 'undefined') {
			const prefersLight = window.matchMedia('(prefers-color-scheme: light)');
			this.themalight = prefersLight.matches;

			prefersLight.addEventListener('change', (event) => {
				this.themalight = event.matches;
				this.updateBodyClass();
			});
		}
	}

	private updateBodyClass(): void {
		const html = document.querySelector('html');
		if (this.themalight) {
			this.renderer.removeClass(html, 'dark-theme');
			this.renderer.addClass(html, 'light-theme');
		} else {
			this.renderer.removeClass(html, 'light-theme');
			this.renderer.addClass(html, 'dark-theme');
		}
	}

	public setPageMetadata(title: string, description: string): void {
		if (typeof document !== 'undefined') {
			document.title = title;
			let metaDescription = document.querySelector('meta[name="description"]');
			if (!metaDescription) {
				metaDescription = document.createElement('meta');
				metaDescription.setAttribute('name', 'description');
				document.head.appendChild(metaDescription);
			}
			metaDescription.setAttribute('content', description);
		}
	}
}
