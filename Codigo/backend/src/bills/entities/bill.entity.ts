import {
	Column,
	CreateDateColumn,
	Entity,
JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	Relation,
} from 'typeorm';
import { BillFile } from '../files/entities/file.entity';
import { Month } from './month.entity';
import { Apartment } from 'src/apartments/entities/apartment.entity';

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

	@ManyToOne(() => Apartment, (apartment) => apartment.bills)
	@JoinColumn({ referencedColumnName: 'number' })
	apartment: Relation<Apartment>;

	@Column({ type: 'set', enum: Month })
	refer: Month;
}
