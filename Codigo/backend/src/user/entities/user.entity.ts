import { Apartment } from 'src/apartments/entities/apartment.entity';
import { Role } from 'src/auth/roles/role.entity';
import { Feedback } from 'src/feedback/entity/feedback.entity';
import { Notice } from 'src/notices/entities/notice.entity';
import {
	AfterLoad,
	BeforeUpdate,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
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

	@OneToMany(() => Notice, (notice) => notice.author)
	notices: Notice[];

	@ManyToOne(() => Apartment, (apartment) => apartment.inhabitants, {
		nullable: true,
		eager: false,
	})
	apartment?: Apartment;

	@Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
	lastPasswordChange: Date;

	@CreateDateColumn()
	createAt: Date;

	@UpdateDateColumn()
	updateAt: Date;

	@BeforeUpdate()
	updateDate() {
		this.updateAt = new Date();
	}

	private _cachedPassword?: string;

	@AfterLoad()
	private _cachePassword() {
		this._cachedPassword = this.password;
	}

	@BeforeUpdate()
	private _checkPasswordChange() {
		if (this._cachedPassword !== this.password) {
			this.lastPasswordChange = new Date();
		}
	}
}
