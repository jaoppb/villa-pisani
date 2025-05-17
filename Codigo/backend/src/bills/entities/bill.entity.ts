import {
	Column,
	CreateDateColumn,
	Entity,
	OneToOne,
	PrimaryGeneratedColumn,
	Relation,
} from 'typeorm';
import { BillFile } from '../files/entities/file.entity';
import { Month } from './month.entity';

@Entity()
export class Bill {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	externalId: string;

	@Column({ type: 'int' })
	value: number;

	@CreateDateColumn()
	createdAt: Date;

	@Column({ type: 'datetime' })
	dueDate: Date;

	@OneToOne(() => BillFile, (file) => file.bill)
	file: Relation<BillFile>;

	@Column({ type: 'set', enum: Month })
	refer: Month;
}
