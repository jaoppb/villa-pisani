import { User } from 'src/user/entities/user.entity';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	Relation,
} from 'typeorm';

@Entity()
export class Feedback {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('text')
	body: string;

	@CreateDateColumn()
	sentAt: Date;

	@ManyToOne(() => User, (user) => user.id, {
		cascade: true,
		nullable: true,
		eager: true,
	})
	user?: Relation<User>;

	@Column({ default: false })
	status: boolean;
}
