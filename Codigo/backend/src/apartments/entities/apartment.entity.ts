import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('apartments')
export class Apartment {
	@Column()
	floor: number;

	@PrimaryColumn()
	number: number;

	@OneToMany(() => User, (user) => user.apartment)
	inhabitants: User[];
}
