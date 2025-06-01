import { Controller, Get, Param, Delete } from '@nestjs/common';
import { MeetingFilesService } from './files.service';

@Controller('files')
export class MeetingFilesController {
	constructor(private readonly filesService: MeetingFilesService) {}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.filesService.findOne(id);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.filesService.remove(id);
	}
}
