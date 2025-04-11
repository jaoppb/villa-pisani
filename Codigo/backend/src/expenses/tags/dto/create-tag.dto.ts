import { IsString, Length } from 'class-validator';

export class CreateTagDto {
	@IsString()
	@Length(3, 255)
	label: string;
}
