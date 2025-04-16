import {
	CanActivate,
	ExecutionContext,
	Injectable,
	Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PublicGuard implements CanActivate {
	private readonly logger = new Logger(PublicGuard.name);

	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): Promise<boolean> | boolean {
		this.logger.debug('CheckPublic');

		const isPublic = this.reflector.get<boolean>(
			'isPublic',
			context.getHandler(),
		);
		if (isPublic) {
			this.logger.debug('Public');
			return true;
		}

		return false;
	}
}
