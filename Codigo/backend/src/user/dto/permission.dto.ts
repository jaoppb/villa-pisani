import { IsEnum, IsUUID } from 'class-validator';
import { Role } from '../../auth/roles/role.entity';

export class ChangePermissionDto {
	@IsUUID()
	userId: string;

	@IsEnum(Role, { each: true })
	roles: Role[];
}
