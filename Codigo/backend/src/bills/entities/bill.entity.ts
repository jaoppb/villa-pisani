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
import { BillState } from './bill-state.entity';

@Entity('bills')
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

	@OneToOne(() => BillFile, (file) => file.bill, {
		cascade: true,
		eager: true,
	})
	@JoinColumn({ referencedColumnName: 'id' })
	file: Relation<BillFile>;

	@ManyToOne(() => Apartment, (apartment) => apartment.bills)
	@JoinColumn({ referencedColumnName: 'number' })
	apartment: Relation<Apartment>;

	@Column({ type: 'enum', enum: Month })
	refer: Month;

	@Column({ type: 'enum', enum: BillState, default: BillState.PENDING })
	state: BillState;
}
