import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordEncryption } from 'src/encryption/password-encryption.provider';
import { SafeUserDto } from './dto/safe-user.dto';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { AppConfigService } from 'src/app-config/app-config.service';
import { faker } from '@faker-js/faker';
import { Role } from 'src/auth/roles/role.entity';

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Apartment)
		private readonly apartmentRepository: Repository<Apartment>,
		private readonly passwordEncryption: PasswordEncryption,
		private readonly appConfig: AppConfigService,
		private readonly dataSource: DataSource,
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

		return new SafeUserDto(updated);
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

	async generateUsers() {
		this.logger.log('Generating users');
		if (this.appConfig.NodeEnv === 'porduction') {
			this.logger.log('production,Not generating users');
			return;
		}
		if ((await this.userRepository.count()) > 2) {
			this.logger.log('Users already generated');
			return;
		}
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const users: User[] = [];

			// Generate random users employees
			const randomUserEmployees = faker.number.int({ min: 1, max: 5 });
			for (let i = 0; i < randomUserEmployees; i++) {
				const user = new User();
				user.name = faker.person.fullName();
				user.email = faker.internet.email();
				user.password = await this.passwordEncryption.encrypt(
					this.appConfig.AdminPassword,
				);
				user.roles = [Role.EMPLOYEE];
				user.birthDate = faker.date.birthdate({
					min: 18,
					max: 55,
					mode: 'age',
				});
				users.push(user);
			}

			// Generate random users residents
			const apartments = await this.apartmentRepository.find();
			for (const apartment of apartments) {
				const randomUserResidents = faker.number.int({
					min: 1,
					max: 5,
				});
				for (let i = 0; i < randomUserResidents; i++) {
					const user = new User();
					user.name = faker.person.fullName();
					user.email = faker.internet.email();
					user.password = await this.passwordEncryption.encrypt(
						this.appConfig.AdminPassword,
					);
					user.roles = [Role.INHABITANT];
					user.birthDate = faker.date.birthdate({
						min: 18,
						max: 80,
						mode: 'age',
					});
					user.apartment = apartment;
					users.push(user);
				}
			}

			await queryRunner.manager.save(users);
			await queryRunner.commitTransaction();
			this.logger.log('Generated users successfully');
		} catch (error) {
			this.logger.error('Error generating users', error);
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await queryRunner.release();
		}
	}
}
