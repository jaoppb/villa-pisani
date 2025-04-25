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

	async findOne(number: number) {
		return await this.floorsRepository.findOneBy({ number });
	}

	async update(number: number, updateFloorDto: UpdateFloorDto) {
		this.logger.log('Updating floor with id', number);
		const updated = await this.floorsRepository.save({
			...updateFloorDto,
			number,
		});
		this.logger.log('Updated floor number', updated);

		return updated;
	}
}
