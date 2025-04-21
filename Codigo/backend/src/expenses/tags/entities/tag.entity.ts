import { Expense } from 'src/expenses/entities/expense.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('expense_tags')
export class Tag {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	label: string;

	@ManyToMany(() => Expense)
	expenses: Expense[];
}
