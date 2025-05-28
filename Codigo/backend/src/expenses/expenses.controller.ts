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
	ParseFilePipe,
	MaxFileSizeValidator,
	FileTypeValidator,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Roles } from 'src/auth/roles/role.decorator';
import { Role } from 'src/auth/roles/role.entity';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('expenses')
export class ExpensesController {
	// TODO avaliate the pros and cons of that:
	// WARN tried to use maxSize from AppConfigService,
	// but the decorator cannot use `this`, so it would be necessary
	// to workaround it with a direct import of the AppConfigService
	// and a static method, but it would be a bad practice
	private static readonly filePipe = new ParseFilePipe({
		validators: [
			new MaxFileSizeValidator({ maxSize: 200 * 1024 * 1024 }),
			new FileTypeValidator({ fileType: 'application/pdf' }),
		],
	});

	constructor(private readonly expensesService: ExpensesService) {}

	@Post()
	@Roles(Role.MANAGER)
	@UseInterceptors(FilesInterceptor('files'))
	create(
		@Body() createExpenseDto: CreateExpenseDto,
		@UploadedFiles(ExpensesController.filePipe)
		files: Array<Express.Multer.File>,
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
	@UseInterceptors(FilesInterceptor('files'))
	update(
		@Param('id') id: string,
		@Body() updateExpenseDto: UpdateExpenseDto,
		@UploadedFiles(ExpensesController.filePipe)
		files: Array<Express.Multer.File>,
	) {
		return this.expensesService.update(id, updateExpenseDto, files);
	}

	@Delete(':id')
	@Roles(Role.MANAGER)
	remove(@Param('id') id: string) {
		return this.expensesService.remove(id);
	}
}
