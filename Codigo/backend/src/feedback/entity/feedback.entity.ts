import { IsUUID } from 'class-validator';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
} from 'typeorm';

@Entity()
export class Feedback {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('text')
	body: string;

	@CreateDateColumn()
	sentAt: Date;

	@Column({ nullable: true })
	@IsUUID()
	senderId?: string;

	@Column({ default: false })
	status: boolean;
}
