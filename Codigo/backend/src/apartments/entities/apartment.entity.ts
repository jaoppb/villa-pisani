import { Notice } from 'src/notices/entities/notice.entity';
import { User } from 'src/user/entities/user.entity';
import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryColumn,
} from 'typeorm';

@Entity('apartments')
export class Apartment {
	@Column()
	floor: number;

	@PrimaryColumn()
	number: number;

	@OneToMany(() => User, (user) => user.apartment)
	inhabitants: User[];

	@ManyToMany(() => Notice, (notice) => notice.apartments)
	@JoinTable()
	notices: Notice[];
}
