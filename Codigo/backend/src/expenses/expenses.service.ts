import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tags/entities/tag.entity';

@Injectable()
export class ExpensesService {
	private readonly logger = new Logger(ExpensesService.name);
	constructor(
		@InjectRepository(Expense)
		private readonly expensesRepository: Repository<Expense>,
		@InjectRepository(Tag)
		private readonly tagsRepository: Repository<Tag>,
	) {}

	async create(createExpenseDto: CreateExpenseDto) {
		const tags: Tag[] = await this.tagsRepository.find({
			where: createExpenseDto.tagIDs.map((id) => ({ id })),
		});

		if (tags.length !== createExpenseDto.tagIDs.length) {
			this.logger.error('Tags not found', createExpenseDto.tagIDs);
			throw new BadRequestException('Tags not found');
		}

		const expense = this.expensesRepository.create({
			dueDate: createExpenseDto.dueDate,
			value: createExpenseDto.value,
			paid: false,
			files: [],
			tags,
		});

		this.logger.log('Expense create', expense);
		return expense;
	}

	findAll() {
		this.logger.log('Expense find all');
		return this.expensesRepository.find();
	}

	async findOne(id: string) {
		const expense = await this.expensesRepository.findOneBy({ id });
		this.logger.log(`Expense find  ${id}`, expense);
		return expense;
	}

	async update(id: string, updateExpenseDto: UpdateExpenseDto) {
		const expense = await this.expensesRepository.update(
			{ id },
			updateExpenseDto,
		);
		this.logger.log('Expense update', expense);
		return expense;
	}

	async remove(id: string) {
		const expense = await this.expensesRepository.delete({ id });
		this.logger.log('Expense remove', expense);
		return expense;
	}
}
