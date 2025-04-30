import { User } from 'src/user/entities/user.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { NoticeTarget } from '../enum/notice-target.enum';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { Role } from 'src/auth/roles/role.entity';

@Entity('notices')
export class Notice {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column({ type: 'varchar' })
	body: string;

	@ManyToOne(() => User, (user) => user.notices)
	author: User;

	@CreateDateColumn()
	createAt: Date;

	@UpdateDateColumn()
	updateAt: Date;

	@Column({ type: 'enum', nullable: true })
	target?: NoticeTarget;

	@ManyToMany(() => Apartment, (apartment) => apartment.notices, {
		nullable: true,
	})
	apartments?: Apartment[];

	@Column({ type: 'set', nullable: true })
	roles?: Role[];

	@Column()
	important: boolean;
}
