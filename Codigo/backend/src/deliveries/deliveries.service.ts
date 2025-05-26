import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { User } from 'src/user/entities/user.entity';
import { Delivery } from './entities/delivery.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { ApartmentsService } from 'src/apartments/apartments.service';
import { DeliveredDeliveryDto } from './dto/delivered-delivery.dto';
import { DeliveryStatus } from './entities/delivery-status';
import { Apartment } from 'src/apartments/entities/apartment.entity';

@Injectable()
export class DeliveriesService {
	private readonly logger = new Logger(DeliveriesService.name);
	constructor(
		@InjectRepository(Delivery)
		private readonly deliveriesRepository: Repository<Delivery>,
		private readonly apartmentsService: ApartmentsService,
	) {}

	async create(receiver: User, dto: CreateDeliveryDto) {
		let apartment: Apartment | undefined = undefined;
		if (dto.apartment) {
			apartment =
				(await this.apartmentsService.findOne(dto.apartment)) ??
				undefined;
			if (!apartment) {
				this.logger.debug(
					'Apartment not found',
					dto.apartment,
					receiver,
				);
			}
		}

		const delivery = this.deliveriesRepository.create({
			receiver,
			sender: dto.sender,
			recipient: dto.recipient,
			apartment: apartment,
		});
		await this.deliveriesRepository.save(delivery);
		return {
			...delivery,
			receiver: delivery.receiver.name,
			apartment: delivery.apartment?.number,
		};
	}

	findAll() {
		return this.deliveriesRepository
			.find({
				relations: ['apartment', 'receiver'],
				order: { receivedAt: 'DESC' },
			})
			.then((deliveries) => {
				return deliveries.map((delivery) => ({
					...delivery,
					receiver: delivery.receiver.name,
					apartment: delivery.apartment?.number,
				}));
			});
	}

	async findOne(id: string) {
		const delivery = await this.deliveriesRepository.findOne({
			where: { id },
			relations: ['apartment', 'receiver'],
		});
		if (!delivery)
			throw new NotFoundException(`Delivery with id ${id} not found`);
		return {
			...delivery,
			receiver: delivery.receiver.name,
			apartment: delivery.apartment?.number,
		};
	}

	async findOneInhabitant(id: string, user: User) {
		const delivery = await this.deliveriesRepository.findOne({
			where: { id },
			relations: ['apartment', 'receiver'],
		});

		if (!delivery) {
			this.logger.debug('Delivery not found', id);
			throw new NotFoundException(`Delivery with id ${id} not found`);
		}

		this.logger.debug(
			'Checking if user belongs to the apartment of the delivery',
			{ delivery, user },
		);

		if (
			delivery.apartment &&
			delivery.apartment?.number !== user.apartment?.number
		) {
			this.logger.debug(
				'User does not belong to the apartment of the delivery',
				id,
				user.apartment?.number,
			);
			throw new BadRequestException(
				`User does not belong to the apartment of the delivery with id ${id}`,
			);
		}

		return {
			...delivery,
			receiver: delivery.receiver.name,
			apartment: delivery.apartment?.number,
		};
	}

	async markDelivered(id: string, dto: DeliveredDeliveryDto) {
		const delivery = await this.deliveriesRepository.findOne({
			where: { id },
			relations: ['apartment'],
		});
		if (!delivery) {
			this.logger.debug('Delivery not found', id);
			throw new NotFoundException(`Delivery with id ${id} not found`);
		}

		if (delivery.status !== DeliveryStatus.RECEIVED) {
			this.logger.debug(
				'Delivery already marked as delivered or confirmed',
				id,
				delivery.status,
			);
			throw new BadRequestException(
				`Delivery with id ${id} already marked as delivered or confirmed`,
			);
		}

		delivery.deliveredTo = dto.deliveredTo;
		delivery.deliveredAt = new Date();
		if (delivery.apartment) {
			delivery.status = DeliveryStatus.DELIVERED;
		} else {
			delivery.status = DeliveryStatus.CONFIRMED;
			delivery.confirmAt = new Date();
		}

		await this.deliveriesRepository.save(delivery);
		return delivery;
	}

	async confirmDelivery(id: string, user: User) {
		const delivery = await this.deliveriesRepository.findOne({
			where: { id, status: Not(DeliveryStatus.CONFIRMED) },
			relations: ['apartment', 'receiver'],
		});
		if (!delivery) {
			this.logger.debug('Delivery not found or already confirmed', id);
			throw new NotFoundException(`Delivery with id ${id} not found`);
		}

		if (!delivery.apartment) {
			this.logger.debug('Delivery has no apartment', id);
			throw new BadRequestException(
				`Delivery with id ${id} has no apartment`,
			);
		}

		if (delivery.apartment?.number !== user.apartment?.number) {
			this.logger.debug(
				'User does not belong to the apartment of the delivery',
				id,
				user.apartment?.number,
			);
			throw new BadRequestException(
				`User does not belong to the apartment of the delivery with id ${id}`,
			);
		}

		if (delivery.status !== DeliveryStatus.DELIVERED) {
			this.logger.debug(
				'Delivery not marked as delivered',
				id,
				delivery.status,
			);
			throw new BadRequestException(
				`Delivery with id ${id} not marked as delivered`,
			);
		}

		delivery.confirmTo = user;
		delivery.confirmAt = new Date();
		delivery.status = DeliveryStatus.CONFIRMED;

		await this.deliveriesRepository.save(delivery);
		return {
			...delivery,
			receiver: delivery.receiver.name,
			apartment: delivery.apartment?.number,
			confirmTo: delivery.confirmTo?.name,
		};
	}
}
