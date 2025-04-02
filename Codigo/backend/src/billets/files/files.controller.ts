import {
	Controller,
	Delete,
	Param,
	Post,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

@Controller('billets/files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post(':billetId')
	@UseInterceptors(FilesInterceptor)
	upload(
		@UploadedFiles() files: Array<Express.Multer.File>,
		@Param('billetId') billetId: string,
	) {
		return this.filesService.uploadAll(billetId, files);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.filesService.remove(id);
	}
}
