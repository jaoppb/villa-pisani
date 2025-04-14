import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateExpenseDto {
	@IsUUID(undefined, { each: true })
	@IsOptional()
	tagIDs?: string[];

	@IsString()
	title: string;

	@IsString()
	description: string;

	@IsOptional()
	files?: Express.Multer.File[];
}
