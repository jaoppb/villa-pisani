import { IsString, IsUUID } from 'class-validator';

export class CreateExpenseDto {
	@IsUUID(undefined, { each: true })
	tagIDs: string[];

	@IsString()
	title: string;

	@IsString()
	description: string;

	files: Express.Multer.File[];
}
