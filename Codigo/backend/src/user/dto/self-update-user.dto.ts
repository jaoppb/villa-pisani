import { OmitType } from '@nestjs/swagger';
import { UpdateUserDto } from './update-user.dto';

export class SelfUpdateUserDto extends OmitType(UpdateUserDto, [
	'roles',
] as const) {}
