import { SetMetadata } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';

export const MAPPER_KEY = 'mapper_key';
export const MapTo = <K>(constructor: ClassConstructor<K>) =>
	SetMetadata(MAPPER_KEY, constructor);
