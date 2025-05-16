import { UpdateUserDto } from './update-user.dto';
import { PickType } from '@nestjs/swagger';

export class SelfUpdateUserDto extends PickType(UpdateUserDto, [
	'birthDate',
	'email',
	'name',
	'password',
] as const) {}
