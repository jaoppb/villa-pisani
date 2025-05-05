import { Apartments } from "./apartment.model";

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

export enum Role {
	MANAGER = 'manager',
	INHABITANT = 'inhabitant',
	EMPLOYEE = 'employee',
}

export interface payloadToken {
	email: string;
	sub: string;
	roles: Role[];
	iss: string;
	iat: number;
	exp: number;
}

export interface User {
	id: string;
	name: string;
	email: string;
	createAt: string;
	updateAt: string;
	birthDate: string | null;
	roles: Role[];
	lastPasswordChange: string;
	apartment: Apartments | null;
}
