import { IsDateString } from 'class-validator';

export class CreateMeetingDto {
	@IsDateString()
	date: Date;
}
