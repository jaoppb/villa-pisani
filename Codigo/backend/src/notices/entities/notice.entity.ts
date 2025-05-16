import { User } from 'src/user/entities/user.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
	Relation,
	UpdateDateColumn,
} from 'typeorm';
import { NoticeTarget } from '../enum/notice-target.enum';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { Role } from 'src/auth/roles/role.entity';
import { LazyMapTo } from 'src/interceptors/meta/lazy-map-to.decorator';

@Entity('notices')
@LazyMapTo({
	path: 'notices/dto/read-notice.dto',
	className: 'ReadNoticeDto',
})
export class Notice {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	title: string;

	@Column({ type: 'varchar' })
	body: string;

	@ManyToOne(() => User, (user) => user.notices)
	author: Relation<User>;

	@CreateDateColumn()
	createAt: Date;

	@UpdateDateColumn()
	updateAt: Date;

	@Column({ type: 'enum', enum: NoticeTarget, nullable: true })
	target?: NoticeTarget;

	@ManyToMany(() => Apartment, (apartment) => apartment.notices, {
		nullable: true,
	})
	apartments?: Apartment[];

	@Column({ type: 'set', nullable: true, enum: Role })
	roles?: Role[];

	@Column()
	important: boolean;
}
