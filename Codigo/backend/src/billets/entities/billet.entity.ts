import {
	BeforeUpdate,
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Tag } from '../tags/entities/tag.entity';
import { File } from '../files/entities/file.entity';

export class Billet {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ default: [] })
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

	@Column({ default: [] })
	files: File[];

	@BeforeUpdate()
	updateDate() {
		this.updatedAt = new Date();
	}
}
