import { SetMetadata } from '@nestjs/common';
import { join } from 'path';

export type LazyMap = {
	path: string;
	className: string;
};
export const LAZY_MAPPER_KEY = 'lazy_mapper_key';
export const LazyMapTo = (map: LazyMap) =>
	SetMetadata(LAZY_MAPPER_KEY, {
		...map,
		path: join(__dirname, '../..', map.path),
	});
