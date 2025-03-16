import { BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
	birthDate: Date;

	@Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
	createAt: Date;

	@Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
	updateAt: Date;

	@BeforeUpdate()
	updateDate() {
		this.updateAt = new Date();
	}
}
