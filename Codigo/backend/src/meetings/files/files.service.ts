import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FilesService } from 'src/files/files.service';
import { QueryRunner, Repository } from 'typeorm';
import { Meeting } from '../entities/meeting.entity';
import { MeetingFile } from './entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MeetingFilesService {
	private readonly logger = new Logger(MeetingFilesService.name);
	constructor(
		@InjectRepository(MeetingFile)
		private readonly filesRepository: Repository<MeetingFile>,
		private readonly filesService: FilesService,
	) {}

	async upload(
		queryRunner: QueryRunner,
		meeting: Meeting,
		file: Express.Multer.File,
	) {
		this.logger.debug(`Uploading file for meeting ${meeting.id}`);
		const data = await queryRunner.manager.save(MeetingFile, {
			meeting,
			name: file.originalname,
			mimetype: file.mimetype,
		});
		this.logger.debug(`File saved with ID ${data.id}`);

		return this.filesService.saveFile(`meetings/${data.id}`, file.buffer);
	}

	async readFile(id: string) {
		const file = await this.filesRepository.findOneBy({ id });
		if (!file) {
			this.logger.error('File with not found', id);
			throw new NotFoundException(`File with ID ${id} not found`);
		}

		this.logger.debug('Reading file', file);
		return {
			buffer: await this.filesService.readFile(file.getUrl()),
			metadata: {
				name: file.name,
				mimetype: file.mimetype,
			},
		};
	}

	async deleteFile(url: string) {
		this.logger.debug('Deleting file with URL', url);
		try {
			await this.filesService.deleteFile(url);
			this.logger.debug('File deleted successfully');
		} catch (error) {
			this.logger.error('Error deleting file', error);
			throw new NotFoundException(`File with URL ${url} not found`);
		}
	}

	async remove(id: string) {
		const file = await this.filesRepository.findOneBy({ id });
		if (!file) {
			this.logger.error('File with not found', id);
			throw new NotFoundException(`File with ID ${id} not found`);
		}

		try {
			await this.filesService.deleteFile(file.getUrl());
		} catch (error) {
			this.logger.error('Error removing file from storage', error);
			throw new NotFoundException(
				`File with ID ${id} not found in storage`,
			);
		}

		this.logger.debug('Removing file', file);
		const removed = await this.filesRepository.remove(file);
		this.logger.debug('File removed successfully', removed);

		return removed;
	}
}
