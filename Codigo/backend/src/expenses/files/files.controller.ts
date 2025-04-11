import { Controller, Delete, Param } from '@nestjs/common';
import { ExpenseFilesService } from './files.service';
import { Roles } from 'src/auth/roles/role.decorator';
import { Role } from 'src/auth/roles/role.entity';

@Controller('expenses/files')
export class ExpenseFileController {
	constructor(private readonly filesService: ExpenseFilesService) {}

	@Delete(':id')
	@Roles(Role.MANAGER)
	remove(@Param('id') id: string) {
		return this.filesService.remove(id);
	}
}
