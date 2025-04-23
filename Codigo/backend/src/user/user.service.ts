import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordEncryption } from 'src/encryption/password-encryption.provider';
import { SafeUserDto } from './dto/safe-user.dto';

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly passwordEncryption: PasswordEncryption,
	) {}

	async update(id: string, update: UpdateUserDto): Promise<SafeUserDto> {
		if (!(await this.userRepository.existsBy({ id }))) {
			this.logger.error('User not found', id);
			throw new BadRequestException('User not found');
		}

		const encryptedPassword = update.password
			? await this.passwordEncryption.encrypt(update.password)
			: undefined;
		const final = {
			...update,
			id,
			password: encryptedPassword,
		};
		this.logger.log('Updating user', final);
		const updated = await this.userRepository.save(final);
		this.logger.log('Updated user', updated);

		return {
			id: updated.id,
			birthDate:
				updated.birthDate === null ? undefined : updated.birthDate,
			email: updated.email,
			name: updated.name,
			roles: updated.roles,
			createAt: updated.createAt,
			updateAt: updated.updateAt,
		};
	}

	async findOneByEmail(email: string) {
		return await this.userRepository.findOneBy({ email });
	}

	async findAllByEmailAndName(name?: string, email?: string) {
		const query = this.userRepository.createQueryBuilder();
		if (name)
			query.andWhere('LOWER(name) LIKE :name', { name: `%${name}%` });
		if (email)
			query.andWhere('LOWER(email) LIKE :email', { email: `%${email}%` });
		const users = await query.getMany();
		this.logger.log('Found users', users);
		return users;
	}

	async findAll() {
		return await this.userRepository.find();
	}
}
