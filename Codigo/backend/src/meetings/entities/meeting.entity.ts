import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	Relation,
	UpdateDateColumn,
} from 'typeorm';
import { MeetingFile } from '../files/entities/file.entity';

@Entity('meetings')
export class Meeting {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@OneToOne(() => MeetingFile, (file) => file.meeting, {
		cascade: true,
		eager: true,
	})
	@JoinColumn()
	file: Relation<MeetingFile>;

	@Column({ type: 'datetime' })
	date: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
