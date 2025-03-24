import { Injectable, OnInit, Renderer2 } from '@angular/core';
import { Theme } from '../enums/themes.enum';

@Injectable({
	providedIn: 'root',
})
export class ThemeManagerService implements OnInit{
	themalight = true;
	constructor(private renderer: Renderer2) {
		this.ngOnInit();
	}

	ngOnInit(): void {
		if (typeof window !== 'undefined') {
			const savedTheme = localStorage.getItem('user-theme');
			if (savedTheme) {
				this.themalight = savedTheme === 'light';
			} else {
				this.detectSystemTheme();
			}
			this.updateBodyClass();
		} else {
			console.warn('localStorage não está disponível no lado do servidor.');
		}
	}

	public switchTheme(): boolean {
		this.themalight = !this.themalight;
		localStorage.setItem('user-theme', this.themalight ? 'light' : 'dark');
		this.updateBodyClass();
		return this.themalight
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
}