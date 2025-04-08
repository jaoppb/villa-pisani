import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseInterceptors,
	UploadedFiles,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Roles } from 'src/auth/roles/role.decorator';
import { Role } from 'src/auth/roles/role.entity';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('expenses')
export class ExpensesController {
	constructor(private readonly expensesService: ExpensesService) {}

	@Post()
	@Roles(Role.MANAGER)
	@UseInterceptors(FilesInterceptor('files'))
	create(
		@Body() createExpenseDto: CreateExpenseDto,
		@UploadedFiles() files: Array<Express.Multer.File>,
	) {
		return this.expensesService.create({
			...createExpenseDto,
			files,
		});
	}

	// TODO add pagination to this method
	@Get()
	findAll() {
		return this.expensesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.expensesService.findOne(id);
	}

	@Get('/by-tags/:tags')
	findByTags(@Param('tags') tagIDs: string) {
		return this.expensesService.findByTags(tagIDs.split(','));
	}

	@Patch(':id')
	@Roles(Role.MANAGER)
	update(
		@Param('id') id: string,
		@Body() updateExpenseDto: UpdateExpenseDto,
	) {
		return this.expensesService.update(id, updateExpenseDto);
	}

	@Delete(':id')
	@Roles(Role.MANAGER)
	remove(@Param('id') id: string) {
		return this.expensesService.remove(id);
	}
}
