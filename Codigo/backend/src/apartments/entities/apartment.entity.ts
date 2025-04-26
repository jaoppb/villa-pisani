import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('apartments')
export class Apartment {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	floor: number;

	@Column({ unique: true })
	number: number;

	@OneToMany(() => User, (user) => user.apartment)
	inhabitants: User[];
}
