import { IsOptional, IsString } from 'class-validator';
import { SignUpAuthDto } from 'src/auth/dto/signup-auth.dto';

export class AcceptInviteDto {
	@IsString()
	inviteToken: string;

	@IsOptional()
	signUp?: SignUpAuthDto;
}
