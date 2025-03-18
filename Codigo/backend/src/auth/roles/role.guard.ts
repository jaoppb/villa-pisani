import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'src/http/request';
import { Role } from './role.entity';
import { BaseGuard } from '../base.guard';
import { CheckPublic } from '../meta/check-public.decorator';

@Injectable()
export class RoleGuard extends BaseGuard {
	private readonly logger = new Logger(RoleGuard.name);
	constructor(protected readonly reflector: Reflector) {
		super();
	}

	@CheckPublic
	canActivate(context: ExecutionContext): Promise<boolean> | boolean {
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
