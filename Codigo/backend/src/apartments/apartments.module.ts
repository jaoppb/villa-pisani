import { Module } from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { ApartmentsController } from './apartments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apartment } from './entities/apartment.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Apartment, User])],
	controllers: [ApartmentsController],
	providers: [ApartmentsService],
})
export class ApartmentsModule {}
