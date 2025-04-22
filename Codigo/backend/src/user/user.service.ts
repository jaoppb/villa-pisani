import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/auth/roles/role.entity';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async updateRoles(userId: string, roles: Role[]) {
		const user = await this.userRepository.findOneBy({ id: userId });
		if (!user) {
			this.logger.error('User not exists', userId);
			throw new BadRequestException('User not exists');
		}

		this.logger.log('Updating user roles', userId, roles);
		const updated = await this.userRepository.save({ id: userId, roles });
		this.logger.log('User roles updated', userId, roles);

		return {
			id: updated.id,
			roles: updated.roles,
		};
	}
}
