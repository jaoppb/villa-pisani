import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ExpenseFile } from './entities/file.entity';
import { Expense } from '../entities/expense.entity';

@Injectable()
export class FilesService {
	private readonly logger = new Logger(FilesService.name);
	constructor(
		@InjectRepository(ExpenseFile)
		private readonly filesRepository: Repository<ExpenseFile>,
		@InjectRepository(Expense)
		private readonly expensesRepository: Repository<Expense>,
		private readonly dataSource: DataSource,
	) {}

	private _saveFile(file: Express.Multer.File): string {
		return file.path;
	}

	private _deleteFile(url: string) {
		// TODO implement file deleting (cloud or disk?)
	}

	async upload(expenseId: string, incomeFile: Express.Multer.File) {
		const expense = await this.expensesRepository.findOneBy({
			id: expenseId,
		});

		if (!expense) {
			this.logger.error(`Expense not found ${expenseId}`);
			throw new BadRequestException('Expense not found');
		}

		const url = this._saveFile(incomeFile);

		if (!url) {
			this.logger.error('File upload error');
			throw new BadRequestException('File upload error');
		}

		const file = this.filesRepository.save({
			name: incomeFile.originalname,
			expense,
			url,
		});
		this.logger.log('File create', file);
		return file;
	}

	async uploadAll(
		expenseId: string,
		incomeFiles: Array<Express.Multer.File>,
	) {
		const expense = await this.expensesRepository.findOneBy({
			id: expenseId,
		});

		if (!expense) {
			this.logger.error(`Expense not found ${expenseId}`);
			throw new BadRequestException('Expense not found');
		}

		const queryRunner = this.dataSource.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();

		const uploadedUrls: string[] = [];
		try {
			for (const file of incomeFiles) {
				const url = this._saveFile(file);
				uploadedUrls.push(url);
				await queryRunner.manager.save(ExpenseFile, {
					expense,
					mimetype: file.mimetype,
					name: file.filename,
					size: file.size,
					url,
				});
			}

			await queryRunner.commitTransaction();
		} catch (error) {
			uploadedUrls.forEach((url) => this._deleteFile(url));

			await queryRunner.rollbackTransaction();
			this.logger.error('File create all', error);
			throw error;
		} finally {
			await queryRunner.release();
		}

		const savedFiles = this.filesRepository
			.createQueryBuilder('files')
			.where('files.url IN (:...urls)', { urls: uploadedUrls })
			.getMany();
		this.logger.log('Files create all', savedFiles);
		return savedFiles;
	}

	async remove(id: string) {
		const file = await this.filesRepository.delete({ id });
		this.logger.log('File remove', file);
		return file;
	}
}
