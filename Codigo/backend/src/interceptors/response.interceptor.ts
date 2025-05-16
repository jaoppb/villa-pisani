import {
	CallHandler,
	ExecutionContext,
	Inject,
	NestInterceptor,
	Type,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { MAPPER_KEY } from './meta/map-to.decorator';
import { LAZY_MAPPER_KEY, LazyMap } from './meta/lazy-map-to.decorator';
import { ClassModule, ClassType, Mapping } from './types';

export class ResponseInterceptor<
	T extends ClassType<T>,
	K extends Mapping<T, K>,
> implements NestInterceptor
{
	constructor(
		@Inject(Reflector)
		private readonly reflector: Reflector,
	) {}

	private _handle<M>(
		key: string,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
		targets: (Type<any> | Function)[],
		applyMapper: (
			mapper: M,
			data: T,
		) => Promise<K | undefined> | K | undefined,
		data: T,
	) {
		const mapper = this.reflector.getAllAndOverride<M>(key, targets);
		if (mapper) return applyMapper(mapper, data);
		return null;
	}

	private async _handleNormal(context: ExecutionContext, data: T) {
		return this._handle<K>(
			MAPPER_KEY,
			[context.getHandler(), data.constructor],
			(mapper, data) => new mapper(data),
			data,
		);
	}

	private async _handleLazy(context: ExecutionContext, data: T) {
		return this._handle<LazyMap>(
			LAZY_MAPPER_KEY,
			[context.getHandler(), data.constructor],
			async (mapper, data) => {
				const module: ClassModule = (await import(
					mapper.path
				)) as ClassModule;
				const targetClass = module[mapper.className];

				if (targetClass) return new targetClass(data) as K;
			},
			data,
		);
	}

	private async _convert(context: ExecutionContext, data: T) {
		if (data === undefined || data === null) return data;

		const normal = this._handleNormal(context, data);
		if (await normal) return normal;

		const lazy = this._handleLazy(context, data);
		if (await lazy) return lazy;

		return data;
	}

	intercept(
		context: ExecutionContext,
		next: CallHandler<T>,
	): Observable<Promise<T | K | null | undefined>> {
		return next.handle().pipe(map((data) => this._convert(context, data)));
	}
}
