import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Apartment } from './entities/apartment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ApartmentsService {
	private readonly logger = new Logger(ApartmentsService.name);

	constructor(
		@InjectRepository(Apartment)
		private readonly apartmentsRepository: Repository<Apartment>,
	) {}

	async create(createApartmentDto: CreateApartmentDto) {
		const apartment = await this.apartmentsRepository.findOneBy({
			number: createApartmentDto.number,
		});
		if (apartment) {
			this.logger.warn('Apartment already exists', apartment);
			throw new BadRequestException('Apartment already exists');
		}

		this.logger.log('Creating apartment', createApartmentDto);
		const created =
			await this.apartmentsRepository.save(createApartmentDto);
		this.logger.log('Created apartment', created);

		return created;
	}

	async findAll() {
		return await this.apartmentsRepository.find();
	}

	async findOne(number: number) {
		return await this.apartmentsRepository.findOneBy({ number });
	}

	async findInhabitants(number: number) {
		const apartment = await this.apartmentsRepository.findOne({
			where: { number },
			relations: ['inhabitants'],
		});
		if (!apartment) {
			this.logger.warn('Apartment not found', number);
			throw new BadRequestException('Apartment not found');
		}

		this.logger.log('Finding inhabitants for apartment', number);
		return apartment.inhabitants;
	}

	async update(number: number, updateApartmentDto: UpdateApartmentDto) {
		const apartment = await this.apartmentsRepository.findOneBy({ number });
		if (!apartment) {
			this.logger.warn('Apartment not found', number);
			return null;
		}

		this.logger.log('Updating apartment with number', number);
		const updated = await this.apartmentsRepository.save({
			...apartment,
			...updateApartmentDto,
		});
		this.logger.log('Updated apartment number', updated);

		return updated;
	}

	async remove(number: number) {
		this.logger.log('Removing apartment with number', number);
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

	async removeInhabitant(number: number, id: string) {
		this.logger.log('Removing inhabitant with id', id);
		const apartment = await this.apartmentsRepository.findOne({
			where: { number },
			relations: ['inhabitants'],
		});
		if (!apartment) {
			this.logger.warn('Apartment not found', number);
			return null;
		}

		const inhabitant = apartment.inhabitants.find((inhabitant) => {
			return inhabitant.id === id;
		});
		if (!inhabitant) {
			this.logger.warn('Inhabitant not found', id);
			throw new NotFoundException('Inhabitant not found at apartment');
		}

		apartment.inhabitants = apartment.inhabitants.filter(
			(inhabitant) => inhabitant.id !== id,
		);

		const updated = await this.apartmentsRepository.save(apartment);
		this.logger.log('Removed inhabitant from apartment', updated);

		return updated;
	}
}
