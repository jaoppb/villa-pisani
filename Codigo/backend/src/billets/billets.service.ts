import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateBilletDto } from './dto/create-billet.dto';
import { UpdateBilletDto } from './dto/update-billet.dto';
import { Repository } from 'typeorm';
import { Billet } from './entities/billet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from './tags/tags.service';
import { Tag } from './tags/entities/tag.entity';

@Injectable()
export class BilletsService {
	private readonly logger = new Logger(BilletsService.name);
	constructor(
		@InjectRepository(Billet)
		private readonly billetsRepository: Repository<Billet>,
		private readonly tagsService: TagsService,
	) {}

	async create(createBilletDto: CreateBilletDto) {
		const tags: Tag[] = await this.tagsService.findAllFromIDs(
			createBilletDto.tagIDs,
		);

		if (tags.length !== createBilletDto.tagIDs.length) {
			this.logger.error('Tags not found', createBilletDto.tagIDs);
			throw new BadRequestException('Tags not found');
		}

		const billet = this.billetsRepository.create({
			dueDate: createBilletDto.dueDate,
			value: createBilletDto.value,
			paid: false,
			files: [],
			tags,
		});

		this.logger.log('Billet create', billet);
		return billet;
	}

	findAll() {
		this.logger.log('Billet find all');
		return this.billetsRepository.find();
	}

	async findOne(id: string) {
		const billet = await this.billetsRepository.findOneBy({ id });
		this.logger.log(`Billet find  ${id}`, billet);
		return billet;
	}

	async update(id: string, updateBilletDto: UpdateBilletDto) {
		const billet = await this.billetsRepository.update(
			{ id },
			updateBilletDto,
		);
		this.logger.log('Billet update', billet);
		return billet;
	}

	async remove(id: string) {
		const billet = await this.billetsRepository.delete({ id });
		this.logger.log('Billet remove', billet);
		return billet;
	}
}
