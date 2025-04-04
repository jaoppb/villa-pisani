import { Expense } from 'src/expenses/entities/expense.entity';
import {
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	Relation,
} from 'typeorm';

@Entity('expense_files')
export class File {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	size: number;

	@Column()
	url: string;

	@Column()
	mimetype: string;

	@ManyToOne(() => Expense, (expense) => expense.files)
	expense: Relation<Expense>;
}
