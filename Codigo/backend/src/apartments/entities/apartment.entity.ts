import { Floor } from 'src/floors/entities/floor.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('apartments')
export class Apartment {
	@ManyToOne(() => Floor, (floor) => floor.apartments)
	floor: Floor;

	@PrimaryColumn({ type: 'number', unique: true })
	number: number;

	@OneToMany(() => User, (user) => user.apartment)
	inhabitants: User[];
}
