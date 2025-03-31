import { Injectable } from "@angular/core";
import { jwtDecode } from 'jwt-decode';

@Injectable({
	providedIn: 'root',
})
export class AccessTokenService {
	KEY = 'vila-pisane/token';

	get AccessToken(): string {
		return localStorage.getItem(this.KEY) ?? '';
	}

	set AccessToken(token: string) {
		localStorage.setItem(this.KEY, token);
	}

	removeAccessToken(): void {
		localStorage.removeItem(this.KEY);
	}

	get hasToken() {
		const token = this.AccessToken;
		if (!token) return false;

		const { exp } = jwtDecode(token);
		if (!exp) return false;

		const expDate = new Date(exp * 1000);
		const now = new Date();
		
		if (expDate < now) {
			this.removeAccessToken();
			return false;
		}
		return true;
	}
}