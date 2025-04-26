import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Apartment } from './entities/apartment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { InviteApartmentDto } from './dto/invite-apartment.dto';

@Injectable()
export class ApartmentsService {
	private readonly logger = new Logger(ApartmentsService.name);

	constructor(
		@InjectRepository(Apartment)
		private readonly apartmentsRepository: Repository<Apartment>,
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		private readonly jwtService: JwtService,
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

	async addInhabitant(number: number, userId: string) {
		this.logger.log('Adding inhabitant to apartment', number);
		const apartment = await this.apartmentsRepository.findOne({
			where: { number },
			relations: ['inhabitants'],
		});
		if (!apartment) {
			this.logger.warn('Apartment not found', number);
			throw new BadRequestException('Apartment not found');
		}

		const user = await this.usersRepository.findOneBy({ id: userId });
		if (!user) {
			this.logger.warn('User not found', userId);
			throw new BadRequestException('User not found');
		}

		const isInhabitant = apartment.inhabitants.find((inhabitant) => {
			return inhabitant.id === userId;
		});
		if (isInhabitant) {
			this.logger.warn('User already inhabitant', userId);
			throw new BadRequestException('User already inhabitant');
		}

		apartment.inhabitants.push(user);
		const updated = await this.apartmentsRepository.save(apartment);
		this.logger.log('Added inhabitant to apartment', updated);

		return updated;
	}

	async inviteInhabitant(number: number) {
		this.logger.log('Inviting inhabitant to apartment', number);
		const apartment = await this.apartmentsRepository.findOneBy({
			number,
		});
		if (!apartment) {
			this.logger.warn('Apartment not found', number);
			throw new BadRequestException('Apartment not found');
		}

		const payload: InviteApartmentDto = {
			apartmentNumber: number,
		};

		const token = this.jwtService.sign(payload, {});
		this.logger.debug('Invite token', token);

		return { inviteToken: token };
	}

	private async _validateInviteToken(token: string) {
		this.logger.log('Validating invite token', token);
		try {
			const decoded = this.jwtService.verify<InviteApartmentDto>(token);
			if (!decoded) {
				this.logger.warn('Invalid invite token', token);
				throw new BadRequestException('Invalid invite token');
			}

			const apartment = await this.apartmentsRepository.findOne({
				where: { number: decoded.apartmentNumber },
				relations: ['inhabitants'],
			});
			if (!apartment) {
				this.logger.warn(
					'Apartment not found',
					decoded.apartmentNumber,
				);
				throw new BadRequestException('Apartment not found');
			}

			return apartment;
		} catch (error) {
			this.logger.error('Error validating invite token', error);
			throw new BadRequestException('Invalid invite token');
		}
	}

	async acceptInvite(user: User, inviteToken: string) {
		this.logger.log('Accepting invite', inviteToken);
		const apartment = await this._validateInviteToken(inviteToken);

		const isInhabitant = apartment.inhabitants.find((inhabitant) => {
			return inhabitant.id === user.id;
		});
		if (isInhabitant) {
			this.logger.warn('User already inhabitant', user.id);
			throw new BadRequestException('User already inhabitant');
		}

		apartment.inhabitants.push(user);
		const updated = await this.apartmentsRepository.save(apartment);
		this.logger.log('Accepted invite and added inhabitant', updated);

		return updated;
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
