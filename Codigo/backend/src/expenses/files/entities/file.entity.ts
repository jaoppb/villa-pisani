import { Expense } from 'src/expenses/entities/expense.entity';
import { File } from 'src/files/entities/file.entity';
import { LazyMapTo } from 'src/interceptors/meta/lazy-map-to.decorator';
import { Entity, ManyToOne, Relation } from 'typeorm';

@Entity('expense_files')
@LazyMapTo({
	path: 'expenses/files/dto/read-file.dto',
	className: 'ReadExpenseFileDto',
})
export class ExpenseFile extends File {
	@ManyToOne(() => Expense, (expense) => expense.files)
	expense: Relation<Expense>;
}
