import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { Expense } from '../entities/expense.entity';

@Injectable()
export class FilesService {
	private readonly logger = new Logger(FilesService.name);
	constructor(
		@InjectRepository(File)
		private readonly filesRepository: Repository<File>,
		@InjectRepository(Expense)
		private readonly expensesRepository: Repository<Expense>,
		private readonly dataSource: DataSource,
	) {}

	private _saveFile(file: Express.Multer.File): string {
		// TODO implement file saving (cloud or disk?)
		return 'url_placeholder';
	}

	private _deleteFile(url: string) {
		// TODO implement file deleting (cloud or disk?)
	}

	async upload(expenseId: string, incomeFile: Express.Multer.File) {
		const expense = await this.expensesRepository.findOneBy({ id: expenseId });

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
			mimetype: incomeFile.mimetype,
			name: incomeFile.filename,
			size: incomeFile.size,
			expense,
			url,
		});
		this.logger.log('File create', file);
		return file;
	}

	async uploadAll(expenseId: string, incomeFiles: Array<Express.Multer.File>) {
		const expense = await this.expensesRepository.findOneBy({ id: expenseId });

		if (!expense) {
			this.logger.error(`Expense not found ${expenseId}`);
			throw new BadRequestException('Expense not found');
		}

		const queryRunner = this.dataSource.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();

		const uploadedUrls: string[] = [];
		try {
			incomeFiles.forEach((file) => {
				const url = this._saveFile(file);
				uploadedUrls.push(url);
				queryRunner.manager.create(File, {
					expense,
					mimetype: file.mimetype,
					name: file.filename,
					size: file.size,
					url,
				});
			});

			await queryRunner.commitTransaction();
		} catch (error) {
			uploadedUrls.forEach((url) => this._deleteFile(url));

			await queryRunner.rollbackTransaction();
			this.logger.error('File create all', error);
			throw error;
		} finally {
			await queryRunner.release();
		}

		this.logger.log('Files create all');
	}

	async remove(id: string) {
		const file = await this.filesRepository.delete({ id });
		this.logger.log('File remove', file);
		return file;
	}
}
