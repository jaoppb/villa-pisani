import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
	private readonly logger = new Logger(TagsService.name);
	constructor(
		@InjectRepository(Tag)
		private readonly tagsRepository: Repository<Tag>,
	) {}

	async create(createTagDto: CreateTagDto) {
		const existingTag = await this.tagsRepository.findOneBy({
			label: createTagDto.label,
		});

		if (existingTag) {
			this.logger.error('Tag already exists', createTagDto.label);
			throw new BadRequestException('Tag with this label already exists');
		}

		const tag = await this.tagsRepository.save(createTagDto);
		this.logger.log('Tag create', tag);
		return tag;
	}

	findAll() {
		this.logger.log('Tag find all');
		return this.tagsRepository.find();
	}

	async findOne(id: string) {
		const tag = await this.tagsRepository.findOneBy({ id });

		if (!tag) {
			this.logger.error('Tag not found', id);
			throw new NotFoundException('Tag not found');
		}

		this.logger.log(`Tag find ${id}`, tag);
		return tag;
	}

	update(id: string, updateTagDto: UpdateTagDto) {
		const tag = this.tagsRepository.update({ id }, updateTagDto);
		this.logger.log('Tag update', tag);
		return tag;
	}

	async remove(id: string) {
		const found = await this.tagsRepository.findOneBy({ id });

		if (!found) {
			this.logger.error('Tag not found', id);
			throw new NotFoundException('Tag not found');
		}

		const tag = this.tagsRepository.remove(found);
		this.logger.log('Tag remove', tag);
		return tag;
	}
}
