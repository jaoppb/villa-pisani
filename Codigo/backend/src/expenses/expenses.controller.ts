import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Roles } from 'src/auth/roles/role.decorator';
import { Role } from 'src/auth/roles/role.entity';

@Controller('expenses')
export class ExpensesController {
	constructor(private readonly expensesService: ExpensesService) {}

	@Post()
	@Roles(Role.MANAGER)
	create(@Body() createExpenseDto: CreateExpenseDto) {
		return this.expensesService.create(createExpenseDto);
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

	@Patch(':id')
	@Roles(Role.MANAGER)
	update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
		return this.expensesService.update(id, updateExpenseDto);
	}

	@Delete(':id')
	@Roles(Role.MANAGER)
	remove(@Param('id') id: string) {
		return this.expensesService.remove(id);
	}
}
