import { Injectable, Logger } from '@nestjs/common';
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

	create(createTagDto: CreateTagDto) {
		const tag = this.tagsRepository.create(createTagDto);
		this.logger.log('Tag create', tag);
		return tag;
	}

	findAll() {
		this.logger.log('Tag find all');
		return this.tagsRepository.find();
	}

	findOne(id: string) {
		const tag = this.tagsRepository.findOneBy({ id });
		this.logger.log(`Tag find ${id}`, tag);
		return tag;
	}

	update(id: string, updateTagDto: UpdateTagDto) {
		const tag = this.tagsRepository.update({ id }, updateTagDto);
		this.logger.log('Tag update', tag);
		return tag;
	}

	remove(id: string) {
		const tag = this.tagsRepository.delete({ id });
		this.logger.log('Tag remove', tag);
		return tag;
	}
}
