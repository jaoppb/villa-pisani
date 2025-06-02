import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { MeetingFilesService } from './files.service';

@Controller('files/meetings')
export class MeetingFilesController {
	constructor(private readonly filesService: MeetingFilesService) {}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		const { buffer, metadata } = await this.filesService.readFile(id);
		return new StreamableFile(buffer, {
			type: metadata.mimetype,
			disposition: `attachment; filename="${metadata.name}"`,
		});
	}
}
