import {
	BadRequestException,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordEncryption } from 'src/encryption/password-encryption.provider';
import { User } from 'src/user/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { PayloadAuthDto } from './dto/payload-auth.dto';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly passwordEncryption: PasswordEncryption,
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
}
