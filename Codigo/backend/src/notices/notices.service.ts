import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { Brackets, In, Repository } from 'typeorm';
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

	private async _parseNoticeDto(
		noticeDto: UpdateNoticeDto | CreateNoticeDto,
		author?: User,
	): Promise<PartialNotice> {
		const notice: PartialNotice = {
			title: noticeDto.title,
			body: noticeDto.body,
			target: noticeDto.target?.type,
			important: noticeDto.important,
			author,
		};

		if (noticeDto.target)
			switch (noticeDto.target.type) {
				case NoticeTarget.APARTMENTS:
					{
						const apartments =
							await this.apartmentsRepositoy.findBy({
								number: In(noticeDto.target.apartments!),
							});
						notice.apartments = apartments;
					}
					break;
				case NoticeTarget.ROLES:
					notice.roles = Array.from(new Set(noticeDto.target.roles));
					break;
				default:
					throw new BadRequestException('Invalid target type');
			}

		return notice;
	}

	async create(author: User, createNoticeDto: CreateNoticeDto) {
		const parsedNotice = await this._parseNoticeDto(
			createNoticeDto,
			author,
		);
		this.logger.log('Creating notice', parsedNotice);
		const saved = await this.noticesRepositoy.save(parsedNotice);
		this.eventEmitter.emit('notice.created', saved);
		this.logger.log('Notice created', saved);

		return saved;
	}

	async findAllByUserRoles(user: User) {
		return await this.findAllByRoles(user.roles);
	}

	async findAllByRoles(roles: string[]): Promise<Notice[]> {
		this.logger.log('Finding all notices for roles', roles);
		const notices = await this.noticesRepositoy
			.createQueryBuilder()
			.andWhere('target = :target', {
				target: NoticeTarget.ROLES,
			})
			.andWhere('roles IN (:...roles)', {
				roles,
			})
			.getMany();
		this.logger.log('Notices found', notices);

		return notices;
	}

	async findAllByUser(user: User) {
		this.logger.log('Finding all notices for user', user);
		let query = this.noticesRepositoy
			.createQueryBuilder('notice')
			.where('target IS NULL')
			.orWhere(
				new Brackets((qb) => {
					qb.where('target = :targetRoles', {
						targetRoles: NoticeTarget.ROLES,
					}).andWhere('notice.roles IN (:...roles)', {
						roles: user.roles,
					});
				}),
			);
		if (user.apartment)
			query = query
				.leftJoinAndMapMany(
					'notice.apartments',
					'notice.apartments',
					'apartment',
				)
				.orWhere(
					new Brackets((qb) => {
						qb.where('target = :targetApartment', {
							targetApartment: NoticeTarget.APARTMENTS,
						}).andWhere('apartment.number = :apartmentNumber', {
							apartmentNumber: user.apartment!.number,
						});
					}),
				);
		const notices = await query
			.leftJoinAndMapOne('notice.author', 'notice.author', 'author')
			.getMany();
		this.logger.log('Notices found', notices);

		return notices;
	}

	findOne(id: string) {
		return `This action returns a #${id} notice`;
	}

	async update(id: string, updateNoticeDto: UpdateNoticeDto) {
		const notice = await this.noticesRepositoy.findOneBy({ id });
		if (!notice) {
			this.logger.error('Notice not found', id);
			throw new BadRequestException('Notice not found');
		}

		const parsedNotice = await this._parseNoticeDto(updateNoticeDto);

		this.logger.log('Updating notice', parsedNotice);
		const saved = await this.noticesRepositoy.save(parsedNotice);
		this.eventEmitter.emit('notice.updated', saved);
		this.logger.log('Notice updated', saved);

		return saved;
	}

	async remove(id: string) {
		const notice = await this.noticesRepositoy.findOneBy({ id });
		if (!notice) {
			this.logger.error('Notice not found', id);
			throw new BadRequestException('Notice not found');
		}

		this.logger.log('Removing notice', id);
		const removed = await this.noticesRepositoy.remove(notice);
		this.eventEmitter.emit('notice.removed', id);
		this.logger.log('Notice removed', id);

		return removed;
	}
}
