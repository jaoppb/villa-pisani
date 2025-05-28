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

	// TODO find a better place for this function
	private _generateCPF(): string {
		const create_array = (total: number, numero: number) =>
			Array.from(Array(total), () => number_random(numero));
		const number_random = (number: number) =>
			Math.round(Math.random() * number);
		const mod = (dividendo: number, divisor: number) =>
			Math.round(dividendo - Math.floor(dividendo / divisor) * divisor);

		const [n1, n2, n3, n4, n5, n6, n7, n8, n9] = create_array(9, 9);

		let d1 =
			n9 * 2 +
			n8 * 3 +
			n7 * 4 +
			n6 * 5 +
			n5 * 6 +
			n4 * 7 +
			n3 * 8 +
			n2 * 9 +
			n1 * 10;
		d1 = 11 - mod(d1, 11);
		if (d1 >= 10) d1 = 0;

		let d2 =
			d1 * 2 +
			n9 * 3 +
			n8 * 4 +
			n7 * 5 +
			n6 * 6 +
			n5 * 7 +
			n4 * 8 +
			n3 * 9 +
			n2 * 10 +
			n1 * 11;
		d2 = 11 - mod(d2, 11);
		if (d2 >= 10) d2 = 0;

		return `${n1}${n2}${n3}${n4}${n5}${n6}${n7}${n8}${n9}${d1}${d2}`;
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
				user.cpf = this._generateCPF();
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
					user.cpf = this._generateCPF();
					if (i === 0) {
						apartment.owner = user;
					}
					users.push(user);
				}
			}

			await queryRunner.manager.save(apartments);
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
