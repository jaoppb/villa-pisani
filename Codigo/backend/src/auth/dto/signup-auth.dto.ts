import {
	IsDateString,
	IsEmail,
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

	@IsDateString()
	@IsOptional()
	birthDate: Date;
}
