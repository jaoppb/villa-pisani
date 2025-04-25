import { Apartment } from 'src/apartments/entities/apartment.entity';
import { Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('floors')
export class Floor {
	@OneToMany(() => Apartment, (apartment) => apartment.floor)
	apartments: Apartment[];

	@PrimaryColumn({ unique: true })
	number: number;
}
