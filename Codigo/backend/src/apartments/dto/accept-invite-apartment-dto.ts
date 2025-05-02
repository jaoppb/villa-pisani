import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { SignUpAuthDto } from 'src/auth/dto/signup-auth.dto';

export class AcceptInviteDto {
	@IsString()
	inviteToken: string;

	@IsOptional()
	@ValidateNested()
	@Type(() => SignUpAuthDto)
	signUp?: SignUpAuthDto;
}
