import { IsEmail, IsJWT, IsString } from 'class-validator';

export class SignInAuthDto {
	@IsEmail()
	email: string;

	@IsString()
	password: string;

	@IsString()
	@IsJWT()
	invite: string;
}
