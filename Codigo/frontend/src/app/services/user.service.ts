import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { loginRequest, loginResponse, registerRequest } from "../model/user.model";
import { tap } from "rxjs";
import { AccessTokenService } from "./accessToken.service";

@Injectable({
	providedIn: 'root',
})
export class UserService {
	constructor(
		private http: HttpClient,
		private tokenService: AccessTokenService,
	) {}

	register(data: registerRequest) {
		return this.http.post('auth/signup',
			data,
			{ observe: 'response' })
	}

	login(data: loginRequest) {
		return this.http
		.post<loginResponse>('auth/signin', 
			data,
			{ observe: 'response' })
		.pipe(
			tap(({ body }) => {
				if (body) {
					this.tokenService.AccessToken = body.accessToken;
				}
			})
		);
	}
}