import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class File {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	size: number;

	@Column()
	url: string;
}
