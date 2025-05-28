import { Expense } from 'src/expenses/entities/expense.entity';
import { File } from 'src/files/entities/file.entity';
import { Entity, ManyToOne, Relation } from 'typeorm';

@Entity('expense_files')
export class ExpenseFile extends File {
	@ManyToOne(() => Expense, (expense) => expense.files)
	expense: Relation<Expense>;
}
