import { IsDate, IsPositive, IsUUID } from 'class-validator';

export class CreateExpenseDto {
	@IsUUID(undefined, { each: true })
	tagIDs: string[];

	@IsPositive()
	value: number;

	@IsDate()
	dueDate: Date;
}
