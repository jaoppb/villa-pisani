import { Injectable } from "@angular/core";
import { jwtDecode } from 'jwt-decode';
import { payloadToken, Role } from "../model/user.model";

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

	isTokenValid(token: string): boolean {
		try {
			const { exp } = jwtDecode<payloadToken>(token);
			if (!exp) return false;

			const currentTime = Math.floor(Date.now() / 1000);
			return exp > currentTime;
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