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

	@Column()
	title: string;

	// TODO avaliate if we should limit the description size
	@Column('text')
	description: string;

	@ManyToMany(() => Tag, { cascade: true, eager: true })
	@JoinTable()
	tags: Tag[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@OneToMany(() => File, (file) => file.expense, {
		cascade: true,
		eager: true,
	})
	files: Relation<File[]>;

	@BeforeUpdate()
	updateDate() {
		this.updatedAt = new Date();
	}
}
