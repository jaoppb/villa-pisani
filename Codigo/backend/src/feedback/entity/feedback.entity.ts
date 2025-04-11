import { User } from 'src/user/entities/user.entity';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
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
		eager: false,
	})
	user?: User;

	@Column({ default: false })
	status: boolean;
}
