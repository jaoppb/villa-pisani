import { Billet } from 'src/billets/entities/billet.entity';
import {
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	Relation,
} from 'typeorm';

@Entity('billet_files')
export class File {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	size: number;

	@Column()
	url: string;

	@Column()
	mimetype: string;

	@ManyToOne(() => Billet, (billet) => billet.files)
	billet: Relation<Billet>;
}
