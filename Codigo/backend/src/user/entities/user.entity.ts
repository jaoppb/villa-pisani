import { Role } from 'src/auth/roles/role.entity';
import {
	BeforeUpdate,
	Column,
	CreateDateColumn,
	Entity,
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

	@CreateDateColumn()
	createAt: Date;

	@UpdateDateColumn()
	updateAt: Date;

	@BeforeUpdate()
	updateDate() {
		this.updateAt = new Date();
	}
}
