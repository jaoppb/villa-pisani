import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { FilesService } from 'src/files/files.service';
import { BillFile } from './entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BillFilesService {
	private readonly logger = new Logger(BillFilesService.name);
	constructor(
		private readonly filesService: FilesService,
		@InjectRepository(BillFile)
		private readonly filesRepository: Repository<BillFile>,
	) {}

	async download(
		billFile: BillFile,
		url: string,
		tries: number = 5,
	): Promise<string> {
		if (tries <= 0) {
			this.logger.error('Max retries reached for downloading Boleto');
			throw new BadRequestException(
				'Failed to download Boleto after multiple attempts',
			);
		}

		const response = await fetch(url, {
			redirect: 'manual',
		});

		if (response.status >= 300 && response.status < 400) {
			const location = response.headers.get('location');
			if (location) return this.download(billFile, location);

			this.logger.error(
				'Redirect location not found in response headers',
			);
			throw new BadRequestException('Redirect location not found');
		}

		if (!response.ok) {
			throw new BadRequestException('Failed to download Boleto');
		}

		if (
			!response.headers.get('content-type')?.includes('application/pdf')
		) {
			return this.download(billFile, url, tries - 1);
		}

		const buffer = await response.arrayBuffer();
		return this.filesService.saveFile(
			`bills/${billFile.id}`,
			Buffer.from(buffer),
		);
	}

	async readFile(id: string) {
		const file = await this.filesRepository.findOneBy({ id });
		if (!file) {
			throw new BadRequestException('File not found');
		}
		const data = await this.filesService.readFile(file.getUrl());
		return { file, data };
	}

	async deleteFile(id: string) {
		const file = await this.filesRepository.findOneBy({ id });
		if (!file) {
			throw new BadRequestException('File not found');
		}

		this.logger.log(`Deleting file: ${file.getUrl()}`);
		await this.filesService.deleteFile(file.getUrl());
		this.logger.log(`File deleted: ${file.getUrl()}`);

		this.logger.log('Removing file record from database:', file);
		const removed = await this.filesRepository.remove(file);
		this.logger.log('File record removed from database:', removed);

		return removed;
	}
}
