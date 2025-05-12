import {
	BadRequestException,
	Injectable,
	Logger,
	OnModuleInit,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { PasswordEncryption } from 'src/encryption/password-encryption.provider';
import { User } from 'src/user/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { PayloadAuthDto } from './dto/payload-auth.dto';
import { Role } from './roles/role.entity';
import { AppConfigService } from 'src/app-config/app-config.service';

@Injectable()
export class AuthService implements OnModuleInit {
	private readonly logger = new Logger(AuthService.name);
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly passwordEncryption: PasswordEncryption,
		private readonly appConfigService: AppConfigService,
		private eventEmitter: EventEmitter2,
	) {}

	private async _signUpWithoutQueryRunner(user: User) {
		return await this.userRepository.save(user);
	}

	private async _signUpWithQueryRunner(user: User, queryRunner: QueryRunner) {
		return await queryRunner.manager.save(user);
	}

	async signUp(payload: SignUpAuthDto): Promise<User>;
	async signUp(
		payload: SignUpAuthDto,
		queryRunner: QueryRunner,
	): Promise<User>;
	async signUp(payload: SignUpAuthDto, queryRunner?: QueryRunner) {
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
		const user = queryRunner
			? await this._signUpWithQueryRunner(userData, queryRunner)
			: await this._signUpWithoutQueryRunner(userData);

		this.logger.log('User create', user);
		return user;
	}

	async signIn(email: string, password: string) {
		const user = await this.userRepository.findOneBy({ email });
		if (!user) {
			this.logger.error('User not exists', email);
			throw new UnauthorizedException('User not exists');
		}

		if (!(await this.passwordEncryption.compare(user.password, password))) {
			this.logger.error('Invalid password', email);
			throw new UnauthorizedException('Invalid password');
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
