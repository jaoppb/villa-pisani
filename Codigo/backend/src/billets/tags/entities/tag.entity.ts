import { Billet } from 'src/billets/entities/billet.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('billet_tags')
export class Tag {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	label: string;

	@ManyToMany(() => Billet)
	billets: Billet[];
}
