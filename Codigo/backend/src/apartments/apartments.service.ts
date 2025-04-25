import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Apartment } from './entities/apartment.entity';
import { Repository } from 'typeorm';
import { Floor } from 'src/floors/entities/floor.entity';

@Injectable()
export class ApartmentsService {
	private readonly logger = new Logger(ApartmentsService.name);

	constructor(
		@InjectRepository(Apartment)
		private readonly apartmentsRepository: Repository<Apartment>,
		@InjectRepository(Floor)
		private readonly floorsRepository: Repository<Floor>,
	) {}

	private async _parseCreateApartmentDto(
		createApartmentDto: CreateApartmentDto,
	): Promise<Partial<Apartment>> {
		const floor = await this.floorsRepository.findOneBy({
			number: createApartmentDto.floor,
		});
		if (!floor) {
			this.logger.debug('Floor not found', createApartmentDto.floor);
			throw new BadRequestException('Floor not found');
		}

		return {
			number: createApartmentDto.number,
			floor,
		};
	}

	async create(createApartmentDto: CreateApartmentDto) {
		const parsed = await this._parseCreateApartmentDto(createApartmentDto);

		this.logger.log('Creating apartment', createApartmentDto);
		const created = await this.apartmentsRepository.save(parsed);
		this.logger.log('Created apartment', created);

		return created;
	}

	async findAll() {
		return await this.apartmentsRepository.find();
	}

	async findOne(id: number) {
		return await this.apartmentsRepository.findOneBy({ id });
	}

	async update(id: number, updateApartmentDto: UpdateApartmentDto) {
		const apartment = await this.apartmentsRepository.findOneBy({ id });
		if (!apartment) {
			this.logger.warn('Apartment not found', id);
			return null;
		}

		const parsed = await this._parseCreateApartmentDto(
			updateApartmentDto as CreateApartmentDto,
		);

		this.logger.log('Updating apartment with id', id);
		const updated = await this.apartmentsRepository.save({
			...apartment,
			...parsed,
		});
		this.logger.log('Updated apartment number', updated);

		return updated;
	}

	async remove(number: number) {
		this.logger.log('Removing apartment with id', number);
		const apartment = await this.apartmentsRepository.findOneBy({
			number,
		});
		if (!apartment) {
			this.logger.warn('Apartment not found', number);
			return null;
		}

		const removed = await this.apartmentsRepository.remove(apartment);
		this.logger.log('Removed apartment number', removed);

		return removed;
	}
}
