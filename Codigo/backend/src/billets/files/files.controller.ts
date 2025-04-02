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
import { Roles } from 'src/auth/roles/role.decorator';
import { Role } from 'src/auth/roles/role.entity';

@Controller('billets/files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post(':billetId')
	@UseInterceptors(FilesInterceptor)
	@Roles(Role.MANAGER)
	upload(
		@UploadedFiles() files: Array<Express.Multer.File>,
		@Param('billetId') billetId: string,
	) {
		return this.filesService.uploadAll(billetId, files);
	}

	@Delete(':id')
	@Roles(Role.MANAGER)
	remove(@Param('id') id: string) {
		return this.filesService.remove(id);
	}
}
