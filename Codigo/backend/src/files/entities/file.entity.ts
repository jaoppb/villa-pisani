import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('files')
export class File {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	url: string;
}
