import { OmitType } from '@nestjs/swagger';
import { MeetingFile } from '../entities/file.entity';

export class ReadMeetingFileDto extends OmitType(MeetingFile, [
	'meeting',
] as const) {
	url: string;

	constructor(file: MeetingFile) {
		super();
		Object.assign(this, file);

		this.url = file.getUrl();
	}
}
