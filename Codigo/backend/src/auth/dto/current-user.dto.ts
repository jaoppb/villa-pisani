import { OmitType } from '@nestjs/mapped-types';
import { User } from 'src/user/entities/user.entity';

export class CurrentUserDto extends OmitType(User, [
	'password',
	'feedbacks',
] as const) {
	constructor(user: User) {
		super();
		this.id = user.id;
		this.name = user.name;
		this.email = user.email;
		this.createAt = user.createAt;
		this.updateAt = user.updateAt;
		this.birthDate = user.birthDate;
		this.roles = user.roles;
		this.lastPasswordChange = user.lastPasswordChange;
		this.apartment = user.apartment;
	}
}
