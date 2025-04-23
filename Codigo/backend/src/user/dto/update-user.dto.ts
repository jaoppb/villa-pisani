import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { SignUpAuthDto } from 'src/auth/dto/signup-auth.dto';
import { Role } from 'src/auth/roles/role.entity';

export class UpdateUserDto extends PartialType(SignUpAuthDto) {
	@IsEnum(Role, { each: true })
	@IsOptional()
	roles?: Role[];
}
