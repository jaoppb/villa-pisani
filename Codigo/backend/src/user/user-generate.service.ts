import { Injectable, Logger } from '@nestjs/common';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { PasswordEncryption } from 'src/encryption/password-encryption.provider';
import { AppConfigService } from 'src/app-config/app-config.service';
import { InjectRepository } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { Role } from 'src/auth/roles/role.entity';

@Injectable()
export class UserGenerateService {
	private readonly logger = new Logger(UserGenerateService.name);
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Apartment)
		private readonly apartmentRepository: Repository<Apartment>,
		private readonly passwordEncryption: PasswordEncryption,
		private readonly appConfig: AppConfigService,
		private readonly dataSource: DataSource,
	) {}

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

	@OnEvent('apartments.generated')
	async generateUsers() {
		this.logger.log('Generating users');
		if (this.appConfig.NodeEnv === 'production') {
			this.logger.log('Production,Not generating users');
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
