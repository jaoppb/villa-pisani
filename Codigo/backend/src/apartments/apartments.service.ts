import { Injectable, Logger } from '@nestjs/common';
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
		this.logger.log('Creating apartment', createApartmentDto);
		const created =
			await this.apartmentsRepository.save(createApartmentDto);
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
		this.logger.log('Updating apartment with id', id);
		const updated = await this.apartmentsRepository.save({
			...updateApartmentDto,
			id,
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
