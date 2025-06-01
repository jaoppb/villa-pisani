import { File } from 'src/files/entities/file.entity';
import { LazyMapTo } from 'src/interceptors/meta/lazy-map-to.decorator';
import { Meeting } from 'src/meetings/entities/meeting.entity';
import { Entity, OneToOne, Relation } from 'typeorm';

@Entity('meeting_files')
@LazyMapTo({
	path: 'meetings/files/dto/read-file.dto',
	className: 'ReadMeetingFileDto',
})
export class MeetingFile extends File {
	@OneToOne(() => Meeting, (meeting) => meeting.file)
	meeting: Relation<Meeting>;

	getUrl(): string {
		return `meetings/${this.id}`;
	}
}
