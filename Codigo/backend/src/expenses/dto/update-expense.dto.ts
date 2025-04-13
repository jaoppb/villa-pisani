import { PartialType } from '@nestjs/swagger';
import { CreateExpenseDto } from './create-expense.dto';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateExpenseDto extends PartialType(
	OmitType(CreateExpenseDto, ['files'] as const),
) {}
