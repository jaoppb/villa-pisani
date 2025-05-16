import { User } from '../entities/user.entity';
import { Role } from 'src/auth/roles/role.entity';
import { Apartment } from 'src/apartments/entities/apartment.entity';

export class SafeUserDto {
	id: string;
	name: string;
	email: string;
	birthDate?: Date;
	roles: Role[];
	apartment?: Apartment;
	createAt: Date;
	updateAt: Date;
	lastPasswordChange: Date;

	constructor(user: User) {
		this.id = user.id;
		this.name = user.name;
		this.email = user.email;
		this.birthDate = user.birthDate;
		this.roles = user.roles;
		this.apartment = user.apartment;
		this.createAt = user.createAt;
		this.updateAt = user.updateAt;
		this.lastPasswordChange = user.lastPasswordChange;
	}
}
