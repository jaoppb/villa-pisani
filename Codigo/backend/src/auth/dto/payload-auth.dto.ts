export class PayloadAuthDto {
	email: string;
	sub: string;
	roles: string[];
	permissions: string[];
	exp: number;
	iat: number;
	iss: string;
}
