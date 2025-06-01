import { Module } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { NoticesController } from './notices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from './entities/notice.entity';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Notice, Apartment, User]),

	],
	controllers: [NoticesController],
	providers: [NoticesService],
})
export class NoticesModule {}
