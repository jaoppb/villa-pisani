import { Module } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { NoticesController } from './notices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from './entities/notice.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Apartment } from 'src/apartments/entities/apartment.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Notice, Apartment]),
		EventEmitterModule.forRoot(),
	],
	controllers: [NoticesController],
	providers: [NoticesService],
})
export class NoticesModule {}
