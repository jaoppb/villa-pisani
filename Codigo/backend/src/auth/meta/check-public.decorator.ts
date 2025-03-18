import { ExecutionContext, Logger } from '@nestjs/common';
import { BaseGuard } from '../base.guard';
import { Reflector } from '@nestjs/core';

export function CheckPublic(
	target: BaseGuard,
	key: string,
	descriptor: PropertyDescriptor,
) {
	const logger = new Logger(target.constructor.name);
	const reflector = new Reflector();
	const old = target.canActivate.bind(target) as (
		context: ExecutionContext,
	) => Promise<boolean>;
	descriptor.value = async (context: ExecutionContext): Promise<boolean> => {
		logger.debug('CheckPublic');

		const isPublic = reflector.get<boolean>(
			'isPublic',
			context.getHandler(),
		);
		if (isPublic) {
			return true;
		}
		return old(context);
	};
}
