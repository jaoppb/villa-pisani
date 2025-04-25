import { Module } from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { ApartmentsController } from './apartments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apartment } from './entities/apartment.entity';
import { Floor } from 'src/floors/entities/floor.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Apartment, Floor])],
	controllers: [ApartmentsController],
	providers: [ApartmentsService],
})
export class ApartmentsModule {}
