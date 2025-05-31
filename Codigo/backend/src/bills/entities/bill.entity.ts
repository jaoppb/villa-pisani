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
import { fromDate, Month } from './month.entity';
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

	@Column({ type: 'datetime' })
	refer: Date;

	@Column({ type: 'enum', enum: BillState, default: BillState.PENDING })
	state: BillState;

	getMonth(): Month {
		return fromDate(this.refer);
	}

	getYear(): number {
		return this.refer.getFullYear();
	}
}
