import { IsBoolean, IsString } from 'class-validator';

export class CreateFeedbackDto {
	@IsString()
	body: string;

	@IsBoolean()
	anonymous: boolean;
}
