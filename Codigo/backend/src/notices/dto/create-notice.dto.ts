import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { NoticeTargetDto } from './notice-target.dto';

export class CreateNoticeDto {
	@IsString()
	title: string;

	@IsString()
	body: string;

	@IsOptional()
	target?: NoticeTargetDto;

	@IsBoolean()
	important: boolean;
}
