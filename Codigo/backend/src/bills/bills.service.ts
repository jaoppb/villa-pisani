import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { DataSource, In, QueryRunner, Repository } from 'typeorm';
import { Bill } from './entities/bill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { AppConfigService } from 'src/app-config/app-config.service';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { BillFile } from './files/entities/file.entity';
import { BillFilesService } from './files/files.service';

@Injectable()
export class BillsService {
	private readonly stripe: Stripe;
	private readonly logger = new Logger(BillsService.name);

	constructor(
		private readonly appConfigService: AppConfigService,
		@InjectRepository(Bill)
		private readonly billRepository: Repository<Bill>,
		@InjectRepository(Apartment)
		private readonly apartmentRepository: Repository<Apartment>,
		private readonly billFilesService: BillFilesService,
		private readonly dataSource: DataSource,
	) {
		this.stripe = new Stripe(appConfigService.StripeSecretKey);
	}

	private async _handleApartmentNumbers(numbers: number[]) {
		const apartments = await this.apartmentRepository.find({
			where: {
				number: In(numbers),
			},
			select: ['owner'],
		});

		if (apartments.length !== numbers.length) {
			const notFoundNumbers = numbers.filter(
				(number) =>
					!apartments.some(
						(apartment) => apartment.number === number,
					),
			);
			this.logger.error(
				`Some apartments were not found: ${notFoundNumbers.join(', ')}`,
			);
			throw new BadRequestException(
				`The following apartments were not found: ${notFoundNumbers.join(', ')}`,
			);
		}

		if (
			apartments.some(
				({ owner }) => owner === null || owner === undefined,
			)
		) {
			const withoutOwner = apartments
				.filter(({ owner }) => owner === null || owner === undefined)
				.map(({ number }) => number)
				.join(', ');
			this.logger.error(
				`Some apartments do not have an owner: ${withoutOwner}`,
			);
			throw new BadRequestException(
				`The following apartments do not have an owner: ${withoutOwner}`,
			);
		}

		return apartments;
	}

	private async _createPaymentIntent(
		apartment: Apartment,
		createBillDto: CreateBillDto,
	) {
		const address = this.appConfigService.CondominiumAddress;
		const owner = apartment.owner!;
		return await this.stripe.paymentIntents.create({
			amount: createBillDto.value,
			currency: 'brl',
			confirm: true,
			payment_method_types: ['boleto'],
			payment_method_options: {
				boleto: {
					expires_after_days: createBillDto.dueIn,
				},
			},
			payment_method_data: {
				type: 'boleto',
				boleto: {
					tax_id: owner.cpf,
				},
				billing_details: {
					name: owner.name,
					email: owner.email,
					address: {
						city: address.city,
						country: address.country,
						line1: `${address.street}, n ${address.number}`,
						line2: `Apto ${apartment.number}`,
						postal_code: address.cep,
						state: address.state,
					},
				},
			},
			metadata: {
				apartmentNumber: apartment.number.toString(),
				refer: createBillDto.refer,
			},
		});
	}

	private async _createBill(
		queryRunner: QueryRunner,
		apartment: Apartment,
		intent: Stripe.PaymentIntent,
		createBillDto: CreateBillDto,
	) {
		const bill = new Bill();
		bill.value = createBillDto.value;
		bill.externalId = intent.id;
		bill.dueDate = new Date(
			(intent.created +
				intent.payment_method_options!.boleto!.expires_after_days *
					24 *
					60 *
					60) *
				1000,
		);
		bill.refer = createBillDto.refer;
		bill.apartment = apartment;

		const billFile = await queryRunner.manager.save(BillFile, {
			name: `${new Date().getFullYear()}-${bill.refer}-${bill.apartment.number}.pdf`,
			url: await this.billFilesService.download(
				bill,
				intent.next_action!.boleto_display_details!.pdf!,
			),
		});
		bill.file = billFile;

		return bill;
	}

	async create(createBillDto: CreateBillDto) {
		const apartments = await this._handleApartmentNumbers(
			Array.from(new Set(createBillDto.apartmentNumbers)),
		);

		const intents: Stripe.PaymentIntent[] = [];
		try {
			for (const apartment of apartments) {
				const intent = await this._createPaymentIntent(
					apartment,
					createBillDto,
				);
				this.logger.log('Payment Intent created', intent);

				intents.push(intent);
			}
		} catch (error) {
			for (const intent of intents) {
				await this.stripe.paymentIntents.cancel(intent.id);
			}
			this.logger.error('Failed to create payment intent', error);
			throw new BadRequestException('Failed to create payment intent');
		}

		const queryRunner = this.dataSource.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();

		const bills: Bill[] = [];
		try {
			for (const intent of intents) {
				const apartment = apartments.find(
					(apartment) =>
						apartment.number.toString() ===
						intent.metadata.apartmentNumber,
				);
				if (!apartment) {
					this.logger.error(
						`Apartment not found for payment intent ${intent.id}`,
					);
					throw new BadRequestException(
						`Apartment not found for payment intent ${intent.id}`,
					);
				}
				const bill = await this._createBill(
					queryRunner,
					apartment,
					intent,
					createBillDto,
				);
				bills.push(bill);
				this.logger.log('Bill created', bill);
			}

			return await queryRunner.manager.save(bills);
		} catch (error) {
			for (const { file } of bills) {
				if (!file) continue;

				await this.billFilesService.deleteFile(file.bill);
			}

			this.logger.error('Failed to save the bill', error);
			await queryRunner.rollbackTransaction();
			throw new BadRequestException('Failed to emit the bill');
		} finally {
			await queryRunner.release();
		}
	}

	findAll() {
		return this.billRepository.find();
	}

	async findOne(id: string) {
		const bill = await this.billRepository.findOne({
			where: { id },
			relations: ['apartment', 'file'],
		});

		if (!bill) {
			this.logger.error('Bill not found', id);
			throw new NotFoundException('Bill not found');
		}

		return bill;
	}

	async remove(id: string) {
		const bill = await this.billRepository.findOne({
			where: { id },
			relations: ['file'],
		});

		if (!bill) {
			this.logger.error('Bill not found', id);
			throw new NotFoundException('Bill not found');
		}

		await this.billFilesService.deleteFile(bill);
		const removed = await this.billRepository.remove(bill);
		this.logger.log('Bill removed', id);
		return removed;
	}
}
