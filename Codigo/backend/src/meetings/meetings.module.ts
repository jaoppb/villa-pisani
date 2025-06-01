import { Module } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { MeetingsController } from './meetings.controller';
import { MeetingFilesController } from './files/files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from './entities/meeting.entity';
import { MeetingFile } from './files/entities/file.entity';

@Module({
	controllers: [MeetingsController, MeetingFilesController],
	providers: [MeetingsService],
	imports: [TypeOrmModule.forFeature([Meeting, MeetingFile])],
})
export class MeetingsModule {}
