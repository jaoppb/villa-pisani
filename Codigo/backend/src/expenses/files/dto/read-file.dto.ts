import { OmitType } from '@nestjs/swagger';
import { ExpenseFile } from '../entities/file.entity';

export class ReadExpenseFileDto extends OmitType(ExpenseFile, [
	'expense',
] as const) {
	url: string;

	constructor(expenseFile: ExpenseFile) {
		super();
		Object.assign(this, expenseFile);
		delete this['expense'];

		this.url = expenseFile.getUrl();
	}
}
