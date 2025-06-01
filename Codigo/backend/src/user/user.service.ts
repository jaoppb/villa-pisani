import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordEncryption } from 'src/encryption/password-encryption.provider';
import { SafeUserDto } from './dto/safe-user.dto';
import { Apartment } from 'src/apartments/entities/apartment.entity';

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Apartment)
		private readonly apartmentRepository: Repository<Apartment>,
		private readonly passwordEncryption: PasswordEncryption,
	) {}

	private async _parsePasswordUpdate(password: string | undefined) {
		if (password === undefined) return undefined;

		return await this.passwordEncryption.encrypt(password);
	}

	private async _parseApartmentUpdate(apartmentNumber: number | undefined) {
		if (apartmentNumber === undefined) return undefined;

		const apartmentFound = await this.apartmentRepository.findOneBy({
			number: apartmentNumber,
		});
		if (!apartmentFound) {
			this.logger.error('Apartment not found', apartmentNumber);
			throw new BadRequestException('Apartment not found');
		}
		return apartmentFound ?? undefined;
	}

	private async _parseUpdate(id: string, update: UpdateUserDto) {
		const parsedApartment = await this._parseApartmentUpdate(
			update.apartmentNumber,
		);
		const parsedPassword = await this._parsePasswordUpdate(update.password);
		return {
			...update,
			id,
			password: parsedPassword,
			apartment: parsedApartment,
		};
	}

	async update(id: string, update: UpdateUserDto): Promise<SafeUserDto> {
		if (!(await this.userRepository.existsBy({ id }))) {
			this.logger.error('User not found', id);
			throw new BadRequestException('User not found');
		}

		const final = await this._parseUpdate(id, update);
		this.logger.log('Updating user', final);
		const updated = await this.userRepository.save(final);
		this.logger.log('Updated user', updated);

		return updated;
	}

	async findOneByEmail(email: string) {
		return await this.userRepository.findOneBy({ email });
	}

	async findAllByEmailAndName(name?: string, email?: string) {
		const query = this.userRepository.createQueryBuilder('users');
		if (name)
			query.andWhere('LOWER(name) LIKE :name', { name: `%${name}%` });
		if (email)
			query.andWhere('LOWER(email) LIKE :email', { email: `%${email}%` });
		query.leftJoinAndSelect('users.apartment', 'apartments');
		query.orderBy('users.name');
		const users = await query.getMany();
		this.logger.log('Found users', users);
		return users;
	}

	async findAll() {
		return await this.userRepository.find();
	}
}
