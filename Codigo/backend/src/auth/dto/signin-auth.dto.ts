import { IsEmail, IsJWT, IsOptional, IsString } from 'class-validator';

export class SignInAuthDto {
	@IsEmail()
	email: string;

	@IsString()
	password: string;

	@IsString()
	@IsOptional()
	@IsJWT()
	invite?: string;
}
