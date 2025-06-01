import { Module } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { DeliveriesController } from './deliveries.controller';
import { Delivery } from './entities/delivery.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApartmentsModule } from 'src/apartments/apartments.module';

@Module({
	imports: [TypeOrmModule.forFeature([Delivery]), ApartmentsModule],
	controllers: [DeliveriesController],
	providers: [DeliveriesService],
})
export class DeliveriesModule {}
