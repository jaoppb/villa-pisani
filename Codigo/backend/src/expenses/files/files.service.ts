import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, QueryRunner, Repository } from 'typeorm';
import { ExpenseFile } from './entities/file.entity';
import { Expense } from '../entities/expense.entity';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class ExpenseFilesService {
	private readonly logger = new Logger(ExpenseFilesService.name);
	constructor(
		@InjectRepository(ExpenseFile)
		private readonly filesRepository: Repository<ExpenseFile>,
		@InjectRepository(Expense)
		private readonly expensesRepository: Repository<Expense>,
		private readonly filesService: FilesService,
		private readonly dataSource: DataSource,
	) {}

	private async _uploadOne(
		queryRunner: QueryRunner,
		expense: Expense,
		incomeFile: Express.Multer.File,
	) {
		try {
			let file = await queryRunner.manager.save(ExpenseFile, {
				name: incomeFile.originalname,
				mimetype: incomeFile.mimetype,
				expense,
				url: '',
			});
			if (!file) {
				this.logger.error('File create error');
				throw new BadRequestException('File create error');
			}
			file.url = await this.filesService.saveFile(
				`expenses/${expense.id}/${file.id}`,
				incomeFile.buffer,
			);

			if (!file.url) {
				this.logger.error('File upload error');
				throw new BadRequestException('File upload error');
			}
			file = await queryRunner.manager.save(ExpenseFile, file);

			this.logger.log('File create', file);
			return (await this.filesRepository.findOne({
				where: { id: file.id },
				select: ['id', 'name'],
			}))!;
		} catch (error) {
			await this.filesService.deleteFolder(`expenses/${expense.id}/`);
			this.logger.error('File create', error);
			throw error;
		}
	}

	private async _uploadMultiple(
		queryRunner: QueryRunner,
		expense: Expense,
		incomeFiles: Array<Express.Multer.File>,
	) {
		const parsedFiles: ExpenseFile[] = [];
		try {
			for (const file of incomeFiles) {
				const data = await queryRunner.manager.save(ExpenseFile, {
					name: file.originalname,
					mimetype: file.mimetype,
					expense,
					url: '',
				});
				const url = await this.filesService.saveFile(
					`expenses/${expense.id}/${data.id}`,
					file.buffer,
				);
				if (!url) {
					this.logger.error('File upload error');
					throw new BadRequestException('File upload error');
				}
				data.url = url;
				parsedFiles.push(data);
			}

			const savedFiles = await queryRunner.manager.save(
				ExpenseFile,
				parsedFiles,
			);
			this.logger.log('Files create all', savedFiles);

			const all = await queryRunner.manager.find(ExpenseFile, {
				where: { id: In(savedFiles.map((f) => f.id)) },
				select: ['id', 'name'],
			});
			return all;
		} catch (error) {
			await this.filesService.deleteFolder(`expenses/${expense.id}`);
			this.logger.error('File create all', error);
			throw error;
		}
	}

	async upload(
		queryRunner: QueryRunner,
		expense: Expense,
		incomeFile: Express.Multer.File | Array<Express.Multer.File>,
	): Promise<ExpenseFile | Array<ExpenseFile>> {
		if (Array.isArray(incomeFile)) {
			return incomeFile.length > 1
				? this._uploadMultiple(queryRunner, expense, incomeFile)
				: this._uploadOne(queryRunner, expense, incomeFile[0]);
		}

		return this._uploadOne(queryRunner, expense, incomeFile);
	}

	async remove(id: string) {
		const file = await this.filesRepository.findOne({
			where: { id },
			relations: ['expense'],
		});

		if (!file) {
			this.logger.error('File not found', id);
			throw new BadRequestException('File not found');
		}

		const result = await this.filesRepository.remove(file);
		await this.filesService.deleteFile(
			`expenses/${file.expense.id}/${file.getUrl()}`,
		);
		this.logger.log('File remove', file);
		return result;
	}

	async readFile(id: string) {
		const file = await this.filesRepository.findOneBy({ id });
		if (!file) {
			this.logger.error('File not found', id);
			throw new BadRequestException('File not found');
		}
		return {
			file,
			data: await this.filesService.readFile(file.getUrl()),
		};
	}
}
