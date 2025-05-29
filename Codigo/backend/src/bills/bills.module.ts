import { Module } from '@nestjs/common';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';
import { BillFile } from './files/entities/file.entity';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { BillFilesService } from './files/files.service';
import { FilesModule } from 'src/files/files.module';
import { BillFilesController } from './files/files.controller';

@Module({
	controllers: [BillsController, BillFilesController],
	providers: [BillsService, BillFilesService],
	imports: [
		AppConfigModule,
		TypeOrmModule.forFeature([Bill, BillFile, Apartment]),
		FilesModule,
	],
})
export class BillsModule {}
