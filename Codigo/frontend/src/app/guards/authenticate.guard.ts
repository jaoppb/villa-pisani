import { Injectable } from "@angular/core";
import { AccessTokenService } from "../services/accessToken.service";

@Injectable({
	providedIn: 'root',
})
export class AuthenticateGuard {
	constructor(
		private tokenService: AccessTokenService,
	) {}

	isLoggedIn(): boolean {
		return this.tokenService.hasToken;
	}
}