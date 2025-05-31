import { Controller, Delete, Get, Param, StreamableFile } from '@nestjs/common';
import { BillFilesService } from './files.service';
import { Roles } from 'src/auth/roles/role.decorator';
import { Role } from 'src/auth/roles/role.entity';

@Controller('files/bills')
export class BillFilesController {
	constructor(private readonly filesService: BillFilesService) {}

	@Delete(':id')
	@Roles(Role.MANAGER)
	remove(@Param('id') id: string) {
		return this.filesService.deleteFile(id);
	}

	@Get(':id')
	async readFile(@Param('id') id: string) {
		const { file, data } = await this.filesService.readFile(id);
		return new StreamableFile(data, {
			type: file.mimetype,
			disposition: 'attachment; filename=' + file.name,
		});
	}
}
