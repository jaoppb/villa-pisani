import { Module } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { MeetingsController } from './meetings.controller';
import { MeetingFilesController } from './files/files.controller';

@Module({
	controllers: [MeetingsController, MeetingFilesController],
	providers: [MeetingsService],
})
export class MeetingsModule {}
