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

	private async _map(
		context: ExecutionContext,
		data: T,
	): Promise<K | null | undefined> {
		const normal = this._handleNormal(context, data);
		if (await normal) return normal;

		const lazy = this._handleLazy(context, data);
		if (await lazy) return lazy;

		return null;
	}

	private async _convert(
		context: ExecutionContext,
		data: T | T[],
	): Promise<T | T[] | K | K[] | null | undefined> {
		if (data === undefined || data === null) return data;

		if (Array.isArray(data)) {
			return Promise.all(
				data.map((item) => this._convert(context, item)),
			) as Promise<K[]>;
		}

		const mapped = await this._map(context, data);
		if (!mapped) return data;

		const promises: {
			key: string;
			promise: Promise<T | K | T[] | K[] | null | undefined>;
		}[] = [];
		Object.entries(mapped).forEach(([key, value]) => {
			if (value === undefined || value === null) return;
			if (!(value instanceof Object)) return;

			const current = this._convert(context, value as T | T[]);
			promises.push({ key, promise: current });
		});
		for (const { key, promise } of promises) {
			const result = await promise;
			mapped[key] = result;
		}

		return mapped;
	}

	intercept(
		context: ExecutionContext,
		next: CallHandler<T>,
	): Observable<Promise<T | T[] | K | K[] | null | undefined>> {
		return next.handle().pipe(map((data) => this._convert(context, data)));
	}
}
