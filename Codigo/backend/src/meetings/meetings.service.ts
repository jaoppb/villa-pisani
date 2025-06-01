import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { DataSource, Repository } from 'typeorm';
import { MeetingFilesService } from './files/files.service';
import { Meeting } from './entities/meeting.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MeetingsService {
	private readonly logger = new Logger(MeetingsService.name);
	constructor(
		@InjectRepository(Meeting)
		private readonly meetingRepository: Repository<Meeting>,
		private readonly filesService: MeetingFilesService,
		private readonly dataSource: DataSource,
	) {}

	async create(
		createMeetingDto: CreateMeetingDto,
		file: Express.Multer.File,
	) {
		const queryRunner = this.dataSource.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();

		let url: string | undefined;
		try {
			this.logger.debug('Creating a new meeting', createMeetingDto);
			const meeting = await queryRunner.manager.save(
				Meeting,
				createMeetingDto,
			);
			this.logger.debug('Created meeting', meeting);

			url = await this.filesService.upload(queryRunner, meeting, file);
			this.logger.debug('File uploaded successfully', url);

			await queryRunner.commitTransaction();

			return (await this.meetingRepository.findOne({
				where: { id: meeting.id },
				relations: ['file'],
			}))!;
		} catch (error) {
			if (url) {
				this.logger.debug('Removing file due to error', url);
				await this.filesService.deleteFile(url);
			}

			this.logger.error('Error creating meeting', error);
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await queryRunner.release();
		}
	}

	findAll() {
		return this.meetingRepository.find();
	}

	findOne(id: string) {
		return this.meetingRepository.findOneBy({ id });
	}

	async update(id: string, updateMeetingDto: UpdateMeetingDto) {
		const meeting = await this.meetingRepository.findOneBy({ id });
		if (!meeting) {
			throw new NotFoundException(`Meeting with ID ${id} not found`);
		}

		this.logger.debug('Updating meeting', id, updateMeetingDto);
		const updated = await this.meetingRepository.save({
			...updateMeetingDto,
			id,
		});
		this.logger.debug('Updated meeting', updated);

		return updated;
	}

	async remove(id: string) {
		const meeting = await this.meetingRepository.findOneBy({ id });
		if (!meeting) {
			throw new NotFoundException(`Meeting with ID ${id} not found`);
		}

		try {
			await this.filesService.deleteFile(meeting.file.getUrl());
		} catch (error) {
			this.logger.error('Error removing file for meeting', id, error);
			throw new BadRequestException('Error removing file for meeting');
		}

		this.logger.debug('Removing meeting', meeting);
		const removed = await this.meetingRepository.remove(meeting);
		this.logger.debug('Meeting removed successfully', removed);

		return removed;
	}
}
