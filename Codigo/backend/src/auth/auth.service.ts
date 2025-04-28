import {
	BadRequestException,
	Injectable,
	Logger,
	OnModuleInit,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

	async signUp(body: SignUpAuthDto) {
		const userExist = await this.userRepository.findOneBy({
			email: body.email,
		});
		const { password } = body;
		if (userExist) {
			this.logger.error('User exists', userExist);
			throw new BadRequestException('User already exists');
		}

		const result = await this.passwordEncryption.encrypt(password);
		const user = await this.userRepository.save({
			email: body.email,
			name: body.name,
			birthDate: body.birthDate,
			password: result,
			roles: [],
		});

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
		const user = await this.userRepository.findOneBy({
			email: payload.email,
		});
		if (!user) {
			this.logger.error('User not exists', payload.email);
			throw new UnauthorizedException('User not exists');
		}

		this.logger.log('User from payload', user);
		return user;
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
