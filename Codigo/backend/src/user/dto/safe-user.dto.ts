import {
	IntersectionType,
	OmitType,
	PartialType,
	PickType,
} from '@nestjs/mapped-types';
import { UpdateUserDto } from './update-user.dto';
import { User } from '../entities/user.entity';

export class SafeUserDto extends IntersectionType(
	OmitType(UpdateUserDto, ['password'] as const),
	PartialType(
		PickType(User, ['id', 'createAt', 'updateAt', 'lastPasswordChange']),
	),
) {
	constructor(user: User) {
		super();
		this.id = user.id;
		this.name = user.name;
		this.email = user.email;
		this.birthDate = user.birthDate;
		this.createAt = user.createAt;
		this.updateAt = user.updateAt;
		this.roles = user.roles;
		this.lastPasswordChange = user.lastPasswordChange;
	}
}
