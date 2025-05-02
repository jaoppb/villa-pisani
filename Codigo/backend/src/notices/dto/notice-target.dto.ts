import { NoticeTarget } from '../enum/notice-target.enum';
import { Role } from 'src/auth/roles/role.entity';
import { ArrayNotEmpty, IsEnum, IsPositive, ValidateIf } from 'class-validator';

export class NoticeTargetDto {
	@IsEnum(NoticeTarget)
	type: NoticeTarget;

	@ValidateIf((o: NoticeTargetDto) => o.type === NoticeTarget.ROLES)
	@IsEnum(Role, { each: true })
	@ArrayNotEmpty()
	roles?: Role[];

	@ValidateIf((o: NoticeTargetDto) => o.type === NoticeTarget.APARTMENTS)
	@IsPositive({ each: true })
	@ArrayNotEmpty()
	apartments?: number[];
}
