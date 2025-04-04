import {
	BeforeUpdate,
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
	Relation,
	UpdateDateColumn,
} from 'typeorm';
import { Tag } from '../tags/entities/tag.entity';
import { File } from '../files/entities/file.entity';

@Entity('expenses')
export class Expense {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToMany(() => Tag, { cascade: true })
	@JoinTable()
	tags: Tag[];

	@Column()
	value: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@Column({ type: 'datetime' })
	dueDate: Date;

	@Column()
	paid: boolean;

	// TODO add apartment

	@OneToMany(() => File, (file) => file.expense, { cascade: true })
	files: Relation<File[]>;

	@BeforeUpdate()
	updateDate() {
		this.updatedAt = new Date();
	}
}
