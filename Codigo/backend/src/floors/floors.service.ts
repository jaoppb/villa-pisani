import { Injectable, Logger } from '@nestjs/common';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Floor } from './entities/floor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FloorsService {
	private readonly logger = new Logger(FloorsService.name);

	constructor(
		@InjectRepository(Floor)
		private readonly floorsRepository: Repository<Floor>,
	) {}

	async create(createFloorDto: CreateFloorDto) {
		return await this.floorsRepository.save(createFloorDto);
	}

	findAll() {
		return this.floorsRepository.find();
	}

	async findOne(id: number) {
		return await this.floorsRepository.findOneBy({ id });
	}

	async update(id: number, updateFloorDto: UpdateFloorDto) {
		this.logger.log('Updating floor with id', id);
		const updated = await this.floorsRepository.save({
			...updateFloorDto,
			id,
		});
		this.logger.log('Updated floor number', updated);

		return updated;
	}
}
