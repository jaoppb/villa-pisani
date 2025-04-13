import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class File {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	url: string;
}
