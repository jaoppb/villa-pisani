import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tags/entities/tag.entity';
import { ExpenseFilesService } from './files/files.service';

@Injectable()
export class ExpensesService {
	private readonly logger = new Logger(ExpensesService.name);
	constructor(
		@InjectRepository(Expense)
		private readonly expensesRepository: Repository<Expense>,
		@InjectRepository(Tag)
		private readonly tagsRepository: Repository<Tag>,
		private readonly filesService: ExpenseFilesService,
	) {}

	async create(createExpenseDto: CreateExpenseDto) {
		const tags: Tag[] =
			createExpenseDto.tagIDs && createExpenseDto.tagIDs.length > 0
				? await this.tagsRepository.find({
						where: createExpenseDto.tagIDs.map((id) => ({ id })),
					})
				: [];

		if (
			createExpenseDto.tagIDs &&
			tags.length !== createExpenseDto.tagIDs?.length
		) {
			this.logger.error('Tags not found', createExpenseDto.tagIDs);
			throw new BadRequestException('Tags not found');
		}

		const expense: Expense = await this.expensesRepository.save({
			title: createExpenseDto.title,
			description: createExpenseDto.description,
			files: [],
			tags,
		});

		if (createExpenseDto.files && createExpenseDto.files.length > 0) {
			try {
				const files = await this.filesService.upload(
					expense.id,
					createExpenseDto.files,
				);
				expense.files = Array.isArray(files) ? files : [files];
			} catch (err) {
				this.logger.error('Files upload error', err);

				await this.remove(expense.id);

				throw new BadRequestException('Files upload error');
			}
		}

		this.logger.log('Expense create', expense);
		return expense;
	}

	findAll() {
		this.logger.log('Expense find all');
		return this.expensesRepository.find();
	}

	async findByTags(ids: string[]) {
		this.logger.log('Expense find by tags', ids);
		const expenses = await this.expensesRepository
			.createQueryBuilder('expense')
			.leftJoinAndSelect('expense.tags', 'tags')
			.where(
				'expense.id IN (SELECT expensesId FROM expenses_tags_expense_tags WHERE expenseTagsId IN (:...ids))',
				{ ids },
			)
			.getMany();

		this.logger.log('Expense find by tags', expenses);
		return expenses;
	}

	async findOne(id: string) {
		const expense = await this.expensesRepository.findOneBy({ id });

		if (!expense) {
			this.logger.error('Expense not found', id);
			throw new NotFoundException('Expense not found');
		}

		this.logger.log(`Expense find  ${id}`, expense);
		return expense;
	}

	async update(
		id: string,
		updateExpenseDto: UpdateExpenseDto,
		files?: Array<Express.Multer.File>,
	) {
		const expense = await this.expensesRepository.findOneBy({ id });

		if (!expense) {
			this.logger.error('Expense not found', id);
			throw new NotFoundException('Expense not found');
		}

		if (files && files.length > 0) {
			// TODO avaliate if it should replace all files or just add new ones
			try {
				const savedFiles = await this.filesService.upload(id, files);
				if (Array.isArray(savedFiles))
					expense.files.push(...savedFiles);
				else expense.files.push(savedFiles);
			} catch (err) {
				this.logger.error('Files upload error', err);
				throw new BadRequestException('Files upload error');
			}
		}

		if (updateExpenseDto.tagIDs) {
			const tags: Tag[] = await this.tagsRepository.find({
				where: updateExpenseDto.tagIDs.map((id) => ({ id })),
			});

			if (tags.length !== updateExpenseDto.tagIDs?.length) {
				this.logger.error('Tags not found', updateExpenseDto.tagIDs);
				throw new BadRequestException('Tags not found');
			}

			expense.tags = tags;
		}

		await this.expensesRepository.save({ ...updateExpenseDto, ...expense });
		this.logger.log('Expense update', expense);
		return expense;
	}

	async remove(id: string) {
		const found = await this.expensesRepository.findOneBy({ id });
		if (!found) {
			this.logger.error('Expense not found', id);
			throw new NotFoundException('Expense not found');
		}

		const expense = await this.expensesRepository.remove(found);
		this.logger.log('Expense remove', expense);
		return expense;
	}
}
