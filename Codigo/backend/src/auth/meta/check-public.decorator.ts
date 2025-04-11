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
	const original = descriptor.value as (
		context: ExecutionContext,
	) => Promise<boolean>;
	descriptor.value = async function (
		context: ExecutionContext,
	): Promise<boolean> {
		logger.debug('CheckPublic');

		const isPublic = reflector.get<boolean>(
			'isPublic',
			context.getHandler(),
		);
		if (isPublic) {
			logger.debug('Public');
			return true;
		}

		logger.debug('Not public');
		return original.apply(this, [context]) as Promise<boolean>;
	};
}
