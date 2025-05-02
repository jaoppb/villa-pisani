import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { In, Repository } from 'typeorm';
import { Notice } from './entities/notice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { PartialType } from '@nestjs/swagger';
import { NoticeTarget } from './enum/notice-target.enum';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

class PartialNotice extends PartialType(Notice) {}

@Injectable()
export class NoticesService {
	private readonly logger = new Logger(NoticesService.name);
	constructor(
		@InjectRepository(Notice)
		private readonly noticesRepositoy: Repository<Notice>,
		@InjectRepository(Apartment)
		private readonly apartmentsRepositoy: Repository<Apartment>,
		private readonly eventEmitter: EventEmitter2,
	) {}

	async create(author: User, createNoticeDto: CreateNoticeDto) {
		const notice: PartialNotice = {
			title: createNoticeDto.title,
			body: createNoticeDto.body,
			target: createNoticeDto.target?.type,
			important: createNoticeDto.important,
			author,
		};

		if (createNoticeDto.target)
			switch (createNoticeDto.target.type) {
				case NoticeTarget.APARTMENTS:
					{
						const apartments =
							await this.apartmentsRepositoy.findBy({
								number: In(createNoticeDto.target.apartments!),
							});
						notice.apartments = apartments;
					}
					break;
				case NoticeTarget.ROLES:
					notice.roles = createNoticeDto.target.roles!;
					break;
				default:
					throw new BadRequestException('Invalid target type');
			}

		this.logger.log('Creating notice', notice);
		const saved = await this.noticesRepositoy.save(notice);
		this.eventEmitter.emit('notice.created', saved);
		this.logger.log('Notice created', saved);

		return saved;
	}

	findAll() {
		return `This action returns all notices`;
	}

	findOne(id: number) {
		return `This action returns a #${id} notice`;
	}

	update(id: number, updateNoticeDto: UpdateNoticeDto) {
		return `This action updates a #${id} notice`;
	}

	remove(id: number) {
		return `This action removes a #${id} notice`;
	}
}
