import { Floor } from 'src/floors/entities/floor.entity';
import { User } from 'src/user/entities/user.entity';
import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('apartments')
export class Apartment {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Floor, (floor) => floor.apartments)
	floor: Floor;

	@Column({ unique: true })
	number: number;

	@OneToMany(() => User, (user) => user.apartment)
	inhabitants: User[];
}
