import { Injectable } from "@angular/core";
import { jwtDecode } from 'jwt-decode';
import { payloadToken, Role } from "../model/user.model";
import { CookieService } from "./cookie.service";

@Injectable({
	providedIn: 'root',
})
export class AccessTokenService {
	KEY = 'accessToken';
	constructor(private cookieService: CookieService) {}

	get AccessToken(): string {
		const token = this.cookieService.get(this.KEY);
		this.isTokenValid(token);
		if (!this.isTokenValid(token)) {
			this.removeAccessToken();
			return '';
		}
		return this.cookieService.get(this.KEY) || '';
	}

	set AccessToken(token: string) {
		this.cookieService.set(this.KEY, token);
	}

	removeAccessToken(): void {
		this.cookieService.delete(this.KEY);
	}

	isTokenValid(token: string): boolean {
		try {
			const { exp, iss } = jwtDecode<payloadToken>(token);
			if (!exp) return false;

			const currentTime = Math.floor(Date.now() / 1000);
			return exp > currentTime && iss === 'login';
		} catch (error) {
			return false;
		}
	}

	get hasToken() {
		const token = this.AccessToken;
		if (!token) return false;

		if (!this.isTokenValid(token)) {
			this.removeAccessToken();
			return false;
		}
		return true;
	}

	get timeToExpire() {
		const token = this.AccessToken;
		if (!token) return 0;
		const { exp } = jwtDecode<payloadToken>(token);
		if (!exp) return 0;
		return exp;
	}

	private hasRole(role: Role): boolean {
		const token = this.AccessToken;
		if (!token) return false;

		if (!this.isTokenValid(token)) {
			this.removeAccessToken();
			return false;
		}

		const { roles } = jwtDecode<payloadToken>(token);
		if (!roles) return false;

		return Array.isArray(roles) && roles.includes(role);
	}

	get hasManager() {
		return this.hasRole(Role.MANAGER);
	}

	get hasInhabitant() {
		return this.hasRole(Role.INHABITANT);
	}

	get hasEmployee() {
		return this.hasRole(Role.EMPLOYEE);
	}
}
