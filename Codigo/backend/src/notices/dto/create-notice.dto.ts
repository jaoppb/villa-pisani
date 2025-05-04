import {
	IsBoolean,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { NoticeTargetDto } from './notice-target.dto';
import { Type } from 'class-transformer';

export class CreateNoticeDto {
	@IsString()
	title: string;

	@IsString()
	body: string;

	@IsOptional()
	@ValidateNested()
	@Type(() => NoticeTargetDto)
	target?: NoticeTargetDto;

	@IsBoolean()
	important: boolean;
}
