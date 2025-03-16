import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator';

export class SignInAuthDto {
	@IsString()
	name: string;

	@IsEmail()
	email: string;

	@IsString()
	password: string;

	@IsDateString()
	@IsOptional()
	birthDate: Date;
}
