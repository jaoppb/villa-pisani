import { File } from 'src/files/entities/file.entity';
import { LazyMapTo } from 'src/interceptors/meta/lazy-map-to.decorator';
import { Meeting } from 'src/meetings/entities/meeting.entity';
import { OneToOne } from 'typeorm';

@LazyMapTo({
	path: 'meetings/files/dto/read-file.dto',
	className: 'ReadMeetingFileDto',
})
export class MeetingFile extends File {
	@OneToOne(() => Meeting, (meeting) => meeting.file)
	meeting: Meeting;

	getUrl(): string {
		return `meetings/${this.id}`;
	}
}
