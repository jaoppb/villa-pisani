import { Apartment } from 'src/apartments/entities/apartment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('floors')
export class Floor {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToMany(() => Apartment, (apartment) => apartment.floor)
	apartments: Apartment[];

	@Column({ unique: true })
	number: number;
}
