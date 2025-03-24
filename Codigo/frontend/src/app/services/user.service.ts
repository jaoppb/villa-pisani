import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { loginRequest, loginResponse } from "../model/user.model";
import { Observable, tap } from "rxjs";

@Injectable({
	providedIn: 'root',
})
export class UserService {
	constructor(
		private http: HttpClient
	) {}

	register(data: any) {
		return this.http.post('http://localhost:3000/register', data);
	}

	login(data: loginRequest) {
		return this.http
		.post<loginResponse>('auth/signin', 
			data,
			{ observe: 'response' })
		.pipe(
			tap(({ body }) => {
				if (body) {
					localStorage.setItem('token', body.accessToken);
				}
			})
		);
	}
}