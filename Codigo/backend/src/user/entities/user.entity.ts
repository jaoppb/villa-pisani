import { Role } from 'src/auth/roles/role.entity';
import { Feedback } from 'src/feedback/entity/feedback.entity';
import {
	BeforeUpdate,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column({ type: 'datetime', nullable: true })
	birthDate?: Date;

	@Column({ type: 'set', enum: Role, default: [] })
	roles: Role[];

	@OneToMany(() => Feedback, (feedback) => feedback.user, {
		eager: false,
	})
	feedbacks: Feedback[];

	@CreateDateColumn()
	createAt: Date;

	@UpdateDateColumn()
	updateAt: Date;

	@BeforeUpdate()
	updateDate() {
		this.updateAt = new Date();
	}
}
