export interface loginRequest {
	email: string;
	password: string;
}

export interface loginResponse {
	accessToken: string;
}

export interface registerRequest {
	name: string;
	email: string;
	birthDate: string;
	password: string;
}

export interface registerErrorResponse {
	message: string;
	error: string;
	statusCode: number;
}