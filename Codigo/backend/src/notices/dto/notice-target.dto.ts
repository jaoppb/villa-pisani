import { NoticeTarget } from '../enum/notice-target.enum';
import { OneOf } from 'src/validators/one-of.validator';
import { Role } from 'src/auth/roles/role.entity';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { IsEnum, isEnum } from 'class-validator';

export class NoticeTargetDto {
	@IsEnum(NoticeTarget)
	type: NoticeTarget;

	@OneOf({
		matchers: [
			(value: any) => {
				return (
					Array.isArray(value) &&
					value.every((each) => isEnum(each, NoticeTarget))
				);
			},
			(value: any) => {
				return (
					Array.isArray(value) &&
					value.every((each) => each instanceof Apartment)
				);
			},
		],
	})
	targets: Role[] | Apartment[];
}
