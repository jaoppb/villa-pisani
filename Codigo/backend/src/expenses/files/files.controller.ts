import { Controller, Delete, Get, Param, StreamableFile } from '@nestjs/common';
import { ExpenseFilesService } from './files.service';
import { Roles } from 'src/auth/roles/role.decorator';
import { Role } from 'src/auth/roles/role.entity';
import { MapTo } from 'src/interceptors/meta/map-to.decorator';
import { ReadExpenseFileDto } from './dto/read-file.dto';

@Controller('files/expenses')
export class ExpenseFileController {
	constructor(private readonly filesService: ExpenseFilesService) {}

	@Delete(':id')
	@Roles(Role.MANAGER)
	@MapTo(ReadExpenseFileDto)
	remove(@Param('id') id: string) {
		return this.filesService.remove(id);
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
