import {
	CanActivate,
	ExecutionContext,
	Injectable,
	Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'src/http/request';
import { Role } from '../roles/role.entity';
import { NO_ROLES_KEY } from '../roles/no-role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
	private readonly logger = new Logger(RoleGuard.name);
	constructor(protected readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): Promise<boolean> | boolean {
		this.logger.debug('RoleGuard');
		const request = context.switchToHttp().getRequest<Request>();

		const user = request.user;
		if (!user) {
			this.logger.debug('User not found');
			return false;
		}

		const noRole = this.reflector.getAllAndOverride<boolean>(NO_ROLES_KEY, [
			context.getHandler(),
		]);
		if (noRole) {
			this.logger.debug('No role required');
			return true;
		}

		if (user.roles.length === 0) {
			this.logger.debug('User has no roles');
			return false;
		}

		const roles = this.reflector.getAllAndOverride<Role[]>('roles', [
			context.getHandler(),
			context.getClass(),
		]);
		if (!roles) {
			this.logger.debug('Method not role protected');
			return true;
		}

		return roles.some((role) => user.roles.includes(role));
	}
}
