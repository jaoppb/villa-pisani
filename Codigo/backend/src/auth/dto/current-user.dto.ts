import { Role } from '../roles/role.entity';

export class CurrentUserDto {
	id: string;
	name: string;
	email: string;
	createAt: Date;
	updateAt: Date;
	birthDate?: Date;
	roles: Role[];
}
