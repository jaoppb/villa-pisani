import {
	IntersectionType,
	OmitType,
	PartialType,
	PickType,
} from '@nestjs/mapped-types';
import { UpdateUserDto } from './update-user.dto';
import { User } from '../entities/user.entity';

export class UpdatedUserDto extends IntersectionType(
	OmitType(UpdateUserDto, ['password'] as const),
	PartialType(PickType(User, ['id', 'createAt', 'updateAt'])),
) {}
