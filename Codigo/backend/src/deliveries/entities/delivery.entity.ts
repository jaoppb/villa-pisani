import { Apartment } from 'src/apartments/entities/apartment.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	Relation,
} from 'typeorm';
import { DeliveryStatus } from './delivery-status';
import { User } from 'src/user/entities/user.entity';

@Entity('deliveries')
export class Delivery {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User)
	receiver: Relation<User>;

	@Column({ type: 'varchar', length: 255 })
	recipient: string;

	@Column({ type: 'varchar', length: 255 })
	sender: string;

	@CreateDateColumn()
	receivedAt: Date;

	@Column({ type: 'varchar', length: 255, nullable: true })
	deliveredTo?: string;

	@Column({ type: 'datetime', nullable: true })
	deliveredAt?: Date;

	@ManyToOne(() => User)
	confirmTo?: Relation<User>;

	@Column({ type: 'datetime', nullable: true })
	confirmAt?: Date;

	@ManyToOne(() => Apartment, (apartment) => apartment.deliveries, {
		nullable: true,
	})
	apartment?: Relation<Apartment>;

	@Column({
		type: 'enum',
		enum: DeliveryStatus,
		default: DeliveryStatus.RECEIVED,
	})
	status: DeliveryStatus;
}
