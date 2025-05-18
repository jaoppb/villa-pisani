import { Bill } from 'src/bills/entities/bill.entity';
import { Notice } from 'src/notices/entities/notice.entity';
import { User } from 'src/user/entities/user.entity';
import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	OneToMany,
	OneToOne,
	PrimaryColumn,
	Relation,
} from 'typeorm';

@Entity('apartments')
export class Apartment {
	@Column()
	floor: number;

	@PrimaryColumn()
	number: number;

	@OneToMany(() => User, (user) => user.apartment)
	inhabitants: User[];

	@OneToOne(() => User, (user) => user.apartment, {
		cascade: ['insert', 'update'],
		eager: true,
		nullable: true,
	})
	@JoinColumn({ referencedColumnName: 'id' })
	owner?: Relation<User>;

	@OneToMany(() => Bill, (bill) => bill.apartment)
	bills: Bill[];

	@ManyToMany(() => Notice, (notice) => notice.apartments)
	@JoinTable()
	notices: Notice[];
}
