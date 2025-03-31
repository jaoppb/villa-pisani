import { Injectable } from '@angular/core';
import { Theme } from '../enums/themes.enum';

const 
	DARK_THEME_CLASS_NAME = 'theme-dark--mode',
	LIGHT_THEME_CLASS_NAME = 'theme-light--mode',
	PREFERS_COLOR_SCHEME_DARK = '(prefers-color-scheme: dark)',
	THEME_PREFERENCE_LOCAL_STORAGE_KEY = 'themePreference';

function preferredScheme(): Theme.DARK | Theme.LIGHT {
	return globalThis.matchMedia(PREFERS_COLOR_SCHEME_DARK).matches ? Theme.DARK : Theme.LIGHT;
}

@Injectable({
	providedIn: 'root',
})
export class ThemeManagerService {
	constructor() {
		console.log("globalThis", );
	}
}