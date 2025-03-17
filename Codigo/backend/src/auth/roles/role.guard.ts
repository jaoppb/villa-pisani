import {
	CanActivate,
	ExecutionContext,
	Injectable,
	Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'src/http/request';
import { Role } from './role.entity';

@Injectable()
export class RoleGuard implements CanActivate {
	private readonly logger = new Logger(RoleGuard.name);
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<Request>();

		const roles = this.reflector.getAllAndOverride<Role[]>('roles', [
			context.getHandler(),
			context.getClass(),
		]);

		if (!roles) {
			this.logger.debug('No roles found');
			return true;
		}

		const user = request.user;
		if (!user) {
			this.logger.debug('User not found');
			return false;
		}

		return roles.some((role) => user.roles.includes(role));
	}
}
