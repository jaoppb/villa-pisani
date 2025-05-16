import {
	IsDateString,
	IsEmail,
	IsJWT,
	IsOptional,
	IsString,
	IsStrongPassword,
	Length,
} from 'class-validator';

export class SignUpAuthDto {
	@IsString()
	@Length(3, 255)
	name: string;

	@IsEmail()
	email: string;

	@IsStrongPassword({
		minLength: 8,
		minNumbers: 1,
		minSymbols: 1,
		minUppercase: 1,
	})
	password: string;

	@IsString()
	@IsJWT()
	invite: string;

	@IsDateString()
	@IsOptional()
	birthDate?: Date;
}
