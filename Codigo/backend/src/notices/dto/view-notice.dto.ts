import { SafeUserDto } from 'src/user/dto/safe-user.dto';
import { Notice } from '../entities/notice.entity';
import { OmitType } from '@nestjs/swagger';

export class ViewNoticeDto extends OmitType(Notice, ['author'] as const) {
	author: SafeUserDto;

	constructor(notice: Notice) {
		super();

		Object.assign(this, notice);

		this.author = new SafeUserDto(notice.author);

		for (const [key, value] of Object.entries(this)) {
			if (value === null) {
				delete this[key];
			}
		}
	}
}
