import {
	BadRequestException,
	Injectable,
	Logger,
	OnModuleInit,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { PasswordEncryption } from 'src/encryption/password-encryption.provider';
import { User } from 'src/user/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { PayloadAuthDto } from './dto/payload-auth.dto';
import { Role } from './roles/role.entity';
import { AppConfigService } from 'src/app-config/app-config.service';
import { JwtService } from '@nestjs/jwt';
import { InviteApartmentDto } from 'src/apartments/dto/invite-apartment.dto';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { SignInAuthDto } from './dto/signin-auth.dto';

@Injectable()
export class AuthService implements OnModuleInit {
	private readonly logger = new Logger(AuthService.name);
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Apartment)
		private readonly apartmentRepository: Repository<Apartment>,
		private readonly passwordEncryption: PasswordEncryption,
		private readonly appConfigService: AppConfigService,
		private readonly jwtService: JwtService,
		private readonly dataSource: DataSource,
		private eventEmitter: EventEmitter2,
	) {}

	private _validateInvite(invite: string) {
		try {
			const payload = this.jwtService.verify<InviteApartmentDto>(invite);
			return payload;
		} catch (err) {
			this.logger.error('Invalid invite token', invite, err);
			throw new BadRequestException('Invalid invite token');
		}
	}

	async acceptInvite(invite: string, user: User): Promise<Apartment>;
	async acceptInvite(
		invite: string,
		user: User,
		queryRunner: QueryRunner,
	): Promise<Apartment>;
	async acceptInvite(invite: string, user: User, queryRunner?: QueryRunner) {
		const payload = this._validateInvite(invite);
		this.logger.log('User invited to apartment', payload);

		const apartmentEntity = await this.apartmentRepository.findOne({
			where: { number: payload.apartmentNumber },
			relations: ['inhabitants'],
		});
		if (!apartmentEntity) {
			this.logger.error('Apartment not found', payload.apartmentNumber);
			throw new BadRequestException('Apartment not found');
		}

		const isInhabitant = apartmentEntity.inhabitants.find((inhabitant) => {
			return inhabitant.id === user.id;
		});
		if (isInhabitant) {
			this.logger.error('User already inhabitant', user.id);
			throw new BadRequestException('User already inhabitant');
		}

		apartmentEntity.inhabitants.push(user);
		const apartment = queryRunner
			? await queryRunner.manager.save(apartmentEntity)
			: await this.apartmentRepository.save(apartmentEntity);
		this.logger.log('User invited to apartment', user, apartmentEntity);

		return apartment;
	}

	async signUp(payload: SignUpAuthDto) {
		const { email, password, name, birthDate } = payload;
		const userExist = await this.userRepository.findOneBy({
			email,
		});

		if (userExist) {
			this.logger.error('User exists', userExist);
			throw new BadRequestException('User already exists');
		}

		const result = await this.passwordEncryption.encrypt(password);
		const userData = new User();
		userData.email = email;
		userData.name = name;
		userData.birthDate = birthDate;
		userData.password = result;
		userData.roles = [];

		const queryRunner = this.dataSource.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const user = await queryRunner.manager.save(userData);
			this.logger.log('User create', user);

			if (payload.invite)
				user.apartment = await this.acceptInvite(
					payload.invite,
					user,
					queryRunner,
				);

			await queryRunner.commitTransaction();

			return user;
		} catch (err) {
			this.logger.error('Failed to sign-up user', err, userData);
			await queryRunner.rollbackTransaction();
			throw err;
		} finally {
			await queryRunner.release();
		}
	}

	async signIn(dto: SignInAuthDto) {
		const { email, password } = dto;
		const user = await this.userRepository.findOneBy({ email });
		if (!user) {
			this.logger.error('User not exists', email);
			throw new UnauthorizedException('User not exists');
		}

		if (!(await this.passwordEncryption.compare(user.password, password))) {
			this.logger.error('Invalid password', email);
			throw new UnauthorizedException('Invalid password');
		}

		if (dto.invite) {
			user.apartment = await this.acceptInvite(dto.invite, user);
		}

		this.logger.log('User sign in', user);
		return user;
	}

	async getUserFromAuthPayload(payload: PayloadAuthDto) {
		const user = await this.userRepository.findOne({
			where: { email: payload.email },
			relations: ['apartment'],
		});
		if (!user) {
			this.logger.error('User not exists', payload.email);
			throw new UnauthorizedException('User not exists');
		}
		this.logger.log('User from payload', user);
		return user;
	}

	async findUserByEmail(email: string) {
		return await this.userRepository.findOneBy({
			email,
		});
	}

	private async _assertAdmin() {
		this.logger.log('Asserting admin user');
		const email = this.appConfigService.AdminEmail;
		const admin = await this.userRepository.findOneBy({
			email,
		});
		if (admin) {
			this.logger.log('Admin user already exists');
			return;
		}
		this.logger.log('Creating admin user');
		const password = await this.passwordEncryption.encrypt(
			this.appConfigService.AdminPassword,
		);
		const adminUser = await this.userRepository.save({
			email,
			name: 'Admin',
			password,
			roles: [Role.MANAGER],
		});
		this.logger.log('Admin user created', adminUser);
	}

	async onModuleInit() {
		await this._assertAdmin();
	}
}
