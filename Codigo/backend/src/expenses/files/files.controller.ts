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

@Controller('expenses/files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post(':expenseId')
	@UseInterceptors(FilesInterceptor('file'))
	@Roles(Role.MANAGER)
	upload(
		@UploadedFiles() files: Array<Express.Multer.File>,
		@Param('expenseId') expenseId: string,
	) {
		return this.filesService.uploadAll(expenseId, files);
	}

	@Delete(':id')
	@Roles(Role.MANAGER)
	remove(@Param('id') id: string) {
		return this.filesService.remove(id);
	}
}
