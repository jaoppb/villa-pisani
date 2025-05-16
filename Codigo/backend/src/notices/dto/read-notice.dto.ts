import { Notice } from '../entities/notice.entity';

export class ReadNoticeDto extends Notice {
	constructor(notice: Notice) {
		super();

		Object.assign(this, notice);

		for (const [key, value] of Object.entries(this)) {
			if (
				value === null ||
				(Array.isArray(value) && value.length === 0)
			) {
				delete this[key];
			}
		}
	}
}
